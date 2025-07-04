// src/pages/Admin/EmployeeManagement.js
import React, { useEffect, useState } from 'react';
import axiosInstance          from '../../api/axiosInstance';
import EmployeeTable          from '../../components/EmployeeTable';
import AddEditEmployeeForm    from '../../components/AddEditEmployeeForm';

export default function EmployeeManagement() {
  const [employees,        setEmployees]        = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm,         setShowForm]         = useState(false);

  /* ───────────────── fetch all employees ───────────────── */
  const fetchEmployees = async () => {
    try {
      const res  = await axiosInstance.get('/Employee');
      const list =
          Array.isArray(res.data)          ? res.data
        : Array.isArray(res.data?.$values) ? res.data.$values
        : Array.isArray(res.data?.data)    ? res.data.data
        : [];
      setEmployees(list);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployees([]);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  /* ───────────────── handlers ───────────────── */
  const handleEdit   = (emp) => { setSelectedEmployee(emp);   setShowForm(true); };
  const handleAdd    = ()   => { setSelectedEmployee(null);   setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await axiosInstance.delete(`/Employee/${id}`);
      fetchEmployees();
    } catch (err) { console.error('Delete failed:', err); }
  };

  const handleFormClose = () => { setShowForm(false); fetchEmployees(); };

  /* ───────────────── styles ───────────────── */
  const styles = {
    header: {
      background   : 'rgba(0,0,0,.60)',
      backdropFilter: 'blur(6px)',
      borderRadius : '12px',
      padding      : '1rem 1.25rem',
    },
    addBtn: {
      transition : 'transform .15s, box-shadow .15s',
    },
    card: {
      background   : 'rgba(0,0,0,.55)',
      backdropFilter: 'blur(8px)',
      borderRadius : '12px',
    },
  };

  /* ───────────────── render ───────────────── */
  return (
    <div className="p-3">

      {/* glass header bar */}
      <div
        style={styles.header}
        className="d-flex justify-content-between align-items-center mb-3"
      >
        <h4 className="m-0 text-white-50 fw-semibold">Employee Management</h4>

        <button
          className="btn btn-primary"
          style={styles.addBtn}
          onMouseEnter={e=>{
            e.currentTarget.style.transform='translateY(-1px)';
            e.currentTarget.style.boxShadow='0 4px 12px rgba(13,110,253,.45)';
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.transform='';
            e.currentTarget.style.boxShadow='';
          }}
          onClick={handleAdd}
        >
          + Add Employee
        </button>
      </div>

      {/* table in frosted card */}
      <div style={styles.card} className="p-3">
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* slide‑in / modal‑like form */}
      {showForm && (
        <AddEditEmployeeForm
          employee={selectedEmployee}
          onClose={handleFormClose}
        />
      )}

    </div>
  );
}
