import pandas as pd
import pickle

from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from utils.encoders import get_preprocessor

DATA_PATH = "data/farmers_train.csv"
MODEL_PATH = "model/model.pkl"


def train():
    # Load data
    df = pd.read_csv(DATA_PATH)

    X = df.drop(columns=["default_risk"])
    y = df["default_risk"]

    # Build pipeline
    model = Pipeline(steps=[
        ("preprocessor", get_preprocessor()),
        ("classifier", LogisticRegression(max_iter=1000))
    ])

    # Train
    model.fit(X, y)

    # Save model
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("Model trained and saved as model.pkl")

if __name__ == "__main__":
    train()
