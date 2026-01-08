import pickle
import pandas as pd

MODEL_PATH = "model.pkl"

# Load trained pipeline
with open(MODEL_PATH, "rb") as f:
    pipeline = pickle.load(f)

# Extract parts
preprocessor = pipeline.named_steps["preprocessor"]
classifier = pipeline.named_steps["classifier"]

# Get feature names AFTER encoding
feature_names = preprocessor.get_feature_names_out()

# Get coefficients
coefficients = classifier.coef_[0]

# Build dataframe
weights_df = pd.DataFrame({
    "feature": feature_names,
    "weight": coefficients
}).sort_values(by="weight", ascending=False)

print(weights_df)
