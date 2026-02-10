// src/components/common/Button.jsx

const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'primary',
                    disabled = false,
                    style = {},
                    ...props
                }) => {
    const variants = {
        primary: {
            backgroundColor: '#3b82f6',
            color: 'white',
        },
        secondary: {
            backgroundColor: '#6b7280',
            color: 'white',
        },
        success: {
            backgroundColor: '#10b981',
            color: 'white',
        },
        danger: {
            backgroundColor: '#ef4444',
            color: 'white',
        },
        warning: {
            backgroundColor: '#f59e0b',
            color: 'white',
        },
    };

    const baseStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s',
        ...variants[variant],
        ...style,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={baseStyle}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;