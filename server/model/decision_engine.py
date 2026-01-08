import pickle
import pandas as pd

MODEL_PATH = "model/model.pkl"

APPROVE_THRESHOLD = 0.30
REVIEW_THRESHOLD  = 0.55
HARD_REJECT       = 0.85


class DecisionEngine:
    def __init__(self):
        with open(MODEL_PATH, "rb") as f:
            self.model = pickle.load(f)

    def predict_default_probability(self, input_data: dict) -> float:
        df = pd.DataFrame([input_data])
        return float(self.model.predict_proba(df)[0][1])

    def assess(self, input_data: dict):
        default_prob = self.predict_default_probability(input_data)

        # --- Decision policy ---
        if default_prob < APPROVE_THRESHOLD:
            decision = "APPROVE"
        elif default_prob < REVIEW_THRESHOLD:
            decision = "REVIEW"
        else:
            decision = "REJECT"

        # --- Explainability reasons ---
        reasons = []
        if input_data.get("rainfall_deviation", 0) > 25:
            reasons.append("High rainfall deviation")
        if input_data.get("repayment_history") in ["poor", "none"]:
            reasons.append("Weak repayment history")
        if input_data.get("irrigation") == "rainfed":
            reasons.append("No assured irrigation")
        if input_data.get("crop_season_risk") == "high":
            reasons.append("Crop not suitable for current season")

        return {
            "decision": decision,
            "default_probability": round(default_prob, 3),
            "key_reasons": reasons
        }

    def optimize_loan_amount(
        self,
        input_data: dict,
        requested_amount: int,
        min_amount: int = 5_000,
        step: int = 5_000
    ):
        base_prob = self.predict_default_probability(input_data)

        # --- Hard reject rule ---
        if base_prob >= HARD_REJECT:
            return {
                "optimized_amount": 0,
                "base_risk": round(base_prob, 3),
                "message": "Borrower too risky for any loan amount"
            }

        # --- Reduce exposure until risk becomes acceptable ---
        for amount in range(requested_amount, min_amount - 1, -step):
            exposure_ratio = amount / requested_amount
            adjusted_risk = base_prob * exposure_ratio

            if adjusted_risk < APPROVE_THRESHOLD:
                return {
                    "optimized_amount": amount,
                    "base_risk": round(base_prob, 3),
                    "adjusted_risk": round(adjusted_risk, 3),
                    "message": "Safe loan amount identified"
                }

        return {
            "optimized_amount": 0,
            "base_risk": round(base_prob, 3),
            "message": "Borrower too risky even at minimum amount"
        }
