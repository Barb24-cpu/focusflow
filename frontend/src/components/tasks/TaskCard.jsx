

import {
    Calendar,
    Edit2,
    Trash2,
    Folder,
    ArrowRight
} from 'lucide-react';

import {
    TASK_PRIORITIES,
    TASK_STATUSES
} from '../../utils/constants';

import {
    formatDate,
    isOverdue
} from '../../utils/formatDate';


function TaskCard({
    task,
    projectName,
    onEdit,
    onDelete,
    onStatusChange
}) {

    // Find styling for the task's priority
    const priorityObj =
        TASK_PRIORITIES.find((p) => p.value === task.priority) ||
        TASK_PRIORITIES[1];

    const overdue = isOverdue(task.due_date, task.status);


    // Quick helper to move task to the next status column
    const handleNextStatus = () => {

        const currentIndex = TASK_STATUSES.findIndex(
            (s) => s.value === task.status
        );

        if (currentIndex < TASK_STATUSES.length - 1) {

            const nextStatus = TASK_STATUSES[currentIndex + 1].value;

            onStatusChange(task.id, nextStatus);
        }
    };


    return (
        <div className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-4 transition-all shadow-sm flex flex-col gap-3">

            {/* Top row: Priority badge & Action buttons */}
            <div className="flex items-center justify-between gap-2">

                <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${priorityObj.color}`}
                >
                    {priorityObj.label}
                </span>

                <div className="flex items-center gap-1">

                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        title="Edit task"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        title="Delete task"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                </div>
            </div>


            {/* Title and Description */}
            <div>

                <h3
                    className={`font-semibold text-base ${task.status === 'done'
                            ? 'line-through text-slate-500'
                            : 'text-slate-100'
                        }`}
                >
                    {task.title}
                </h3>

                {task.description && (
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                    </p>
                )}

            </div>


            {/* Project tag if linked */}
            {projectName && (
                <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 w-fit px-2 py-1 rounded-md">

                    <Folder className="w-3.5 h-3.5" />

                    <span>{projectName}</span>

                </div>
            )}


            {/* Footer: Due date and quick status advance */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">

                <div
                    className={`flex items-center gap-1.5 ${overdue
                            ? 'text-rose-400 font-medium'
                            : 'text-slate-400'
                        }`}
                >
                    <Calendar className="w-3.5 h-3.5" />

                    <span>{formatDate(task.due_date)}</span>
                </div>


                {task.status !== 'done' && (
                    <button
                        type="button"
                        onClick={handleNextStatus}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                        <span>Advance</span>

                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}

            </div>

        </div>
    );
}

export default TaskCard;
