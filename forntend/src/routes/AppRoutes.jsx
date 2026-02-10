// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../auth/Login';
import ProtectedRoute from '../auth/ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages (we'll create these next)
import Dashboard from '../pages/Dashboard';
import Hospitals from '../pages/Hospitals';
import OperatingRooms from '../pages/OperatingRooms';
import Staff from '../pages/Staff';
import Equipment from '../pages/Equipment';
import SurgeryRequests from '../pages/SurgeryRequests';
import Scheduler from '../pages/Scheduler';
import Calendar from '../pages/Calendar';
import PriorityQueue from '../pages/PriorityQueue';
import AuditLogs from '../pages/AuditLogs';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="hospitals" element={<Hospitals />} />
                <Route path="operating-rooms" element={<OperatingRooms />} />
                <Route path="staff" element={<Staff />} />
                <Route path="equipment" element={<Equipment />} />
                <Route path="surgery-requests" element={<SurgeryRequests />} />
                <Route path="scheduler" element={<Scheduler />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="priority-queue" element={<PriorityQueue />} />
                <Route path="audit-logs" element={<AuditLogs />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;