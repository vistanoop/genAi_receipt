import json
import datetime
from google import genai
from google.genai import types
from app.config.settings import settings
from app.schemas.fraud import FraudCheckResponse

class FraudInvestigator:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY) if settings.GOOGLE_API_KEY else None

    async def investigate(self, entity: str, entity_type: str) -> FraudCheckResponse:
        """
        Conducts a background check on the entity using Google Search Grounding.
        """
        if not self.client:
            raise Exception("Google API Key not configured")

        prompt = (
            f"Act as a Forensic Financial Analyst. Conduct a background credibility check on the {entity_type} named '{entity}'.\n"
            f"Use Google Search to find recent news, reviews, scam reports, legal filings, crunchbase profile, or social media complaints.\n\n"
            f"Look explicitly for keywords: scam, fraud, unpaid, fake, lawsuit, complaint, warning, 'not paying', 'fake investor'.\n\n"
            f"Evaluate the collected evidence and assign a 'Risk Score' from 0 (Safe/Legit) to 100 (High Risk/Fraud).\n"
            f"If the entity is a well-known legitimate VC or startup with no red flags, risk score should be low (<20).\n"
            f"If there are concrete reports of bad behavior, risk score should be high (>70).\n\n"
            f"OUTPUT VALID JSON format matching this structure:\n"
            f"{{\n"
            f"  'status': 'risk' | 'safe',  // 'risk' if score > 50\n"
            f"  'score': number,            // 0-100\n"
            f"  'flags': [string],          // List of max 3 distinct red flags/warnings found. Empty if safe.\n"
            f"  'verified': boolean,        // True if you found concrete evidence of their legitimacy (e.g. Website, LinkedIn, Funding news).\n"
            f"  'summary': string           // DETAILED PROOF. If safe, explicitly mention their founding year, HQ location, and key status (e.g. 'Publicly listed on NSE' or 'Backed by Sequoia'). If risk, explain exactly why.\n"
            f"}}"
        )

        try:
            response = await self.client.aio.models.generate_content(
                model="gemini-flash-latest", # Using fast experimental model for speed & tool use
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.3
                )
            )

            raw_text = response.text.strip()
            # Clean md json
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0].strip()

            data = json.loads(raw_text)
            
            return FraudCheckResponse(
                entity=entity,
                status=data.get("status", "safe"),
                score=data.get("score", 10),
                flags=data.get("flags", [])[:3],
                verified=data.get("verified", False),
                lastChecked=datetime.datetime.now().strftime("%Y-%m-%d"),
                summary=data.get("summary", "No significant data found.")
            )

        except Exception as e:
            print(f"[!] Fraud check failed: {e}")
            # Fallback for error handling
            return FraudCheckResponse(
                entity=entity,
                status="safe",
                score=0,
                flags=["System error during check - Verification inconclusive"],
                verified=False,
                lastChecked=datetime.datetime.now().strftime("%Y-%m-%d"),
                summary="Unable to verify at this time."
            )

    async def get_recent_alerts(self) -> list[dict]:
        """
        Scans the internet for generic recent startup/investor scams.
        """
        if not self.client:
            return []

        prompt = (
            "Search for the latest news reports, community warnings, or articles about specific startup scams, "
            "fake VCs, angel investor fraud, or accelerator scams in India and Globally from the last 3 months.\n"
            "Find 4 distinct, real examples.\n"
            "Return a RAW JSON list of objects with these keys: 'title' (short headline), 'type' (Investor or Startup), "
            "'date' (approx relative time e.g. '2 weeks ago'), 'risk' (High or Medium)."
        )
        
        try:
            response = await self.client.aio.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.3
                )
            )

            raw_text = response.text.strip()
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].split("```")[0].strip()

            alerts = json.loads(raw_text)
            return alerts if isinstance(alerts, list) else []
        except Exception as e:
            print(f"[!] Alert fetch failed: {e}")
            return []
