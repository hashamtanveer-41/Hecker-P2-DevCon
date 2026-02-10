// src/api/scheduler.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';

export const schedulerAPI = {
    // Run scheduler
    run: async () => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SCHEDULER_RUN);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Handle emergency
    emergency: async (surgeryRequestId) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SCHEDULER_EMERGENCY, {
                surgery_request_id: surgeryRequestId,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get schedule
    getSchedule: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.SCHEDULE);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Reschedule
    reschedule: async (id, data) => {
        try {
            const response = await axiosInstance.patch(
                API_ENDPOINTS.SCHEDULE_RESCHEDULE(id),
                data
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get calendar day
    getCalendarDay: async (date) => {
        try {
            const response = await axiosInstance.get(
                `${API_ENDPOINTS.CALENDAR_DAY}?date=${date}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get calendar week
    getCalendarWeek: async (startDate) => {
        try {
            const response = await axiosInstance.get(
                `${API_ENDPOINTS.CALENDAR_WEEK}?start_date=${startDate}`
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Get priority queue
    getPriorityQueue: async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PRIORITY_QUEUE);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};