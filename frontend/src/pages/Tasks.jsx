import { useState } from "react";

export default function Tasks() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);

  const addTask = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTasks([...tasks, text]);
    setText("");
  };

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen">
      <h1 className="text-white text-2xl font-bold">Tasks</h1>
      <p className="text-[#9CA3AF] mb-4">Your tasks will appear here</p>
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New task..." className="p-3 rounded bg-[#1A1A2E] text-white border border-[#2A2A3D] flex-1" />
        <button className="bg-[#22D3EE] text-black font-bold px-4 rounded">Add</button>
      </form>
      {tasks.map((t, i) => (
        <div key={i} className="bg-[#1A1A2E] border border-[#2A2A3D] p-3 rounded mb-2 text-white">{t}</div>
      ))}
    </div>
  );
}