import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, f1_score, classification_report
from utils.encoders import get_preprocessor

DATA_PATH = "data/farmers_train.csv"

def evaluate():
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    
    X = df.drop(columns=["default_risk"])
    y = df["default_risk"]

    print(f"Dataset Size: {len(df)} records")
    print(f"Class Balance:\n{y.value_counts(normalize=True)}")

    # Define the exact model pipeline used in production
    pipeline = Pipeline(steps=[
        ("preprocessor", get_preprocessor()),
        ("classifier", LogisticRegression(max_iter=1000))
    ])

    # 1. Cross-Validation Statistics (More robust estimation)
    print("\n--- Cross-Validation (5-Fold) ---")
    cv_acc = cross_val_score(pipeline, X, y, cv=5, scoring='accuracy')
    cv_f1 = cross_val_score(pipeline, X, y, cv=5, scoring='f1')
    
    print(f"Mean Accuracy: {cv_acc.mean():.4f} (+/- {cv_acc.std() * 2:.4f})")
    print(f"Mean F1 Score: {cv_f1.mean():.4f} (+/- {cv_f1.std() * 2:.4f})")

    # 2. Train/Test Split Evaluation (Snapshot performance)
    print("\n--- Hold-Out Test Set (20%) ---")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print(f"Accuracy: {acc:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    evaluate()
