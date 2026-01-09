import uuid
import datetime
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.rag.retriever import Retriever
from app.reasoning.validator import Validator
from app.generation.generator import Generator


class AnalysisOrchestrator:
    # Anlzuse the whole pipeline
    def __init__(self):
        self.retriever = Retriever()
        self.validator = Validator()
        self.generator = Generator()

    async def run_analysis(self, request: AnalysisRequest) -> AnalysisResponse:

        # 1. RETRIEVAL
        # Fetches contextually relevant facts based on startup sector, geography, and stage.
        evidence_units = await self.retriever.retrieve_relevant_evidence(
            sector=request.sector,
            geography=request.geography,
            funding_stage=request.funding_stage,
            startup_description=request.startup_description,
        )

        # 2. VALIDATION
        # Analyzes evidence and determines which logical claims are supported or rejected.
        reasoning_result = self.validator.validate(
            evidence=evidence_units,
            sector=request.sector,
            geography=request.geography,
            funding_stage=request.funding_stage,
        )

        # 3. GENERATION
        # Translates validated reasoning into professional, multilingual prose via Gemini.
        report = await self.generator.generate_report(
            reasoning_result=reasoning_result,
            evidence_units=evidence_units,
            language=request.language,
        )

        evidence_for_ui = [
            {
                "source_type": ev.source_type.value if hasattr(ev.source_type, "value") else str(ev.source_type),
                "title": ev.title,
                "source_name": ev.source_name,
                "year": str(ev.published_year),
                "url": ev.url,
                "usage_reason": (
                    ev.usage_tags[0] if ev.usage_tags else "General context"
                ),
            }
            for ev in evidence_units
        ]

        investors_from_report = report.get("recommended_investors", [])
        final_investors = []
        investor_scores = []

        for inv in investors_from_report:
            # Defensive casting for fit_score
            try:
                score = int(float(inv.get("fit_score", 75)))
            except (ValueError, TypeError):
                score = 75
                
            score = max(5, min(98, score))
            investor_scores.append(score)
            
            raw_name = inv.get("name", "Unknown Investor")
            initials = "".join([n[0] for n in raw_name.split() if n]) if raw_name else "VC"
            
            # Defensive check for reasons (ensure it is a list)
            raw_reasons = inv.get("reasons", [])
            if isinstance(raw_reasons, str):
                raw_reasons = [raw_reasons]
            elif not raw_reasons:
                raw_reasons = [f"Strong alignment with startup's mission in {request.sector}."]

            # Defensive check for focus_areas
            raw_focus = inv.get("focus_areas", [request.sector])
            if isinstance(raw_focus, str):
                raw_focus = [raw_focus]
                
            final_investors.append(
                {
                    "name": raw_name,
                    "fit_score": score,
                    "logo_initials": initials[:3].upper(),
                    "focus_areas": raw_focus,
                    "reasons": raw_reasons,
                }
            )

        # Calculates a more intuitive overall fit score
        avg_inv_score = (
            sum(investor_scores) / max(len(investor_scores), 1)
            if investor_scores
            else 50
        )
        # Evidence score is normalized
        evidence_score = min(100, (len(evidence_units) / 7.0) * 100) if evidence_units else 30
        
        # 0.6 factor from validator ratio, 0.4 from aggregate investor match
        reasoning_ratio_score = reasoning_result.support_ratio * 100
        
        blended_score = int(
            (avg_inv_score * 0.45) + 
            (reasoning_ratio_score * 0.45) + 
            (evidence_score * 0.1)
        )
        
        # Final cap for realism
        blended_score = max(5, min(99, blended_score))

        response = AnalysisResponse(
            analysis_id=str(uuid.uuid4()),
            user_id=request.user_id,
            startup_summary=report.get(
                "executive_summary", f"Analysis for {request.sector} startup based on available evidence."
            ),
            confidence_indicator=reasoning_result.confidence_level,
            overall_score=blended_score,
            recommended_investors=final_investors
            or [
                {
                    "name": "General VC",
                    "fit_score": 50,
                    "logo_initials": "VC",
                    "reasons": [
                        "No specific investor matches found in current evidence. Recommend exploring general sector funds."
                    ],
                }
            ],
            why_fits=report.get("why_this_fits", []) if isinstance(report.get("why_this_fits"), list) else [report.get("why_this_fits")] if report.get("why_this_fits") else [],
            why_does_not_fit=report.get("why_this_does_not_fit", []) if isinstance(report.get("why_this_does_not_fit"), list) else [report.get("why_this_does_not_fit")] if report.get("why_this_does_not_fit") else [],
            evidence_used=evidence_for_ui,
            perspectives=report.get("perspectives"),
            grounding_trace=report.get("grounding_trace"),
            created_at=datetime.datetime.utcnow().isoformat() + "Z", # Standard UTC format
            metadata={
                "language": request.language,
                "engine_version": "1.0.0-rag-decision-centric",
                "evidence_count": len(evidence_units),
                "sector": request.sector,
                "stage": request.funding_stage,
                "geography": request.geography,
                "raw_support_ratio": reasoning_result.support_ratio,
            },
        )

        # Trigger completion notification
        try:
            from app.api.endpoints.notifications import add_notification, NotificationType
            add_notification(
                type=NotificationType.ANALYSIS_COMPLETE,
                title="Analysis Complete",
                message=f"The briefing for your {request.sector} startup is now ready.",
                link=f"/results/{response.analysis_id}"
            )
        except Exception as e:
            print(f"[*] Notification failed: {e}")

        return response
