// src/api/scheduler.api.js

import axiosInstance from './axios';
import { API_ENDPOINTS } from '../utils/constants';
import { mockSchedules, mockPriorityQueue } from './mockData';

const USE_MOCK_DATA = true;

export const schedulerAPI = {
    // Run scheduler
    run: async () => {
        try {
            if (USE_MOCK_DATA) {
                return { message: 'Scheduler ran successfully', schedules_created: 3 };
            }
            const response = await axiosInstance.post(API_ENDPOINTS.SCHEDULER_RUN);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Handle emergency
    emergency: async (surgeryRequestId) => {
        try {
            if (USE_MOCK_DATA) {
                return {
                    message: 'Emergency scheduled successfully',
                    schedule_id: 99,
                    surgery_request_id: surgeryRequestId
                };
            }
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
            if (USE_MOCK_DATA) {
                return { data: mockSchedules };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.SCHEDULE);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Reschedule
    reschedule: async (id, data) => {
        try {
            if (USE_MOCK_DATA) {
                const schedule = mockSchedules.find(s => s.id === id);
                if (schedule) {
                    schedule.scheduled_start_time = data.new_start_time || schedule.scheduled_start_time;
                    return schedule;
                }
                return { error: 'Schedule not found' };
            }
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
            if (USE_MOCK_DATA) {
                return {
                    date,
                    schedules: mockSchedules.filter(s => s.scheduled_start_time.startsWith(date)),
                };
            }
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
            if (USE_MOCK_DATA) {
                return {
                    start_date: startDate,
                    schedules: mockSchedules,
                };
            }
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
            if (USE_MOCK_DATA) {
                return { data: mockPriorityQueue };
            }
            const response = await axiosInstance.get(API_ENDPOINTS.PRIORITY_QUEUE);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
};

