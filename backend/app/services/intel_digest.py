import json
import asyncio
from datetime import datetime
from google import genai
from google.genai import types
from app.config.settings import settings
from app.api.endpoints.notifications import add_notification, NotificationType

class IntelDigestService:
    """
    Generates real-time market intelligence digests using Gemini + Google Search Grounding.
    """
    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY) if settings.GOOGLE_API_KEY else None

    async def generate_daily_digest(self):
        """
        Searches for the most critical startup funding news in India for the last 24 hours
        and pushes them as system-wide notifications.
        """
        if not self.client:
            print("[!] AI Client not configured for Intel Digest.")
            return

        print("[*] Generating Real-Time Funding Intel Digest...")

        prompt = (
            "Identify the top 3 most significant startup funding news or major policy shifts in the Indian startup ecosystem "
            "that occurred in the last 24 hours. Focus on high-impact rounds or regulatory changes.\n\n"
            "Return ONLY a JSON list of objects with 'title', 'summary', and 'source_url'."
        )

        try:
            response = await self.client.aio.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())]
                )
            )

            raw_text = response.text.strip()
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            
            news_items = json.loads(raw_text)

            for item in news_items:
                add_notification(
                    type=NotificationType.MARKET_INTEL,
                    title=item.get("title", "Market Update"),
                    message=item.get("summary", ""),
                    link=item.get("source_url")
                )
                print(f"    [+] Pushed Intel: {item.get('title')}")

            return len(news_items)

        except Exception as e:
            print(f"[!] Intel Digest generation failed: {e}")
            return 0

async def main():
    service = IntelDigestService()
    count = await service.generate_daily_digest()
    print(f"[*] Digest Complete: {count} alerts pushed.")

if __name__ == "__main__":
    asyncio.run(main())
