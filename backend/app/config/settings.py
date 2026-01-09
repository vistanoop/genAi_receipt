from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "FundingSense Backend"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    GOOGLE_API_KEY: Optional[str] = None
    YOUTUBE_API_KEY: Optional[str] = None
    ENABLE_VECTOR_DB: bool = True

    ALLOWED_ORIGINS: str = "*"

    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    RENDER_EXTERNAL_URL: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=True, extra="ignore"
    )


settings = Settings()
