import asyncio
from app.schemas.evidence import EvidenceUnit, SourceType
from app.rag.academy_engine import AcademyEngine

SEED_VIDEOS = [
    {
        "evidence_id": "vid_001",
        "title": "Unlocking the Next Billion: Rural FinTech in India",
        "source_name": "Startup India Official",
        "published_year": 2024,
        "url": "https://www.youtube.com/watch?v=startup-india-rural",
        "sector": "FinTech",
        "duration": "14:20",
        "category": "webinar",
        "content": """Summary of talk by Ministry of Electronics & IT (MeitY) on rural digitalization. 
        Key Insight 1: Digital payment adoption in Tier 3 cities is growing at 45% YoY. 
        Key Insight 2: Farmers are looking for 'Voice-First' interfaces rather than complex apps. 
        Key Insight 3: Government subsidies are now being routed via UPI-AutoPay, creating a massive opportunity for FinTech layers."""
    },
    {
        "evidence_id": "vid_002",
        "title": "The AgriTech Revolution: Data-Driven Farming",
        "source_name": "Peak XV Multiplier",
        "published_year": 2024,
        "url": "https://www.youtube.com/watch?v=peak-xv-agritech",
        "sector": "AgriTech",
        "duration": "28:45",
        "category": "talk",
        "content": """Deep dive into AgriTech trends by Peak XV Managing Directors. 
        Key Insight 1: Precision farming is no longer a luxury; it's a necessity for yield optimization in high-value crops.
        Key Insight 2: The 'Success Fee' model is more effective in rural India than SaaS subscriptions. 
        Key Insight 3: Integration with Government schemes (PM-Kisan) provides a significant moat for tech players."""
    },
    {
        "evidence_id": "vid_003",
        "title": "Scaling SaaS from Bharat to the World",
        "source_name": "Blume Ventures Founders Series",
        "published_year": 2025,
        "url": "https://www.youtube.com/watch?v=blume-saas-global",
        "sector": "SaaS",
        "duration": "42:10",
        "category": "interview",
        "content": """Panel discussion with founders of leading Indian SaaS companies. 
        Key Insight 1: Indian engineering talent is pivoting from service-mindset to product-mindset.
        Key Insight 2: Vertical SaaS (Deep Tech for specific industries) is seeing faster adoption than horizontal CRM tools.
        Key Insight 3: Regulatory compliance in the US and EU is the biggest hurdle for global scaling."""
    }
]

async def seed_academy():
    print("[*] Seeding Video Academy with high-fidelity intelligence...")
    engine = AcademyEngine()
    
    for video_data in SEED_VIDEOS:
        try:
            unit = EvidenceUnit(
                evidence_id=video_data["evidence_id"],
                source_type=SourceType.VIDEO,
                title=video_data["title"],
                source_name=video_data["source_name"],
                published_year=video_data["published_year"],
                url=video_data["url"],
                sector=video_data["sector"],
                content=video_data["content"],
                duration=video_data["duration"],
                category=video_data["category"]
            )
            
            engine.index_video(unit)
            print(f"[+] Indexed: {video_data['title']}")
            
        except Exception as e:
            print(f"[!] Error indexing {video_data['title']}: {e}")

if __name__ == "__main__":
    asyncio.run(seed_academy())
