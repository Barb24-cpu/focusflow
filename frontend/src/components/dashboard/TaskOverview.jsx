import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { parseDateKey, toDateKey } from "../../hooks/useTasks";


const PRIORITY_STYLES = {
  high: "bg-danger-soft text-danger",
  medium: "bg-warning-soft text-warning",
  low: "bg-success-soft text-success",
};

const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function dueLabel(dueDate) {
  if (!dueDate) return "No date";
  if (dueDate === toDateKey(new Date())) return "Today";
  return parseDateKey(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}


function TaskRow({ task, onToggle }) {
  const done = task.status === "done";
  const overdue = !done && task.dueDate && task.dueDate < toDateKey(new Date());

  return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-border px-4 py-3 sm:grid-cols-[auto_1fr_6rem_6rem]">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle?.(task)}
        aria-label={`Mark "${task.title}" as ${done ? "not done" : "done"}`}
        className="h-4 w-4 cursor-pointer accent-primary"
      />

      <div className="min-w-0">
        <p className={`truncate text-sm font-medium ${done ? "text-muted line-through" : "text-fg"}`}>
          {task.title}
        </p>
        {task.projectName && (
          <p className="truncate text-xs text-muted">{task.projectName}</p>
        )}
      </div>

      <span
        className={`badge justify-self-start max-sm:hidden ${
          PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.medium
        }`}
      >
        {capitalise(task.priority)}
      </span>

      <span className={`text-sm ${overdue ? "font-medium text-danger" : "text-muted"}`}>
        {dueLabel(task.dueDate)}
      </span>
    </li>
  );
}