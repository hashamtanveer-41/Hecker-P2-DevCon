// src/api/axios.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor – attach access token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage (stored as 'token', not 'access')
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – handle auth errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('🔓 Unauthorized (401) - clearing auth and redirecting to login');

            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('hospitalId');

            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
