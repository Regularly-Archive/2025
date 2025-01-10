from typing import TypeVar, Generic, Sequence, Optional
from pydantic import BaseModel
from fastapi import Query

T = TypeVar("T")

class PageParams:
    def __init__(
        self,
        skip: int = Query(default=0, ge=0),
        limit: int = Query(default=10, ge=1, le=100)
    ):
        self.skip = skip
        self.limit = limit

class Page(BaseModel, Generic[T]):
    items: Sequence[T]
    total: int
    page: int
    size: int
    pages: int

    @classmethod
    def create(cls, items: Sequence[T], total: int, params: PageParams):
        pages = (total + params.limit - 1) // params.limit
        return cls(
            items=items,
            total=total,
            page=params.skip // params.limit + 1,
            size=len(items),
            pages=pages
        ) 