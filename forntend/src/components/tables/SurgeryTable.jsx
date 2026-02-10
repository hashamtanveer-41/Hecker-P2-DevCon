// src/components/tables/SurgeryTable.jsx

const SurgeryTable = ({ data = [], onApprove, onView }) => {
    if (data.length === 0) {
        return (
            <div style={styles.noData}>
                No surgery requests found. Create one to get started.
            </div>
        );
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'EMERGENCY':
                return { bg: '#fee2e2', color: '#991b1b' };
            case 'URGENT':
                return { bg: '#fef3c7', color: '#92400e' };
            case 'NORMAL':
                return { bg: '#dbeafe', color: '#1e40af' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return { bg: '#d1fae5', color: '#065f46' };
            case 'PENDING':
                return { bg: '#fef3c7', color: '#92400e' };
            case 'REJECTED':
                return { bg: '#fee2e2', color: '#991b1b' };
            case 'SCHEDULED':
                return { bg: '#dbeafe', color: '#1e40af' };
            default:
                return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    return (
        <div style={styles.tableWrapper}>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Procedure</th>
                    <th style={styles.th}>Priority</th>
                    <th style={styles.th}>Complexity</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {data.map((request) => {
                    const priorityStyle = getPriorityColor(request.priority);
                    const statusStyle = getStatusColor(request.status);

                    return (
                        <tr key={request.id} style={styles.tr}>
                            <td style={styles.td}>{request.id}</td>
                            <td style={styles.td}>{request.patient_name}</td>
                            <td style={styles.td}>{request.procedure}</td>
                            <td style={styles.td}>
                  <span style={{
                      ...styles.badge,
                      backgroundColor: priorityStyle.bg,
                      color: priorityStyle.color,
                  }}>
                    {request.priority}
                  </span>
                            </td>
                            <td style={styles.td}>{request.complexity_level}/5</td>
                            <td style={styles.td}>{request.estimated_duration_minutes} min</td>
                            <td style={styles.td}>
                  <span style={{
                      ...styles.badge,
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                  }}>
                    {request.status}
                  </span>
                            </td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    {onView && (
                                        <button onClick={() => onView(request)} style={styles.viewButton}>
                                            View
                                        </button>
                                    )}
                                    {onApprove && request.status === 'PENDING' && (
                                        <button onClick={() => onApprove(request.id)} style={styles.approveButton}>
                                            Approve
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
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
        minWidth: '1000px',
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
    actions: {
        display: 'flex',
        gap: '8px',
    },
    viewButton: {
        padding: '6px 12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    },
    approveButton: {
        padding: '6px 12px',
        backgroundColor: '#10b981',
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

export default SurgeryTable;