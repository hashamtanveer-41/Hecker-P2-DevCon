// src/components/forms/HospitalForm.jsx

import { useForm } from 'react-hook-form';

const HospitalForm = ({ onSubmit, loading = false, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Hospital Name *</label>
                <input
                    type="text"
                    {...register('name', { required: 'Hospital name is required' })}
                    style={styles.input}
                    placeholder="e.g., City General Hospital"
                />
                {errors.name && <span style={styles.error}>{errors.name.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Location *</label>
                <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    style={styles.input}
                    placeholder="e.g., New York, NY"
                />
                {errors.location && <span style={styles.error}>{errors.location.message}</span>}
            </div>

            <div style={styles.actions}>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Creating...' : 'Create Hospital'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} style={styles.cancelButton}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

const styles = {
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
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '14px',
    },
    error: {
        color: '#ef4444',
        fontSize: '12px',
        marginTop: '4px',
    },
    actions: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    submitButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
    },
    cancelButton: {
        padding: '12px 24px',
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default HospitalForm;