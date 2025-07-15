import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function RequestHistory() {
  const [allocation, setAllocation] = useState([]);
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const empId = user.EmployeeID ?? user.employeeID;
        if (!empId) {
          setLoading(false);
          return;
        }

        const [aRes, sRes] = await Promise.all([
          axiosInstance.get('/EmployeeAssetAllocation'),
          axiosInstance.get('/AssetServiceRequest'),
        ]);

        const allAlloc = unwrap(aRes.data);
        const allService = unwrap(sRes.data);

        setAllocation(allAlloc.filter((r) => r.employeeID === empId));
        setService(allService.filter((r) => r.employeeID === empId));
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusStyle = {
    Approved: { backgroundColor: '#198754', color: '#fff' },
    Pending: { backgroundColor: '#ffc107', color: '#000' },
    Requested: { backgroundColor: '#0dcaf0', color: '#000' },
    Rejected: { backgroundColor: '#dc3545', color: '#fff' },
    Completed: { backgroundColor: '#6c757d', color: '#fff' },
  };

  const renderStatus = (status) => {
    const style = {
      ...statusStyle[status],
      padding: '4px 10px',
      borderRadius: '8px',
      fontSize: '0.85rem',
      fontWeight: 500,
    };
    return <span style={style}>{status}</span>;
  };

  const card = {
    background: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 18,
    padding: '2rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
    width: '100%',
    maxWidth: '1100px',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const heading = {
    color: '#ccc',
    fontWeight: 600,
    fontSize: '1.1rem',
    marginBottom: '0.6rem',
    marginTop: '1.5rem',
  };

  const tableHead = {
    background: 'linear-gradient(to right, #1a1a1a, #2c2c2c)',
    color: '#ccc',
    fontWeight: 600,
    letterSpacing: 0.3,
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  };

  const tableCell = {
    padding: '0.75rem',
    verticalAlign: 'middle',
  };

  const rowHover = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    borderRadius: '12px',
  };

  if (loading) {
    return (
      <div className="text-center text-white-50 mt-5">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div style={card}>
        <h4 style={{ color: '#adb5bd', fontWeight: 600 }}>My Request History</h4>

        {/* Asset Allocation Section */}
        <h5 style={heading}>Asset Allocation</h5>
        {allocation.length === 0 ? (
          <p className="text-white-50">No allocation requests.</p>
        ) : (
          <div className="table-responsive mb-4">
            <table
              className="table align-middle"
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <thead style={tableHead}>
                <tr>
                  <th style={tableCell}>ID</th>
                  <th style={tableCell}>Asset</th>
                  <th style={tableCell}>Date</th>
                  <th style={tableCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocation.map((r) => (
                  <tr
                    key={r.allocationID}
                    style={rowHover}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(68, 68, 68, 0.05)';
                      e.currentTarget.style.transform = 'scale(1.005)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <td style={tableCell}>{r.allocationID}</td>
                    <td style={tableCell}>{r.assetName}</td>
                    <td style={tableCell}>{r.allocationDate?.split('T')[0]}</td>
                    <td style={tableCell}>{renderStatus(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Service Request Section */}
        <h5 style={heading}>Service Requests</h5>
        {service.length === 0 ? (
          <p className="text-white-50">No service requests.</p>
        ) : (
          <div className="table-responsive">
            <table
              className="table align-middle"
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <thead style={tableHead}>
                <tr>
                  <th style={tableCell}>ID</th>
                  <th style={tableCell}>Asset</th>
                  <th style={tableCell}>Issue</th>
                  <th style={tableCell}>Description</th>
                  <th style={tableCell}>Date</th>
                  <th style={tableCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {service.map((r) => (
                  <tr
                    key={r.serviceRequestID}
                    style={rowHover}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.transform = 'scale(1.005)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <td style={tableCell}>{r.serviceRequestID}</td>
                    <td style={tableCell}>{r.assetName}</td>
                    <td style={tableCell}>{r.issueType}</td>
                    <td style={{ ...tableCell, maxWidth: 240 }}>{r.description}</td>
                    <td style={tableCell}>{r.requestDate?.split('T')[0]}</td>
                    <td style={tableCell}>{renderStatus(r.status)}</td>
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
