// src/pages/Hospitals.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import { hospitalAPI } from '../api/hospital.api';
// Backend imports (uncomment when backend is ready):
// import axiosInstance from '../api/axios';
// import { API_ENDPOINTS } from '../utils/constants';

const Hospitals = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { setHospitalId } = useHospital();
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            // Using mock data API
            const response = await hospitalAPI.getAll();
            setHospitals(response.data || response);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.get(API_ENDPOINTS.HOSPITALS);
            // setHospitals(response.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Using mock data API
            const response = await hospitalAPI.create(data);
            setHospitals([...hospitals, response]);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.post(API_ENDPOINTS.HOSPITALS, data);
            // setHospitals([...hospitals, response.data]);

            reset();
            setShowForm(false);
            alert('Hospital created successfully!');
        } catch (error) {
            console.error('Error creating hospital:', error);
            alert('Failed to create hospital');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHospital = (hospital) => {
        setHospitalId(hospital.id, hospital.name);
        alert(`Selected hospital: ${hospital.name}`);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Hospitals</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                >
                    {showForm ? 'Cancel' : '+ Add Hospital'}
                </button>
            </div>

            {showForm && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Create New Hospital</h3>
                    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Hospital Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Hospital name is required' })}
                                style={styles.input}
                                placeholder="e.g., City General Hospital"
                            />
                            {errors.name && <span style={styles.error}>{errors.name.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Location *</label>
                            <input
                                type="text"
                                {...register('location', { required: 'Location is required' })}
                                style={styles.input}
                                placeholder="e.g., New York, NY"
                            />
                            {errors.location && <span style={styles.error}>{errors.location.message}</span>}
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Creating...' : 'Create Hospital'}
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.tableCard}>
                <h3 style={styles.tableTitle}>All Hospitals</h3>
                {hospitals.length === 0 ? (
                    <p style={styles.noData}>No hospitals found. Create one to get started.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hospitals.map((hospital) => (
                            <tr key={hospital.id} style={styles.tr}>
                                <td style={styles.td}>{hospital.id}</td>
                                <td style={styles.td}>{hospital.name}</td>
                                <td style={styles.td}>{hospital.location}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleSelectHospital(hospital)}
                                        style={styles.selectButton}
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: 0,
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    formCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    formTitle: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '18px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '6px',
    },
    input: {
        padding: '10px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
    },
    error: {
        color: '#ef4444',
        fontSize: '12px',
        marginTop: '4px',
    },
    submitButton: {
        padding: '12px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    tableCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    tableTitle: {
        marginTop: 0,
        marginBottom: '16px',
        fontSize: '18px',
    },
    noData: {
        textAlign: 'center',
        color: '#6b7280',
        padding: '32px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid #e5e7eb',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
    },
    tr: {
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '12px',
        fontSize: '14px',
    },
    selectButton: {
        padding: '6px 12px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
};

export default Hospitals;