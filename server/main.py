from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model.decision_engine import DecisionEngine
from context.region_profiles import REGION_CONTEXT
from context.crop_season_rules import get_crop_season_risk
from context.farmer_db import get_farmer_history
from booster.credit_booster import CreditBooster

app = FastAPI(
    title="AgriScore API",
    description="Connect with our official API: [https://break2build.onrender.com/](https://break2build.onrender.com/)",
    version="1.0.0"
)

# Allow CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Engine and Booster
# Ensure model.pkl exists (it should, based on file listing)
try:
    engine = DecisionEngine()
    booster = CreditBooster(engine)
except Exception as e:
    # print(f"Error initializing engine/booster: {e}")
    # Fallback/Empty for build safety, but will fail requests if models missing
    engine = None
    booster = None

class AssessmentRequest(BaseModel):
    farmer_id: str
    land_size_acres: float
    crop_type: str
    irrigation: str
    loan_purpose: str
    experience_years: int
    location: str
    loan_amount: int


@app.post("/assess")
async def assess_credit(data: AssessmentRequest):


    if not engine:

        raise HTTPException(status_code=500, detail="Decision Engine not initialized")

    # 1. Normalize Inputs
    city_key = data.location.title() # e.g. "raichur" -> "Raichur"

    
    if city_key not in REGION_CONTEXT:

        raise HTTPException(status_code=400, detail=f"Location '{data.location}' not supported.")

    region_data = REGION_CONTEXT[city_key]

    
    # 2. Fetch Repayment History
    repayment_history = get_farmer_history(data.farmer_id)
    if repayment_history is None:
        raise HTTPException(status_code=400, detail=f"Farmer ID '{data.farmer_id}' not found in database.")


    # 3. Calculate Season Risk (Hardcoded 'kharif' as per demo script context)
    CURRENT_SEASON = "kharif" 
    crop_season_risk = get_crop_season_risk(data.crop_type, CURRENT_SEASON)

    # 4. Construct Enrichment Payload
    # This must match the schema expected by the model (same keys as used in training/test_decision)
    model_input = {
        "land_size_acres": data.land_size_acres,
        "crop_type": data.crop_type.lower(),
        "irrigation": data.irrigation.lower(),
        "soil_quality": region_data["soil_quality"],
        "yield_variance": region_data["yield_variance"],
        "rainfall_deviation": region_data["rainfall_deviation"],
        "market_volatility": region_data["market_volatility"],
        "repayment_history": repayment_history,
        "loan_purpose": data.loan_purpose.lower(),
        "experience_years": data.experience_years,
        # New features added for Loan Stress analysis
        "loan_amount": data.loan_amount,
        "loan_amount_per_acre": data.loan_amount / data.land_size_acres,
        "loan_to_experience_ratio": data.loan_amount / (data.experience_years + 1),
        # Derived
        "crop_season_risk": crop_season_risk
    }
    


    # 5. Run Assessment
    assessment_result = engine.assess(model_input)
    
    # Map City to State
    CITY_TO_STATE = {
        "Hassan": "Karnataka",
        "Raichur": "Karnataka",
        "Mandya": "Karnataka",
        "Guntur": "Andhra Pradesh",
        "Nashik": "Maharashtra",
        "Ludhiana": "Punjab",
        "Karnal": "Haryana",
        "Thanjavur": "Tamil Nadu",
        "Vidisha": "Madhya Pradesh",
        "Nizamabad": "Telangana"
    }

    # Enrich input_summary for frontend display
    summary_payload = model_input.copy()
    summary_payload.update({
        "farmer_id": data.farmer_id,
        "city": city_key,
        "state": CITY_TO_STATE.get(city_key, "Unknown")
    })

    response = {
        "decision": assessment_result,
        "input_summary": summary_payload,
        "loan_amount": data.loan_amount,
        "optimized_plan": None,
        "credit_booster": []
    }

    # 6. Optimize if needed
    if assessment_result["decision"] != "APPROVE":
        optimized = engine.optimize_loan_amount(
            input_data=model_input,
            requested_amount=data.loan_amount
        )
        response["optimized_plan"] = optimized

    # 7. Credit Booster Suggestions
    # Only useful if there is risk (decision isn't perfect or just to show improvements)
    # Usually we show suggestions to help them improve score regardless
    try:
        suggestions = booster.suggest_improvements(model_input)
        response["credit_booster"] = suggestions
    except Exception as e:
        # print(f"Booster error: {e}")
        response["credit_booster"] = []

    return response

@app.get("/")
def health_check():
    return {"status": "AgriScore API Running"}
