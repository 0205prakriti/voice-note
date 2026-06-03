import { useState, useEffect } from "react";
import Recorder from "./components/Recorder";
import NoteCard from "./components/NoteCard";
import { fetchNotes } from "./api";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes().then(setNotes);
  }, []);

  function handleNoteSaved(newNote) {
    setNotes((prev) => [newNote, ...prev]);
  }

  function handleDelete(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase()) ||
    (n.summary || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>🎙 Voice Notes</h1>
      <p style={{ color: "#888", marginBottom: "1.5rem" }}>Record, transcribe, and summarize your thoughts</p>

      <Recorder onNoteSaved={handleNoteSaved} />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "0.95rem",
          marginBottom: "1.5rem",
          boxSizing: "border-box",
        }}
      />

      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>No notes yet. Record one above!</p>
      )}

      {filtered.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
      ))}
    </div>
  );
}