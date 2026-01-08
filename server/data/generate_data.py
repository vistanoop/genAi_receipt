import random
import csv

NUM_ROWS = 5000

CROP_TYPES = ["rice", "wheat", "maize", "cotton", "pulses", "millets"]
SEASONS = ["kharif", "rabi"]

IRRIGATION = ["rainfed", "partial", "assured"]
SOIL = ["poor", "average", "good"]
MARKET_VOL = ["low", "medium", "high"]
REPAYMENT = ["good", "mixed", "poor", "none"]
PURPOSE = ["productive", "semi", "consumption"]

CROP_SEASON_MAP = {
    "rice": ["kharif", "rabi"],
    "wheat": ["rabi"],
    "maize": ["kharif", "rabi"],
    "cotton": ["kharif"],
    "pulses": ["kharif", "rabi"],
    "millets": ["kharif"]
}

def crop_season_risk(crop, season):
    return "low" if season in CROP_SEASON_MAP[crop] else "high"

def compute_default(row):
    risk = 0

    # Capacity
    if row["land_size_acres"] < 1: risk += 1
    if row["experience_years"] < 2: risk += 1
    if row["repayment_history"] in ["poor", "none"]: risk += 2

    # Agro risk
    if row["crop_season_risk"] == "high": risk += 1
    if row["irrigation"] == "rainfed": risk += 1
    if row["soil_quality"] == "poor": risk += 1
    if row["yield_variance"] > 0.7: risk += 1
    if row["rainfall_deviation"] > 30: risk += 1
    if row["market_volatility"] == "high": risk += 1

    if row["loan_purpose"] == "consumption":
        risk += 2
    elif row["loan_purpose"] == "semi":
        risk += 1

    # Loan stress (MOST IMPORTANT)
    if row["loan_amount_per_acre"] > 120000: risk += 2
    if row["loan_to_experience_ratio"] > 60000: risk += 2

    return 1 if risk >= 5 else 0

rows = []

for _ in range(NUM_ROWS):
    land = round(random.uniform(0.5, 6), 2)
    exp = random.randint(0, 30)
    loan = random.randint(1_000, 500_000)

    loan_per_acre = loan / land
    loan_to_exp = loan / (exp + 1)

    crop = random.choice(CROP_TYPES)
    season = random.choice(SEASONS)

    row = {
        "land_size_acres": land,
        "experience_years": exp,
        "loan_amount": loan,
        "loan_amount_per_acre": round(loan_per_acre, 2),
        "loan_to_experience_ratio": round(loan_to_exp, 2),

        "crop_type": crop,
        "crop_season_risk": crop_season_risk(crop, season),
        "irrigation": random.choice(IRRIGATION),
        "soil_quality": random.choice(SOIL),
        "yield_variance": round(random.uniform(0.1, 1.0), 2),
        "rainfall_deviation": random.randint(0, 40),
        "market_volatility": random.choice(MARKET_VOL),
        "repayment_history": random.choice(REPAYMENT),
        "loan_purpose": random.choice(PURPOSE)
    }

    row["default_risk"] = compute_default(row)
    rows.append(row)

with open("farmers_train.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print("✅ Industry-ready dataset generated")
