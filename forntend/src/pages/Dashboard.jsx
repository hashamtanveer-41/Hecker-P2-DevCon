// src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import { useHospital } from '../context/HospitalContext';

const Dashboard = () => {
    const { hospitalId, hospitalName } = useHospital();
    const [stats, setStats] = useState({
        totalORs: 0,
        activeStaff: 0,
        pendingRequests: 0,
        scheduledToday: 0,
    });

    useEffect(() => {
        // TODO: Fetch dashboard stats from API
        // For now, showing mock data
        setStats({
            totalORs: 12,
            activeStaff: 45,
            pendingRequests: 8,
            scheduledToday: 15,
        });
    }, [hospitalId]);

    const cards = [
        { label: 'Total Operating Rooms', value: stats.totalORs, icon: '🏗️', color: '#3b82f6' },
        { label: 'Active Staff', value: stats.activeStaff, icon: '👨‍⚕️', color: '#10b981' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: '📋', color: '#f59e0b' },
        { label: 'Scheduled Today', value: stats.scheduledToday, icon: '📅', color: '#8b5cf6' },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Dashboard</h1>
                {hospitalName && (
                    <p style={styles.subtitle}>Overview for {hospitalName}</p>
                )}
            </div>

            <div style={styles.grid}>
                {cards.map((card, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.cardIcon}>{card.icon}</div>
                        <div style={styles.cardContent}>
                            <p style={styles.cardLabel}>{card.label}</p>
                            <h2 style={{ ...styles.cardValue, color: card.color }}>{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.infoBox}>
                <h3 style={styles.infoTitle}>Quick Start Guide</h3>
                <ul style={styles.infoList}>
                    <li>1. Set up your hospital in the Hospitals page</li>
                    <li>2. Add Operating Rooms</li>
                    <li>3. Add Staff members</li>
                    <li>4. Add Equipment</li>
                    <li>5. Create Surgery Requests</li>
                    <li>6. Run the Scheduler to auto-assign surgeries</li>
                    <li>7. View the Calendar for daily schedules</li>
                </ul>
            </div>
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
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#6b7280',
        margin: 0,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
    },
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    cardIcon: {
        fontSize: '40px',
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
        marginBottom: '4px',
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: 'bold',
        margin: 0,
    },
    infoBox: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    infoTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: '16px',
    },
    infoList: {
        margin: 0,
        paddingLeft: '20px',
        lineHeight: '1.8',
    },
};

export default Dashboard;