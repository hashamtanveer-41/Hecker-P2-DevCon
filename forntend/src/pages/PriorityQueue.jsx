// src/pages/PriorityQueue.jsx

import { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { schedulerAPI } from '../api/scheduler.api';
// Backend imports (uncomment when backend is ready):
// import axiosInstance from '../api/axios';
// import { API_ENDPOINTS } from '../utils/constants';

const PriorityQueue = () => {
    const { hospitalId } = useHospital();
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (hospitalId) {
            fetchQueue();
        }
    }, [hospitalId]);

    const fetchQueue = async () => {
        setLoading(true);
        try {
            // Using mock data API
            const response = await schedulerAPI.getPriorityQueue();
            setQueue(response.data || response);

            // Backend implementation (uncomment when backend is ready):
            // const response = await axiosInstance.get(API_ENDPOINTS.PRIORITY_QUEUE);
            // setQueue(response.data);
        } catch (error) {
            console.error('Error fetching priority queue:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'EMERGENCY':
                return { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' };
            case 'URGENT':
                return { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
            case 'NORMAL':
                return { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' };
            default:
                return { bg: '#f3f4f6', color: '#374151', border: '#9ca3af' };
        }
    };

    const getWaitingColor = (hours) => {
        if (hours > 48) return '#ef4444'; // Red - critical
        if (hours > 24) return '#f59e0b'; // Yellow - warning
        return '#10b981'; // Green - ok
    };

    const calculateWaitingHours = (createdAt) => {
        if (!createdAt) return 0;
        const now = new Date();
        const created = new Date(createdAt);
        return Math.floor((now - created) / 1000 / 60 / 60);
    };

    const handleEmergency = async (requestId) => {
        const confirm = window.confirm(`Handle this as emergency? This will reschedule other surgeries if needed.`);
        if (!confirm) return;

        try {
            await axiosInstance.post(API_ENDPOINTS.SCHEDULER_EMERGENCY, {
                surgery_request_id: requestId,
            });
            alert('Emergency scheduled successfully!');
            fetchQueue();
        } catch (error) {
            console.error('Error handling emergency:', error);
            alert('Failed to handle emergency');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Priority Queue</h1>
                <button onClick={fetchQueue} style={styles.refreshButton}>
                    🔄 Refresh
                </button>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>Queue Management</h3>
                <p style={styles.infoText}>
                    Surgeries are automatically prioritized based on urgency, waiting time, and medical necessity.
                    Emergency cases can be fast-tracked using the "Handle Emergency" button.
                </p>
            </div>

            {loading && (
                <div style={styles.loading}>Loading queue...</div>
            )}

            {!loading && hospitalId && (
                <div style={styles.queueCard}>
                    <h3 style={styles.queueTitle}>Current Queue ({queue.length} surgeries)</h3>

                    {queue.length === 0 ? (
                        <div style={styles.noData}>
                            No surgeries in queue. All requests are either scheduled or pending approval.
                        </div>
                    ) : (
                        <div style={styles.queueList}>
                            {queue.map((item, index) => {
                                const priorityStyle = getPriorityColor(item.priority);
                                const waitingHours = calculateWaitingHours(item.created_at);
                                const waitingColor = getWaitingColor(waitingHours);

                                return (
                                    <div
                                        key={item.id || index}
                                        style={{
                                            ...styles.queueItem,
                                            borderLeft: `5px solid ${priorityStyle.border}`,
                                        }}
                                    >
                                        <div style={styles.queueHeader}>
                                            <div style={styles.queueRank}>
                                                <span style={styles.rankNumber}>#{index + 1}</span>
                                                <span style={{
                                                    ...styles.priorityBadge,
                                                    backgroundColor: priorityStyle.bg,
                                                    color: priorityStyle.color,
                                                }}>
                          {item.priority}
                        </span>
                                            </div>

                                            <div style={styles.waitingInfo}>
                                                <span style={styles.waitingLabel}>Waiting:</span>
                                                <span style={{
                                                    ...styles.waitingValue,
                                                    color: waitingColor,
                                                }}>
                          {waitingHours}h
                        </span>
                                            </div>
                                        </div>

                                        <div style={styles.queueBody}>
                                            <div style={styles.patientInfo}>
                                                <h4 style={styles.patientName}>{item.patient_name}</h4>
                                                <p style={styles.procedure}>{item.procedure}</p>
                                            </div>

                                            <div style={styles.detailsGrid}>
                                                <div style={styles.detailItem}>
                                                    <span style={styles.detailLabel}>Age:</span>
                                                    <span style={styles.detailValue}>{item.patient_age}</span>
                                                </div>
                                                <div style={styles.detailItem}>
                                                    <span style={styles.detailLabel}>Complexity:</span>
                                                    <span style={styles.detailValue}>{item.complexity_level}/5</span>
                                                </div>
                                                <div style={styles.detailItem}>
                                                    <span style={styles.detailLabel}>Duration:</span>
                                                    <span style={styles.detailValue}>{item.estimated_duration_minutes} min</span>
                                                </div>
                                                <div style={styles.detailItem}>
                                                    <span style={styles.detailLabel}>Specialization:</span>
                                                    <span style={styles.detailValue}>{item.required_specialization}</span>
                                                </div>
                                            </div>

                                            {item.equipment_required && item.equipment_required.length > 0 && (
                                                <div style={styles.equipmentSection}>
                                                    <span style={styles.equipmentLabel}>Equipment:</span>
                                                    <div style={styles.equipmentList}>
                                                        {item.equipment_required.map((eq, idx) => (
                                                            <span key={idx} style={styles.equipmentTag}>{eq}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div style={styles.queueFooter}>
                                            {item.priority === 'EMERGENCY' ? (
                                                <button
                                                    onClick={() => handleEmergency(item.id)}
                                                    style={styles.emergencyButton}
                                                >
                                                    🚨 Handle Emergency
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEmergency(item.id)}
                                                    style={styles.fastTrackButton}
                                                >
                                                    ⚡ Fast Track
                                                </button>
                                            )}

                                            {waitingHours > 48 && (
                                                <span style={styles.escalationWarning}>
                          ⚠️ Escalation required
                        </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
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
    refreshButton: {
        padding: '10px 20px',
        backgroundColor: '#10b981',
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
    infoCard: {
        backgroundColor: '#dbeafe',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '24px',
    },
    infoTitle: {
        marginTop: 0,
        marginBottom: '8px',
        fontSize: '18px',
        color: '#1e40af',
    },
    infoText: {
        margin: 0,
        color: '#1e3a8a',
        fontSize: '14px',
        lineHeight: '1.6',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '16px',
        color: '#6b7280',
    },
    queueCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    queueTitle: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '20px',
        fontWeight: '600',
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
    },
    queueList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    queueItem: {
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
    },
    queueHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    queueRank: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    rankNumber: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#6b7280',
    },
    priorityBadge: {
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '13px',
        fontWeight: '600',
    },
    waitingInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    waitingLabel: {
        fontSize: '12px',
        color: '#6b7280',
        textTransform: 'uppercase',
    },
    waitingValue: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    queueBody: {
        marginBottom: '16px',
    },
    patientInfo: {
        marginBottom: '12px',
    },
    patientName: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
        color: '#1f2937',
    },
    procedure: {
        margin: 0,
        marginTop: '4px',
        fontSize: '14px',
        color: '#6b7280',
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '12px',
    },
    detailItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    detailLabel: {
        fontSize: '12px',
        color: '#6b7280',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: '14px',
        color: '#1f2937',
        fontWeight: '600',
    },
    equipmentSection: {
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb',
    },
    equipmentLabel: {
        fontSize: '12px',
        color: '#6b7280',
        textTransform: 'uppercase',
        fontWeight: '500',
        display: 'block',
        marginBottom: '8px',
    },
    equipmentList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    },
    equipmentTag: {
        padding: '4px 8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#374151',
    },
    queueFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #e5e7eb',
    },
    emergencyButton: {
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    fastTrackButton: {
        padding: '8px 16px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    escalationWarning: {
        fontSize: '13px',
        color: '#ef4444',
        fontWeight: '500',
    },
};

export default PriorityQueue;