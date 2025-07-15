import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import { debounce } from 'lodash';
import 'react-toastify/dist/ReactToastify.css';

export default function RequestAsset() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCat, setFilterCat] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rawSearch, setRawSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(null);

  const employeeId = JSON.parse(localStorage.getItem('user') || '{}')?.employeeID;

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
        const [aRes, cRes] = await Promise.all([
          axiosInstance.get('/Asset'),
          axiosInstance.get('/AssetCategory'),
        ]);
        setAssets(unwrap(aRes.data));
        setCategories(unwrap(cRes.data));
      } catch (err) {
        toast.error('Failed to load assets');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const debouncedSearch = useCallback(debounce((text) => setSearchText(text), 300), []);

  const handleSearchChange = (e) => {
    setRawSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const visible = assets
    .filter((a) => a.assetStatus === 'Available')
    .filter((a) =>
      filterCat ? a.categoryName?.toLowerCase() === filterCat.toLowerCase() : true
    )
    .filter(
      (a) =>
        a.assetName?.toLowerCase().includes(searchText.toLowerCase()) ||
        a.assetNo?.toLowerCase().includes(searchText.toLowerCase())
    );

  const requestAllocation = async (assetID) => {
    try {
      setRequesting(assetID);
      await axiosInstance.post('/EmployeeAssetAllocation', {
        employeeID: employeeId,
        assetID,
        allocationDate: new Date().toISOString(),
        status: 'Requested',
      });
      toast.success('Request submitted ✅');
    } catch (err) {
      toast.error('Request failed ❌');
    } finally {
      setRequesting(null);
    }
  };

  // ────────── Styles ──────────
  const card = {
    background: 'rgba(25, 25, 25, 0.78)',
    borderRadius: 18,
    padding: '2rem',
    color: '#fff',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    width: '100%',
    maxWidth: '1100px',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const labelCls = 'form-label text-white-50 mb-1';

  const inputStyle = {
    backgroundColor: '#1a1a1a',
    color: '#f2f2f2',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    width: '100%',
    fontSize: '15px',
    outline: 'none',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg fill='white' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '12px',
  };

  const tableRowHover = {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={card}>
        <h4 className="fw-semibold mb-4">Request New Asset</h4>

        {/* Filters */}
        <div className="d-md-flex gap-3 mb-3">
          <div className="flex-grow-1">
            <label className={labelCls}>Search</label>
            <input
              style={inputStyle}
              className="form-control"
              placeholder="Search by asset name or number…"
              value={rawSearch}
              onChange={handleSearchChange}
            />
          </div>

          <div style={{ minWidth: 220 }}>
            <label className={labelCls}>Category</label>
            <select
              style={selectStyle}
              className="form-select"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.assetCategoryID} value={c.categoryName}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Asset Table */}
        {loading ? (
          <p className="text-white-50">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="text-white-50">No available assets.</p>
        ) : (
          <>
            <p className="text-white-50 mb-2">
              Showing {visible.length} available {filterCat || 'assets'}.
            </p>
            <div className="table-responsive rounded">
              <table
                className="table table-dark align-middle table-borderless"
                style={{
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  overflow: 'hidden',
                  borderRadius: '14px',
                }}
              >
                <thead
                  style={{
                    background: 'linear-gradient(to right,rgb(255, 255, 255), #2d2d2d)',
                    color: '#ddd',
                  }}
                >
                  <tr>
                    <th style={{ padding: '0.75rem' }}>Asset No</th>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Model</th>
                    <th style={{ padding: '0.75rem' }}>Category</th>
                    <th style={{ padding: '0.75rem' }}>Value</th>
                    <th style={{ padding: '0.75rem' }} />
                  </tr>
                </thead>
                <tbody>
                  {visible.map((a) => (
                    <tr
                      key={a.assetID}
                      style={tableRowHover}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.transform = 'scale(1.002)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <td style={{ padding: '0.75rem' }}>{a.assetNo}</td>
                      <td style={{ padding: '0.75rem' }}>{a.assetName}</td>
                      <td style={{ padding: '0.75rem' }}>{a.assetModel}</td>
                      <td style={{ padding: '0.75rem' }}>{a.categoryName}</td>
                      <td style={{ padding: '0.75rem' }}>{a.assetValue}</td>
                      <td style={{ padding: '0.75rem', width: 150 }}>
                        <button
                          className="btn btn-sm btn-primary w-100"
                          onClick={() => requestAllocation(a.assetID)}
                          disabled={requesting === a.assetID}
                          style={{
                            borderRadius: 8,
                            fontWeight: 500,
                            transition: '0.2s ease-in-out',
                          }}
                        >
                          {requesting === a.assetID ? 'Requesting…' : 'Request'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
