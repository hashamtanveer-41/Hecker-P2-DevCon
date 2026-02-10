// src/api/sync.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockAuditLogs } from './mockData';

const USE_MOCK_DATA = true;

export const syncAPI = {
    // Push offline changes
    push: async (changes) => {
        try {
            if (USE_MOCK_DATA) {
                return {
                    message: 'Changes synced successfully',
                    changes_applied: changes.length || 0
                };
            }
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
            if (USE_MOCK_DATA) {
                let logs = [...mockAuditLogs];

                if (filters.action) {
                    logs = logs.filter(l => l.action === filters.action);
                }
                if (filters.user) {
                    logs = logs.filter(l => l.user_name.toLowerCase().includes(filters.user.toLowerCase()));
                }

                return { data: logs };
            }

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

