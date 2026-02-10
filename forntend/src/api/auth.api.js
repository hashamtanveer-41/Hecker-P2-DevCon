// src/api/auth.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const authAPI = {
    // Mock WebAuthn Login (for hackathon demo)
    login: async (username) => {
        try {
            // In real implementation, this would call WebAuthn API
            // For hackathon, we'll mock it
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH_LOGIN, {
                username,
                credential: 'mock-biometric-credential', // Mock credential
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Register user (if needed)
    register: async (userData) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH_REGISTER, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Logout
    logout: async () => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH_LOGOUT);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};