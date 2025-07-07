// src/components/AddEditEmployeeForm.js
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (employee) {
      setForm({
        name:           employee.name || '',
        gender:         employee.gender || '',
        contactNumber:  employee.contactNumber || '',
        email:          employee.email || '',
        address:        employee.address || '',
        password:       '',
        role:           employee.role || '',
      });
    }
  }, [employee]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await axiosInstance.put(`/Employee/${employee.employeeID}`, {
          EmployeeID:    employee.employeeID,
          Name:          form.name,
          Gender:        form.gender,
          ContactNumber: form.contactNumber,
          Email:         form.email,
          Address:       form.address,
          PasswordHash:  form.password,
          Role:          form.role,
        });
      } else {
        await axiosInstance.post('/Employee', {
          Name:          form.name,
          Gender:        form.gender,
          ContactNumber: form.contactNumber,
          Email:         form.email,
          Address:       form.address,
          Password:      form.password,
          Role:          form.role,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(`Save failed:\n${err.response?.data || err.message}`);
    }
  };

  const backdrop = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    overflowY: 'auto',
    zIndex: 1050,
  };

  const card = {
    width: '100%',
    maxWidth: 420,
    background: 'rgba(0,0,0,0.85)',
    borderRadius: 16,
    padding: '1.8rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  };

  const hoverBtnStyle = `
    .btn-primary:hover {
      background-color: #0d6efd !important;
      filter: brightness(1.15);
    }
    .btn-outline-light:hover {
      background-color: #ffffff10;
      border-color: #fff;
    }
  `;

  return (
    <div style={backdrop} onClick={onClose}>
      <style>{hoverBtnStyle}</style>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <h5 className="mb-4 text-center fw-semibold">
          {employee ? 'Edit Employee' : 'Add Employee'}
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Gender --</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input
              name="contactNumber"
              className="form-control"
              value={form.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              name="address"
              className="form-control"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password {employee && <small>(leave blank to keep)</small>}
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required={!employee}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Role --</option>
              <option>Admin</option>
              <option>Employee</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {employee ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
