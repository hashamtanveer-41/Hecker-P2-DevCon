// src/components/common/Input.jsx

import { forwardRef } from 'react';

const Input = forwardRef(({
                              label,
                              error,
                              type = 'text',
                              placeholder = '',
                              ...props
                          }, ref) => {
    return (
        <div style={styles.container}>
            {label && <label style={styles.label}>{label}</label>}
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                style={{
                    ...styles.input,
                    ...(error ? styles.inputError : {}),
                }}
                {...props}
            />
            {error && <span style={styles.error}>{error}</span>}
        </div>
    );
});

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#374151',
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    error: {
        color: '#ef4444',
        fontSize: '12px',
        marginTop: '4px',
    },
};

Input.displayName = 'Input';

export default Input;