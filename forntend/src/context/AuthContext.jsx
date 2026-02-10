// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const savedToken = storage.getToken();
        const savedUser = storage.getUser();

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        storage.setToken(authToken);
        storage.setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        storage.clearAll();
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};