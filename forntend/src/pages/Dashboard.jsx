// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';

const Dashboard = () => {
    const { hospitalName } = useHospital();
    const [stats] = useState({
        totalORs: 12,
        activeStaff: 45,
        pendingRequests: 8,
        scheduledToday: 15,
    });

    // TODO: Fetch dashboard stats from API when backend is ready
    // const useEffect(() => {
    //     if (hospitalId) {
    //         fetchDashboardStats();
    //     }
    // }, [hospitalId]);

    // Enhanced card data with modern gradients and background colors
    const cards = [
        {
            label: 'Operating Rooms',
            value: stats.totalORs,
            icon: '🏗️',
            accent: '#0ea5e9', // Sky blue
            bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)'
        },
        {
            label: 'Active Staff',
            value: stats.activeStaff,
            icon: '👨‍⚕️',
            accent: '#10b981', // Emerald
            bg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
        },
        {
            label: 'Pending Requests',
            value: stats.pendingRequests,
            icon: '📋',
            accent: '#f59e0b', // Amber
            bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
        },
        {
            label: 'Scheduled Today',
            value: stats.scheduledToday,
            icon: '📅',
            accent: '#8b5cf6', // Violet
            bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
        },
    ];

    return (
        <div style={styles.pageWrapper}>
            {/* Scoped CSS for Hover States, Animations, and Mobile Tweaks */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .dashboard-card {
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
                    }
                    .dashboard-card:hover {
                        transform: translateY(-5px) scale(1.01);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    }
                    .icon-wrapper {
                        transition: transform 0.3s ease;
                    }
                    .dashboard-card:hover .icon-wrapper {
                        transform: scale(1.1) rotate(5deg);
                    }
                    .btn-primary:hover {
                        background-color: #0284c7 !important;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.3);
                    }
                    .btn-primary:active {
                        transform: translateY(0);
                    }
                    .btn-secondary:hover {
                        background-color: #f1f5f9 !important;
                        border-color: #cbd5e1 !important;
                        color: #0f172a !important;
                    }
                    .guide-item {
                        transition: background-color 0.2s;
                    }
                    .guide-item:hover {
                        background-color: #f8fafc;
                    }
                `}
            </style>

            <div style={styles.container}>
                {/* Header Section */}
                <header style={styles.header}>
                    <div style={styles.headerText}>
                        <h1 style={styles.title}>Dashboard</h1>
                        {hospitalName && (
                            <div style={styles.subtitleWrapper}>
                                <span style={styles.subtitleLabel}>Managing:</span>
                                <span style={styles.subtitleValue}>{hospitalName}</span>
                            </div>
                        )}
                    </div>

                    <div style={styles.actions}>
                        <button className="btn-secondary" style={styles.btnSecondary}>
                            View Calendar
                        </button>
                        <button className="btn-primary" style={styles.btnPrimary}>
                            + Create Request
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div style={styles.grid}>
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="dashboard-card"
                            style={{...styles.card, animationDelay: `${index * 100}ms`}}
                        >
                            <div style={styles.cardHeader}>
                                <div className="icon-wrapper" style={{...styles.iconBox, background: card.bg}}>
                                    {card.icon}
                                </div>
                                {/* Optional: Add a subtle mini-chart or arrow here in the future */}
                            </div>
                            <div style={styles.cardContent}>
                                <h2 style={{...styles.cardValue, color: '#1e293b'}}>{card.value}</h2>
                                <p style={styles.cardLabel}>{card.label}</p>
                            </div>
                            <div style={{...styles.progressBarBase}}>
                                <div style={{...styles.progressBarFill, backgroundColor: card.accent, width: '60%'}}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Start Guide */}
                <div style={styles.infoBox}>
                    <div style={styles.infoHeader}>
                        <h3 style={styles.infoTitle}>Quick Start Guide</h3>
                        <span style={styles.badge}>Setup Required</span>
                    </div>
                    <div style={styles.stepsContainer}>
                        {[
                            "Set up your hospital profile",
                            "Register Operating Rooms",
                            "Onboard Staff members",
                            "Inventory Equipment",
                            "Create Surgery Requests",
                            "Run Scheduler Auto-assign",
                            "View Daily Calendar"
                        ].map((step, i) => (
                            <div key={i} className="guide-item" style={styles.stepItem}>
                                <div style={styles.stepNumber}>{i + 1}</div>
                                <span style={styles.stepText}>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Style System
const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc', // Slate 50
        padding: '32px 20px',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#334155',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        animation: 'fadeIn 0.6s ease-out',
    },
    // Header Styles
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '40px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '24px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#0f172a', // Slate 900
        margin: '0 0 8px 0',
        letterSpacing: '-0.025em',
    },
    subtitleWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '15px',
    },
    subtitleLabel: {
        color: '#64748b',
    },
    subtitleValue: {
        fontWeight: '600',
        color: '#0ea5e9', // Primary Blue
        backgroundColor: '#e0f2fe',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    actions: {
        display: 'flex',
        gap: '12px',
    },
    btnPrimary: {
        backgroundColor: '#0ea5e9',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    btnSecondary: {
        backgroundColor: 'white',
        color: '#475569',
        border: '1px solid #e2e8f0',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    // Grid Styles
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
    },
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid #f1f5f9',
        height: '100%',
        minHeight: '160px',
        animation: 'fadeIn 0.5s ease-out backwards',
    },
    cardHeader: {
        marginBottom: '16px',
    },
    iconBox: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
    },
    cardContent: {
        marginBottom: '16px',
    },
    cardValue: {
        fontSize: '36px',
        fontWeight: '800',
        margin: '0 0 4px 0',
        lineHeight: '1',
    },
    cardLabel: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0,
        fontWeight: '500',
    },
    progressBarBase: {
        height: '4px',
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: '2px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: '2px',
    },
    // Info Box Styles
    infoBox: {
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
    },
    infoHeader: {
        padding: '24px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fafbfc',
    },
    infoTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0f172a',
        margin: 0,
    },
    badge: {
        backgroundColor: '#fef3c7',
        color: '#b45309',
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '20px',
    },
    stepsContainer: {
        padding: '12px 0',
    },
    stepItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        gap: '16px',
        cursor: 'default',
        borderBottom: '1px solid #f8fafc',
    },
    stepNumber: {
        width: '28px',
        height: '28px',
        backgroundColor: '#e0f2fe',
        color: '#0284c7',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '700',
        flexShrink: 0,
    },
    stepText: {
        fontSize: '15px',
        color: '#475569',
    },
};

export default Dashboard;