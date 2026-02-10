// src/pages/Staff.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import { staffAPI } from '../api/staff.api';
// Backend imports (uncomment when backend is ready):
// import axiosInstance from '../api/axios';
// import { API_ENDPOINTS } from '../utils/constants';

const Staff = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { hospitalId } = useHospital();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (hospitalId) {
            fetchStaff();
        }
    }, [hospitalId]);

    const fetchStaff = async () => {
        try {
            // Using mock data API
            const response = await staffAPI.getAll();
            setStaff(response.data || response);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.get(API_ENDPOINTS.STAFF);
            // setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
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
                max_hours_per_day: parseInt(data.max_hours_per_day),
            };

            // Using mock data API
            const response = await staffAPI.create(payload);
            setStaff([...staff, response]);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.post(API_ENDPOINTS.STAFF, payload);
            // setStaff([...staff, response.data]);

            reset();
            setShowForm(false);
            alert('Staff member created successfully!');
        } catch (error) {
            console.error('Error creating staff:', error);
            alert('Failed to create staff member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Staff Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                    disabled={!hospitalId}
                >
                    {showForm ? 'Cancel' : '+ Add Staff'}
                </button>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            {showForm && hospitalId && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Add New Staff Member</h3>
                    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Name is required' })}
                                style={styles.input}
                                placeholder="e.g., Dr. John Smith"
                            />
                            {errors.name && <span style={styles.error}>{errors.name.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Role *</label>
                            <select
                                {...register('role', { required: 'Role is required' })}
                                style={styles.input}
                            >
                                <option value="">Select role</option>
                                <option value="SURGEON">Surgeon</option>
                                <option value="ANESTHESIOLOGIST">Anesthesiologist</option>
                                <option value="NURSE">Nurse</option>
                                <option value="TECHNICIAN">Technician</option>
                            </select>
                            {errors.role && <span style={styles.error}>{errors.role.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Specialization *</label>
                            <input
                                type="text"
                                {...register('specialization', { required: 'Specialization is required' })}
                                style={styles.input}
                                placeholder="e.g., Cardiology, Neurology"
                            />
                            {errors.specialization && <span style={styles.error}>{errors.specialization.message}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Max Hours Per Day *</label>
                            <input
                                type="number"
                                {...register('max_hours_per_day', {
                                    required: 'Max hours is required',
                                    min: { value: 1, message: 'Must be at least 1' },
                                    max: { value: 16, message: 'Cannot exceed 16' },
                                })}
                                style={styles.input}
                                placeholder="e.g., 12"
                                defaultValue={12}
                            />
                            {errors.max_hours_per_day && <span style={styles.error}>{errors.max_hours_per_day.message}</span>}
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Creating...' : 'Add Staff Member'}
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.tableCard}>
                <h3 style={styles.tableTitle}>All Staff Members</h3>
                {staff.length === 0 ? (
                    <p style={styles.noData}>No staff members found. Add one to get started.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Specialization</th>
                            <th style={styles.th}>Max Hours/Day</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staff.map((member) => (
                            <tr key={member.id} style={styles.tr}>
                                <td style={styles.td}>{member.id}</td>
                                <td style={styles.td}>{member.name}</td>
                                <td style={styles.td}>{member.role}</td>
                                <td style={styles.td}>{member.specialization}</td>
                                <td style={styles.td}>{member.max_hours_per_day}</td>
                                <td style={styles.td}>
                    <span style={{
                        ...styles.badge,
                        backgroundColor: member.is_available ? '#d1fae5' : '#fee2e2',
                        color: member.is_available ? '#065f46' : '#991b1b',
                    }}>
                      {member.is_available ? 'Available' : 'Busy'}
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

export default Staff;
