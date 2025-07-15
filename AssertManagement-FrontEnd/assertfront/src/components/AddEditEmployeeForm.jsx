import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AddEditEmployeeForm({ employee, onClose }) {
  const [form, setForm] = useState({
    name: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    password: '',
    role: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const firstInputRef = useRef();

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        gender: employee.gender || '',
        contactNumber: employee.contactNumber || '',
        email: employee.email || '',
        address: employee.address || '',
        password: '',
        role: employee.role || '',
      });
    }
    setTimeout(() => firstInputRef.current?.focus(), 150);
  }, [employee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'gender', 'contactNumber', 'email', 'address', 'role'];
    if (!employee) requiredFields.push('password');
    const emptyFields = requiredFields.filter((field) => !form[field]?.trim());
    if (emptyFields.length > 0) {
      setErrorMsg(`Please fill all required fields:\n• ${emptyFields.join('\n• ')}`);
      return;
    }

    try {
      if (employee) {
        await axiosInstance.put(`/Employee/${employee.employeeID}`, {
          Name: form.name,
          Gender: form.gender,
          ContactNumber: form.contactNumber,
          Email: form.email,
          Address: form.address,
          PasswordHash: form.password || undefined,
          Role: form.role,
        });
      } else {
        await axiosInstance.post('/Employee', {
          Name: form.name,
          Gender: form.gender,
          ContactNumber: form.contactNumber,
          Email: form.email,
          Address: form.address,
          Password: form.password,
          Role: form.role,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(`Save failed:\n${err.response?.data || err.message}`);
    }
  };

  // Styles
  const inputStyle = {
    background: 'rgba(20, 20, 30, 0.85)',
    color: '#f5f5f5',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '10px 14px',
    width: '100%',
    marginTop: '5px',
    fontSize: '0.95rem',
    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.5)',
    transition: '0.3s',
  };

  const labelStyle = {
    color: '#c4c4c4',
    fontWeight: 600,
    fontSize: '0.88rem',
    textShadow: '0 0 4px rgba(255,255,255,0.05)',
  };

  const selectStyle = {
    ...inputStyle,
    backgroundImage:
      'linear-gradient(45deg, #121212, #1d1d2e), url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill=\'%23aaa\' d=\'M6 8L0 0h12L6 8z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '12px 8px',
    appearance: 'none',
    paddingRight: '38px',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '95%',
          maxWidth: '520px',
          background: 'rgba(0, 0, 0, 0.96)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '2.2rem',
          boxShadow: '0 0 30px rgba(0,0,0,0.5)',
          color: '#fff',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        <h4
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: '#ffffffdd',
            textShadow: '0 0 6px rgba(255,255,255,0.05)',
          }}
        >
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h4>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(220, 53, 69, 0.9)',
              padding: '10px 14px',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontSize: '0.88rem',
              whiteSpace: 'pre-line',
              boxShadow: '0 0 8px rgba(255,0,0,0.3)',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', name: 'name', type: 'text', ref: firstInputRef },
            { label: 'Contact Number', name: 'contactNumber', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Address', name: 'address', type: 'text' },
            {
              label: `Password${employee ? ' (leave blank to keep existing)' : ''}`,
              name: 'password',
              type: 'password',
            },
          ].map(({ label, name, type, ref }) => (
            <div key={name} style={{ marginBottom: '1rem' }}>
              <label htmlFor={name} style={labelStyle}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                ref={ref}
                style={inputStyle}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="gender" style={labelStyle}>
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              style={selectStyle}
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="role" style={labelStyle}>
              Role
            </label>
            <select
              id="role"
              name="role"
              style={selectStyle}
              value={form.role}
              onChange={handleChange}
            >
              <option value="">-- Select Role --</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#aaa',
                padding: '8px 16px',
                border: '1px solid #555',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#aaa')}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #12c2e9, #c471ed, #f64f59)',
                backgroundSize: '200% 200%',
                color: '#fff',
                padding: '8px 18px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(255,255,255,0.2)',
                transition: '0.3s ease-in-out',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundPosition = 'right center')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundPosition = 'left center')
              }
            >
              {employee ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
