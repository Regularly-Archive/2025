from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Book Management API"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings() 