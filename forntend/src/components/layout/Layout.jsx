// src/components/layout/Layout.jsx

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.main}>
                <Navbar />
                <div style={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 1,
        padding: '24px',
        backgroundColor: '#f9fafb',
        overflowY: 'auto',
    },
};

export default Layout;