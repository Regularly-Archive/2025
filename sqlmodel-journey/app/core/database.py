from sqlmodel import create_engine, Session
from typing import Generator
from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    echo=True  # 设置为 False 可以关闭 SQL 语句输出
)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session 