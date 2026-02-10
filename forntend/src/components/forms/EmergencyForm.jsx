// src/components/forms/EmergencyForm.jsx

import { useForm } from 'react-hook-form';

const EmergencyForm = ({ onSubmit, loading = false, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Surgery Request ID *</label>
                <input
                    type="number"
                    {...register('surgery_request_id', {
                        required: 'Surgery request ID is required',
                        min: { value: 1, message: 'Invalid ID' },
                    })}
                    style={styles.input}
                    placeholder="Enter surgery request ID"
                />
                {errors.surgery_request_id && (
                    <span style={styles.error}>{errors.surgery_request_id.message}</span>
                )}
            </div>

            <div style={styles.warning}>
                ⚠️ This will reschedule other surgeries if needed. Use only for genuine emergencies.
            </div>

            <div style={styles.actions}>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Processing...' : 'Schedule Emergency'}
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
    warning: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        padding: '12px',
        borderRadius: '4px',
        fontSize: '14px',
    },
    actions: {
        display: 'flex',
        gap: '12px',
        marginTop: '8px',
    },
    submitButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#ef4444',
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

export default EmergencyForm;