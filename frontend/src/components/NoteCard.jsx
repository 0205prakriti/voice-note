import { deleteNote } from "../api";

export default function NoteCard({ note, onDelete }) {
  const tags = note.tags ? note.tags.split(",").filter(Boolean) : [];

  async function handleDelete() {
    await deleteNote(note.id);
    onDelete(note.id);
  }

  function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: "14px",
      padding: "1.25rem 1.5rem",
      marginBottom: "1rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
        <span style={{ fontSize: "0.78rem", color: "#aaa", fontWeight: 500 }}>
          🕐 {formatDate(note.created_at)}
        </span>
        <button
          onClick={handleDelete}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#ccc",
            fontSize: "16px",
            padding: "2px 6px",
            borderRadius: "6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#e24b4a"}
          onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
        >
          🗑
        </button>
      </div>

      {/* Note text */}
      <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#222", marginBottom: "0.75rem" }}>
        {note.text}
      </p>

      {/* Summary */}
      {note.summary && (
        <div style={{
          background: "#f9fafb",
          border: "1px solid #e4e4e7",
          borderRadius: "8px",
          padding: "10px 12px",
          fontSize: "0.88rem",
          color: "#555",
          lineHeight: 1.6,
          marginBottom: "0.75rem",
        }}>
          ✦ {note.summary}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              background: "#eff6ff",
              color: "#3b82f6",
              padding: "3px 10px",
              borderRadius: "99px",
              fontSize: "0.78rem",
              fontWeight: 500,
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}