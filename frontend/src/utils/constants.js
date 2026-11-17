
// Backend base URL (matches Flask API prefix in docs)
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Task statuses matching database schema: todo, in_progress, done
export const TASK_STATUSES = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
];

// Task priorities matching database schema: low, medium, high
export const TASK_PRIORITIES = [
    {
        value: 'low',
        label: 'Low',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
        value: 'medium',
        label: 'Medium',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
        value: 'high',
        label: 'High',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
];

// Pomodoro default durations in minutes
export const FOCUS_DURATIONS = {
    focus: 25,
    short_break: 5,
    long_break: 15,
};
