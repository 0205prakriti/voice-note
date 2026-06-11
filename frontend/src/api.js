import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadNote(text) {
  const res = await axios.post(`${BASE}/notes`, { text });
  return res.data;
}

export async function fetchNotes() {
  const res = await axios.get(`${BASE}/notes`);
  return res.data;
}

export async function deleteNote(id) {
  await axios.delete(`${BASE}/notes/${id}`);
}

export async function askNotes(question) {
  const res = await axios.post(`${BASE}/ask`, { question });
  return res.data.answer;
}