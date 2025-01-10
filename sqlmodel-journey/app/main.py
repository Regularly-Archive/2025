from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.database import engine
from app.models.domain import SQLModel
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.include_router(api_router, prefix=settings.API_V1_STR)