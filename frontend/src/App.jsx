import { useState, useEffect } from "react";
import Recorder from "./components/Recorder";
import NoteCard from "./components/NoteCard";
import { fetchNotes } from "./api";
import AskBar from "./components/AskBar";

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
    <div style={{ minHeight: "100vh", background: "#f4f4f5" }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e4e4e7",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "22px" }}>🎙</span>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.3px" }}>VoiceNotes</span>
        </div>
        <span style={{ fontSize: "0.85rem", color: "#888" }}>{notes.length} notes</span>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Record card */}
        <AskBar />
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
            New Note
          </p>
          <Recorder onNoteSaved={handleNoteSaved} />
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: "16px" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            style={{
              width: "100%",
              padding: "11px 14px 11px 40px",
              borderRadius: "10px",
              border: "1px solid #e4e4e7",
              fontSize: "0.95rem",
              background: "#fff",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
        </div>

        {/* Notes */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🎙</div>
            <p style={{ fontWeight: 500 }}>No notes yet</p>
            <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>Record your first note above</p>
          </div>
        ) : (
          filtered.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}