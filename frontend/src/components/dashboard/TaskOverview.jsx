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