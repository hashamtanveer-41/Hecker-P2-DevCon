// src/api/surgery.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const surgeryAPI = {
    // Get all surgery requests
    getAll: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.SURGERY_REQUESTS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get surgery request by ID
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.SURGERY_REQUEST_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create surgery request
    create: async (data) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SURGERY_REQUESTS, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update surgery request
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.SURGERY_REQUEST_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete surgery request
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.SURGERY_REQUEST_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Approve surgery request
    approve: async (id) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SURGERY_REQUEST_APPROVE(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};