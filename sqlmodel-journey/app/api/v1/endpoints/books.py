from typing import Optional
from fastapi import APIRouter, Depends
from app.models.schemas import BookCreate, BookUpdate, BookRead
from app.services.book_service import BookService
from app.utils.pagination import PageParams, Page

router = APIRouter()

@router.post("/", response_model=BookRead)
def create_book(
    book: BookCreate,
    service: BookService = Depends()
):
    return service.create_book(book)

@router.get("/", response_model=Page[BookRead])
def read_books(
    params: PageParams = Depends(),
    title: Optional[str] = None,
    service: BookService = Depends()
):
    return service.get_books(params, title)

@router.get("/{book_id}", response_model=BookRead)
def read_book(
    book_id: int,
    service: BookService = Depends()
):
    return service.get_book(book_id)

@router.put("/{book_id}", response_model=BookRead)
def update_book(
    book_id: int,
    book: BookUpdate,
    service: BookService = Depends()
):
    return service.update_book(book_id, book)

@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    service: BookService = Depends()
):
    service.delete_book(book_id)
    return {"message": "Book deleted successfully"} 