// src/pages/Employee/ViewAssignedAssets.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function ViewAssignedAssets() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const empId = user.EmployeeID ?? user.employeeID;

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
        const res  = await axiosInstance.get('/EmployeeAssetAllocation');
        const mine = unwrap(res.data).filter((a) => a.employeeID === empId);
        setRows(mine);
      } catch (err) {
        console.error('Assigned asset load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [empId]);

  /* card style */
  const card = {
    background: 'rgba(0,0,0,0.78)',
    borderRadius: 16,
    padding: '1.8rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
    width: '100%',
    maxWidth: 1000,
  };

  /* render */
  if (loading) return <p>Loading…</p>;

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div style={card}>
        <h4 className="fw-semibold mb-4">My Assigned Assets</h4>

        {rows.length === 0 ? (
          <p>No assets assigned.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Allocation ID</th>
                  <th>Asset No</th>
                  <th>Asset Name</th>
                  <th>Allocation Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.allocationID}>
                    <td>{a.allocationID}</td>
                    <td>{a.assetNo}</td>
                    <td>{a.assetName}</td>
                    <td>{a.allocationDate?.split('T')[0]}</td>
                    <td>{a.status}</td>
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
