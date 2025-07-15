import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import EmployeeTable from '../../components/EmployeeTable';
import AddEditEmployeeForm from '../../components/AddEditEmployeeForm';


export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [addBtnHover, setAddBtnHover] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ─────── Fetch Employees ───────
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/Employee');
      const list =
        Array.isArray(res.data) ? res.data :
        Array.isArray(res.data?.$values) ? res.data.$values :
        Array.isArray(res.data?.data) ? res.data.data : [];
      setEmployees(list);
      setFiltered(list);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployees([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    const query = searchText.toLowerCase();
    const result = employees.filter((emp) =>
      (emp.name?.toLowerCase().includes(query) ||
        emp.employeeID?.toString().includes(query)) &&
      (selectedCategory === 'All' || emp.role === selectedCategory)
    );
    setFiltered(result);
  }, [searchText, selectedCategory, employees]);

  const uniqueRoles = ['All', ...new Set(employees.map((e) => e.role || ''))];

  // ─────── Handlers ───────
  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await axiosInstance.delete(`/Employee/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    fetchEmployees();
  };

  // ─────── Styles ───────
  const styles = {
    header: {
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      padding: '1rem 1.5rem',
      boxShadow: '0 0 24px rgba(0,0,0,0.3)',
    },
    card: {
      background: 'rgba(0,0,0,.55)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
    },
    input: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.15)',
      outline: 'none',
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#fff',
      width: '240px',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(255,255,255,0.05)',
    },
    inputFocus: {
      borderColor: '#66b2ff',
      boxShadow: '0 0 8px rgba(102,178,255,0.5)',
    },
    select: {
      padding: '10px 16px',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.15)',
      outline: 'none',
      backgroundColor: '#000000ff',
      color: '#fff',
      width: '180px',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(255,255,255,0.05)',
      appearance: 'none',
      paddingRight: '2.2rem',
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg width='16' height='16' fill='white' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '1rem',
      cursor: 'pointer',
    },
    addBtn: {
      padding: '10px 16px',
      fontSize: '15px',
      borderRadius: '12px',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      background: 'linear-gradient(90deg, #0d6efd, #0a58ca)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 3px 10px rgba(13,110,253,0.35)',
    },
    addBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(13,110,253,0.5)',
    },
  };

  // ─────── Render ───────
  return (
    <div className="p-3">
      {/* Header Section */}
      <div
        style={styles.header}
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3"
      >
        <h4 className="m-0 text-white-50 fw-semibold">Employee Management</h4>

        <div className="d-flex flex-wrap gap-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            style={{
              ...styles.input,
              ...(inputFocus ? styles.inputFocus : {}),
            }}
          />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.select}
          >
            {uniqueRoles.map((role, idx) => (
              <option key={idx} value={role}>
                {role || 'Unassigned'}
              </option>
            ))}
          </select>

          {/* Add Button */}
          <button
            style={{
              ...styles.addBtn,
              ...(addBtnHover ? styles.addBtnHover : {}),
            }}
            onMouseEnter={() => setAddBtnHover(true)}
            onMouseLeave={() => setAddBtnHover(false)}
            onClick={handleAdd}
          >
            + Add Employee
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div style={styles.card} className="p-3">
        {loading ? (
          <div className="text-white-50 text-center py-4 fs-5">
            Loading employees...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-white-50 text-center py-4 fs-5">
            No employees found.
          </div>
        ) : (
          <EmployeeTable
            employees={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <AddEditEmployeeForm
          employee={selectedEmployee}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}