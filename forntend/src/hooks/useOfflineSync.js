// src/hooks/useOfflineSync.js

import { useState, useEffect, useCallback } from 'react';
import { syncAPI } from '../api/sync.api';

const OFFLINE_QUEUE_KEY = 'offline_queue';

export const useOfflineSync = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingChanges, setPendingChanges] = useState([]);

    useEffect(() => {
        // Load pending changes from localStorage
        const loadPendingChanges = () => {
            try {
                const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
                if (stored) {
                    setPendingChanges(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Error loading offline queue:', error);
            }
        };

        loadPendingChanges();

        // Listen for online/offline events
        const handleOnline = () => {
            setIsOnline(true);
            syncChanges();
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const addToQueue = useCallback((change) => {
        setPendingChanges((prev) => {
            const newQueue = [...prev, { ...change, timestamp: Date.now() }];
            localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue));
            return newQueue;
        });
    }, []);

    const syncChanges = useCallback(async () => {
        if (!isOnline || pendingChanges.length === 0) {
            return;
        }

        try {
            await syncAPI.push(pendingChanges);

            // Clear queue after successful sync
            setPendingChanges([]);
            localStorage.removeItem(OFFLINE_QUEUE_KEY);

            console.log('Successfully synced offline changes');
        } catch (error) {
            console.error('Error syncing offline changes:', error);
        }
    }, [isOnline, pendingChanges]);

    useEffect(() => {
        if (isOnline && pendingChanges.length > 0) {
            syncChanges();
        }
    }, [isOnline, pendingChanges.length, syncChanges]);

    return {
        isOnline,
        pendingChanges: pendingChanges.length,
        addToQueue,
        syncChanges,
    };
};