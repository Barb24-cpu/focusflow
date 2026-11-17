export default function Analytics() {
  const stats = [
    { label: "Tasks Done", value: "12" },
    { label: "Focus Time", value: "4h 30m" },
    { label: "Notes", value: "8" },
    { label: "Streak", value: "3 days" },
  ];

  const bars = [
    { day: "Mon", pct: 40 },
    { day: "Tue", pct: 70 },
    { day: "Wed", pct: 55 },
    { day: "Thu", pct: 90 },
    { day: "Fri", pct: 65 },
    { day: "Sat", pct: 30 },
    { day: "Sun", pct: 80 },
  ];

  return (
    <div className="p-6 bg-[#0B0B12] min-h-screen">
      <h1 className="text-white text-2xl font-bold">Analytics</h1>
      <p className="text-[#9CA3AF] mb-4">Your progress this week</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1A1A2E] border border-[#2A2A3D] p-4 rounded-xl">
            <p className="text-[#9CA3AF] text-sm">{s.label}</p>
            <p className="text-white text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1A2E] border border-[#2A2A3D] p-4 rounded-xl">
        <p className="text-white font-bold mb-4">Focus per day</p>
        <div className="flex items-end gap-3 h-32">
          {bars.map((b) => (
            <div key={b.day} className="flex-1 flex flex-col items-center justify-end h-full">
              <div className="bg-[#22D3EE] w-full rounded-t" style={{ height: `${b.pct}%` }}></div>
              <p className="text-[#9CA3AF] text-xs mt-1">{b.day}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}