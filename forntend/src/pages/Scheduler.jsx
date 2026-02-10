// src/pages/Scheduler.jsx

import { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

const Scheduler = () => {
    const { hospitalId } = useHospital();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleRunScheduler = async () => {
        if (!hospitalId) {
            alert('Please select a hospital first!');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SCHEDULER_RUN);
            setResult(response.data);
            alert('Scheduler completed successfully!');
        } catch (error) {
            console.error('Error running scheduler:', error);
            alert('Failed to run scheduler');
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencySchedule = async () => {
        if (!hospitalId) {
            alert('Please select a hospital first!');
            return;
        }

        const surgeryId = prompt('Enter Surgery Request ID for emergency:');
        if (!surgeryId) return;

        setLoading(true);

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.SCHEDULER_EMERGENCY, {
                surgery_request_id: parseInt(surgeryId),
            });
            setResult(response.data);
            alert('Emergency scheduled successfully!');
        } catch (error) {
            console.error('Error scheduling emergency:', error);
            alert('Failed to schedule emergency');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Intelligent Scheduler</h1>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            <div style={styles.infoCard}>
                <h3 style={styles.infoTitle}>How It Works</h3>
                <ul style={styles.infoList}>
                    <li>✅ Checks all hard constraints (surgeon match, OR availability, equipment)</li>
                    <li>📊 Optimizes soft constraints (waiting time, OR utilization)</li>
                    <li>🔄 Handles sterilization cycles automatically</li>
                    <li>⚡ Respects staff work hour limits</li>
                    <li>🎯 Calculates optimality score</li>
                </ul>
            </div>

            <div style={styles.actionsCard}>
                <div style={styles.actionSection}>
                    <h3 style={styles.actionTitle}>🤖 Run Auto Scheduler</h3>
                    <p style={styles.actionDesc}>
                        Automatically schedule all approved surgery requests based on intelligent constraint satisfaction.
                    </p>
                    <button
                        onClick={handleRunScheduler}
                        disabled={loading || !hospitalId}
                        style={{
                            ...styles.runButton,
                            opacity: (loading || !hospitalId) ? 0.6 : 1,
                        }}
                    >
                        {loading ? 'Running Scheduler...' : 'Run Scheduler'}
                    </button>
                </div>

                <div style={styles.divider}></div>

                <div style={styles.actionSection}>
                    <h3 style={styles.actionTitle}>🚨 Emergency Override</h3>
                    <p style={styles.actionDesc}>
                        Schedule an emergency surgery immediately, bumping lower-priority cases if needed.
                    </p>
                    <button
                        onClick={handleEmergencySchedule}
                        disabled={loading || !hospitalId}
                        style={{
                            ...styles.emergencyButton,
                            opacity: (loading || !hospitalId) ? 0.6 : 1,
                        }}
                    >
                        {loading ? 'Processing...' : 'Emergency Schedule'}
                    </button>
                </div>
            </div>

            {result && (
                <div style={styles.resultCard}>
                    <h3 style={styles.resultTitle}>📋 Scheduler Results</h3>

                    {result.optimality_score !== undefined && (
                        <div style={styles.scoreSection}>
                            <span style={styles.scoreLabel}>Optimality Score:</span>
                            <span style={styles.scoreValue}>{result.optimality_score.toFixed(2)}/100</span>
                        </div>
                    )}

                    {result.scheduled_count !== undefined && (
                        <div style={styles.stat}>
                            <span style={styles.statLabel}>Surgeries Scheduled:</span>
                            <span style={styles.statValue}>{result.scheduled_count}</span>
                        </div>
                    )}

                    {result.conflicts && result.conflicts.length > 0 && (
                        <div style={styles.conflictsSection}>
                            <h4 style={styles.conflictsTitle}>⚠️ Soft Violations:</h4>
                            <ul style={styles.conflictsList}>
                                {result.conflicts.map((conflict, index) => (
                                    <li key={index}>{conflict}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.scheduled_surgeries && result.scheduled_surgeries.length > 0 && (
                        <div style={styles.scheduledSection}>
                            <h4 style={styles.scheduledTitle}>✅ Scheduled Surgeries:</h4>
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                    <tr>
                                        <th style={styles.th}>Surgery ID</th>
                                        <th style={styles.th}>OR</th>
                                        <th style={styles.th}>Start Time</th>
                                        <th style={styles.th}>End Time</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {result.scheduled_surgeries.map((surgery, index) => (
                                        <tr key={index} style={styles.tr}>
                                            <td style={styles.td}>{surgery.surgery_request_id}</td>
                                            <td style={styles.td}>{surgery.operating_room_id}</td>
                                            <td style={styles.td}>{new Date(surgery.start_time).toLocaleString()}</td>
                                            <td style={styles.td}>{new Date(surgery.end_time).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {result.message && (
                        <div style={styles.message}>{result.message}</div>
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
        marginBottom: '24px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: 0,
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
        marginBottom: '12px',
        fontSize: '18px',
        color: '#1e40af',
    },
    infoList: {
        margin: 0,
        paddingLeft: '20px',
        lineHeight: '1.8',
        color: '#1e3a8a',
    },
    actionsCard: {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    actionSection: {
        textAlign: 'center',
        padding: '20px 0',
    },
    actionTitle: {
        marginTop: 0,
        marginBottom: '12px',
        fontSize: '20px',
    },
    actionDesc: {
        color: '#6b7280',
        marginBottom: '20px',
        fontSize: '14px',
    },
    runButton: {
        padding: '14px 32px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
    emergencyButton: {
        padding: '14px 32px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
    },
    divider: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '32px 0',
    },
    resultCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    resultTitle: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '20px',
    },
    scoreSection: {
        backgroundColor: '#f0fdf4',
        padding: '16px',
        borderRadius: '6px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: '16px',
        fontWeight: '500',
    },
    scoreValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#10b981',
    },
    stat: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #e5e7eb',
    },
    statLabel: {
        fontSize: '14px',
        color: '#6b7280',
    },
    statValue: {
        fontSize: '14px',
        fontWeight: '600',
    },
    conflictsSection: {
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#fef3c7',
        borderRadius: '6px',
    },
    conflictsTitle: {
        marginTop: 0,
        marginBottom: '12px',
        color: '#92400e',
    },
    conflictsList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#92400e',
    },
    scheduledSection: {
        marginTop: '20px',
    },
    scheduledTitle: {
        marginTop: 0,
        marginBottom: '12px',
        color: '#059669',
    },
    tableWrapper: {
        overflowX: 'auto',
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
    message: {
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        fontSize: '14px',
    },
};

export default Scheduler;