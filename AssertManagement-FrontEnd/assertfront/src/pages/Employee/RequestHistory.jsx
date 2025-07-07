// src/pages/Employee/RequestHistory.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function RequestHistory() {
  const [allocation, setAllocation] = useState([]);
  const [service, setService]       = useState([]);
  const [loading, setLoading]       = useState(true);

  /* unwrap helper */
  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  /* fetch on mount */
  useEffect(() => {
    (async () => {
      try {
        const user   = JSON.parse(localStorage.getItem('user') || '{}');
        const empId  = user.EmployeeID ?? user.employeeID;
        if (!empId) { setLoading(false); return; }

        const [aRes, sRes] = await Promise.all([
          axiosInstance.get('/EmployeeAssetAllocation'),
          axiosInstance.get('/AssetServiceRequest'),
        ]);

        const allAlloc   = unwrap(aRes.data);
        const allService = unwrap(sRes.data);

        setAllocation(allAlloc.filter((r) => r.employeeID === empId));
        setService   (allService.filter((r) => r.employeeID === empId));
      } catch (err) {
        console.error('History load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* shared styles */
  const card = {
    background: 'rgba(0,0,0,0.78)',
    borderRadius: 16,
    padding: '1.8rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };

  /* render */
  if (loading) return <p>Loading…</p>;

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div style={{ ...card, width: '100%', maxWidth: 1100 }}>
        <h4 className="fw-semibold mb-4">My Request History</h4>

        {/* ─── Allocation requests ─── */}
        <h5 className="mb-2 text-white-50">Asset Allocation</h5>
        {allocation.length === 0 ? (
          <p>No allocation requests.</p>
        ) : (
          <div className="table-responsive mb-4">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocation.map((r) => (
                  <tr key={r.allocationID}>
                    <td>{r.allocationID}</td>
                    <td>{r.assetName}</td>
                    <td>{r.allocationDate?.split('T')[0]}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Service requests ─── */}
        <h5 className="mb-2 text-white-50">Service Requests</h5>
        {service.length === 0 ? (
          <p>No service requests.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset</th>
                  <th>Issue</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {service.map((r) => (
                  <tr key={r.serviceRequestID}>
                    <td>{r.serviceRequestID}</td>
                    <td>{r.assetName}</td>
                    <td>{r.issueType}</td>
                    <td style={{ maxWidth: 220 }}>{r.description}</td>
                    <td>{r.requestDate?.split('T')[0]}</td>
                    <td>{r.status}</td>
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
