import { useState, useRef } from "react";
import { uploadNote } from "../api";

export default function Recorder({ onNoteSaved }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition not supported — use Chrome or Edge");
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalText = "";

    recognition.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      setTranscript(finalText + interim);
    };

    recognition.onerror = (e) => {
      setError("Mic error: " + e.error);
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setTranscript("");
    setError(null);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setRecording(false);
  }

  async function saveNote() {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const note = await uploadNote(transcript.trim());
      onNoteSaved(note);
      setTranscript("");
    } catch (err) {
      setError("Could not save. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          style={{
            padding: "1rem 2rem",
            borderRadius: "999px",
            fontSize: "1rem",
            background: recording ? "#e24b4a" : "#222",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {recording ? "⏹ Stop" : "🎙 Record"}
        </button>
      </div>

      {transcript && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "0.95rem",
            lineHeight: 1.6
          }}>
            {transcript}
          </p>
          <button
            onClick={saveNote}
            disabled={loading}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              background: "#1a73e8",
              color: "#fff",
              border: "none",
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "💾 Save Note"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
    </div>
  );
}