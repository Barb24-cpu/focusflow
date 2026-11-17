import { useState } from "react";

export default function GithubActivity() {
  const [username, setUsername] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivity = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${username}/events/public`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch (err) {
      setEvents([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen">
      <h1 className="text-white text-2xl font-bold">GitHub Activity</h1>
      <p className="text-[#9CA3AF] mb-4">See recent GitHub activity for any user</p>

      <form onSubmit={fetchActivity} className="flex gap-2 mb-4">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username..."
          className="p-3 rounded bg-[#1A1A2E] text-white border border-[#2A2A3D] flex-1"
        />
        <button className="bg-[#22D3EE] text-black font-bold px-4 rounded">
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {events.length === 0 && !loading && (
        <p className="text-[#9CA3AF]">Type a username above to see their last 10 public events.</p>
      )}

      {events.map((ev, i) => (
        <div key={i} className="bg-[#1A1A2E] border border-[#2A2A3D] p-3 rounded mb-2">
          <p className="text-white font-bold">{ev.type}</p>
          <p className="text-[#9CA3AF] text-sm">{ev.repo?.name}</p>
        </div>
      ))}
    </div>
  );
}