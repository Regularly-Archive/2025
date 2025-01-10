from typing import Optional
from fastapi import Depends
from sqlmodel import Session
from app.core.database import get_session
from app.core.exceptions import BookNotFoundException
from app.repositories.book_repository import BookRepository
from app.models.schemas import BookCreate, BookUpdate, BookRead
from app.utils.pagination import PageParams, Page

class BookService:
    def __init__(self, session: Session = Depends(get_session)):
        self.repository = BookRepository(session)

    def create_book(self, book_create: BookCreate) -> BookRead:
        book = self.repository.create(book_create)
        return BookRead.from_orm(book)

    def get_books(
        self,
        params: PageParams,
        title: Optional[str] = None
    ) -> Page[BookRead]:
        return self.repository.get_all(params, title)

    def get_book(self, book_id: int) -> BookRead:
        book = self.repository.get_by_id(book_id)
        if not book:
            raise BookNotFoundException()
        return BookRead.from_orm(book)

    def update_book(self, book_id: int, book_update: BookUpdate) -> BookRead:
        book = self.repository.update(book_id, book_update)
        if not book:
            raise BookNotFoundException()
        return BookRead.from_orm(book)

    def delete_book(self, book_id: int) -> None:
        if not self.repository.delete(book_id):
            raise BookNotFoundException() 