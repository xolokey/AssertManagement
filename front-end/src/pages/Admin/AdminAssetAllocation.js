import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

function AdminAssetAllocation() {
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [newAlloc, setNewAlloc] = useState({ employeeID: '', assetID: '' });
  const [loading, setLoading] = useState(true);

  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [allocRes, empRes, assetRes] = await Promise.all([
        axiosInstance.get('/EmployeeAssetAllocation'),
        axiosInstance.get('/Employee'),
        axiosInstance.get('/Asset'),
      ]);
      setRows(unwrap(allocRes.data));
      setEmployees(unwrap(empRes.data));
      setAssets(unwrap(assetRes.data));
    } catch (err) {
      console.error('❌ Load error:', err);
      alert('Failed to load allocation data');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleApprove = async (r) => {
    if (!window.confirm(`Approve ${r.assetName} for ${r.employeeName}?`)) return;
    try {
      await axiosInstance.put('/EmployeeAssetAllocation/approve', {
        employeeID: r.employeeID,
        assetID: r.assetID,
      });
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Approval failed');
    }
  };

  const handleAllocate = async () => {
    if (!newAlloc.employeeID || !newAlloc.assetID) {
      alert('Select employee and asset');
      return;
    }
    try {
      await axiosInstance.post('/EmployeeAssetAllocation', {
        employeeID: Number(newAlloc.employeeID),
        assetID: Number(newAlloc.assetID),
        allocationDate: new Date().toISOString(),
        status: 'Allocated',
      });
      setNewAlloc({ employeeID: '', assetID: '' });
      fetchAll();
      alert('Asset allocated');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Allocation failed');
    }
  };

  const cardStyle = {
    background: 'rgba(0,0,0,0.75)',
    borderRadius: '16px',
    padding: '1.5rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };

  return (
    <div className="container-fluid px-3">
      <div style={cardStyle}>
        <h4 className="fw-semibold mb-4">Asset Allocation Requests & Assignments</h4>

        {loading ? (
          <p className="text-light">Loading…</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Allocation ID</th>
                  <th>Employee</th>
                  <th>Asset</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.allocationID}>
                    <td>{r.allocationID}</td>
                    <td>{r.employeeName || `Emp ${r.employeeID}`}</td>
                    <td>{r.assetName || `Asset ${r.assetID}`}</td>
                    <td>{r.status}</td>
                    <td>
                      {r.status === 'Requested' ? (
                        <button
                          onClick={() => handleApprove(r)}
                          className="btn btn-outline-light btn-sm"
                        >
                          Approve
                        </button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <hr className="border-light my-4" />
        <h5 className="fw-bold mb-3">Allocate New Asset Manually</h5>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <select
            className="form-select form-select-sm w-auto"
            value={newAlloc.employeeID}
            onChange={(e) => setNewAlloc({ ...newAlloc, employeeID: e.target.value })}
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.employeeID} value={e.employeeID}>
                {e.name}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm w-auto"
            value={newAlloc.assetID}
            onChange={(e) => setNewAlloc({ ...newAlloc, assetID: e.target.value })}
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.assetID} value={a.assetID}>
                {a.assetName}
              </option>
            ))}
          </select>

          <button onClick={handleAllocate} className="btn btn-success btn-sm">
            Allocate
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminAssetAllocation;
