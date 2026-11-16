
import api from './api';

const noteService = {

    async getNotes(projectId = null) {
        const params = projectId
            ? { project_id: projectId }
            : {};

        const response = await api.get('/notes', { params });

        return response.data;
    },

    async createNote(noteData) {
        const response = await api.post('/notes', noteData);

        return response.data;
    },

    async updateNote(noteId, updates) {
        const response = await api.put(`/notes/${noteId}`, updates);

        return response.data;
    },

    async deleteNote(noteId) {
        const response = await api.delete(`/notes/${noteId}`);

        return response.data;
    },

};

export default noteService;
