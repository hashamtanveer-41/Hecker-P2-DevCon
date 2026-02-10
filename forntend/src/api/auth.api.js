// src/api/auth.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

// DEVELOPMENT MODE: Set to true to bypass login
const BYPASS_LOGIN = true;

export const authAPI = {
    // Mock WebAuthn Login (for hackathon demo)
    login: async (username) => {
        try {
            // BYPASS LOGIN FOR DEVELOPMENT/TESTING
            if (BYPASS_LOGIN) {
                return {
                    success: true,
                    token: 'mock-jwt-token-dev-' + Date.now(),
                    user: {
                        id: 1,
                        username: username || 'demo_user',
                        role: 'HOSPITAL_ADMIN',
                        name: username || 'Demo User',
                        email: (username || 'demo') + '@hospital.com',
                    },
                };
            }

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