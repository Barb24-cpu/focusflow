
import api from './api';

const authService = {
    async register(userData) {
        // userData: { username, email, password }

        const response = await api.post('/auth/register', userData);

        return response.data;
    },

    async login(credentials) {
        // credentials: { email, password }

        const response = await api.post('/auth/login', credentials);

        return response.data;
    },

    async logout() {
        const response = await api.post('/auth/logout');

        return response.data;
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me');

        return response.data;
    },
};

export default authService;
