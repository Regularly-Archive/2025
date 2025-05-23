from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class BookBase(BaseModel):
    title: str
    author: str
    price: float
    description: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    title: Optional[str] = None
    author: Optional[str] = None
    price: Optional[float] = None

class BookRead(BookBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 