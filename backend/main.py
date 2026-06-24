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

    # Summarize + tag + categorize with Gemini
    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=f"""Analyze this voice note. Reply ONLY with JSON, no markdown:
{{
  "summary": "one sentence summary",
  "tags": ["tag1", "tag2"],
  "folder": "one of: Work, Personal, Ideas, Health, Finance, General"
}}

Note: {text}"""
        )
        parsed = json.loads(response.text)
        summary = parsed.get("summary", "")
        tags = ",".join(parsed.get("tags", []))
        folder = parsed.get("folder", "General")
    except:
        summary = ""
        tags = ""
        folder = "General"

    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO notes (text, summary, tags, folder) VALUES (?, ?, ?, ?)",
        (text, summary, tags, folder)
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

class QuestionInput(BaseModel):
    question: str

@app.post("/ask")
async def ask_notes(q: QuestionInput):
    # Get all notes from database
    conn = get_connection()
    notes = conn.execute("SELECT text, created_at FROM notes ORDER BY created_at DESC").fetchall()
    conn.close()

    if not notes:
        return {"answer": "You don't have any notes yet. Record some first!"}

    # Format notes for Gemini
    notes_text = "\n\n".join([
        f"[{dict(n)['created_at']}]: {dict(n)['text']}"
        for n in notes
    ])

    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=f"""You are a personal assistant. The user has these voice notes:

{notes_text}

Answer this question based only on the notes above. Be concise and helpful.
If the answer isn't in the notes, say so.

Question: {q.question}"""
    )

    return {"answer": response.text}