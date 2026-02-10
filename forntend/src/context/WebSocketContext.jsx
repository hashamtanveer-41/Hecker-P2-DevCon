// src/context/WebSocketContext.js
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        // Connection handlers
        socketInstance.on('connect', () => {
            console.log('WebSocket connected');
            setConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        });

        socketInstance.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const value = {
        socket,
        connected,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};

