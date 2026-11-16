import { BrowserRouter } from "react-router-dom";
import { Check, Timer, FolderOpen, BarChart3 } from "lucide-react";
import { ThemeProvider } from "../context/ThemeContext";
import useTheme from "../hooks/useTheme";
import StatCard from "../components/dashboard/StatCard";
import TaskOverview from "../components/dashboard/TaskOverview";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import FocusInsight from "../components/dashboard/FocusInsight";
import { toDateKey } from "../hooks/useTasks";

const today = toDateKey(new Date());
const tasks = [
  { id: 1, title: "Build the project dashboard", projectName: "FocusFlow MVP", priority: "high", status: "in_progress", dueDate: today },
  { id: 2, title: "Connect task CRUD endpoints", projectName: "FocusFlow MVP", priority: "high", status: "todo", dueDate: today },
  { id: 3, title: "Review database relationships", projectName: "Backend architecture", priority: "medium", status: "todo", dueDate: "2020-01-01" },
  { id: 4, title: "Set up protected routes", projectName: "FocusFlow MVP", priority: "medium", status: "done", dueDate: today },
];
const week = [3, 2, 3, 0, 0, 4, 6].map((count, i) => ({
  date: `2026-11-${String(i + 4).padStart(2, "0")}`,
  day: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"][i],
  count,
}));

function Content() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">
      <button onClick={toggleTheme} className="rounded-lg bg-primary px-4 py-2 text-primary-contrast">
        Switch to {isDark ? "light" : "dark"} mode
      </button>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tasks today" value={8} helper="3 completed today" icon={Check} />
        <StatCard label="Overdue tasks" value={2} helper="Let's get these back on track" tone="danger" icon={Timer} />
        <StatCard label="Active projects" value={4} helper="2 deadlines this week" icon={FolderOpen} />
        <StatCard label="Completed in 7 days" value={18} helper="6 more than the previous 7 days" icon={BarChart3} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <TaskOverview tasks={tasks} onToggle={() => {}} />
        <FocusInsight />
      </div>
      <ProductivityChart data={week} total={18} previousTotal={12} />
    </div>
  );
}

export default function PreviewBarbara() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Content />
      </ThemeProvider>
    </BrowserRouter>
  );
}