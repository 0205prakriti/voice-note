import os
import json
from google import genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_connection
from models import NoteOut
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

class NoteInput(BaseModel):
    text: str

@app.on_event("startup")
def startup():
    init_db()

@app.post("/notes", response_model=NoteOut)
async def create_note(note_input: NoteInput):
    text = note_input.text
    summary = ""
    tags = ""

    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO notes (text, summary, tags) VALUES (?, ?, ?)",
        (text, summary, tags)
    )
    conn.commit()
    note = conn.execute(
        "SELECT * FROM notes WHERE id = ?", (cursor.lastrowid,)
    ).fetchone()
    conn.close()

    return dict(note)

@app.get("/notes", response_model=list[NoteOut])
def get_notes():
    conn = get_connection()
    notes = conn.execute(
        "SELECT * FROM notes ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [dict(n) for n in notes]

@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM notes WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
    return {"ok": True}