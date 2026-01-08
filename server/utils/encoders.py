from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

def get_preprocessor():
    categorical_features = [
        "crop_season_risk",
        "irrigation",
        "soil_quality",
        "market_volatility",
        "repayment_history",
        "loan_purpose"
    ]

    numerical_features = [
        "land_size_acres",
        "yield_variance",
        "rainfall_deviation",
        "experience_years"
    ]

    categorical_transformer = OneHotEncoder(handle_unknown="ignore")
    numerical_transformer = StandardScaler()

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", categorical_transformer, categorical_features),
            ("num", numerical_transformer, numerical_features)
        ]
    )

    return preprocessor
