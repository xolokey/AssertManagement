import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AddEditAssetForm({ asset, categories, onClose }) {
  const isEdit = asset && asset.assetID;

  const [form, setForm] = useState({
    assetNo: '',
    assetName: '',
    assetCategoryID: '',
    assetModel: '',
    manufacturingDate: '',
    expiryDate: '',
    assetValue: '',
    assetStatus: 'Available',
    imageURL: '',
  });


  useEffect(() => {
    if (isEdit) {
      setForm({
        assetNo:            asset.assetNo         ?? '',
        assetName:          asset.assetName       ?? '',
        assetCategoryID:    asset.assetCategoryID ?? '',
        assetModel:         asset.assetModel      ?? '',
        manufacturingDate:  asset.manufacturingDate
          ? asset.manufacturingDate.split('T')[0]
          : '',
        expiryDate:         asset.expiryDate
          ? asset.expiryDate.split('T')[0]
          : '',
        assetValue:         asset.assetValue      ?? '',
        assetStatus:        asset.assetStatus     ?? 'Available',
        imageURL:           asset.imageURL        ?? '',
      });
    }
  }, [isEdit, asset]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /*save / update */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axiosInstance.put(`/Asset/${asset.assetID}`, {
          assetID: asset.assetID,
          ...form,
        });
      } else {
        await axiosInstance.post('/Asset', form);
      }
      onClose();
    } catch (err) {
      alert(`Save failed:\n${err.response?.data || err.message}`);
      console.error(err);
    }
  };

  /*quick styles*/
  const backdrop = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1050,
  };

  const card = {
    width: '100%',
    maxWidth: 500,
    maxHeight: '92vh',
    overflowY: 'auto',
    background: 'rgba(0,0,0,.88)',
    borderRadius: 16,
    padding: '2rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };

  const labelCls = 'form-label text-white-50 fw-semibold mb-1';
  const inputCls = 'form-control bg-input text-white';

  /* render */
  return (
    <div style={backdrop} onClick={onClose}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <h5 className="text-center fw-semibold mb-4">
          {isEdit ? 'Edit Asset' : 'Add Asset'}
        </h5>

        <form onSubmit={handleSubmit}>
          {/* first column */}
          <div className="mb-3">
            <label className="form-label">Asset No</label>
            <input
              className="form-control"
              name="assetNo"
              value={form.assetNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="assetName"
              value={form.assetName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="assetCategoryID"
              value={form.assetCategoryID}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.assetCategoryID} value={c.assetCategoryID}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Model</label>
            <input
              className="form-control"
              name="assetModel"
              value={form.assetModel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Manufacturing Date</label>
            <input
              type="date"
              className="form-control"
              name="manufacturingDate"
              value={form.manufacturingDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Asset Value</label>
            <input
              type="number"
              className="form-control"
              name="assetValue"
              value={form.assetValue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="assetStatus"
              value={form.assetStatus}
              onChange={handleChange}
            >
              <option>Available</option>
              <option>Allocated</option>
              <option>InService</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Image URL</label>
            <input
              className="form-control"
              name="imageURL"
              value={form.imageURL}
              onChange={handleChange}
              placeholder="https://example.com/asset.jpg"
            />
            {form.imageURL && (
              <img
                src={form.imageURL}
                alt="preview"
                style={{
                  marginTop: 10,
                  maxWidth: 180,
                  maxHeight: 120,
                  borderRadius: 6,
                  border: '1px solid #444',
                }}
              />
            )}
          </div>

          {/* buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onClose}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,.15)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(13,110,253,.5)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = 'none')
              }
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
