from fastapi import APIRouter, HTTPException, Query
from app.schemas.fraud import FraudCheckResponse
from app.services.fraud_investigator import FraudInvestigator

router = APIRouter()
investigator = FraudInvestigator()

@router.get("/check", response_model=FraudCheckResponse)
async def check_fraud(
    q: str = Query(..., description="Entity name to check"),
    type: str = Query("investor", description="investor or startup")
):
    """
    Real-time fraud and credibility check using AI + Google Search.
    """
    try:
        return await investigator.investigate(q, type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/alerts")
async def get_alerts():
    """
    Get generic recent fraud alerts from the web.
    """
    try:
        return await investigator.get_recent_alerts()
    except Exception as e:
        # Don't crash frontend if alerts fail, generic return
        print(f"Alerts error: {e}")
        return []
