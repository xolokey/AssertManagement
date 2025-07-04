// src/pages/Employee/RaiseServiceRequest.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function RaiseServiceRequest() {
  /* ───────── state ───────── */
  const [form, setForm] = useState({
    assetID: '',
    issueType: 'Malfunction',
    description: '',
  });
  const [myAssets, setMyAssets] = useState([]);
  const [sending, setSending] = useState(false);

  /* current user */
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myId = user.employeeID;

  /* helper to flatten JSON‑NET payloads */
  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  /* load employee’s allocated assets for dropdown */
  useEffect(() => {
    if (!myId) return;
    (async () => {
      try {
        const res = await axiosInstance.get('/EmployeeAssetAllocation');
        setMyAssets(
          unwrap(res.data).filter((a) => a.employeeID === myId)
        );
      } catch (err) {
        console.error('Failed to load assets:', err);
      }
    })();
  }, [myId]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ───────── submit ───────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assetID || !form.description) return;

    const payload = {
      employeeID: myId,
      assetID: Number(form.assetID),
      issueType: form.issueType,
      description: form.description,
      requestDate: new Date().toISOString(),
      status: 'Pending',
    };

    setSending(true);
    try {
      await axiosInstance.post('/AssetServiceRequest', payload);
      alert('✅ Service request submitted');
      setForm({ assetID: '', issueType: 'Malfunction', description: '' });
    } catch (err) {
      console.error(err.response?.data || err);
      alert('❌ Request failed');
    } finally {
      setSending(false);
    }
  };

  /* ───────── styles ───────── */
  const card = {
    background: 'rgba(0,0,0,0.78)',
    borderRadius: 16,
    padding: '1.8rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
    maxWidth: 500,
    width: '100%',
  };

  const labelCls = 'form-label text-white-50 mb-1';

  /* ───────── render ───────── */
  return (
    <div className="container-fluid d-flex justify-content-center mt-4">
      <div style={card}>
        <h4 className="fw-semibold mb-4 text-center">Raise Service Request</h4>

        <form onSubmit={handleSubmit}>
          {/* Asset dropdown */}
          <div className="mb-3">
            <label className={labelCls}>Asset</label>
            <select
              name="assetID"
              className="form-select bg-input"
              value={form.assetID}
              onChange={onChange}
              required
            >
              <option value="">-- select --</option>
              {myAssets.map((a) => (
                <option key={a.allocationID} value={a.assetID}>
                  {a.assetNo ? `${a.assetNo} - ` : ''}
                  {a.assetName}
                </option>
              ))}
            </select>
          </div>

          {/* Issue type */}
          <div className="mb-3">
            <label className={labelCls}>Issue Type</label>
            <select
              name="issueType"
              className="form-select bg-input"
              value={form.issueType}
              onChange={onChange}
            >
              <option value="Malfunction">Malfunction</option>
              <option value="Repair">Repair</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows="3"
              className="form-control bg-input"
              value={form.description}
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 login-btn"
            disabled={sending}
          >
            {sending ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
