import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function ViewAssignedAssets() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const empId = user.EmployeeID ?? user.employeeID;

  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/EmployeeAssetAllocation');
        const mine = unwrap(res.data).filter((a) => a.employeeID === empId);
        setRows(mine);
      } catch (err) {
        console.error('Assigned asset load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [empId]);

  const badgeMap = {
    Approved: { color: '#0d6efd', icon: '✅' },
    Requested: { color: '#ffc107', icon: '🕒', textColor: '#000' },
    Allocated: { color: '#0dcaf0', icon: '📦' },
    Pending: { color: '#6c757d', icon: '⏳' },
  };

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(40,40,40,0.9), rgba(20,20,20,0.9))',
    borderRadius: '18px',
    padding: '1.8rem',
    color: '#fff',
    boxShadow: '0 10px 32px rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '310px',
    minHeight: '200px',
    margin: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const labelStyle = {
    fontSize: '0.9rem',
    color: '#aaa',
    marginBottom: '0.25rem',
    letterSpacing: '0.4px',
  };

  const valueStyle = {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#f1f1f1',
    marginBottom: '0.8rem',
  };

  const statusBadge = (status) => {
    const badge = badgeMap[status] || {
      color: '#6c757d',
      icon: '🔘',
      textColor: '#fff',
    };
    return (
      <span
        style={{
          backgroundColor: badge.color,
          color: badge.textColor || '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          borderRadius: '999px',
          padding: '0.4rem 0.85rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {badge.icon} {status}
      </span>
    );
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div
        style={{
          background: 'rgba(25, 25, 25, 0.85)',
          borderRadius: '20px',
          padding: '2rem',
          color: '#eef3ff',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
          width: '100%',
          maxWidth: '1200px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h4 className="fw-bold mb-4" style={{ color: '#f1f3f8', fontSize: '1.6rem' }}>
          My Assigned Assets
        </h4>

        {loading ? (
          <p className="text-white-50">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-white-50">No assets assigned yet.</p>
        ) : (
          <div className="d-flex flex-wrap justify-content-start">
            {rows.map((a, index) => (
              <div
                key={a.allocationID}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,153,255,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 32px rgba(0, 0, 0, 0.55)';
                }}
              >
                <div>
                  <div style={labelStyle}>#</div>
                  <div style={valueStyle}>{index + 1}</div>

                  <div style={labelStyle}>Asset No</div>
                  <div style={valueStyle}>{a.assetNo}</div>

                  <div style={labelStyle}>Asset Name</div>
                  <div style={valueStyle}>{a.assetName}</div>

                  <div style={labelStyle}>Allocation Date</div>
                  <div style={valueStyle}>
                    {a.allocationDate?.split('T')[0] || '—'}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  {statusBadge(a.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
