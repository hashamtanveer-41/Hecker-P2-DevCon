// src/pages/AuditLogs.jsx

import { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import axiosInstance from '../api/axios';
import { API_ENDPOINTS } from '../utils/constants';

const AuditLogs = () => {
    const { hospitalId } = useHospital();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        action: '',
        user: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        if (hospitalId) {
            fetchLogs();
        }
    }, [hospitalId]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (filters.action) params.append('action', filters.action);
            if (filters.user) params.append('user', filters.user);
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);

            const url = `${API_ENDPOINTS.AUDIT_LOGS}?${params.toString()}`;
            const response = await axiosInstance.get(url);
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        fetchLogs();
    };

    const handleClearFilters = () => {
        setFilters({
            action: '',
            user: '',
            startDate: '',
            endDate: '',
        });
        setTimeout(() => fetchLogs(), 100);
    };

    const getActionColor = (action) => {
        if (action.includes('CREATE')) return '#10b981';
        if (action.includes('UPDATE')) return '#3b82f6';
        if (action.includes('DELETE')) return '#ef4444';
        if (action.includes('LOGIN')) return '#8b5cf6';
        return '#6b7280';
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Audit Logs</h1>
                <button onClick={fetchLogs} style={styles.refreshButton}>
                    🔄 Refresh
                </button>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            <div style={styles.filtersCard}>
                <h3 style={styles.filtersTitle}>Filters</h3>
                <div style={styles.filtersGrid}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Action</label>
                        <select
                            value={filters.action}
                            onChange={(e) => handleFilterChange('action', e.target.value)}
                            style={styles.filterInput}
                        >
                            <option value="">All Actions</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="LOGIN">Login</option>
                            <option value="LOGOUT">Logout</option>
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>User</label>
                        <input
                            type="text"
                            value={filters.user}
                            onChange={(e) => handleFilterChange('user', e.target.value)}
                            style={styles.filterInput}
                            placeholder="Username or ID"
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            style={styles.filterInput}
                        />
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            style={styles.filterInput}
                        />
                    </div>
                </div>

                <div style={styles.filterActions}>
                    <button onClick={handleApplyFilters} style={styles.applyButton}>
                        Apply Filters
                    </button>
                    <button onClick={handleClearFilters} style={styles.clearButton}>
                        Clear Filters
                    </button>
                </div>
            </div>

            {loading && (
                <div style={styles.loading}>Loading audit logs...</div>
            )}

            {!loading && hospitalId && (
                <div style={styles.logsCard}>
                    <h3 style={styles.logsTitle}>Activity Log ({logs.length} entries)</h3>

                    {logs.length === 0 ? (
                        <div style={styles.noData}>
                            No audit logs found. Try adjusting your filters.
                        </div>
                    ) : (
                        <div style={styles.logsTable}>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th style={styles.th}>Timestamp</th>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Action</th>
                                    <th style={styles.th}>Resource</th>
                                    <th style={styles.th}>IP Address</th>
                                    <th style={styles.th}>Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                {logs.map((log, index) => (
                                    <tr key={log.id || index} style={styles.tr}>
                                        <td style={styles.td}>
                                            <span style={styles.timestamp}>{formatTimestamp(log.timestamp)}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.user}>{log.user_name || log.user_id}</span>
                                        </td>
                                        <td style={styles.td}>
                        <span style={{
                            ...styles.actionBadge,
                            backgroundColor: getActionColor(log.action) + '20',
                            color: getActionColor(log.action),
                        }}>
                          {log.action}
                        </span>
                                        </td>
                                        <td style={styles.td}>{log.resource_type || 'N/A'}</td>
                                        <td style={styles.td}>
                                            <span style={styles.ipAddress}>{log.ip_address || 'N/A'}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <details style={styles.details}>
                                                <summary style={styles.summary}>View Details</summary>
                                                <pre style={styles.detailsContent}>
                            {JSON.stringify(log.details || log, null, 2)}
                          </pre>
                                            </details>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <div style={styles.securityCard}>
                <h4 style={styles.securityTitle}>🔒 Security Information</h4>
                <ul style={styles.securityList}>
                    <li>All actions are logged with timestamp and user information</li>
                    <li>IP addresses are recorded for security auditing</li>
                    <li>Logs are immutable and cannot be deleted</li>
                    <li>Biometric authentication ensures user accountability</li>
                </ul>
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
    filtersCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    filtersTitle: {
        marginTop: 0,
        marginBottom: '16px',
        fontSize: '18px',
    },
    filtersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px',
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    filterLabel: {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#374151',
    },
    filterInput: {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
    },
    filterActions: {
        display: 'flex',
        gap: '12px',
    },
    applyButton: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    clearButton: {
        padding: '10px 20px',
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '16px',
        color: '#6b7280',
    },
    logsCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    logsTitle: {
        marginTop: 0,
        marginBottom: '16px',
        fontSize: '20px',
        fontWeight: '600',
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
    },
    logsTable: {
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
        backgroundColor: '#f9fafb',
    },
    tr: {
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '12px',
        fontSize: '14px',
        verticalAlign: 'top',
    },
    timestamp: {
        fontSize: '13px',
        color: '#6b7280',
    },
    user: {
        fontWeight: '500',
        color: '#1f2937',
    },
    actionBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },
    ipAddress: {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#6b7280',
    },
    details: {
        cursor: 'pointer',
    },
    summary: {
        fontSize: '13px',
        color: '#3b82f6',
        cursor: 'pointer',
        userSelect: 'none',
    },
    detailsContent: {
        marginTop: '8px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '4px',
        fontSize: '12px',
        overflow: 'auto',
        maxHeight: '200px',
    },
    securityCard: {
        backgroundColor: '#f0fdf4',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #bbf7d0',
    },
    securityTitle: {
        margin: 0,
        marginBottom: '12px',
        fontSize: '16px',
        color: '#065f46',
    },
    securityList: {
        margin: 0,
        paddingLeft: '20px',
        color: '#065f46',
        fontSize: '14px',
        lineHeight: '1.8',
    },
};

export default AuditLogs;