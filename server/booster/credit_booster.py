import shap
import pandas as pd
import numpy as np


class CreditBooster:
    def __init__(self, decision_engine, background_data_path="data/farmers_train.csv"):
        self.engine = decision_engine
        self.model = decision_engine.model

        # Load training data for background
        bg_df = pd.read_csv(background_data_path)
        self.feature_columns = bg_df.drop(columns=["default_risk"]).columns.tolist()

        # Use small representative background
        self.background = bg_df.sample(50, random_state=42)[self.feature_columns]

        # 🔑 CRITICAL FIX: always convert input back to DataFrame
        def model_fn(X):
            if not isinstance(X, pd.DataFrame):
                X = pd.DataFrame(X, columns=self.feature_columns)
            return self.model.predict_proba(X)[:, 1]

        self.explainer = shap.KernelExplainer(
            model_fn,
            self.background
        )

    def suggest_improvements(self, input_data: dict, top_k: int = 2):
        df = pd.DataFrame([input_data])[self.feature_columns]

        base_risk = self.engine.predict_default_probability(input_data)

        # SHAP values for single instance
        shap_values = self.explainer.shap_values(df)[0]

        feature_impacts = list(zip(self.feature_columns, shap_values))

        # Sort by risk-increasing contribution
        risky_features = sorted(
            feature_impacts,
            key=lambda x: x[1],
            reverse=True
        )

        suggestions = []

        for feature, impact in risky_features:
            if feature in ["repayment_history", "irrigation", "loan_purpose", "soil_quality", "market_volatility", "crop_season_risk"]:
                improved_input = input_data.copy()

                if feature == "repayment_history":
                    improved_input[feature] = "good"
                elif feature == "irrigation":
                    improved_input[feature] = "assured"
                elif feature == "loan_purpose":
                    improved_input[feature] = "productive"
                elif feature == "soil_quality":
                    improved_input[feature] = "good"  # Suggest Soil Health Card
                elif feature == "market_volatility":
                    improved_input[feature] = "low"   # Suggest Forward Contracts/MSP
                elif feature == "crop_season_risk":
                    improved_input[feature] = "low"   # Suggest changing crop/season

                new_risk = self.engine.predict_default_probability(improved_input)

                if new_risk < base_risk:
                    # Suggestions in raw format for Frontend Mapper
                    suggestions.append({
                        "factor": feature,  # Raw key for mapping
                        "current_risk": base_risk,
                        "improved_risk": new_risk,
                        "risk_reduction": base_risk - new_risk,
                        # Extra metadata if needed
                        "original_feature": feature
                    })

            if len(suggestions) == top_k:
                break

        return suggestions
