// src/pages/Employee/RequestAsset.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function RequestAsset() {
  /* ───────── state ───────── */
  const [assets, setAssets]       = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat]   = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading]       = useState(true);

  const employeeId =
    JSON.parse(localStorage.getItem('user') || '{}')?.employeeID;

  /* unwrap helper */
  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const [aRes, cRes] = await Promise.all([
          axiosInstance.get('/Asset'),
          axiosInstance.get('/AssetCategory'),
        ]);
        setAssets(unwrap(aRes.data));
        setCategories(unwrap(cRes.data));
      } catch (err) {
        console.error(err);
        alert('Failed to load assets');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* filter logic */
  const visible = assets
    .filter((a) => a.assetStatus === 'Available')
    .filter((a) =>
      filterCat
        ? a.categoryName?.toLowerCase() === filterCat.toLowerCase()
        : true
    )
    .filter(
      (a) =>
        a.assetName?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.assetNo?.toLowerCase().includes(searchText.toLowerCase())
    );

  /* request allocation */
  const requestAllocation = async (assetID) => {
    try {
      await axiosInstance.post('/EmployeeAssetAllocation', {
        employeeID: employeeId,
        assetID,
        allocationDate: new Date().toISOString(),
        status: 'Requested',
      });
      alert('Request submitted ✅');
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Request failed ❌');
    }
  };

  /* ───────── styles ───────── */
  const card = {
    background: 'rgba(0,0,0,0.78)',
    borderRadius: 16,
    padding: '1.8rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };
  const labelCls = 'form-label text-white-50 mb-1';

  /* ───────── render ───────── */
  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div style={{ ...card, width: '100%', maxWidth: 1100 }}>
        <h4 className="fw-semibold mb-4">Request New Asset</h4>

        {/* search + filter */}
        <div className="d-md-flex gap-3 mb-3">
          <div className="flex-grow-1">
            <label className={labelCls}>Search</label>
            <input
              className="form-control bg-input"
              placeholder="Asset name or number…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div style={{ minWidth: 220 }}>
            <label className={labelCls}>Category</label>
            <select
              className="form-select bg-input"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.assetCategoryID}>{c.categoryName}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : visible.length === 0 ? (
          <p>No available assets.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Value</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr key={a.assetID}>
                    <td>{a.assetNo}</td>
                    <td>{a.assetName}</td>
                    <td>{a.assetModel}</td>
                    <td>{a.categoryName}</td>
                    <td>{a.assetValue}</td>
                    <td style={{ width: 150 }}>
                      <button
                        className="btn btn-primary btn-sm login-btn w-100"
                        onClick={() => requestAllocation(a.assetID)}
                      >
                        Request
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
