from sqlmodel import Session, select
from typing import List, Optional
from . import models

def create_book(session: Session, book: models.BookCreate) -> models.Book:
    db_book = models.Book.from_orm(book)
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def get_books(
    session: Session, 
    skip: int = 0, 
    limit: int = 10,
    title: Optional[str] = None
) -> List[models.Book]:
    query = select(models.Book)
    if title:
        query = query.where(models.Book.title.contains(title))
    return session.exec(query.offset(skip).limit(limit)).all()

def get_book(session: Session, book_id: int) -> Optional[models.Book]:
    return session.get(models.Book, book_id)

def update_book(
    session: Session, 
    book_id: int, 
    book: models.BookCreate
) -> Optional[models.Book]:
    db_book = session.get(models.Book, book_id)
    if not db_book:
        return None
    
    book_data = book.dict(exclude_unset=True)
    for key, value in book_data.items():
        setattr(db_book, key, value)
    
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def delete_book(session: Session, book_id: int) -> bool:
    book = session.get(models.Book, book_id)
    if not book:
        return False
    session.delete(book)
    session.commit()
    return True 