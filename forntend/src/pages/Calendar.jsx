// src/pages/Calendar.jsx

import { useState, useEffect, useCallback } from 'react';
import { useHospital } from '../context/HospitalContext';
import { schedulerAPI } from '../api/scheduler.api';
// Backend imports (uncomment when backend is ready):
// import axiosInstance from '../api/axios';
// import { API_ENDPOINTS } from '../utils/constants';

const Calendar = () => {
    const { hospitalId } = useHospital();
    const [schedules, setSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

    const fetchSchedule = useCallback(async () => {
        setLoading(true);
        try {
            // Using mock data API
            const response = viewMode === 'day'
                ? await schedulerAPI.getCalendarDay(selectedDate)
                : await schedulerAPI.getCalendarWeek(selectedDate);

            setSchedules(response.schedules || response.data || []);

            // Backend implementation (uncomment when backend is ready):
            // const endpoint = viewMode === 'day'
            //     ? `${API_ENDPOINTS.CALENDAR_DAY}?date=${selectedDate}`
            //     : `${API_ENDPOINTS.CALENDAR_WEEK}?start_date=${selectedDate}`;
            // const response = await axiosInstance.get(endpoint);
            // setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedDate, viewMode]);

    useEffect(() => {
        if (hospitalId && selectedDate) {
            fetchSchedule();
        }
    }, [hospitalId, selectedDate, viewMode, fetchSchedule]);

    const formatTime = (datetime) => {
        if (!datetime) return 'N/A';
        const date = new Date(datetime);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const minutes = Math.round((endDate - startDate) / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'EMERGENCY':
                return '#ef4444';
            case 'URGENT':
                return '#f59e0b';
            case 'NORMAL':
                return '#3b82f6';
            default:
                return '#6b7280';
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Surgery Calendar</h1>
                <div style={styles.controls}>
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        style={styles.select}
                    >
                        <option value="day">Day View</option>
                        <option value="week">Week View</option>
                    </select>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={styles.dateInput}
                    />
                    <button onClick={fetchSchedule} style={styles.refreshButton}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {!hospitalId && (
                <div style={styles.warning}>
                    ⚠️ Please select a hospital from the Hospitals page first!
                </div>
            )}

            {loading && (
                <div style={styles.loading}>Loading schedule...</div>
            )}

            {!loading && hospitalId && (
                <div style={styles.calendarCard}>
                    <div style={styles.calendarHeader}>
                        <h3 style={styles.calendarTitle}>
                            {viewMode === 'day' ? 'Daily Schedule' : 'Weekly Schedule'} - {selectedDate}
                        </h3>
                    </div>

                    {schedules.length === 0 ? (
                        <div style={styles.noData}>
                            <p>No surgeries scheduled for this {viewMode}.</p>
                            <p style={styles.hint}>Run the Scheduler to create schedules.</p>
                        </div>
                    ) : (
                        <div style={styles.scheduleGrid}>
                            {schedules.map((schedule, index) => (
                                <div
                                    key={schedule.id || index}
                                    style={{
                                        ...styles.scheduleCard,
                                        borderLeft: `4px solid ${getPriorityColor(schedule.priority)}`,
                                    }}
                                >
                                    <div style={styles.scheduleHeader}>
                                        <div style={styles.scheduleTime}>
                                            <span style={styles.timeLabel}>Start:</span>
                                            <span style={styles.timeValue}>{formatTime(schedule.start_time)}</span>
                                        </div>
                                        <div style={styles.scheduleTime}>
                                            <span style={styles.timeLabel}>End:</span>
                                            <span style={styles.timeValue}>{formatTime(schedule.end_time)}</span>
                                        </div>
                                        <div style={styles.duration}>
                                            ⏱️ {formatDuration(schedule.start_time, schedule.end_time)}
                                        </div>
                                    </div>

                                    <div style={styles.scheduleBody}>
                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>OR:</span>
                                            <span style={styles.infoValue}>
                        {schedule.operating_room_name || `OR-${schedule.operating_room_id}`}
                      </span>
                                        </div>

                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Patient:</span>
                                            <span style={styles.infoValue}>
                        {schedule.patient_name || 'N/A'}
                      </span>
                                        </div>

                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Procedure:</span>
                                            <span style={styles.infoValue}>
                        {schedule.procedure || 'N/A'}
                      </span>
                                        </div>

                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Surgeon:</span>
                                            <span style={styles.infoValue}>
                        {schedule.surgeon_name || 'N/A'}
                      </span>
                                        </div>

                                        <div style={styles.infoRow}>
                                            <span style={styles.infoLabel}>Priority:</span>
                                            <span style={{
                                                ...styles.priorityBadge,
                                                backgroundColor: getPriorityColor(schedule.priority) + '20',
                                                color: getPriorityColor(schedule.priority),
                                            }}>
                        {schedule.priority || 'NORMAL'}
                      </span>
                                        </div>
                                    </div>

                                    {schedule.notes && (
                                        <div style={styles.notes}>
                                            <strong>Notes:</strong> {schedule.notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={styles.legendCard}>
                <h4 style={styles.legendTitle}>Priority Legend</h4>
                <div style={styles.legendGrid}>
                    <div style={styles.legendItem}>
                        <div style={{ ...styles.legendColor, backgroundColor: '#ef4444' }}></div>
                        <span>Emergency</span>
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{ ...styles.legendColor, backgroundColor: '#f59e0b' }}></div>
                        <span>Urgent</span>
                    </div>
                    <div style={styles.legendItem}>
                        <div style={{ ...styles.legendColor, backgroundColor: '#3b82f6' }}></div>
                        <span>Normal</span>
                    </div>
                </div>
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
        flexWrap: 'wrap',
        gap: '16px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        margin: 0,
    },
    controls: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
    },
    select: {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
    },
    dateInput: {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
    },
    refreshButton: {
        padding: '8px 16px',
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
    loading: {
        textAlign: 'center',
        padding: '40px',
        fontSize: '16px',
        color: '#6b7280',
    },
    calendarCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px',
    },
    calendarHeader: {
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e5e7eb',
    },
    calendarTitle: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '600',
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
    },
    hint: {
        fontSize: '14px',
        marginTop: '8px',
    },
    scheduleGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
    },
    scheduleCard: {
        backgroundColor: '#f9fafb',
        padding: '16px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
    },
    scheduleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
    },
    scheduleTime: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    timeLabel: {
        fontSize: '11px',
        color: '#6b7280',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    timeValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1f2937',
    },
    duration: {
        fontSize: '13px',
        color: '#6b7280',
        fontWeight: '500',
    },
    scheduleBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
    },
    infoLabel: {
        color: '#6b7280',
        fontWeight: '500',
    },
    infoValue: {
        color: '#1f2937',
        fontWeight: '500',
        textAlign: 'right',
    },
    priorityBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    notes: {
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#fef3c7',
        borderRadius: '4px',
        fontSize: '13px',
        color: '#92400e',
    },
    legendCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    legendTitle: {
        margin: 0,
        marginBottom: '12px',
        fontSize: '16px',
        fontWeight: '600',
    },
    legendGrid: {
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
    },
    legendColor: {
        width: '20px',
        height: '20px',
        borderRadius: '4px',
    },
};

export default Calendar;