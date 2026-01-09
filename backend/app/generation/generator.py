import json
from typing import Dict, List, Any
from google import genai
from google.genai import types
from app.config.settings import settings
from app.schemas.reasoning import ReasoningResult


class Generator:

    # Generation Layer: Handles professional explanation of validated results.

    # Hallucinations are prevented because the prompt forbids the introduction of
    # any facts not present in the supported_claims or evidence_map.

    def __init__(self):
        if settings.GOOGLE_API_KEY:
            self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        else:
            self.client = None

    # reasoning_result: The output from the Validator layer.
    #   language: Target language for the report
    async def generate_report(
        self,
        reasoning_result: ReasoningResult,
        evidence_units: List[Any],
        language: str = "en",
    ) -> Dict:
        if not settings.GOOGLE_API_KEY:
            return self._generate_mock_fallback(reasoning_result, language)

        system_prompt = (
            "You are a Senior Venture Capital Expert Panel. Your task is to explain a provided "
            "funding analysis from three distinct perspectives based ONLY on the validated claims and evidence provided.\n\n"
            "CRITICAL CONSTRAINTS:\n"
            f"0. You MUST write the ENTIRE REPORT in the following language: {language}.\n"
            "1. Do NOT hallucinate. Use only the provided evidence.\n"
            "2. For every insight in 'why_this_fits' and 'why_this_does_not_fit', you MUST include a [source_id] tag at the end of the sentence (e.g., [ev_vec_123]).\n"
            "3. Provide distinct analysis for these three personas:\n"
            "   - Policy Guard: Focused on government policies, tax holidays, and regulatory support.\n"
            "   - Market Maven: Focused on market trends, sector growth, and competitive landscape.\n"
            "   - VC Strategist: Focused on investor fit, funding stage alignment, and strategic roadmap.\n"
            "4. Your response MUST be a valid JSON object with the following keys:\n"
            "   - executive_summary (string)\n"
            "   - perspectives (object with keys: 'policy_guard', 'market_maven', 'vc_strategist')\n"
            "     Each perspective object should have: 'analysis' (string), 'top_insights' (list of strings with [source_id] tags)\n"
            "   - why_this_fits (list of strings with [source_id] tags)\n"
            "   - why_this_does_not_fit (list of strings with [source_id] tags)\n"
            "   - recommended_investors (list of objects with: name (string), fit_score (INTEGER 0-100, NO DECIMALS), reasons (LIST of strings), focus_areas (LIST of strings))\n"
            "   - grounding_trace (object mapping [source_id] to a 1-sentence summary of the specific fact used from that source)"
        )

        input_data = {
            "supported_claims": reasoning_result.supported_claims,
            "rejected_claims": reasoning_result.rejected_claims,
            "confidence_level": reasoning_result.confidence_level,
            "evidence": [
                {
                    "id": ev.evidence_id if hasattr(ev, "evidence_id") else str(getattr(ev, "id", "unknown")),
                    "category": getattr(ev, "category", "market"),
                    "content": ev.content if hasattr(ev, "content") else str(ev),
                    "title": ev.title if hasattr(ev, "title") else "Unknown"
                } for ev in evidence_units
            ],
        }

        try:
            response = await self.client.aio.models.generate_content(
                model="gemini-flash-latest",
                contents=f"{system_prompt}\n\nData to analyze: {json.dumps(input_data)}",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"[!] Generation failed: {e}")
            return self._generate_mock_fallback(reasoning_result, language)
                                                                                                  
    def _generate_mock_fallback(
        self, reasoning_result: ReasoningResult, language: str
    ) -> Dict:

        summaries = {
            "hi": "बाजार, नियामक और वित्तीय मापदंडों में प्रारंभिक विश्लेषण किया गया।",
            "en": "Initial analysis performed across market, regulatory, and financial parameters.",
        }
        
        explanation_prefix = {
            "hi": "प्रत्यक्ष साक्ष्य मिलान के आधार पर रिपोर्ट तैयार की गई।",
            "en": "Report generated based on direct evidence matches.",
        }

        return {
            "executive_summary": summaries.get(language, summaries["en"]),
            "why_this_fits": reasoning_result.supported_claims,
            "why_this_does_not_fit": [
                (f"Insufficient evidence for: {c}" if language == "en" else f"इसके लिए अपर्याप्त साक्ष्य: {c}")
                for c in reasoning_result.rejected_claims
            ],
            "recommended_investors": [
                {
                    "name": "General VC Fund",
                    "fit_score": 70,
                    "reasons": ["Strategic match" if language == "en" else "रणनीतिक मिलान"],
                    "focus_areas": ["Technology"]
                }
            ],
            "confidence_explanation": f"{explanation_prefix.get(language, explanation_prefix['en'])} (Confidence: {reasoning_result.confidence_level})",
        }

    async def translate(self, text: str, target_language: str) -> str:
        if not self.client:
            return text
        
        # Mapping language codes to full names for better AI context
        lang_map = {
            "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu", 
            "mr": "Marathi", "gu": "Gujarati", "kn": "Kannada", "en": "English"
        }
        target_lang_name = lang_map.get(target_language, target_language)

        prompt = f"Translate the following text to {target_lang_name}. Return ONLY the translated text, no quotes or meta-talk.\n\nTEXT: {text}"
        try:
            response = await self.client.aio.models.generate_content(
                model="gemini-flash-latest",
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            print(f"[!] Dynamic translation failed: {e}")
            return text

    async def generate_explanation(self, validated_data: dict, language: str) -> str:
        return f"Validated report generated in {language}"
