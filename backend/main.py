import os
import google.generativeai as genai
from openai import OpenAI
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_connection
from models import NoteOut
import tempfile
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Allow React frontend (running on port 5173) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

@app.on_event("startup")
def startup():
    init_db()

@app.post("/notes", response_model=NoteOut)
async def create_note(audio: UploadFile = File(...)):
    # 1. Save uploaded audio to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    # 2. Transcribe with Whisper
    with open(tmp_path, "rb") as f:
        transcript = openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=f
        )
    text = transcript.text

    # 3. Summarize + tag with Gemini
    import json
    response = gemini_model.generate_content(
        f"""Analyze this voice note. Reply ONLY with JSON, no markdown:
    {{"summary": "one sentence summary", "tags": ["tag1", "tag2"]}}

    Note: {text}"""
    )
    parsed = json.loads(response.text)
    summary = parsed.get("summary", "")
    tags = ",".join(parsed.get("tags", []))

    # 4. Save to database
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