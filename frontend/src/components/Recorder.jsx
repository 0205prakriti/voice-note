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
      setError("Use Chrome or Edge for speech recognition");
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
    } catch {
      setError("Could not save. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "none",
            background: recording ? "#e24b4a" : "#111",
            color: "#fff",
            fontSize: "24px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: recording ? "0 0 0 8px rgba(226,75,74,0.15)" : "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 0.2s",
          }}
        >
          {recording ? "⏹" : "🎙"}
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#aaa", marginBottom: "1rem" }}>
        {loading ? "Saving..." : recording ? "Recording — click to stop" : "Click to record"}
      </p>

      {transcript && (
        <div>
          <div style={{
            background: "#f9fafb",
            border: "1px solid #e4e4e7",
            borderRadius: "10px",
            padding: "12px 14px",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "#333",
            marginBottom: "10px",
            minHeight: "60px",
          }}>
            {transcript}
          </div>
          <button
            onClick={saveNote}
            disabled={loading}
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: "10px",
              background: "#111",
              color: "#fff",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "💾 Save Note"}
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: "#e24b4a", fontSize: "0.85rem", marginTop: "8px", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}