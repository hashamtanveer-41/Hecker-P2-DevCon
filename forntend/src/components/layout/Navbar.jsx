// src/components/layout/Navbar.jsx

import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../../api/auth.api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { hospitalName } = useHospital();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            console.log('🚪 Logout initiated');

            // Try to call logout API (optional, backend might not have this)
            try {
                await authAPI.logout();
                console.log('✅ Backend logout successful');
            } catch (err) {
                console.warn('⚠️ Backend logout failed (might not exist), clearing local auth', err);
            }

            // Clear auth state in context
            logout();
            console.log('🗑️ Cleared local auth state');

            // Clear localStorage completely
            localStorage.clear();
            console.log('🗑️ Cleared localStorage');

            // Redirect to login
            console.log('📍 Redirecting to /login');
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('❌ Logout error:', err);
            // Force logout anyway
            logout();
            localStorage.clear();
            navigate('/login', { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div style={styles.navbar}>
            <div style={styles.left}>
                {hospitalName && (
                    <div style={styles.hospitalInfo}>
                        <span style={styles.hospitalLabel}>Hospital:</span>
                        <span style={styles.hospitalName}>{hospitalName}</span>
                    </div>
                )}
            </div>

            <div style={styles.right}>
                <div style={styles.userInfo}>
                    <span style={styles.userName}>{user?.name || user?.username}</span>
                    <span style={styles.userRole}>{user?.role}</span>
                </div>
                <button
                    onClick={handleLogout}
                    style={styles.logoutButton}
                    disabled={loggingOut}
                >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </div>
    );
};


const styles = {
    navbar: {
        height: '60px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
    },
    hospitalInfo: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    hospitalLabel: {
        fontSize: '14px',
        color: '#6b7280',
    },
    hospitalName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    userName: {
        fontSize: '14px',
        fontWeight: '500',
    },
    userRole: {
        fontSize: '12px',
        color: '#6b7280',
    },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default Navbar;