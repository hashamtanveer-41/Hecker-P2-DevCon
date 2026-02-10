// src/components/forms/SurgeryForm.jsx

import { useForm } from 'react-hook-form';

const SurgeryForm = ({ onSubmit, loading = false, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.formRow}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Patient Name *</label>
                    <input
                        type="text"
                        {...register('patient_name', { required: 'Patient name is required' })}
                        style={styles.input}
                        placeholder="e.g., John Doe"
                    />
                    {errors.patient_name && <span style={styles.error}>{errors.patient_name.message}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Patient Age *</label>
                    <input
                        type="number"
                        {...register('patient_age', {
                            required: 'Age is required',
                            min: { value: 0, message: 'Invalid age' },
                        })}
                        style={styles.input}
                        placeholder="e.g., 45"
                    />
                    {errors.patient_age && <span style={styles.error}>{errors.patient_age.message}</span>}
                </div>
            </div>

            <div style={styles.formRow}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Procedure *</label>
                    <input
                        type="text"
                        {...register('procedure', { required: 'Procedure is required' })}
                        style={styles.input}
                        placeholder="e.g., CABG, Appendectomy"
                    />
                    {errors.procedure && <span style={styles.error}>{errors.procedure.message}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Priority *</label>
                    <select
                        {...register('priority', { required: 'Priority is required' })}
                        style={styles.input}
                    >
                        <option value="">Select priority</option>
                        <option value="NORMAL">Normal</option>
                        <option value="URGENT">Urgent</option>
                        <option value="EMERGENCY">Emergency</option>
                    </select>
                    {errors.priority && <span style={styles.error}>{errors.priority.message}</span>}
                </div>
            </div>

            <div style={styles.formRow}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Complexity Level (1-5) *</label>
                    <input
                        type="number"
                        {...register('complexity_level', {
                            required: 'Complexity is required',
                            min: { value: 1, message: 'Min 1' },
                            max: { value: 5, message: 'Max 5' },
                        })}
                        style={styles.input}
                        placeholder="1-5"
                        defaultValue={3}
                    />
                    {errors.complexity_level && <span style={styles.error}>{errors.complexity_level.message}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Duration (minutes) *</label>
                    <input
                        type="number"
                        {...register('estimated_duration_minutes', {
                            required: 'Duration is required',
                            min: { value: 15, message: 'Min 15 minutes' },
                        })}
                        style={styles.input}
                        placeholder="e.g., 120"
                    />
                    {errors.estimated_duration_minutes && (
                        <span style={styles.error}>{errors.estimated_duration_minutes.message}</span>
                    )}
                </div>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Required Specialization *</label>
                <input
                    type="text"
                    {...register('required_specialization', { required: 'Specialization is required' })}
                    style={styles.input}
                    placeholder="e.g., Cardiology"
                />
                {errors.required_specialization && (
                    <span style={styles.error}>{errors.required_specialization.message}</span>
                )}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Equipment Required (comma-separated) *</label>
                <input
                    type="text"
                    {...register('equipment_required', { required: 'Equipment is required' })}
                    style={styles.input}
                    placeholder="e.g., Cardiac Monitor, Defibrillator"
                />
                {errors.equipment_required && (
                    <span style={styles.error}>{errors.equipment_required.message}</span>
                )}
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Anesthesia Type *</label>
                <select
                    {...register('anesthesia_type', { required: 'Anesthesia type is required' })}
                    style={styles.input}
                >
                    <option value="">Select type</option>
                    <option value="General">General</option>
                    <option value="Regional">Regional</option>
                    <option value="Local">Local</option>
                </select>
                {errors.anesthesia_type && (
                    <span style={styles.error}>{errors.anesthesia_type.message}</span>
                )}
            </div>

            <div style={styles.actions}>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? 'Creating...' : 'Create Request'}
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
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
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

export default SurgeryForm;