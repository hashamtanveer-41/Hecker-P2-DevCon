// src/api/staff.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK_DATA = false;

export const staffAPI = {
    // Get all staff
    getAll: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STAFF);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get staff by ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STAFF_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create staff
    create: async (data) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.STAFF, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update staff
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.STAFF_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete staff
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.STAFF_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get staff availability
    getAvailability: async (id, date) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.STAFF_AVAILABILITY(id), {
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

