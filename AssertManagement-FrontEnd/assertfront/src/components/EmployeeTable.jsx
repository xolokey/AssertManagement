import React from 'react';

/**
 * @param {Object[]} employees - List of employee objects.
 * @param {Function} onEdit - Callback when Edit is clicked.
 * @param {Function} onDelete - Callback when Delete is clicked.
 */
export default function EmployeeTable({ employees = [], onEdit, onDelete }) {
  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <div style={styles.empty}>
        <i className="bi bi-people" style={styles.emptyIcon}></i>
        No employees found.
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              {['ID', 'Name', 'Email', 'Role', 'Actions'].map((head, i) => (
                <th key={i} style={styles.th}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr
                key={emp.employeeID}
                style={{
                  ...styles.row,
                  background:
                    idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow =
                    '0 0 10px rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'scale(1.003)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    idx % 2 === 0
                      ? 'rgba(255,255,255,0.02)'
                      : 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <td style={styles.td}>{emp.employeeID}</td>
                <td style={styles.td}>{emp.name || '—'}</td>
                <td style={styles.td}>{emp.email || '—'}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.roleBadge,
                      background: emp.role === 'Admin'
                        ? 'linear-gradient(45deg, #00f2fe, #4facfe)'
                        : 'linear-gradient(45deg, #6a11cb, #2575fc)',
                    }}
                  >
                    {emp.role || '—'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => onEdit?.(emp)}
                      style={styles.editBtn}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'linear-gradient(to right, #0dcaf0, #00b4d8)';
                        e.currentTarget.style.color = '#000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#0dcaf0';
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(emp.employeeID)}
                      style={styles.deleteBtn}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.07)';
                        e.currentTarget.style.boxShadow =
                          '0 0 10px rgba(220,53,69,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────── Styles ──────────────
const styles = {
  card: {
    borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.1)',
    overflowX: 'auto',
    marginTop: '1rem',
  },
  tableWrapper: {
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
    color: '#fff',
    minWidth: '700px',
  },
  headerRow: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(12px)',
    color: '#fff',
    textAlign: 'left',
  },
  th: {
    padding: '16px 22px',
    fontWeight: '700',
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  row: {
    transition: 'all 0.3s ease',
  },
  td: {
    padding: '16px 22px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    verticalAlign: 'middle',
  },
  roleBadge: {
    padding: '6px 14px',
    borderRadius: '40px',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    color: '#fff',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    display: 'inline-block',
    minWidth: 80,
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  editBtn: {
    background: 'transparent',
    border: '1px solid #0dcaf0',
    color: '#0dcaf0',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  deleteBtn: {
    background: '#dc3545',
    border: 'none',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
  empty: {
    color: '#ccc',
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1rem',
  },
  emptyIcon: {
    fontSize: 24,
    marginRight: 8,
  },
};
