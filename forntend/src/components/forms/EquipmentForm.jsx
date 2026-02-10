// src/components/forms/EquipmentForm.jsx

import { useForm } from 'react-hook-form';

const EquipmentForm = ({ onSubmit, loading = false, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Equipment Name *</label>
                <input
                    type="text"
                    {...register('name', { required: 'Equipment name is required' })}
                    style={styles.input}
                    placeholder="e.g., Cardiac Monitor XR-500"
                />
                {errors.name && <span style={styles.error}>{errors.name.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Type *</label>
                <select
                    {...register('type', { required: 'Type is required' })}
                    style={styles.input}
                >
                    <option value="">Select type</option>
                    <option value="Surgical Instrument">Surgical Instrument</option>
                    <option value="Monitoring Device">Monitoring Device</option>
                    <option value="Anesthesia Machine">Anesthesia Machine</option>
                    <option value="Imaging Equipment">Imaging Equipment</option>
                    <option value="Life Support">Life Support</option>
                </select>
                {errors.type && <span style={styles.error}>{errors.type.message}</span>}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Sterilization Cycle Hours *</label>
                <input
                    type="number"
                    {...register('sterilization_cycle_hours', {
                        required: 'Sterilization cycle is required',
                        min: { value: 1, message: 'Must be at least 1 hour' },
                    })}
                    style={styles.input}
                    placeholder="e.g., 2"
                    defaultValue={2}
                />
                {errors.sterilization_cycle_hours && (
                    <span style={styles.error}>{errors.sterilization_cycle_hours.message}</span>
                )}
            </div>

            <div style={styles.actions}>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Creating...' : 'Add Equipment'}
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

export default EquipmentForm;