// src/components/tables/StaffTable.jsx

const StaffTable = ({ data = [], onSelect }) => {
    if (data.length === 0) {
        return (
            <div style={styles.noData}>
                No staff members found. Add one to get started.
            </div>
        );
    }

    return (
        <div style={styles.tableWrapper}>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Specialization</th>
                    <th style={styles.th}>Max Hours/Day</th>
                    <th style={styles.th}>Status</th>
                    {onSelect && <th style={styles.th}>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((member) => (
                    <tr key={member.id} style={styles.tr}>
                        <td style={styles.td}>{member.id}</td>
                        <td style={styles.td}>{member.name}</td>
                        <td style={styles.td}>{member.role}</td>
                        <td style={styles.td}>{member.specialization}</td>
                        <td style={styles.td}>{member.max_hours_per_day}</td>
                        <td style={styles.td}>
                <span style={{
                    ...styles.badge,
                    backgroundColor: member.is_available ? '#d1fae5' : '#fee2e2',
                    color: member.is_available ? '#065f46' : '#991b1b',
                }}>
                  {member.is_available ? 'Available' : 'Busy'}
                </span>
                        </td>
                        {onSelect && (
                            <td style={styles.td}>
                                <button onClick={() => onSelect(member)} style={styles.actionButton}>
                                    View
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px',
    },
    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid #e5e7eb',
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        backgroundColor: '#f9fafb',
    },
    tr: {
        borderBottom: '1px solid #e5e7eb',
    },
    td: {
        padding: '12px',
        fontSize: '14px',
    },
    badge: {
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-block',
    },
    actionButton: {
        padding: '6px 12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    noData: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
    },
};

export default StaffTable;