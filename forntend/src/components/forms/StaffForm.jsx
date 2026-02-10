// src/components/forms/StaffForm.jsx

import { useForm } from 'react-hook-form';

const StaffForm = ({ onSubmit, loading = false, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    style={styles.input}
                    placeholder="e.g., Dr. John Smith"
                />
                {errors.name && <span style={styles.error}>{errors.name.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Role *</label>
                <select
                    {...register('role', { required: 'Role is required' })}
                    style={styles.input}
                >
                    <option value="">Select role</option>
                    <option value="SURGEON">Surgeon</option>
                    <option value="ANESTHESIOLOGIST">Anesthesiologist</option>
                    <option value="NURSE">Nurse</option>
                    <option value="TECHNICIAN">Technician</option>
                </select>
                {errors.role && <span style={styles.error}>{errors.role.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Specialization *</label>
                <input
                    type="text"
                    {...register('specialization', { required: 'Specialization is required' })}
                    style={styles.input}
                    placeholder="e.g., Cardiology, Neurology"
                />
                {errors.specialization && <span style={styles.error}>{errors.specialization.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Max Hours Per Day *</label>
                <input
                    type="number"
                    {...register('max_hours_per_day', {
                        required: 'Max hours is required',
                        min: { value: 1, message: 'Must be at least 1' },
                        max: { value: 16, message: 'Cannot exceed 16' },
                    })}
                    style={styles.input}
                    placeholder="e.g., 12"
                    defaultValue={12}
                />
                {errors.max_hours_per_day && <span style={styles.error}>{errors.max_hours_per_day.message}</span>}
            </div>

            <div style={styles.actions}>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Creating...' : 'Add Staff Member'}
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

export default StaffForm;