// src/api/auth.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const authAPI = {
    login: async (username, password) => {
        try {
            const response = await axiosInstance.post(
                API_ENDPOINTS.AUTH_LOGIN,
                { username, password },
                { withCredentials: true } // IMPORTANT for cookies
            );

            return response.data; // { access, role }
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: async () => {
        try {
            const response = await axiosInstance.post(
                API_ENDPOINTS.AUTH_LOGOUT,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
