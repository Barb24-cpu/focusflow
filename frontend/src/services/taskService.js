
import api from './api';

const taskService = {
    // Supports optional query filters: status, priority, project_id, search
    async getTasks(filters = {}) {

        // Remove empty filter values before sending query params
        const params = {};

        if (filters.status) {
            params.status = filters.status;
        }

        if (filters.priority) {
            params.priority = filters.priority;
        }

        if (filters.project_id) {
            params.project_id = filters.project_id;
        }

        if (filters.search) {
            params.search = filters.search;
        }

        const response = await api.get('/tasks', { params });

        return response.data;
    },

    async createTask(taskData) {
        const response = await api.post('/tasks', taskData);

        return response.data;
    },

    async updateTask(taskId, updates) {
        const response = await api.put(`/tasks/${taskId}`, updates);

        return response.data;
    },

    async deleteTask(taskId) {
        const response = await api.delete(`/tasks/${taskId}`);

        return response.data;
    },
};

export default taskService;
