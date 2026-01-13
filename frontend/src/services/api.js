import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Register new user
export const register = async (username, email, password) => {
    const response = await api.post('/register', { username, email, pwd: password });
    return response.data;
};

// Login user
export const login = async (username, password) => {
    const response = await api.post('/auth', { user: username, pwd: password });
    return response.data;
};

// Request password reset
export const requestPasswordReset = async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
};

// Validate reset token
export const validateResetToken = async (token) => {
    const response = await api.get(`/reset-password/${token}`);
    return response.data;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
    const response = await api.post(`/reset-password/${token}`, { newPassword });
    return response.data;
};

export default api;
