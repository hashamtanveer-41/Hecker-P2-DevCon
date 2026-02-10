// src/components/common/Loader.jsx

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
    const sizes = {
        small: 20,
        medium: 40,
        large: 60,
    };

    const spinnerSize = sizes[size];

    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.spinner,
                    width: spinnerSize,
                    height: spinnerSize,
                    borderWidth: spinnerSize / 10,
                }}
            />
            {text && <p style={styles.text}>{text}</p>}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
    },
    spinner: {
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    text: {
        marginTop: '16px',
        color: '#6b7280',
        fontSize: '14px',
    },
};

// Add keyframes animation
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Loader;