
import { useState } from 'react';

import {
    TASK_PRIORITIES,
    TASK_STATUSES
} from '../../utils/constants';

import { toInputDateFormat } from '../../utils/formatDate';


function TaskForm({
    initialData = null,
    projects = [],
    onSubmit,
    onCancel,
    isSubmitting = false
}) {

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [status, setStatus] = useState(initialData?.status || 'todo');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');
    const [dueDate, setDueDate] = useState(
        initialData?.due_date ? toInputDateFormat(initialData.due_date) : ''
    );
    const [projectId, setProjectId] = useState(
        initialData?.project_id ? String(initialData.project_id) : ''
    );
    const [error, setError] = useState('');


    const handleSubmit = (e) => {

        e.preventDefault();

        setError('');


        if (!title.trim()) {

            setError('Task title is required.');

            return;
        }


        const payload = {
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            due_date: dueDate || null,
            project_id: projectId ? Number(projectId) : null,
        };


        onSubmit(payload);
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">


            {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
                    {error}
                </div>
            )}


            {/* Title */}
            <div>

                <label
                    htmlFor="task-title"
                    className="block text-sm font-medium text-slate-300 mb-1"
                >
                    Task Title *
                </label>

                <input
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Build Flask auth routes"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-100 outline-none"
                />

            </div>


            {/* Description */}
            <div>

                <label
                    htmlFor="task-desc"
                    className="block text-sm font-medium text-slate-300 mb-1"
                >
                    Description
                </label>

                <textarea
                    id="task-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details or acceptance criteria..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-100 outline-none"
                />

            </div>


            {/* Status & Priority row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                <div>

                    <label
                        htmlFor="task-status"
                        className="block text-sm font-medium text-slate-300 mb-1"
                    >
                        Status
                    </label>

                    <select
                        id="task-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-100 outline-none"
                    >

                        {TASK_STATUSES.map((s) => (
                            <option
                                key={s.value}
                                value={s.value}
                            >
                                {s.label}
                            </option>
                        ))}

                    </select>

                </div>


                <div>

                    <label
                        htmlFor="task-priority"
                        className="block text-sm font-medium text-slate-300 mb-1"
                    >
                        Priority
                    </label>

                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-100 outline-none"
                    >

                        {TASK_PRIORITIES.map((p) => (
                            <option
                                key={p.value}
                                value={p.value}
                            >
                                {p.label}
                            </option>
                        ))}

                    </select>

                </div>

            </div>


            {/* Due Date & Project row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                <div>

                    <label
                        htmlFor="task-due"
                        className="block text-sm font-medium text-slate-300 mb-1"
                    >
                        Due Date
                    </label>

                    <input
                        id="task-due"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-100 outline-none"
                    />

                </div>


                <div>

                    <label
                        htmlFor="task-project"
                        className="block text-sm font-medium text-slate-300 mb-1"
                    >
                        Project (Optional)
                    </label>

                    <select
                        id="task-project"
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-slate-100 outline-none"
                    >

                        <option value="">No Project</option>

                        {projects.map((proj) => (
                            <option
                                key={proj.id}
                                value={proj.id}
                            >
                                {proj.name}
                            </option>
                        ))}

                    </select>

                </div>

            </div>


            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">


                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                )}


                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                    {isSubmitting
                        ? 'Saving...'
                        : initialData
                            ? 'Update Task'
                            : 'Create Task'}
                </button>

            </div>

        </form>
    );
}


export default TaskForm;
