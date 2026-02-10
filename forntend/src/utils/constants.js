// src/utils/constants.js

export const API_BASE_URL = "http://127.0.0.1:8000";
export const WS_URL = "ws://localhost:8000/ws/notifications";

// API Endpoints
export const API_ENDPOINTS = {
    // Auth (jwt_auth app)
    AUTH_LOGIN: "/api/v1/auth/login/",
    AUTH_LOGOUT: "/api/v1/auth/logout/",
    AUTH_TOKEN: "/api/v1/auth/token/",
    AUTH_TOKEN_REFRESH: "/api/v1/auth/token/refresh/",

    // Hospitals
    HOSPITALS: "/api/v1/hospitals/",
    HOSPITAL_BY_ID: (id) => `/api/v1/hospitals/${id}/`,

    // Operating Rooms
    OPERATING_ROOMS: "/api/v1/operating-rooms/",
    OR_BY_ID: (id) => `/api/v1/operating-rooms/${id}/`,

    // Staff
    STAFF: "/api/v1/staff/",
    STAFF_BY_ID: (id) => `/api/v1/staff/${id}/`,

    // Equipment
    EQUIPMENT: "/api/v1/equipment/",
    EQUIPMENT_BY_ID: (id) => `/api/v1/equipment/${id}/`,

    // Surgery Requests
    SURGERY_REQUESTS: "/api/v1/surgery-requests/",
    SURGERY_REQUEST_BY_ID: (id) => `/api/v1/surgery-requests/${id}/`,

    // Schedule
    SCHEDULE: "/api/v1/schedule/",
    SCHEDULE_BY_ID: (id) => `/api/v1/schedule/${id}/`,
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
    HOSPITAL_ADMIN: 'admin',
    OR_MANAGER: 'room_manager',
    SURGEON: 'surgeon',
    SCHEDULER: 'scheduler',
    NURSE: 'nurse',
};