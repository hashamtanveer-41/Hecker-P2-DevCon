// src/components/forms/ORForm.jsx

import { useForm } from 'react-hook-form';

const ORForm = ({ onSubmit, loading = false, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>OR Name *</label>
                <input
                    type="text"
                    {...register('name', { required: 'OR name is required' })}
                    style={styles.input}
                    placeholder="e.g., OR-Cardiac-1"
                />
                {errors.name && <span style={styles.error}>{errors.name.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>OR Type *</label>
                <select
                    {...register('type', { required: 'OR type is required' })}
                    style={styles.input}
                >
                    <option value="">Select type</option>
                    <option value="General">General</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Neuro">Neuro</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Pediatric">Pediatric</option>
                </select>
                {errors.type && <span style={styles.error}>{errors.type.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Capabilities (comma-separated) *</label>
                <input
                    type="text"
                    {...register('capabilities', { required: 'Capabilities are required' })}
                    style={styles.input}
                    placeholder="e.g., Heart Surgery, CABG, Valve Replacement"
                />
                {errors.capabilities && <span style={styles.error}>{errors.capabilities.message}</span>}
            </div>

            <div style={styles.actions}>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Creating...' : 'Create Operating Room'}
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

export default ORForm;