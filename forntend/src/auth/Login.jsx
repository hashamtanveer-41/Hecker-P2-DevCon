import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth.api';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(
                data.username,
                data.password
            );

            const token = response.access;
            const user = {
                username: data.username,
                role: response.role,
            };

            login(user, token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Hospital OR Scheduler</h1>
                <p style={styles.subtitle}>Intelligent Operating Room Management</p>

                <div style={styles.divider}>OR</div>

                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            {...register('username', { required: 'Username is required' })}
                            style={styles.input}
                        />
                        {errors.username && (
                            <span style={styles.error}>{errors.username.message}</span>
                        )}
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            style={styles.input}
                        />
                        {errors.password && (
                            <span style={styles.error}>{errors.password.message}</span>
                        )}
                    </div>

                    {error && <div style={styles.errorBox}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Secured with JWT & HttpOnly Cookies 🔒
                </p>
            </div>
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        marginBottom: '30px',
    },
    biometricButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    divider: {
        textAlign: 'center',
        margin: '20px 0',
        color: '#999',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        marginBottom: '6px',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
    },
    error: {
        color: 'red',
        fontSize: '12px',
        marginTop: '4px',
    },
    errorBox: {
        backgroundColor: '#fee',
        color: 'red',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '14px',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    footer: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#999',
        marginTop: '20px',
    },
};
export default Login;
