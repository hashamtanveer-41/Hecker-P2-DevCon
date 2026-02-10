// src/api/hospital.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const hospitalAPI = {
    // Get all hospitals
    getAll: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.HOSPITALS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get hospital by ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.HOSPITAL_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create hospital
    create: async (data) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.HOSPITALS, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update hospital
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.HOSPITAL_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete hospital
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.HOSPITAL_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};