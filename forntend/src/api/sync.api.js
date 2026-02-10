// src/api/sync.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const syncAPI = {
    // Push offline changes
    push: async (changes) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SYNC_PUSH, {
                changes,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get audit logs
    getAuditLogs: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.action) params.append('action', filters.action);
            if (filters.user) params.append('user', filters.user);
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);

            const url = `${API_ENDPOINTS.AUDIT_LOGS}?${params.toString()}`;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};