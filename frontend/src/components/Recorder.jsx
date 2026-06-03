import { useState, useRef } from "react";
import { uploadAudio } from "../api";

export default function Recorder({ onNoteSaved }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  async function startRecording() {
    setError(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      setLoading(true);
      try {
        const note = await uploadAudio(blob);
        onNoteSaved(note); // tell App.jsx a new note arrived
      } catch (err) {
        setError("Something went wrong. Is the backend running?");
      } finally {
        setLoading(false);
      }
      // stop mic access
      stream.getTracks().forEach((t) => t.stop());
    };

    mediaRecorder.current.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorder.current.stop();
    setRecording(false);
  }

  return (
    <div style={{ textAlign: "center", margin: "2rem 0" }}>
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
        {loading ? "Processing..." : recording ? "⏹ Stop" : "🎙 Record"}
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}