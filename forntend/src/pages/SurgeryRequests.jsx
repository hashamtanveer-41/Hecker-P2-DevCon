// src/pages/SurgeryRequests.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHospital } from '../context/HospitalContext';
import { surgeryAPI } from '../api/surgery.api';
import { PRIORITY_LEVELS, REQUEST_STATUS } from '../utils/constants';

const SurgeryRequests = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { hospitalId } = useHospital();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (hospitalId) {
            fetchRequests();
        }
    }, [hospitalId]);

    const fetchRequests = async () => {
        try {
            const response = await surgeryAPI.getAll();
            setRequests(response.data || response);
        } catch (error) {
            console.error('Error fetching surgery requests:', error);
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
                complexity_level: parseInt(data.complexity_level),
                estimated_duration_minutes: parseInt(data.estimated_duration_minutes),
                equipment_required: data.equipment_required.split(',').map(eq => eq.trim()),
            };

            // Using mock data API
            const response = await surgeryAPI.create(payload);
            setRequests([...requests, response]);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.post(API_ENDPOINTS.SURGERY_REQUESTS, payload);
            // setRequests([...requests, response.data]);

            reset();
            setShowForm(false);
            alert('Surgery request created successfully!');
        } catch (error) {
            console.error('Error creating surgery request:', error);
            alert('Failed to create surgery request');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            // Using mock data API
            await surgeryAPI.approve(id);
            alert('Surgery request approved!');
            fetchRequests(); // Refresh list

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.post(API_ENDPOINTS.SURGERY_REQUEST_APPROVE(id));
            // alert('Surgery request approved!');
            // fetchRequests(); // Refresh list
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'EMERGENCY':
                return { bg: '#fee2e2', color: '#991b1b' };
            case 'URGENT':
                return { bg: '#fef3c7', color: '#92400e' };
            case 'NORMAL':
                return { bg: '#dbeafe', color: '#1e40af' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return { bg: '#d1fae5', color: '#065f46' };
            case 'PENDING':
                return { bg: '#fef3c7', color: '#92400e' };
            case 'REJECTED':
                return { bg: '#fee2e2', color: '#991b1b' };
            case 'SCHEDULED':
                return { bg: '#dbeafe', color: '#1e40af' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Surgery Requests</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={styles.addButton}
                    disabled={!hospitalId}
                >
                    {showForm ? 'Cancel' : '+ New Request'}
                </button>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            {showForm && hospitalId && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Create Surgery Request</h3>
                    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Patient Name *</label>
                                <input
                                    type="text"
                                    {...register('patient_name', { required: 'Patient name is required' })}
                                    style={styles.input}
                                    placeholder="e.g., John Doe"
                                />
                                {errors.patient_name && <span style={styles.error}>{errors.patient_name.message}</span>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Patient Age *</label>
                                <input
                                    type="number"
                                    {...register('patient_age', {
                                        required: 'Age is required',
                                        min: { value: 0, message: 'Invalid age' },
                                    })}
                                    style={styles.input}
                                    placeholder="e.g., 45"
                                />
                                {errors.patient_age && <span style={styles.error}>{errors.patient_age.message}</span>}
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Procedure *</label>
                                <input
                                    type="text"
                                    {...register('procedure', { required: 'Procedure is required' })}
                                    style={styles.input}
                                    placeholder="e.g., CABG, Appendectomy"
                                />
                                {errors.procedure && <span style={styles.error}>{errors.procedure.message}</span>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Priority *</label>
                                <select
                                    {...register('priority', { required: 'Priority is required' })}
                                    style={styles.input}
                                >
                                    <option value="">Select priority</option>
                                    <option value="NORMAL">Normal</option>
                                    <option value="URGENT">Urgent</option>
                                    <option value="EMERGENCY">Emergency</option>
                                </select>
                                {errors.priority && <span style={styles.error}>{errors.priority.message}</span>}
                            </div>
                        </div>

                        <div style={styles.formRow}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Complexity Level (1-5) *</label>
                                <input
                                    type="number"
                                    {...register('complexity_level', {
                                        required: 'Complexity is required',
                                        min: { value: 1, message: 'Min 1' },
                                        max: { value: 5, message: 'Max 5' },
                                    })}
                                    style={styles.input}
                                    placeholder="1-5"
                                    defaultValue={3}
                                />
                                {errors.complexity_level && <span style={styles.error}>{errors.complexity_level.message}</span>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Duration (minutes) *</label>
                                <input
                                    type="number"
                                    {...register('estimated_duration_minutes', {
                                        required: 'Duration is required',
                                        min: { value: 15, message: 'Min 15 minutes' },
                                    })}
                                    style={styles.input}
                                    placeholder="e.g., 120"
                                />
                                {errors.estimated_duration_minutes && (
                                    <span style={styles.error}>{errors.estimated_duration_minutes.message}</span>
                                )}
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Required Specialization *</label>
                            <input
                                type="text"
                                {...register('required_specialization', { required: 'Specialization is required' })}
                                style={styles.input}
                                placeholder="e.g., Cardiology"
                            />
                            {errors.required_specialization && (
                                <span style={styles.error}>{errors.required_specialization.message}</span>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Equipment Required (comma-separated) *</label>
                            <input
                                type="text"
                                {...register('equipment_required', { required: 'Equipment is required' })}
                                style={styles.input}
                                placeholder="e.g., Cardiac Monitor, Defibrillator"
                            />
                            {errors.equipment_required && (
                                <span style={styles.error}>{errors.equipment_required.message}</span>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Anesthesia Type *</label>
                            <select
                                {...register('anesthesia_type', { required: 'Anesthesia type is required' })}
                                style={styles.input}
                            >
                                <option value="">Select type</option>
                                <option value="General">General</option>
                                <option value="Regional">Regional</option>
                                <option value="Local">Local</option>
                            </select>
                            {errors.anesthesia_type && (
                                <span style={styles.error}>{errors.anesthesia_type.message}</span>
                            )}
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitButton}>
                            {loading ? 'Creating...' : 'Create Request'}
                        </button>
                    </form>
                </div>
            )}

            <div style={styles.tableCard}>
                <h3 style={styles.tableTitle}>All Surgery Requests</h3>
                {requests.length === 0 ? (
                    <p style={styles.noData}>No surgery requests found. Create one to get started.</p>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Patient</th>
                                <th style={styles.th}>Procedure</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Complexity</th>
                                <th style={styles.th}>Duration</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((request) => {
                                const priorityStyle = getPriorityColor(request.priority);
                                const statusStyle = getStatusColor(request.status);

                                return (
                                    <tr key={request.id} style={styles.tr}>
                                        <td style={styles.td}>{request.id}</td>
                                        <td style={styles.td}>{request.patient_name}</td>
                                        <td style={styles.td}>{request.procedure}</td>
                                        <td style={styles.td}>
                        <span style={{
                            ...styles.badge,
                            backgroundColor: priorityStyle.bg,
                            color: priorityStyle.color,
                        }}>
                          {request.priority}
                        </span>
                                        </td>
                                        <td style={styles.td}>{request.complexity_level}/5</td>
                                        <td style={styles.td}>{request.estimated_duration_minutes} min</td>
                                        <td style={styles.td}>
                        <span style={{
                            ...styles.badge,
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                        }}>
                          {request.status}
                        </span>
                                        </td>
                                        <td style={styles.td}>
                                            {request.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleApprove(request.id)}
                                                    style={styles.actionButton}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1400px',
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
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
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
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '900px',
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
        display: 'inline-block',
    },
    actionButton: {
        padding: '6px 12px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
};

export default SurgeryRequests;