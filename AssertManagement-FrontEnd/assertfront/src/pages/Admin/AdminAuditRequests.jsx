import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AdminAuditRequests() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  const fetchAudits = async () => {
    try {
      const res = await axiosInstance.get('/AssetAudit');
      setAudits(unwrap(res.data));
    } catch (err) {
      console.error('Failed to load audits:', err);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const triggerAll = async () => {
    if (!window.confirm('Send audit request to all employees?')) return;
    setSending(true);
    try {
      await axiosInstance.post('/AssetAudit/TriggerAll');
      alert('Audit requests created.');
      fetchAudits();
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Trigger failed');
    } finally {
      setSending(false);
    }
  };

  const markCompleted = async (auditID) => {
    try {
      await axiosInstance.patch(
        `/AssetAudit/${auditID}/status`,
        '"Completed"',
        { headers: { 'Content-Type': 'application/json' } }
      );
      fetchAudits();
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Update failed');
    }
  };

  const card = {
    background: 'rgba(0,0,0,.75)',
    borderRadius: 16,
    padding: '1.5rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };

  return (
    <div className="container-fluid px-3">
      <div style={card}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-semibold m-0">Audit Requests</h4>
          <button
            onClick={triggerAll}
            disabled={sending}
            className="btn btn-outline-warning"
          >
            {sending ? 'Sending…' : 'Trigger Audit for All'}
          </button>
        </div>

        {loading ? (
          <p className="text-light">Loading…</p>
        ) : audits.length === 0 ? (
          <p className="text-light">No audit requests found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.auditID}>
                    <td>{a.auditID}</td>
                    <td>{a.assetName}</td>
                    <td>{a.employeeName}</td>
                    <td>{a.requestDate?.split('T')[0]}</td>
                    <td>{a.status}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          a.status === 'Completed'
                            ? 'btn-success disabled'
                            : 'btn-outline-light'
                        }`}
                        onClick={() => markCompleted(a.auditID)}
                        disabled={a.status === 'Completed'}
                      >
                        {a.status === 'Completed'
                          ? 'Completed'
                          : 'Mark Completed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
