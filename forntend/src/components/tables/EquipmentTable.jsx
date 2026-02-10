// src/components/tables/EquipmentTable.jsx

const EquipmentTable = ({ data = [], onSterilize }) => {
    if (data.length === 0) {
        return (
            <div style={styles.noData}>
                No equipment found. Add one to get started.
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
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Sterilization (hrs)</th>
                    <th style={styles.th}>Status</th>
                    {onSterilize && <th style={styles.th}>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                        <td style={styles.td}>{item.id}</td>
                        <td style={styles.td}>{item.name}</td>
                        <td style={styles.td}>{item.type}</td>
                        <td style={styles.td}>{item.sterilization_cycle_hours}</td>
                        <td style={styles.td}>
                <span style={{
                    ...styles.badge,
                    backgroundColor: item.is_available ? '#d1fae5' : '#fef3c7',
                    color: item.is_available ? '#065f46' : '#92400e',
                }}>
                  {item.is_available ? 'Available' : 'In Use/Sterilizing'}
                </span>
                        </td>
                        {onSterilize && (
                            <td style={styles.td}>
                                <button
                                    onClick={() => onSterilize(item.id)}
                                    style={styles.actionButton}
                                    disabled={!item.is_available}
                                >
                                    Sterilize
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
        minWidth: '700px',
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
        backgroundColor: '#8b5cf6',
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

export default EquipmentTable;