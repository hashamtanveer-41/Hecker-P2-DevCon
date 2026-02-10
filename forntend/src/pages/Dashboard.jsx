// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useHospital } from '../context/HospitalContext';
//
// API Imports
import { orAPI } from '../api/or.api';
import { staffAPI } from '../api/staff.api';
import { surgeryAPI } from '../api/surgery.api';
import { schedulerAPI } from '../api/scheduler.api';

// Material UI Components
import {
    Card,
    CardContent,
    Typography,
    Button,
    Avatar,
    Box,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Container,
    Stack
} from '@mui/material';

// Material UI Icons
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Dashboard = () => {
    const { hospitalName, hospitalId } = useHospital();

    // State for statistics
    const [stats, setStats] = useState({
        totalORs: 0,
        activeStaff: 0,
        pendingRequests: 0,
        scheduledToday: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Dashboard Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!hospitalId) return;

            setLoading(true);
            setError(null);

            try {
                // Fetch Operating Rooms
                const orsResponse = await orAPI.getAll();
                const ors = Array.isArray(orsResponse) ? orsResponse : orsResponse.data || [];

                // Fetch Staff
                const staffResponse = await staffAPI.getAll();
                const staffMembers = Array.isArray(staffResponse) ? staffResponse : staffResponse.data || [];

                // Fetch Surgery Requests
                const surgeryResponse = await surgeryAPI.getAll();
                const surgeries = Array.isArray(surgeryResponse) ? surgeryResponse : surgeryResponse.data || [];

                // Filter pending requests
                const pendingRequests = surgeries.filter(s => s.status === 'PENDING').length;

                // Get today's scheduled surgeries
                const today = new Date().toISOString().split('T')[0];
                const scheduledResponse = await schedulerAPI.getCalendarDay(today);
                const scheduledToday = scheduledResponse.schedules ? scheduledResponse.schedules.length : 0;

                // Update stats
                setStats({
                    totalORs: ors.length || 0,
                    activeStaff: staffMembers.length || 0,
                    pendingRequests: pendingRequests || 0,
                    scheduledToday: scheduledToday || 0,
                });

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard statistics');
                // Fallback to mock data on error
                setStats({
                    totalORs: 12,
                    activeStaff: 45,
                    pendingRequests: 8,
                    scheduledToday: 15,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [hospitalId]);

    // Data Configuration for Cards
    const statCards = [
        {
            label: 'Operating Rooms',
            value: stats.totalORs,
            icon: <LocalHospitalIcon />,
            color: '#2563eb', // Blue
            bgColor: '#eff6ff'
        },
        {
            label: 'Active Staff',
            value: stats.activeStaff,
            icon: <GroupsIcon />,
            color: '#0ea5e9', // Sky
            bgColor: '#e0f2fe'
        },
        {
            label: 'Pending Requests',
            value: stats.pendingRequests,
            icon: <AssignmentIcon />,
            color: '#f97316', // Orange
            bgColor: '#fff7ed'
        },
        {
            label: 'Scheduled Today',
            value: stats.scheduledToday,
            icon: <ScheduleIcon />,
            color: '#7c3aed', // Violet
            bgColor: '#f5f3ff'
        },
    ];

    const guideSteps = [
        "Setup hospital profile in settings",
        "Add Operating Rooms to inventory",
        "Register Medical Staff & Surgeons",
        "Catalog Medical Equipment",
        "Create new Surgery Requests",
        "Run Auto-Scheduler engine",
        "Review Daily Calendar"
    ];

    return (
        // Tailwind: Page Background & Layout
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <Container maxWidth="xl">

                {/* --- ERROR MESSAGE --- */}
                {error && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: '#fee2e2', border: '1px solid #fecaca', borderRadius: 2, color: '#991b1b' }}>
                        <Typography variant="body2">
                            ⚠️ {error}
                        </Typography>
                    </Box>
                )}

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mb: 1 }}>
                            Dashboard
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: '#64748b' }}>
                            Overview for <strong>{hospitalName || 'Main Hospital'}</strong>
                        </Typography>
                    </div>

                    <Stack direction="row" spacing={2}>
                        {/* MUI Buttons with Tailwind styling wrappers if needed */}
                        <Button
                            variant="outlined"
                            startIcon={<CalendarMonthIcon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: '#e2e8f0',
                                color: '#475569',
                                '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
                            }}
                        >
                            View Calendar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                backgroundColor: '#0f172a',
                                '&:hover': { backgroundColor: '#334155' },
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            Create Request
                        </Button>
                    </Stack>
                </div>

                {/* --- LOADING STATE --- */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                        <Typography variant="body1" sx={{ color: '#64748b' }}>
                            Loading dashboard statistics...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* --- STATS GRID --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {statCards.map((card, index) => (
                                <Card
                                    key={index}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <div className="flex justify-between items-start mb-4">
                                            <Avatar variant="rounded" sx={{ bgcolor: card.bgColor, color: card.color, width: 48, height: 48 }}>
                                                {card.icon}
                                            </Avatar>
                                        </div>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                                            {card.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                            {card.label}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* --- QUICK START SECTION --- */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 0,
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#ffffff' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                    Quick Start Guide
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    Complete these steps to get your hospital running efficiently.
                                </Typography>
                            </Box>

                            <div className="bg-white p-2">
                                <List>
                                    {guideSteps.map((step, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: '#0f172a', width: 32, height: 32, fontSize: '0.875rem', fontWeight: 'bold' }}>
                                                        {index + 1}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#334155' }}>
                                                            {step}
                                                        </Typography>
                                                    }
                                                />
                                                <CheckCircleIcon sx={{ color: '#cbd5e1' }} />
                                            </ListItem>
                                            {index < guideSteps.length - 1 && <Divider component="li" variant="inset" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </div>
                        </Paper>
                    </>
                )}

            </Container>
        </div>
    );
};

export default Dashboard;