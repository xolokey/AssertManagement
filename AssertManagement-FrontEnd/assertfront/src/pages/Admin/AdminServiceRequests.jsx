import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const card = {
    background: 'rgba(0,0,0,.75)',
    borderRadius: 16,
    padding: '1.5rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };

  if (loading) return <p className="text-light">Loading…</p>;
  if (requests.length === 0)
    return <p className="text-light">No service requests found.</p>;

  return (
    <div className="container-fluid px-3">
      <div style={card}>
        <h4 className="mb-4 fw-semibold">Service Requests</h4>

        <div className="table-responsive">
          <table className="table table-dark table-striped align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th>Asset</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Set Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.serviceRequestID}>
                  <td>{r.serviceRequestID}</td>
                  <td>{r.assetName}</td>
                  <td>{r.employeeName}</td>
                  <td>{r.requestDate?.split('T')[0]}</td>
                  <td>{r.description}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === 'Completed'
                          ? 'bg-success'
                          : r.status === 'InProgress'
                          ? 'bg-warning text-dark'
                          : r.status === 'Rejected'
                          ? 'bg-danger'
                          : 'bg-secondary'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select text-white bg-dark border-secondary"
                      value={r.status}
                      onChange={(e) => updateStatus(r, e.target.value)}
                      style={{ minWidth: 140 }}
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
