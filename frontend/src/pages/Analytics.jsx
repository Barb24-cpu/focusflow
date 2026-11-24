export default function Analytics() {
const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

// 1. Tasks Done - real
const tasksDone = tasks.filter((t) => t.completed || t.status === "done" || t.status === "completed").length;

// 2. Notes - real
const notesCount = notes.length;

// 3. Focus Time - real from saved sessions, 0 if you haven't used timer yet
const focusSessions = JSON.parse(localStorage.getItem("focusSessions") || "[]");
const totalFocusMins = focusSessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
const focusLabel = `${Math.floor(totalFocusMins / 60)}h ${String(totalFocusMins % 60).padStart(2, "0")}m`;

// 4. Streak - consecutive days with at least 1 task completed
const doneDates = new Set(
  tasks
    .filter((t) => t.completed || t.status === "done")
    .map((t) => (t.completedAt || t.updatedAt || t.dueDate || "").slice(0, 10))
    .filter(Boolean)
);
let streak = 0;
let d = new Date();
while (doneDates.has(d.toISOString().slice(0, 10))) {
  streak++;
  d.setDate(d.getDate() - 1);
}
// if nothing today yet, check from yesterday so streak doesn't break mid-day
if (streak === 0) {
  d = new Date();
  d.setDate(d.getDate() - 1);
  while (doneDates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
}

const stats = [
  { label: "Tasks Done", value: String(tasksDone) },
  { label: "Focus Time", value: focusLabel },
  { label: "Notes", value: String(notesCount) },
  { label: "Streak", value: `${streak} day${streak === 1 ? "" : "s"}` },
];

// 5. Bars - real: tasks completed per day, last 7 days (Mon-Sun)
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
tasks.forEach((t) => {
  if (t.completed || t.status === "done") {
    const dateStr = (t.completedAt || t.updatedAt || t.dueDate || "").slice(0, 10);
    if (dateStr) counts[new Date(dateStr).getDay()]++;
  }
});
const maxCount = Math.max(...counts, 1);
// Order Mon -> Sun for display
const order = [1, 2, 3, 4, 5, 6, 0];
const bars = order.map((dayIndex) => ({
  day: dayNames[dayIndex],
  pct: Math.round((counts[dayIndex] / maxCount) * 100),
}));

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