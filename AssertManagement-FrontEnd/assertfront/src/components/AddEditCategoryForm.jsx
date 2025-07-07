import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function AddEditCategoryForm({ category, onClose }) {
  const isEdit = category && category.assetCategoryID;

  const [form, setForm] = useState({
    categoryName: '',
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        categoryName: category.categoryName || '',
      });
    }
  }, [isEdit, category]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axiosInstance.put(
          `/AssetCategory/${category.assetCategoryID}`,
          {
            assetCategoryID: category.assetCategoryID,
            ...form,
          }
        );
      } else {
        await axiosInstance.post('/AssetCategory', form);
      }
      onClose();
    } catch (err) {
      alert(`Save failed:\n${err.response?.data || err.message}`);
      console.error('Category save failed:', err);
    }
  };

  /* ─── styles ─── */
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
    maxWidth: 400,
    background: 'rgba(0,0,0,.88)',
    borderRadius: 16,
    padding: '2rem',
    color: '#fff',
    boxShadow: '0 8px 24px rgba(0,0,0,.6)',
  };

  const labelCls = 'form-label text-white-50 fw-semibold mb-1';
  const inputCls = 'form-control bg-input text-white';

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <h5 className="text-center fw-semibold mb-4">
          {isEdit ? 'Edit Category' : 'Add Category'}
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Category Name</label>
            <input
              className="form-select"
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
              required
            />
          </div>

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
