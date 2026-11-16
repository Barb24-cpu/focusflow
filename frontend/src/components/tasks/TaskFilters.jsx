

import { Search, X } from 'lucide-react';

import {
    TASK_PRIORITIES,
    TASK_STATUSES
} from '../../utils/constants';


function TaskFilters({
    filters,
    onFilterChange,
    onReset,
    projects = []
}) {

    const handleChange = (field, value) => {

        onFilterChange({
            ...filters,
            [field]: value,
        });

    };


    const hasActiveFilters =
        filters.search ||
        filters.status ||
        filters.priority ||
        filters.project_id;


    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">


            {/* Search box */}
            <div className="relative flex-1">

                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                    type="text"
                    value={filters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                    placeholder="Search tasks by title..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none"
                />

            </div>


            {/* Status filter */}
            <select
                value={filters.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                aria-label="Filter by status"
                className="bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
            >

                <option value="">All Statuses</option>

                {TASK_STATUSES.map((status) => (
                    <option
                        key={status.value}
                        value={status.value}
                    >
                        {status.label}
                    </option>
                ))}

            </select>


            {/* Priority filter */}
            <select
                value={filters.priority || ''}
                onChange={(e) => handleChange('priority', e.target.value)}
                aria-label="Filter by priority"
                className="bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
            >

                <option value="">All Priorities</option>

                {TASK_PRIORITIES.map((priority) => (
                    <option
                        key={priority.value}
                        value={priority.value}
                    >
                        {priority.label}
                    </option>
                ))}

            </select>


            {/* Project filter */}
            <select
                value={filters.project_id || ''}
                onChange={(e) => handleChange('project_id', e.target.value)}
                aria-label="Filter by project"
                className="bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
            >

                <option value="">All Projects</option>

                {projects.map((project) => (
                    <option
                        key={project.id}
                        value={project.id}
                    >
                        {project.name}
                    </option>
                ))}

            </select>


            {/* Clear button */}
            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >

                    <X className="w-4 h-4" />

                    <span>Clear</span>

                </button>
            )}

        </div>
    );
}


export default TaskFilters;
