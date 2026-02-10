// src/components/layout/Sidebar.jsx

import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/hospitals', label: 'Hospitals', icon: '🏥' },
        { path: '/operating-rooms', label: 'Operating Rooms', icon: '🏗️' },
        { path: '/staff', label: 'Staff', icon: '👨‍⚕️' },
        { path: '/equipment', label: 'Equipment', icon: '🔧' },
        { path: '/surgery-requests', label: 'Surgery Requests', icon: '📋' },
        { path: '/scheduler', label: 'Scheduler', icon: '🤖' },
        { path: '/calendar', label: 'Calendar', icon: '📅' },
        { path: '/priority-queue', label: 'Priority Queue', icon: '🚨' },
        { path: '/audit-logs', label: 'Audit Logs', icon: '📜' },
    ];

    return (
        <div style={styles.sidebar}>
            <div style={styles.logo}>
                <h2 style={styles.logoText}>OR Scheduler</h2>
            </div>

            <nav style={styles.nav}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.navLinkActive : {}),
                        })}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        backgroundColor: '#1e293b',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
    },
    logo: {
        padding: '20px',
        borderBottom: '1px solid #334155',
    },
    logoText: {
        margin: 0,
        fontSize: '20px',
        fontWeight: 'bold',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0',
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        color: '#cbd5e1',
        textDecoration: 'none',
        transition: 'all 0.2s',
        gap: '12px',
    },
    navLinkActive: {
        backgroundColor: '#334155',
        color: 'white',
        borderLeft: '3px solid #3b82f6',
    },
    icon: {
        fontSize: '18px',
    },
};

export default Sidebar;