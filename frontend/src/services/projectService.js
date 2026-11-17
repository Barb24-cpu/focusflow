
import api from './api';

const projectService = {

    async getProjects() {
        const response = await api.get('/projects');

        return response.data;
    },

    async createProject(projectData) {
        const response = await api.post('/projects', projectData);

        return response.data;
    },

    async updateProject(projectId, updates) {
        const response = await api.put(`/projects/${projectId}`, updates);

        return response.data;
    },

    async deleteProject(projectId) {
        const response = await api.delete(`/projects/${projectId}`);

        return response.data;
    },

};

export default projectService;
