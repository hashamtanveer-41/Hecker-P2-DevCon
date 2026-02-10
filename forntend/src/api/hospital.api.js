// src/api/hospital.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockHospitals } from './mockData';

// Enable mock data mode
const USE_MOCK_DATA = true;

export const hospitalAPI = {
    // Get all hospitals
    getAll: async () => {
        try {
            if (USE_MOCK_DATA) {
                return { data: mockHospitals };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.HOSPITALS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get hospital by ID
    getById: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const hospital = mockHospitals.find(h => h.id === id);
                return hospital || { error: 'Hospital not found' };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.HOSPITAL_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create hospital
    create: async (data) => {
        try {
            if (USE_MOCK_DATA) {
                const newHospital = {
                    id: mockHospitals.length + 1,
                    ...data,
                    total_ors: 0,
                    active_surgeries: 0,
                };
                mockHospitals.push(newHospital);
                return newHospital;
            }
            const response = await axiosInstance.post(API_ENDPOINTS.HOSPITALS, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update hospital
    update: async (id, data) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockHospitals.findIndex(h => h.id === id);
                if (index !== -1) {
                    mockHospitals[index] = { ...mockHospitals[index], ...data };
                    return mockHospitals[index];
                }
                return { error: 'Hospital not found' };
            }
            const response = await axiosInstance.put(API_ENDPOINTS.HOSPITAL_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete hospital
    delete: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockHospitals.findIndex(h => h.id === id);
                if (index !== -1) {
                    mockHospitals.splice(index, 1);
                    return { message: 'Hospital deleted' };
                }
                return { error: 'Hospital not found' };
            }
            const response = await axiosInstance.delete(API_ENDPOINTS.HOSPITAL_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

