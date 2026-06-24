from pydantic import BaseModel
from typing import Optional

class NoteOut(BaseModel):
    id: int
    text: str
    summary: Optional[str] = None
    tags: Optional[str] = None
    folder: Optional[str] = "General"
    created_at: str