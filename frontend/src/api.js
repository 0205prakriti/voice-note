import axios from "axios";

const BASE = "http://localhost:8000";

// Send audio blob to backend, get back a saved note
export async function uploadAudio(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const res = await axios.post(`${BASE}/notes`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Fetch all notes
export async function fetchNotes() {
  const res = await axios.get(`${BASE}/notes`);
  return res.data;
}

// Delete a note by id
export async function deleteNote(id) {
  await axios.delete(`${BASE}/notes/${id}`);
}