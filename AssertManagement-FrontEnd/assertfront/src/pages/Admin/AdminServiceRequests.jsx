import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/AssetServiceRequest');
      setRequests(unwrap(res.data));
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to load service requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (req, newStatus) => {
    const payload = { ...req, status: newStatus };
    try {
      await axiosInstance.put(`/AssetServiceRequest/${req.serviceRequestID}`, payload);
      fetchRequests();
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Status update failed');
    }
  };

  const badgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: status === 'InProgress' ? '#000' : '#fff',
    backgroundColor:
      status === 'Completed'
        ? '#198754'
        : status === 'InProgress'
        ? '#ffc107'
        : status === 'Rejected'
        ? '#dc3545'
        : '#6c757d',
  });

  const filtered = requests.filter((r) => {
    const matchesText =
      r.assetName?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.employeeName?.toLowerCase().includes(searchText.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

    return matchesText && matchesStatus;
  });

  const inputStyle = {
    padding: '8px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    width: '260px',
    fontSize: '15px',
    transition: 'all 0.2s ease',
  };

  const selectStyle = {
    ...inputStyle,
    width: 180,
    background: '#111',
  };

  const cardStyle = {
    background: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(6px)',
    borderRadius: 16,
    padding: '1.5rem',
    color: '#fff',
    boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
    marginTop: '1rem',
  };

  if (loading) return <p className="text-light">Loading…</p>;
  if (requests.length === 0) return <p className="text-light">No service requests found.</p>;

  return (
    <div className="container-fluid px-3">
      <div style={cardStyle}>
        <h4 className="mb-4 fw-semibold">Service Requests</h4>

        {/* Filter row */}
        <div className="d-flex flex-wrap gap-3 mb-3">
          <input
            type="text"
            placeholder="Search by asset, employee, or issue..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={inputStyle}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div
          style={{
            overflowX: 'auto',
            borderRadius: '12px',
            background: 'rgba(20,20,20,0.85)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#fff',
              fontSize: '0.95rem',
              minWidth: '800px',
            }}
          >
            <thead>
              <tr style={{ background: '#ffffff', color: '#000', textAlign: 'left' }}>
                <th style={{ padding: '14px 20px' }}>ID</th>
                <th style={{ padding: '14px 20px' }}>Asset</th>
                <th style={{ padding: '14px 20px' }}>Employee</th>
                <th style={{ padding: '14px 20px' }}>Date</th>
                <th style={{ padding: '14px 20px' }}>Description</th>
                <th style={{ padding: '14px 20px' }}>Status</th>
                <th style={{ padding: '14px 20px' }}>Set Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr
                  key={r.serviceRequestID}
                  style={{
                    backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background 0.3s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')
                  }
                >
                  <td style={{ padding: '14px 20px' }}>{r.serviceRequestID}</td>
                  <td style={{ padding: '14px 20px' }}>{r.assetName}</td>
                  <td style={{ padding: '14px 20px' }}>{r.employeeName}</td>
                  <td style={{ padding: '14px 20px' }}>
                    {r.requestDate?.split('T')[0]}
                  </td>
                  <td style={{ padding: '14px 20px' }}>{r.description}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={badgeStyle(r.status)}>{r.status}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <select
                      className="form-select text-white bg-dark border-secondary"
                      value={r.status}
                      onChange={(e) => updateStatus(r, e.target.value)}
                      style={{
                        minWidth: 140,
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: '#111',
                        color: '#fff',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
