// src/api/or.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockOperatingRooms } from './mockData';

const USE_MOCK_DATA = true;

export const orAPI = {
    // Get all operating rooms
    getAll: async () => {
        try {
            if (USE_MOCK_DATA) {
                return { data: mockOperatingRooms };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.OPERATING_ROOMS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get OR by ID
    getById: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const room = mockOperatingRooms.find(r => r.id === id);
                return room || { error: 'OR not found' };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.OR_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create OR
    create: async (data) => {
        try {
            if (USE_MOCK_DATA) {
                const newOR = {
                    id: Math.max(...mockOperatingRooms.map(r => r.id)) + 1,
                    ...data,
                    available: true,
                    current_surgery: null,
                    equipment: [],
                };
                mockOperatingRooms.push(newOR);
                return newOR;
            }
            const response = await axiosInstance.post(API_ENDPOINTS.OPERATING_ROOMS, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update OR
    update: async (id, data) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockOperatingRooms.findIndex(r => r.id === id);
                if (index !== -1) {
                    mockOperatingRooms[index] = { ...mockOperatingRooms[index], ...data };
                    return mockOperatingRooms[index];
                }
                return { error: 'OR not found' };
            }
            const response = await axiosInstance.put(API_ENDPOINTS.OR_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete OR
    delete: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockOperatingRooms.findIndex(r => r.id === id);
                if (index !== -1) {
                    mockOperatingRooms.splice(index, 1);
                    return { message: 'OR deleted' };
                }
                return { error: 'OR not found' };
            }
            const response = await axiosInstance.delete(API_ENDPOINTS.OR_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

