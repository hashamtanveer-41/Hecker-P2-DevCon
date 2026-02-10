// src/utils/constants.js

export const API_BASE_URL = 'http://localhost:8000'; // ← CHANGE THIS to your backend URL
export const WS_URL = 'ws://localhost:8000/ws/notifications'; // ← WebSocket URL

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH_REGISTER: '/auth/webauthn/register',
    AUTH_LOGIN: '/auth/webauthn/login/verify',
    AUTH_LOGOUT: '/auth/logout',

    // Hospitals
    HOSPITALS: '/hospitals',
    HOSPITAL_BY_ID: (id) => `/hospitals/${id}`,

    // Operating Rooms
    OPERATING_ROOMS: '/operating-rooms',
    OR_BY_ID: (id) => `/operating-rooms/${id}`,

    // Staff
    STAFF: '/staff',
    STAFF_BY_ID: (id) => `/staff/${id}`,
    STAFF_AVAILABILITY: (id) => `/staff/${id}/availability`,

    // Equipment
    EQUIPMENT: '/equipment',
    EQUIPMENT_BY_ID: (id) => `/equipment/${id}`,
    EQUIPMENT_STERILIZE: (id) => `/equipment/${id}/sterilize`,

    // Surgery Requests
    SURGERY_REQUESTS: '/surgery-requests',
    SURGERY_REQUEST_BY_ID: (id) => `/surgery-requests/${id}`,
    SURGERY_REQUEST_APPROVE: (id) => `/surgery-requests/${id}/approve`,

    // Scheduler
    SCHEDULER_RUN: '/scheduler/run',
    SCHEDULER_EMERGENCY: '/scheduler/emergency',

    // Schedule
    SCHEDULE: '/schedule',
    SCHEDULE_BY_ID: (id) => `/schedule/${id}`,
    SCHEDULE_RESCHEDULE: (id) => `/schedule/${id}/reschedule`,

    // Calendar
    CALENDAR_DAY: '/calendar/day',
    CALENDAR_WEEK: '/calendar/week',

    // Priority Queue
    PRIORITY_QUEUE: '/priority-queue',

    // Sync
    SYNC_PUSH: '/sync/push',

    // Audit Logs
    AUDIT_LOGS: '/audit-logs',
};

// Priority Levels
export const PRIORITY_LEVELS = {
    EMERGENCY: 'EMERGENCY',
    URGENT: 'URGENT',
    NORMAL: 'NORMAL',
};

// Request Status
export const REQUEST_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SCHEDULED: 'SCHEDULED',
};

// Roles
export const ROLES = {
    HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
    OR_MANAGER: 'OR_MANAGER',
    SURGEON: 'SURGEON',
    SCHEDULER: 'SCHEDULER',
    NURSE: 'NURSE',
};