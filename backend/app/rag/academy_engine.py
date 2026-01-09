import os
import chromadb
from chromadb.utils import embedding_functions
from typing import List, Optional
from app.schemas.evidence import EvidenceUnit, SourceType
from app.config.settings import settings

class AcademyEngine:
    """
    Multimodal RAG Engine for the Video Academy.
    Indexes transcripts and key insights from official webinars and talks.
    """
    def __init__(self, persist_directory: str = "db"):
        try:
            abs_persist_path = os.path.abspath(persist_directory)
            self.client = chromadb.PersistentClient(path=abs_persist_path)

            if settings.GOOGLE_API_KEY:
                self.emb_fn = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
                    api_key=settings.GOOGLE_API_KEY, model_name="models/text-embedding-004"
                )
            else:
                self.emb_fn = embedding_functions.DefaultEmbeddingFunction()

            self.collection = self.client.get_or_create_collection(
                name="video_academy", embedding_function=self.emb_fn
            )
        except Exception as e:
            print(f"[!] AcademyEngine initialization failed: {e}")
            raise e

    def index_video(self, video: EvidenceUnit, user_id: Optional[str] = None):
        """
        Indexes a video transcript/summary into the academy collection.
        """
        metadata = {
            "source_type": "video",
            "source_name": video.source_name,
            "published_year": video.published_year,
            "url": video.url or "",
            "sector": video.sector,
            "title": video.title,
            "duration": video.duration or "00:00",
            "category": video.category or "talk",
            "user_id": user_id or "global" # Allow global videos or user-specific
        }

        self.collection.upsert(
            ids=[f"{user_id or 'global'}_{video.evidence_id}"],
            documents=[video.content],
            metadatas=[metadata]
        )

    def search_academy(self, query: str, user_id: Optional[str] = None, limit: int = 5) -> List[EvidenceUnit]:
        """
        Semantic search through video intelligence.
        """
        where_filter = {"user_id": user_id} if user_id else None
        
        results = self.collection.query(
            query_texts=[query],
            n_results=limit,
            where=where_filter
        )

        units = []
        if not results["ids"] or not results["ids"][0]:
            return []

        for i in range(len(results["ids"][0])):
            meta = results["metadatas"][0][i]
            units.append(
                EvidenceUnit(
                    evidence_id=results["ids"][0][i],
                    source_type=SourceType.VIDEO,
                    title=meta.get("title", "Untitled Video"),
                    source_name=meta.get("source_name", "Academic Series"),
                    published_year=int(meta.get("published_year", 2024)),
                    url=meta.get("url"),
                    sector=meta.get("sector", "General"),
                    content=results["documents"][0][i],
                    usage_tags=["video-academy"],
                    duration=meta.get("duration"),
                    category=meta.get("category")
                )
            )
        return units

    def get_featured_videos(self, user_id: Optional[str] = None, limit: int = 10) -> List[EvidenceUnit]:
        """
        Returns a sample of videos for the dashboard.
        """
        try:
            where_filter = {"user_id": user_id} if user_id else None
            results = self.collection.get(limit=limit, where=where_filter)
        except Exception:
            return []

        units = []
        if not results or not results["ids"]:
            return []

        for i in range(len(results["ids"])):
            meta = results["metadatas"][i] or {}
            units.append(
                EvidenceUnit(
                    evidence_id=results["ids"][i],
                    source_type=SourceType.VIDEO,
                    title=meta.get("title", "Untitled Video"),
                    source_name=meta.get("source_name", "Academic Series"),
                    published_year=int(meta.get("published_year", 2024)),
                    url=meta.get("url"),
                    sector=meta.get("sector", "General"),
                    content=results["documents"][i][:500], # Preview content
                    usage_tags=["featured"],
                    duration=meta.get("duration"),
                    category=meta.get("category")
                )
            )
        return units

    def seed_academy(self, user_id: str):
        """
        Populate the academy with initial seed data if search fails.
        """
        seed_videos = [
            EvidenceUnit(
                evidence_id="seed_blume_2024",
                source_type=SourceType.VIDEO,
                title="Building for the Next Billion: The 2024 Playbook",
                source_name="Blume Ventures",
                published_year=2024,
                url="https://www.youtube.com/watch?v=eVnSYMTMCQ8",
                sector="Consumer Tech",
                content="Deep dive into the 'Indus' consumer segment. Key takeaways: Trust is more important than price for Tier 2+ users. Founders must build for local languages from day one to capture the next 300M users.",
                duration="24:15",
                category="talk"
            ),
            EvidenceUnit(
                evidence_id="seed_peakxv_2024",
                source_type=SourceType.VIDEO,
                title="The AI First Startup: Strategies for Indian Founders",
                source_name="Peak XV Partners",
                published_year=2024,
                url="https://www.youtube.com/watch?v=ZkuoMbtm2TQ",
                sector="Deep Tech / AI",
                content="Venture capitalists discuss why the 'wrapper' era of AI is over. Focus on verticalized LLMs and proprietary data pipelines. India's advantage lies in the application layer and talent density.",
                duration="18:40",
                category="webinar"
            ),
            EvidenceUnit(
                evidence_id="seed_elevation_2024",
                source_type=SourceType.VIDEO,
                title="Navigating the 2024 Funding Winter",
                source_name="Elevation Capital",
                published_year=2024,
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                sector="Fintech",
                content="Strategic advice on runway management and profitability. Why unit economics are the only truth in the current market. Shift from 'growth at all costs' to 'sustainable scaling' metrics.",
                duration="32:10",
                category="talk"
            )
        ]
        
        for video in seed_videos:
            self.index_video(video, user_id=user_id)
        
        return len(seed_videos)

    def delete_user_videos(self, user_id: str):
        """
        Clears all videos for a specific user.
        """
        try:
            self.collection.delete(where={"user_id": user_id})
            return True
        except Exception as e:
            print(f"[!] Force delete for user {user_id} failed: {e}")
            return False
