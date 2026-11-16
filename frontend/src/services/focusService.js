
import api from './api';

const focusService = {

    async getSessions() {
        const response = await api.get('/focus-sessions');

        return response.data;
    },

    async saveSession(sessionData) {
        // sessionData: { task_id, session_type, duration_minutes, started_at, ended_at }

        const response = await api.post('/focus-sessions', sessionData);

        return response.data;
    },

    async getAnalyticsSummary() {
        const response = await api.get('/analytics/summary');

        return response.data;
    },

    async getAnalyticsTrends() {
        const response = await api.get('/analytics/trends');

        return response.data;
    },

};

export default focusService;
