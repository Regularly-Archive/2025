from fastapi import HTTPException

class BookNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(status_code=404, detail="Book not found")

class DatabaseException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=500, detail=detail) 