import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RaiseServiceRequest() {
  const [form, setForm] = useState({
    assetID: '',
    issueType: 'Malfunction',
    description: '',
  });

  const [myAssets, setMyAssets] = useState([]);
  const [sending, setSending] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myId = user.employeeID;

  const unwrap = (p) =>
    Array.isArray(p)
      ? p
      : Array.isArray(p?.$values)
      ? p.$values
      : Array.isArray(p?.data)
      ? p.data
      : [];

  useEffect(() => {
    if (!myId) return;
    (async () => {
      try {
        const res = await axiosInstance.get('/EmployeeAssetAllocation');
        setMyAssets(unwrap(res.data).filter((a) => a.employeeID === myId));
      } catch (err) {
        console.error('Failed to load assets:', err);
        toast.error('❌ Failed to fetch your assets.');
      }
    })();
  }, [myId]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assetID || !form.description) {
      toast.warn('Please complete all fields.');
      return;
    }

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
      toast.success('✅ Service request submitted successfully');
      setForm({ assetID: '', issueType: 'Malfunction', description: '' });
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error('❌ Failed to submit service request');
    } finally {
      setSending(false);
    }
  };

  // ─────────── Styles ───────────
  const card = {
    background: 'rgba(30, 30, 30, 0.85)',
    borderRadius: 16,
    padding: '2rem',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    maxWidth: 520,
    width: '100%',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const labelCls = 'form-label text-white-50 mb-1';

  const inputBase = {
  backgroundColor: '#1a1a1a',
  color: '#f2f2f2',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '0.55rem 0.75rem',
  borderRadius: '10px',
  width: '100%',
  fontSize: '15px',
  outline: 'none',
  appearance: 'none', // 👈 disables default arrow
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg fill='white' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '12px',
 };


  const inputFocus = {
    borderColor: '#66b2ff',
    boxShadow: '0 0 8px rgba(102,178,255,0.3)',
  };

  const [focusField, setFocusField] = useState('');

  // ─────────── Render ───────────
  return (
    <div className="container-fluid d-flex justify-content-center mt-5 mb-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={card}>
        <h4 className="fw-semibold mb-4 text-center">🛠️ Raise Service Request</h4>

        <form onSubmit={handleSubmit}>
          {/* Asset Select */}
          <div className="mb-3">
            <label className={labelCls}>Asset</label>
            <select
              name="assetID"
              style={{
                ...inputBase,
                ...(focusField === 'assetID' ? inputFocus : {}),
              }}
              value={form.assetID}
              onChange={onChange}
              onFocus={() => setFocusField('assetID')}
              onBlur={() => setFocusField('')}
              required
            >
              <option value="">-- Select Asset --</option>
              {myAssets.map((a) => (
                <option key={a.allocationID} value={a.assetID}>
                  {a.assetNo ? `${a.assetNo} - ` : ''}
                  {a.assetName}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Type */}
          <div className="mb-3">
            <label className={labelCls}>Issue Type</label>
            <select
              name="issueType"
              style={{
                ...inputBase,
                ...(focusField === 'issueType' ? inputFocus : {}),
              }}
              value={form.issueType}
              onChange={onChange}
              onFocus={() => setFocusField('issueType')}
              onBlur={() => setFocusField('')}
            >
              <option value="Malfunction">Malfunction</option>
              <option value="Repair">Repair</option>
              <option value="Software Issue">Software Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              style={{
                ...inputBase,
                resize: 'vertical',
                minHeight: 90,
                ...(focusField === 'description' ? inputFocus : {}),
              }}
              value={form.description}
              onChange={onChange}
              onFocus={() => setFocusField('description')}
              onBlur={() => setFocusField('')}
              placeholder="Describe the issue..."
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={sending}
          >
            {sending ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
