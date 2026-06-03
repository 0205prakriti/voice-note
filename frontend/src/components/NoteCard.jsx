import { deleteNote } from "../api";

export default function NoteCard({ note, onDelete }) {
  const tags = note.tags ? note.tags.split(",") : [];

  async function handleDelete() {
    await deleteNote(note.id);
    onDelete(note.id);
  }

  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: "1rem 1.25rem",
      marginBottom: "1rem",
      background: "#fff",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <small style={{ color: "#999" }}>{new Date(note.created_at).toLocaleString()}</small>
        <button onClick={handleDelete} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}>🗑</button>
      </div>

      <p style={{ margin: "0.5rem 0", lineHeight: 1.6 }}>{note.text}</p>

      {note.summary && (
        <p style={{ color: "#555", fontSize: "0.9rem", background: "#f5f5f5", padding: "8px", borderRadius: "8px" }}>
          ✦ {note.summary}
        </p>
      )}

      {tags.length > 0 && (
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span key={tag} style={{ background: "#e8f0fe", color: "#1a73e8", padding: "2px 10px", borderRadius: "99px", fontSize: "0.8rem" }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}