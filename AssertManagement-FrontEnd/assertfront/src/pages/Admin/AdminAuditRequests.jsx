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

  const cardStyle = {
    background: 'rgba(30, 30, 30, 0.85)',
    backdropFilter: 'blur(6px)',
    borderRadius: 16,
    padding: '1.5rem',
    color: '#fff',
    boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
    marginTop: '1rem',
  };

  const badgeStyle = (status) => ({
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: status === 'Completed' ? '#fff' : '#000',
    backgroundColor:
      status === 'Completed'
        ? '#198754'
        : status === 'Pending'
        ? '#6c757d'
        : '#ffc107',
  });

  const tableWrapper = {
    overflowX: 'auto',
    borderRadius: '12px',
    background: 'rgba(20,20,20,0.85)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  };

  const btnStyle = {
    padding: '10px 18px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(90deg, #ffc107, #ffcd39)',
    color: '#000',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <div className="container-fluid px-3">
      <div style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-semibold m-0 text-white-50">Audit Requests</h4>
          <button
            onClick={triggerAll}
            disabled={sending}
            style={btnStyle}
          >
            {sending ? 'Sending…' : 'Trigger Audit for All'}
          </button>
        </div>

        {loading ? (
          <p className="text-light">Loading…</p>
        ) : audits.length === 0 ? (
          <p className="text-light">No audit requests found.</p>
        ) : (
          <div style={tableWrapper}>
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
                <tr style={{ background: '#fff', color: '#000' }}>
                  <th style={{ padding: '14px 20px' }}>ID</th>
                  <th style={{ padding: '14px 20px' }}>Asset</th>
                  <th style={{ padding: '14px 20px' }}>Employee</th>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a, idx) => (
                  <tr
                    key={a.auditID}
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
                    <td style={{ padding: '14px 20px' }}>{a.auditID}</td>
                    <td style={{ padding: '14px 20px' }}>{a.assetName}</td>
                    <td style={{ padding: '14px 20px' }}>{a.employeeName}</td>
                    <td style={{ padding: '14px 20px' }}>{a.requestDate?.split('T')[0]}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={badgeStyle(a.status)}>{a.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        className={`btn btn-sm ${
                          a.status === 'Completed'
                            ? 'btn-success disabled'
                            : 'btn-outline-light'
                        }`}
                        onClick={() => markCompleted(a.auditID)}
                        disabled={a.status === 'Completed'}
                      >
                        {a.status === 'Completed' ? 'Completed' : 'Mark Completed'}
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
