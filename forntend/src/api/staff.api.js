// src/api/staff.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockStaff } from './mockData';

const USE_MOCK_DATA = true;

export const staffAPI = {
    // Get all staff
    getAll: async () => {
        try {
            if (USE_MOCK_DATA) {
                return { data: mockStaff };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.STAFF);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get staff by ID
    getById: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const staff = mockStaff.find(s => s.id === id);
                return staff || { error: 'Staff not found' };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.STAFF_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create staff
    create: async (data) => {
        try {
            if (USE_MOCK_DATA) {
                const newStaff = {
                    id: Math.max(...mockStaff.map(s => s.id)) + 1,
                    ...data,
                    available: true,
                    current_surgery: null,
                    hospital_id: 1,
                };
                mockStaff.push(newStaff);
                return newStaff;
            }
            const response = await axiosInstance.post(API_ENDPOINTS.STAFF, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update staff
    update: async (id, data) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockStaff.findIndex(s => s.id === id);
                if (index !== -1) {
                    mockStaff[index] = { ...mockStaff[index], ...data };
                    return mockStaff[index];
                }
                return { error: 'Staff not found' };
            }
            const response = await axiosInstance.put(API_ENDPOINTS.STAFF_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete staff
    delete: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockStaff.findIndex(s => s.id === id);
                if (index !== -1) {
                    mockStaff.splice(index, 1);
                    return { message: 'Staff deleted' };
                }
                return { error: 'Staff not found' };
            }
            const response = await axiosInstance.delete(API_ENDPOINTS.STAFF_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get staff availability
    getAvailability: async (id, date) => {
        try {
            if (USE_MOCK_DATA) {
                const staff = mockStaff.find(s => s.id === id);
                return {
                    staff_id: id,
                    date,
                    available_hours: staff?.available ? ['09:00', '10:00', '11:00', '14:00', '15:00'] : [],
                };
            }
            const response = await axiosInstance.get(
                `${API_ENDPOINTS.STAFF_AVAILABILITY(id)}?date=${date}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};
