import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminAssetAllocation() {
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [newAlloc, setNewAlloc] = useState({ employeeID: '', assetID: '' });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredRows, setFilteredRows] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const unwrap = (p) =>
    Array.isArray(p) ? p :
    Array.isArray(p?.$values) ? p.$values :
    Array.isArray(p?.data) ? p.data : [];

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
      toast.error('Failed to load data.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const query = searchText.toLowerCase();
    let result = rows.filter(r =>
      r.employeeName?.toLowerCase().includes(query) ||
      r.assetName?.toLowerCase().includes(query)
    );
    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }
    setFilteredRows(result);
  }, [searchText, statusFilter, rows]);

  const handleApprove = async (r) => {
    if (!window.confirm(`Approve ${r.assetName} for ${r.employeeName}?`)) return;
    setActionLoading(true);
    try {
      await axiosInstance.put('/EmployeeAssetAllocation/approve', {
        employeeID: r.employeeID,
        assetID: r.assetID,
      });
      toast.success('Request approved');
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error('Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAllocate = async () => {
    if (!newAlloc.employeeID || !newAlloc.assetID) {
      toast.warn('Please select both employee and asset');
      return;
    }
    setActionLoading(true);
    try {
      await axiosInstance.post('/EmployeeAssetAllocation', {
        employeeID: Number(newAlloc.employeeID),
        assetID: Number(newAlloc.assetID),
        allocationDate: new Date().toISOString(),
        status: 'Allocated',
      });
      toast.success('Asset allocated');
      setNewAlloc({ employeeID: '', assetID: '' });
      fetchAll();
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error('Allocation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const cardStyle = {
    background: 'rgba(0,0,0,0.75)',
    borderRadius: '16px',
    padding: '1.5rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
    marginTop: '1rem',
  };

  const inputStyle = {
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid #555',
    background: '#111',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
  };

  const th = {
    padding: '14px 20px',
    fontWeight: '600',
    color: '#fff',
    backdropFilter: 'blur(6px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };

  const td = {
    padding: '12px 20px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    verticalAlign: 'middle',
  };

  const noMatch = {
    padding: '18px',
    textAlign: 'center',
    color: '#aaa',
    fontStyle: 'italic',
  };

  return (
    <div className="container-fluid px-3">
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={cardStyle}>
        {/* Search + Filter */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <h4 className="fw-semibold text-white-50 m-0">Asset Allocation Requests & Assignments</h4>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search by Employee or Asset"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ ...inputStyle, width: 240 }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="All">All Status</option>
              <option value="Requested">Requested</option>
              <option value="Allocated">Allocated</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-light">Loading…</p>
        ) : (
          <div className="table-responsive">
            <table
              className="glass-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderRadius: '16px',
                overflow: 'hidden',
                fontSize: '0.95rem',
                color: '#fff',
                minWidth: '680px',
              }}
            >
              <thead style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={th}>Allocation ID</th>
                  <th style={th}>Employee</th>
                  <th style={th}>Asset</th>
                  <th style={th}>Status</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={noMatch}>No matching results.</td>
                  </tr>
                ) : (
                  filteredRows.map((r, index) => (
                    <tr
                      key={r.allocationID}
                      style={{
                        background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent')}
                    >
                      <td style={td}>{r.allocationID}</td>
                      <td style={td}>{r.employeeName || `Emp ${r.employeeID}`}</td>
                      <td style={td}>{r.assetName || `Asset ${r.assetID}`}</td>
                      <td style={td}>{r.status}</td>
                      <td style={td}>
                        {r.status === 'Requested' ? (
                          <button
                            onClick={() => handleApprove(r)}
                            className="btn btn-outline-light btn-sm"
                            disabled={actionLoading}
                          >
                            {actionLoading ? 'Approving...' : 'Approve'}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Manual Allocation */}
        <hr className="border-light my-4" />
        <h5 className="fw-bold mb-3">Allocate New Asset Manually</h5>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <select
            className="form-select form-select-sm w-auto"
            value={newAlloc.employeeID}
            onChange={(e) => setNewAlloc({ ...newAlloc, employeeID: e.target.value })}
            disabled={actionLoading}
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
            disabled={actionLoading}
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.assetID} value={a.assetID}>
                {a.assetName}
              </option>
            ))}
          </select>

          <button
            onClick={handleAllocate}
            className="btn btn-success btn-sm"
            disabled={actionLoading}
          >
            {actionLoading ? 'Allocating…' : 'Allocate'}
          </button>
        </div>
      </div>
    </div>
  );
}
