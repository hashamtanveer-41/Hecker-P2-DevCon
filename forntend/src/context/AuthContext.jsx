// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

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
        console.log('🔓 AuthContext.logout() called');
        setUser(null);
        setToken(null);
        storage.clearAll();
        console.log('✅ Auth state cleared in context');
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
