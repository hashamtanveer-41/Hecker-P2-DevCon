// src/api/surgery.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockSurgeryRequests } from './mockData';

const USE_MOCK_DATA = true;

export const surgeryAPI = {
    // Get all surgery requests
    getAll: async () => {
        try {
            if (USE_MOCK_DATA) {
                return { data: mockSurgeryRequests };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.SURGERY_REQUESTS);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get surgery request by ID
    getById: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const request = mockSurgeryRequests.find(r => r.id === id);
                return request || { error: 'Surgery request not found' };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.SURGERY_REQUEST_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Create surgery request
    create: async (data) => {
        try {
            if (USE_MOCK_DATA) {
                const newRequest = {
                    id: Math.max(...mockSurgeryRequests.map(r => r.id)) + 1,
                    ...data,
                    status: 'PENDING',
                    hospital_id: 1,
                    created_at: new Date().toISOString(),
                };
                mockSurgeryRequests.push(newRequest);
                return newRequest;
            }
            const response = await axiosInstance.post(API_ENDPOINTS.SURGERY_REQUESTS, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update surgery request
    update: async (id, data) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockSurgeryRequests.findIndex(r => r.id === id);
                if (index !== -1) {
                    mockSurgeryRequests[index] = { ...mockSurgeryRequests[index], ...data };
                    return mockSurgeryRequests[index];
                }
                return { error: 'Surgery request not found' };
            }
            const response = await axiosInstance.put(API_ENDPOINTS.SURGERY_REQUEST_BY_ID(id), data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Delete surgery request
    delete: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const index = mockSurgeryRequests.findIndex(r => r.id === id);
                if (index !== -1) {
                    mockSurgeryRequests.splice(index, 1);
                    return { message: 'Surgery request deleted' };
                }
                return { error: 'Surgery request not found' };
            }
            const response = await axiosInstance.delete(API_ENDPOINTS.SURGERY_REQUEST_BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Approve surgery request
    approve: async (id) => {
        try {
            if (USE_MOCK_DATA) {
                const request = mockSurgeryRequests.find(r => r.id === id);
                if (request) {
                    request.status = 'APPROVED';
                    return request;
                }
                return { error: 'Surgery request not found' };
            }
            const response = await axiosInstance.post(API_ENDPOINTS.SURGERY_REQUEST_APPROVE(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

