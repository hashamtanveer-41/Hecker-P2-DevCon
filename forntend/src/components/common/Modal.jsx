// src/components/common/Modal.jsx

import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, width = '500px' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div
                style={{ ...styles.modal, width }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={styles.header}>
                    <h3 style={styles.title}>{title}</h3>
                    <button style={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div style={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflow: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        fontWeight: '600',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#6b7280',
        padding: 0,
        width: '30px',
        height: '30px',
    },
    content: {
        padding: '20px',
    },
};

export default Modal;