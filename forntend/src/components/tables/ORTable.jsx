// src/components/tables/ORTable.jsx

const ORTable = ({ data = [], onSelect }) => {
    if (data.length === 0) {
        return (
            <div style={styles.noData}>
                No operating rooms found. Create one to get started.
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
                    <th style={styles.th}>Capabilities</th>
                    <th style={styles.th}>Status</th>
                    {onSelect && <th style={styles.th}>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {data.map((or) => (
                    <tr key={or.id} style={styles.tr}>
                        <td style={styles.td}>{or.id}</td>
                        <td style={styles.td}>{or.name}</td>
                        <td style={styles.td}>{or.type}</td>
                        <td style={styles.td}>
                            {Array.isArray(or.capabilities) ? or.capabilities.join(', ') : or.capabilities}
                        </td>
                        <td style={styles.td}>
                <span style={{
                    ...styles.badge,
                    backgroundColor: or.is_available ? '#d1fae5' : '#fee2e2',
                    color: or.is_available ? '#065f46' : '#991b1b',
                }}>
                  {or.is_available ? 'Available' : 'Occupied'}
                </span>
                        </td>
                        {onSelect && (
                            <td style={styles.td}>
                                <button onClick={() => onSelect(or)} style={styles.actionButton}>
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

export default ORTable;