// src/pages/OperatingRooms.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import { orAPI } from '../api/or.api';
// Backend imports (uncomment when backend is ready):
// import axiosInstance from '../api/axios';
// import { API_ENDPOINTS } from '../utils/constants';

const OperatingRooms = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { hospitalId } = useHospital();
    const [operatingRooms, setOperatingRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (hospitalId) {
            fetchOperatingRooms();
        }
    }, [hospitalId]);

    const fetchOperatingRooms = async () => {
        try {
            // Using mock data API
            const response = await orAPI.getAll();
            setOperatingRooms(response.data || response);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.get(API_ENDPOINTS.OPERATING_ROOMS);
            // setOperatingRooms(response.data);
        } catch (error) {
            console.error('Error fetching operating rooms:', error);
        }
    };

    const onSubmit = async (data) => {
        if (!hospitalId) {
            alert('Please select a hospital first!');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...data,
                capabilities: data.capabilities.split(',').map(cap => cap.trim()),
            };

            // Using mock data API
            const response = await orAPI.create(payload);
            setOperatingRooms([...operatingRooms, response]);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.post(API_ENDPOINTS.OPERATING_ROOMS, payload);
            // setOperatingRooms([...operatingRooms, response.data]);

            reset();
            setShowForm(false);
            alert('Operating Room created successfully!');
        } catch (error) {
            console.error('Error creating operating room:', error);
            alert('Failed to create operating room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Operating Rooms</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                    disabled={!hospitalId}
                >
                    {showForm ? 'Cancel' : '+ Add Operating Room'}
                </button>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            {showForm && hospitalId && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Create New Operating Room</h3>
                    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>OR Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'OR name is required' })}
                                style={styles.input}
                                placeholder="e.g., OR-Cardiac-1"
                            />
                            {errors.name && <span style={styles.error}>{errors.name.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>OR Type *</label>
                            <select
                                {...register('type', { required: 'OR type is required' })}
                                style={styles.input}
                            >
                                <option value="">Select type</option>
                                <option value="General">General</option>
                                <option value="Cardiac">Cardiac</option>
                                <option value="Neuro">Neuro</option>
                                <option value="Orthopedic">Orthopedic</option>
                                <option value="Pediatric">Pediatric</option>
                            </select>
                            {errors.type && <span style={styles.error}>{errors.type.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Capabilities (comma-separated) *</label>
                            <input
                                type="text"
                                {...register('capabilities', { required: 'Capabilities are required' })}
                                style={styles.input}
                                placeholder="e.g., Heart Surgery, CABG, Valve Replacement"
                            />
                            {errors.capabilities && <span style={styles.error}>{errors.capabilities.message}</span>}
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Creating...' : 'Create Operating Room'}
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.tableCard}>
                <h3 style={styles.tableTitle}>All Operating Rooms</h3>
                {operatingRooms.length === 0 ? (
                    <p style={styles.noData}>No operating rooms found. Create one to get started.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Capabilities</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operatingRooms.map((or) => (
                            <tr key={or.id} style={styles.tr}>
                                <td style={styles.td}>{or.id}</td>
                                <td style={styles.td}>{or.name}</td>
                                <td style={styles.td}>{or.type}</td>
                                <td style={styles.td}>
                                    {Array.isArray(or.capabilities) ? or.capabilities.join(', ') : or.capabilities}
                                </td>
                                <td style={styles.td}>
                    <span style={{
                        ...styles.badge,
                        backgroundColor: or.is_available ? '#d1fae5' : '#fee2e2',
                        color: or.is_available ? '#065f46' : '#991b1b',
                    }}>
                      {or.is_available ? 'Available' : 'Occupied'}
                    </span>
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
    warning: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        padding: '12px 16px',
        borderRadius: '4px',
        marginBottom: '24px',
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
    badge: {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
    },
};

export default OperatingRooms;