from typing import List, Optional
from sqlmodel import Session, select, func
from app.models.domain import Book
from app.models.schemas import BookCreate, BookUpdate
from app.utils.pagination import PageParams, Page

class BookRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, book_create: BookCreate) -> Book:
        db_book = Book(**book_create.model_dump())
        self.session.add(db_book)
        self.session.commit()
        self.session.refresh(db_book)
        return db_book

    def get_by_id(self, book_id: int) -> Optional[Book]:
        return self.session.get(Book, book_id)

    def get_all(self, params: PageParams, title: Optional[str] = None) -> Page[Book]:
        query = select(Book)
        if title:
            query = query.where(Book.title.contains(title))
        
        total = self.session.exec(select(func.count()).select_from(query.subquery())).one()
        books = self.session.exec(query.offset(params.skip).limit(params.limit)).all()
        return Page.create(books, total, params)

    def update(self, book_id: int, book_update: BookUpdate) -> Optional[Book]:
        db_book = self.get_by_id(book_id)
        if not db_book:
            return None

        update_data = book_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_book, key, value)

        self.session.add(db_book)
        self.session.commit()
        self.session.refresh(db_book)
        return db_book

    def delete(self, book_id: int) -> bool:
        book = self.get_by_id(book_id)
        if not book:
            return False
        
        self.session.delete(book)
        self.session.commit()
        return True 