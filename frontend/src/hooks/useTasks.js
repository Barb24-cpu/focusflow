~import { useCallback, useEffect, useMemo, useState } from "react";
import * as taskService from "../services/taskService";


/** Date -> "YYYY-MM-DD" in the user's local time */
export const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** "YYYY-MM-DD" -> Date at local midnight */
export const parseDateKey = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// "2026-11-10" stays as is; a full timestamp becomes the local date.
const toKey = (value) => {
  if (!value) return null;
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : toDateKey(date);
};

/* ---------- normalise whatever Flask sends ---------- */

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

function normalizeStatus(value) {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("done") || text.includes("complete")) return "done";
  if (text.includes("progress")) return "in_progress";
  return "todo";
}

function normalizeTask(raw) {
  const status = normalizeStatus(raw.status);
  const completedValue =
    raw.completed_at ??
    raw.completedAt ??
    (status === "done" ? raw.updated_at ?? raw.updatedAt : null);

  return {
    ...raw,
    status,
    priority: String(raw.priority ?? "medium").toLowerCase(),
    dueDate: toKey(raw.due_date ?? raw.dueDate),
    completedDate: status === "done" ? toKey(completedValue) : null,
    projectName: raw.project_name ?? raw.projectName ?? raw.project?.name ?? "",
  };
}

const unwrapList = (data) => (Array.isArray(data) ? data : data?.tasks ?? []);

const toMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong. Please try again.";

/* ---------- the hook ---------- */

export function useTasks({ autoLoad = true } = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(params);
      setTasks(unwrapList(data).map(normalizeTask));
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) loadTasks();
  }, [autoLoad, loadTasks]);