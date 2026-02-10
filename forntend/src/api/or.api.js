// src/api/or.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const orAPI = {
    // Get all operating rooms
    getAll: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.OPERATING_ROOMS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get OR by ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.OR_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create OR
    create: async (data) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.OPERATING_ROOMS, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update OR
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.OR_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete OR
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.OR_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};