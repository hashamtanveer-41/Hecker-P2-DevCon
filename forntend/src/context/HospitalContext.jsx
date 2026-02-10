// src/context/HospitalContext.jsx
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const HospitalContext = createContext(null);

export const HospitalProvider = ({ children }) => {
    const [hospitalId, setHospitalIdState] = useState(() => {
        // Initialize state from storage
        return storage.getHospitalId();
    });
    const [hospitalName, setHospitalName] = useState('');

    // Auto-select first hospital on mount if none is selected
    useEffect(() => {
        if (!hospitalId) {
            // Import mock data here to avoid circular dependencies
            import('../api/mockData').then(({ mockHospitals }) => {
                if (mockHospitals && mockHospitals.length > 0) {
                    const firstHospital = mockHospitals[0];
                    setHospitalIdState(firstHospital.id);
                    setHospitalName(firstHospital.name);
                    storage.setHospitalId(firstHospital.id);
                }
            });
        }
    }, []);

    const setHospitalId = (id, name = '') => {
        setHospitalIdState(id);
        setHospitalName(name);
        storage.setHospitalId(id);
    };

    const clearHospital = () => {
        setHospitalIdState(null);
        setHospitalName('');
        storage.removeHospitalId();
    };

    const value = {
        hospitalId,
        hospitalName,
        setHospitalId,
        clearHospital,
    };

    return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
};

export const useHospital = () => {
    const context = useContext(HospitalContext);
    if (!context) {
        throw new Error('useHospital must be used within HospitalProvider');
    }
    return context;
};

