import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AddEditAssetForm({ asset, categories = [], onClose }) {
  const isEdit = asset?.assetID;

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
        assetNo: asset.assetNo ?? '',
        assetName: asset.assetName ?? '',
        assetCategoryID: asset.assetCategoryID ?? '',
        assetModel: asset.assetModel ?? '',
        manufacturingDate: asset.manufacturingDate?.split('T')[0] || '',
        expiryDate: asset.expiryDate?.split('T')[0] || '',
        assetValue: asset.assetValue ?? '',
        assetStatus: asset.assetStatus ?? 'Available',
        imageURL: asset.imageURL ?? '',
      });
    }
  }, [isEdit, asset]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      alert(`❌ Save failed:\n${err.response?.data || err.message}`);
      console.error(err);
    }
  };

  const styles = {
    backdrop: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      overflowY: 'auto',
      zIndex: 1050,
    },
    card: {
      width: '100%',
      maxWidth: 500,
      background: 'rgba(0,0,0,0.88)',
      borderRadius: 16,
      padding: '2rem',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    },
    preview: {
      marginTop: 10,
      maxWidth: 180,
      maxHeight: 120,
      borderRadius: 6,
      border: '1px solid #444',
    },
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <h5 className="text-center fw-semibold mb-4">
          {isEdit ? 'Edit Asset' : 'Add New Asset'}
        </h5>

        <form onSubmit={handleSubmit}>
          {[
            ['assetNo', 'Asset No'],
            ['assetName', 'Name'],
            ['assetModel', 'Model'],
            ['manufacturingDate', 'Manufacturing Date', 'date'],
            ['expiryDate', 'Expiry Date', 'date'],
            ['assetValue', 'Asset Value', 'number'],
            ['imageURL', 'Image URL'],
          ].map(([name, label, type = 'text']) => (
            <div className="mb-3" key={name}>
              <label className="form-label" htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                className="form-control"
                value={form[name]}
                onChange={handleChange}
                required={name !== 'imageURL'}
              />
            </div>
          ))}

          {/* Category Dropdown */}
          <div className="mb-3">
            <label className="form-label" htmlFor="assetCategoryID">
              Category
            </label>
            <select
              id="assetCategoryID"
              name="assetCategoryID"
              className="form-select"
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

          {/* Status Dropdown */}
          <div className="mb-4">
            <label className="form-label" htmlFor="assetStatus">
              Status
            </label>
            <select
              id="assetStatus"
              name="assetStatus"
              className="form-select"
              value={form.assetStatus}
              onChange={handleChange}
            >
              <option>Available</option>
              <option>Allocated</option>
              <option>InService</option>
            </select>
          </div>

          {/* Image Preview */}
          {form.imageURL && (
            <div className="mb-4">
              <img
                src={form.imageURL}
                alt="Asset Preview"
                style={styles.preview}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
