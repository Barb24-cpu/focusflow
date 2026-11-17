import { useState, useEffect } from "react";

export default function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl font-bold">Focus Timer</h1>
      <p className="text-white text-6xl font-bold my-6">
        {mins}:{secs < 10 ? `0${secs}` : secs}
      </p>
      <div className="flex gap-2">
        <button onClick={() => setRunning(!running)} className="bg-[#22D3EE] text-black font-bold px-6 py-3 rounded">
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => { setRunning(false); setSeconds(25 * 60); }} className="bg-[#1A1A2E] text-white border border-[#2A2A3D] px-6 py-3 rounded">Reset</button>
      </div>
    </div>
  );
}