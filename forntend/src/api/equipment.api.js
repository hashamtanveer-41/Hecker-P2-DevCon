// src/api/equipment.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockEquipment } from './mockData';

const USE_MOCK_DATA = true;

export const equipmentAPI = {
    // Get all equipment
    getAll: async () => {
        try {
            if (USE_MOCK_DATA) {
                return { data: mockEquipment };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.EQUIPMENT);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get equipment by ID
    getById: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const equipment = mockEquipment.find(e => e.id === id);
                return equipment || { error: 'Equipment not found' };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.EQUIPMENT_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create equipment
    create: async (data) => {
        try {
            if (USE_MOCK_DATA) {
                const newEquipment = {
                    id: Math.max(...mockEquipment.map(e => e.id)) + 1,
                    ...data,
                    is_available: true,
                    hospital_id: 1,
                };
                mockEquipment.push(newEquipment);
                return newEquipment;
            }
            const response = await axiosInstance.post(API_ENDPOINTS.EQUIPMENT, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update equipment
    update: async (id, data) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockEquipment.findIndex(e => e.id === id);
                if (index !== -1) {
                    mockEquipment[index] = { ...mockEquipment[index], ...data };
                    return mockEquipment[index];
                }
                return { error: 'Equipment not found' };
            }
            const response = await axiosInstance.put(API_ENDPOINTS.EQUIPMENT_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete equipment
    delete: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockEquipment.findIndex(e => e.id === id);
                if (index !== -1) {
                    mockEquipment.splice(index, 1);
                    return { message: 'Equipment deleted' };
                }
                return { error: 'Equipment not found' };
            }
            const response = await axiosInstance.delete(API_ENDPOINTS.EQUIPMENT_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Sterilize equipment
    sterilize: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const equipment = mockEquipment.find(e => e.id === id);
                if (equipment) {
                    equipment.is_available = false;
                    return { message: 'Sterilization started', equipment };
                }
                return { error: 'Equipment not found' };
            }
            const response = await axiosInstance.post(API_ENDPOINTS.EQUIPMENT_STERILIZE(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

