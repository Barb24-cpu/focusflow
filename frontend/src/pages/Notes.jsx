import { useState } from "react";

export default function Notes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const saveNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setNotes([...notes, note]);
    setNote("");
  };

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen">
      <h1 className="text-white text-2xl font-bold">Notes</h1>
      <p className="text-[#9CA3AF] mb-4">Write a quick note</p>
      <form onSubmit={saveNote} className="flex flex-col gap-2 mb-4">
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type your note..." className="p-3 rounded bg-[#1A1A2E] text-white border border-[#2A2A3D]" />
        <button className="bg-[#22D3EE] text-black font-bold p-3 rounded">Save Note</button>
      </form>
      {notes.map((n, i) => (
        <div key={i} className="bg-[#1A1A2E] border border-[#2A2A3D] p-3 rounded mb-2 text-white">{n}</div>
      ))}
    </div>
  );
}