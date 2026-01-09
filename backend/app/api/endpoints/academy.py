from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.evidence import EvidenceUnit
from app.rag.academy_engine import AcademyEngine

router = APIRouter()
engine = AcademyEngine()

@router.get("/videos", response_model=List[EvidenceUnit])
async def get_videos(
    limit: int = Query(10, ge=1, le=50),
    featured: bool = Query(False),
    user_id: Optional[str] = Query(None)
):
    """
    Get a list of videos from the Academy.
    """
    try:
        if featured:
            return engine.get_featured_videos(limit=limit, user_id=user_id)
        # For now, we reuse featured logic or implement a broad list
        return engine.get_featured_videos(limit=limit, user_id=user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search", response_model=List[EvidenceUnit])
async def search_videos(
    q: str = Query(..., min_length=2),
    limit: int = Query(5, ge=1, le=20),
    user_id: Optional[str] = Query(None)
):
    """
    Search through video transcripts and insights.
    """
    try:
        return engine.search_academy(q, limit=limit, user_id=user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest", status_code=201)
async def ingest_video_content(video: EvidenceUnit):
    """
    Index new video content into the Academy.
    """
    try:
        engine.index_video(video)
        return {"status": "success", "message": f"Video '{video.title}' indexed."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync")
async def sync_academy(user_id: Optional[str] = Query(None)):
    """
    Trigger the automated discovery of videos and real-time market news.
    """
    from app.rag.video_scraper import VideoScraper
    from app.services.intel_digest import IntelDigestService
    
    scraper = VideoScraper()
    digest_service = IntelDigestService()
    
    try:
        # Check if we need to seed first (Instant gratification)
        seeded = False
        if user_id:
            existing_videos = engine.get_featured_videos(user_id=user_id, limit=1)
            if not existing_videos:
                print(f"[*] Initial sync for {user_id}. Seeding curated intelligence...")
                engine.seed_academy(user_id)
                seeded = True

        # Run live sync task (now much more lightweight)
        video_stats = await scraper.discover_and_index_latest(user_id=user_id)
        if seeded:
            video_stats["is_seeded"] = True

        news_count = await digest_service.generate_daily_digest()
        
        return {
            "status": "success", 
            "video_stats": video_stats,
            "market_intel_pushed": news_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")

@router.post("/reset")
async def reset_academy(user_id: str = Query(...)):
    """
    Clear all videos for the current user.
    """
    success = engine.delete_user_videos(user_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to clear library.")
    return {"status": "success", "message": "Library cleared."}
