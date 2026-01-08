# Indian cropping seasons (simplified)
CROP_SEASON_MAP = {
    "rice": ["kharif", "rabi"],
    "wheat": ["rabi"],
    "maize": ["kharif", "rabi"],
    "cotton": ["kharif"],
    "sugarcane": ["annual"],
    "pulses": ["kharif", "rabi"],
    "millets": ["kharif"],
    "vegetables": ["all"]
}

def get_crop_season_risk(crop_type: str, season: str) -> str:
    crop_type = crop_type.lower()
    season = season.lower()

    allowed_seasons = CROP_SEASON_MAP.get(crop_type)

    if not allowed_seasons:
        return "medium"  # unknown crop → neutral risk

    if "all" in allowed_seasons or "annual" in allowed_seasons:
        return "low"

    if season in allowed_seasons:
        return "low"

    # Wrong season crop
    return "high"
