// src/context/HospitalContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const HospitalContext = createContext(null);

export const HospitalProvider = ({ children }) => {
    const [hospitalId, setHospitalIdState] = useState(null);
    const [hospitalName, setHospitalName] = useState('');

    // Load hospital ID from storage on mount
    useEffect(() => {
        const savedHospitalId = storage.getHospitalId();
        if (savedHospitalId) {
            setHospitalIdState(savedHospitalId);
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