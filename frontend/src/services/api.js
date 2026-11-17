
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create main axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Needed so Flask HttpOnly cookies get sent automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept responses to handle global errors like 401 Unauthorized
api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        // Extract error message from Flask JSON format: { "error": "..." }
        const message =
            error.response?.data?.error ||
            error.message ||
            'Something went wrong connecting to the server.';

        return Promise.reject(new Error(message));
    }
);

export default api;
