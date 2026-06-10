import { useState } from "react";
import { askNotes } from "../api";

export default function AskBar() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    setError(null);
    try {
      const result = await askNotes(question);
      setAnswer(result);
    } catch {
      setError("Could not get answer. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAsk();
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <p style={{
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "1rem"
      }}>
        Ask your notes
      </p>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "What did I say about work?"'
          style={{
            flex: 1,
            padding: "11px 14px",
            borderRadius: "10px",
            border: "1px solid #e4e4e7",
            fontSize: "0.95rem",
            outline: "none",
            background: "#f9fafb",
          }}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{
            padding: "11px 18px",
            borderRadius: "10px",
            background: "#111",
            color: "#fff",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            cursor: loading || !question.trim() ? "not-allowed" : "pointer",
            opacity: loading || !question.trim() ? 0.5 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Thinking..." : "Ask ✦"}
        </button>
      </div>

      {answer && (
        <div style={{
          marginTop: "1rem",
          background: "#f0f9ff",
          border: "1px solid #bae6fd",
          borderRadius: "10px",
          padding: "12px 14px",
          fontSize: "0.92rem",
          lineHeight: 1.7,
          color: "#0c4a6e",
        }}>
          ✦ {answer}
        </div>
      )}

      {error && (
        <p style={{ color: "#e24b4a", fontSize: "0.85rem", marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  );
}