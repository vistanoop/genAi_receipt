import json
import asyncio
from typing import List, Dict, Optional
from youtube_transcript_api import YouTubeTranscriptApi
from googleapiclient.discovery import build
from google import genai
from google.genai import types
from app.config.settings import settings
from app.schemas.evidence import EvidenceUnit, SourceType
from app.rag.academy_engine import AcademyEngine

class VideoScraper:
    """
    Automated Video Intelligence Scraper.
    Uses Official YouTube API (if available) or Google Search Grounding to find latest videos.
    """
    def __init__(self):
        self.ai_client = genai.Client(api_key=settings.GOOGLE_API_KEY) if settings.GOOGLE_API_KEY else None
        self.academy = AcademyEngine()
        self.yt_api_key = settings.YOUTUBE_API_KEY
        
        # High-value Indian startup channels
        self.target_channels = [
            {"name": "Startup India", "id": "UC9O5E3_6_p_E7A9z_X9F3VQ"}, # Example IDs, or use search
            {"name": "Peak XV Partners", "query": "Peak XV Partners YouTube"},
            {"name": "Blume Ventures", "query": "Blume Ventures YouTube"},
            {"name": "Elevation Capital", "query": "Elevation Capital YouTube"}
        ]

    async def discover_and_index_latest(self, user_id: Optional[str] = None) -> Dict[str, int]:
        """
        Discovers latest videos from target channels and indexes them.
        """
        if not self.ai_client:
            print("[!] AI Client not configured. Scraper disabled.")
            return {"indexed": 0, "failed": 0}

        videos_to_process = []

        if self.yt_api_key:
            print("[*] Using Official YouTube Data API for discovery...")
            videos_to_process = self._discover_via_api()
        else:
            print("[!] YouTube API Key missing. Using Falling back to Search Grounding (Less Reliable)...")
            videos_to_process = await self._discover_via_grounding()

        if not videos_to_process:
            print("[!] No new videos discovered.")
            return {"indexed": 0, "failed": 0}

        # Be extremely conservative for Free Tier: 1 video per sync
        videos_to_process = videos_to_process[:1]

        stats = {"indexed": 0, "failed": 0}
        for video_info in videos_to_process:
            # Fast-fail approach: try once, no aggressive retries in the request loop
            success = await self.process_video(video_info, user_id=user_id)
            if success:
                stats["indexed"] += 1
            else:
                stats["failed"] += 1

        return stats

    def _discover_via_api(self) -> List[Dict[str, str]]:
        """Uses official YouTube API to get actual video data."""
        try:
            youtube = build("youtube", "v3", developerKey=self.yt_api_key)
            results = []
            
            # Search for the 2 most recent videos for each channel name
            for channel in self.target_channels:
                search_query = channel["name"]
                request = youtube.search().list(
                    q=search_query,
                    part="snippet",
                    type="video",
                    order="date",
                    maxResults=1,
                    relevanceLanguage="en",
                    regionCode="IN"
                )
                response = request.execute()
                
                for item in response.get("items", []):
                    results.append({
                        "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                        "title": item["snippet"]["title"],
                        "channel_name": item["snippet"]["channelTitle"]
                    })
            
            return results
        except Exception as e:
            print(f"[!] YouTube API Discovery failed: {e}")
            return []

    async def _discover_via_grounding(self) -> List[Dict[str, str]]:
        """Fallback discovery via Gemini Search Grounding."""
        discovery_prompt = (
            f"Search for the 3 most recent and relevant YouTube video URLs regarding startup funding, "
            f"policy updates, or founder talks from these specific Indian channels: Startup India, Peak XV, Blume, Elevation.\n\n"
            f"Return ONLY a JSON list of objects with 'url' (MUST BE A DIRECT youtube.com/watch?v= LINK), 'title', and 'channel_name'."
        )

        try:
            response = await self.ai_client.aio.models.generate_content(
                model="gemini-flash-latest",
                contents=discovery_prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )

            raw_text = response.text.strip()
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            
            return json.loads(raw_text)
        except Exception as e:
            print(f"[!] Video discovery via grounding failed: {e}")
            return []

    async def process_video(self, video_info: Dict[str, str], user_id: Optional[str] = None) -> bool:
        """
        Takes a video URL, extracts transcript (or researches it), and indexes the intelligence.
        """
        url = video_info.get("url", "")
        if "youtube.com" not in url and "youtu.be" not in url:
            print(f"[!] Invalid YouTube URL: {url}")
            return False

        try:
            video_id = url.split("v=")[1].split("&")[0] if "v=" in url else url.split("/")[-1]
            print(f"[*] Extracting intelligence for Video ID: {video_id}...")
            
            full_transcript = ""
            context_source = ""
            
            # Try official transcript first
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'hi'])
                full_transcript = " ".join([t['text'] for t in transcript_list])
                context_source = "Transcript"
            except Exception:
                print(f"[!] Transcript unavailable for {video_id}. Falling back to Search Grounding...")
                context_source = "AI Research"

            # 2. Structure the insights
            if full_transcript:
                prompt_content = f"TRANSCRIPT:\n{full_transcript[:12000]}"
            else:
                prompt_content = f"The video is titled '{video_info.get('title')}' on channel '{video_info.get('channel_name')}'. Use Google Search to research the key takeaways from this specific session."

            extraction_prompt = (
                f"You are a Venture Capital Intelligence Expert. Analyze the following video intelligence from '{video_info.get('channel_name')}'.\n\n"
                f"{prompt_content}\n\n"
                f"TASK:\n"
                f"1. Summarize the top 3-5 strategic funding or scaling insights.\n"
                f"2. Determine the sector and category (webinar/talk/story).\n"
                f"3. Estimate duration (e.g., '15:20').\n\n"
                f"OUTPUT RAW JSON: {{'title', 'source_name', 'published_year', 'sector', 'content', 'duration', 'category'}}"
            )

            # Skip retries to prevent blocking the user.
            # Only use tools if we absolutely have to.
            try:
                resp = await self.ai_client.aio.models.generate_content(
                    model="gemini-flash-latest",
                    contents=extraction_prompt
                )
            except Exception as e:
                print(f"    [!] AI Extraction failed (likely quota): {e}")
                return False
            
            if not resp:
                return False

            raw_resp = resp.text.strip()
            if "```json" in raw_resp:
                raw_resp = raw_resp.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_resp:
                raw_resp = raw_resp.split("```")[1].split("```")[0].strip()
            
            data = json.loads(raw_resp)
            
            # Construct EvidenceUnit
            unit = EvidenceUnit(
                evidence_id=f"vid_sync_{video_id}",
                source_type=SourceType.VIDEO,
                title=data.get("title", video_info.get("title")),
                source_name=data.get("source_name", video_info.get("channel_name")),
                published_year=data.get("published_year", 2024),
                url=f"https://www.youtube.com/watch?v={video_id}", # Force clean URL
                sector=data.get("sector", "General"),
                content=data.get("content", ""),
                duration=data.get("duration", "00:00"),
                category=data.get("category", "talk"),
                usage_tags=["auto-synced", f"source-{context_source.lower()}", "multimodal-rag"]
            )

            self.academy.index_video(unit, user_id=user_id)
            print(f"    [+] Successfully indexed ({context_source}): {unit.title}")

            # Notification
            from app.api.endpoints.notifications import add_notification, NotificationType
            add_notification(
                type=NotificationType.ACADEMY_UPDATE,
                title="New Academy Content",
                message=f"Official talk '{unit.title}' has been indexed and is now searchable.",
                link="/academy"
            )
            
            return True

        except Exception as e:
            print(f"[!] Error processing {url}: {e}")
            return False

async def main():
    scraper = VideoScraper()
    results = await scraper.discover_and_index_latest()
    print(f"[*] Sync Complete: {results}")

if __name__ == "__main__":
    asyncio.run(main())
