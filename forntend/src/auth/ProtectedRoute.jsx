// src/auth/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        console.log('🔐 ProtectedRoute state:', {
            isAuthenticated,
            loading,
        });

        if (!isAuthenticated && !loading) {
            console.log('❌ Not authenticated, will redirect to login');
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('🚪 Redirecting to login - not authenticated');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;