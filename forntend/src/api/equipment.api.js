// src/api/equipment.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

const USE_MOCK_DATA = false;

export const equipmentAPI = {
    // Get all equipment
    getAll: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.EQUIPMENT);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get equipment by ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.EQUIPMENT_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create equipment
    create: async (data) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.EQUIPMENT, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update equipment
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.EQUIPMENT_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete equipment
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.EQUIPMENT_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Sterilize equipment
    sterilize: async (id) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.EQUIPMENT_STERILIZE(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
