// src/pages/Equipment.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

const Equipment = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { hospitalId } = useHospital();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (hospitalId) {
            fetchEquipment();
        }
    }, [hospitalId]);

    const fetchEquipment = async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.EQUIPMENT);
            setEquipment(response.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
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
                sterilization_cycle_hours: parseInt(data.sterilization_cycle_hours),
            };

            const response = await axiosInstance.post(API_ENDPOINTS.EQUIPMENT, payload);
            setEquipment([...equipment, response.data]);
            reset();
            setShowForm(false);
            alert('Equipment created successfully!');
        } catch (error) {
            console.error('Error creating equipment:', error);
            alert('Failed to create equipment');
        } finally {
            setLoading(false);
        }
    };

    const handleSterilize = async (id) => {
        try {
            await axiosInstance.post(API_ENDPOINTS.EQUIPMENT_STERILIZE(id));
            alert('Sterilization started!');
            fetchEquipment(); // Refresh list
        } catch (error) {
            console.error('Error sterilizing equipment:', error);
            alert('Failed to start sterilization');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Equipment Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                    disabled={!hospitalId}
                >
                    {showForm ? 'Cancel' : '+ Add Equipment'}
                </button>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            {showForm && hospitalId && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Add New Equipment</h3>
                    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Equipment Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Equipment name is required' })}
                                style={styles.input}
                                placeholder="e.g., Cardiac Monitor XR-500"
                            />
                            {errors.name && <span style={styles.error}>{errors.name.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Type *</label>
                            <select
                                {...register('type', { required: 'Type is required' })}
                                style={styles.input}
                            >
                                <option value="">Select type</option>
                                <option value="Surgical Instrument">Surgical Instrument</option>
                                <option value="Monitoring Device">Monitoring Device</option>
                                <option value="Anesthesia Machine">Anesthesia Machine</option>
                                <option value="Imaging Equipment">Imaging Equipment</option>
                                <option value="Life Support">Life Support</option>
                            </select>
                            {errors.type && <span style={styles.error}>{errors.type.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Sterilization Cycle Hours *</label>
                            <input
                                type="number"
                                {...register('sterilization_cycle_hours', {
                                    required: 'Sterilization cycle is required',
                                    min: { value: 1, message: 'Must be at least 1 hour' },
                                })}
                                style={styles.input}
                                placeholder="e.g., 2"
                                defaultValue={2}
                            />
                            {errors.sterilization_cycle_hours && (
                                <span style={styles.error}>{errors.sterilization_cycle_hours.message}</span>
                            )}
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Creating...' : 'Add Equipment'}
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.tableCard}>
                <h3 style={styles.tableTitle}>All Equipment</h3>
                {equipment.length === 0 ? (
                    <p style={styles.noData}>No equipment found. Add one to get started.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>Sterilization (hrs)</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipment.map((item) => (
                            <tr key={item.id} style={styles.tr}>
                                <td style={styles.td}>{item.id}</td>
                                <td style={styles.td}>{item.name}</td>
                                <td style={styles.td}>{item.type}</td>
                                <td style={styles.td}>{item.sterilization_cycle_hours}</td>
                                <td style={styles.td}>
                    <span style={{
                        ...styles.badge,
                        backgroundColor: item.is_available ? '#d1fae5' : '#fef3c7',
                        color: item.is_available ? '#065f46' : '#92400e',
                    }}>
                      {item.is_available ? 'Available' : 'In Use/Sterilizing'}
                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => handleSterilize(item.id)}
                                        style={styles.actionButton}
                                        disabled={!item.is_available}
                                    >
                                        Sterilize
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
    actionButton: {
        padding: '6px 12px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
};

export default Equipment;