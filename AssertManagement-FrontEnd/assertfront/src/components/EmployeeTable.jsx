import React from 'react';

/**
 * @param {Object[]} employees - List of employee objects.
 * @param {Function} onEdit - Callback when the Edit button is clicked.
 * @param {Function} onDelete - Callback when the Delete button is clicked.
 */
export default function EmployeeTable({ employees = [], onEdit, onDelete }) {
  if (!Array.isArray(employees) || employees.length === 0) {
    return (
      <p className="text-white-50 my-3">
        No employees found.
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped table-hover align-middle mb-0">
        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
          <tr>
            <th style={{ width: 60 }}>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: 120 }}>Role</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employeeID}>
              <td>{emp.employeeID}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-light me-2"
                  onClick={() => onEdit(emp)}
                  aria-label={`Edit ${emp.name}`}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(emp.employeeID)}
                  aria-label={`Delete ${emp.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
