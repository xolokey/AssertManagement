
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import AssetTable from '../../components/AssetTable';
import AddEditAssetForm from '../../components/AddEditAssetForm';
import AddEditCategoryForm from '../../components/AddEditCategoryForm';

export default function AssetManagement() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState('assets');
  const [editingAsset, setEditingAsset] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [assetSearch, setAssetSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('');
  const [cardView, setCardView] = useState(true);

  const unwrap = (p) =>
    Array.isArray(p) ? p :
    Array.isArray(p?.$values) ? p.$values :
    Array.isArray(p?.data) ? p.data : [];

  const getAssets = async () => {
    try {
      const res = await axiosInstance.get('/Asset');
      setAssets(unwrap(res.data));
    } catch {
      setAssets([]);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('/AssetCategory');
      setCategories(unwrap(res.data));
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    getAssets();
    getCategories();
  }, []);

  const deleteAsset = async (id) => {
    if (!window.confirm('Delete this asset?')) return;
    await axiosInstance.delete(`/Asset/${id}`).catch(() => {});
    getAssets();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axiosInstance.delete(`/AssetCategory/${id}`).catch(() => {});
    getCategories();
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.assetName?.toLowerCase().includes(assetSearch.toLowerCase()) ||
      a.assetNo?.toLowerCase().includes(assetSearch.toLowerCase());
    const matchesCategory = !assetCategoryFilter || a.categoryName?.toLowerCase() === assetCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = categories.filter((c) =>
    c.categoryName?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const btnStyles = {
    base: {
      padding: '0.5rem 1rem',
      borderRadius: '999px',
      fontSize: '0.875rem',
      fontWeight: 600,
      border: 'none',
      transition: 'all 0.3s ease-in-out',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    primary: {
      background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
      color: '#fff',
      boxShadow: '0 4px 14px rgba(0, 114, 255, 0.4)',
    },
    primaryHover: {
      background: 'linear-gradient(135deg,rgb(61, 140, 238),rgb(94, 32, 105))',
    },
    outline: {
      border: '1px linear-gradient(135deg,rgb(51, 128, 223),rgb(170, 33, 194))',
      backgroundColor: 'transparent',
      color: '#00c6ff',
    },
    danger: {
      background: 'linear-gradient(135deg, #ff4e50,rgb(38, 67, 236))',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(255, 78, 80, 0.4)',
    },
    dangerHover: {
      background: 'linear-gradient(135deg, #f9d423, #ff4e50)',
    },
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  };

  const styles = {
    container: { padding: 20 },
    card: {
      background: 'rgba(30, 30, 30, 0.8)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 8px 28px rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(6px)',
      marginBottom: 24,
    },
    tile: {
      background: 'rgba(20, 20, 20, 0.85)',
      padding: 24,
      borderRadius: 16,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    },
    input: {
      maxWidth: 250,
      backgroundColor: '#111',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: 8,
      padding: '8px 12px',
    },
    select: {
      maxWidth: 200,
      backgroundColor: '#111',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: 8,
      padding: '8px 12px',
    },
    closeBtn: {
      position: 'absolute',
      top: 10,
      right: 10,
      background: 'transparent',
      color: '#fff',
      border: 'none',
      fontSize: 20,
      cursor: 'pointer',
    },
    noResults: {
      color: '#aaa',
      textAlign: 'center',
      marginTop: 16,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: '#fff', fontWeight: 'bold' }}>Asset Management</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          <button
            style={{ ...btnStyles.base, ...(tab === 'assets' ? btnStyles.primary : btnStyles.outline) }}
            onClick={() => setTab('assets')}
          >
            Assets
          </button>
          <button
            style={{ ...btnStyles.base, ...(tab === 'categories' ? btnStyles.primary : btnStyles.outline) }}
            onClick={() => setTab('categories')}
          >
            Categories
          </button>
        </div>
      </div>

      {/* ASSETS TAB */}
      {tab === 'assets' && (
        <div style={styles.tile}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="text-light mb-0">Assets</h5>
            <div className="d-flex gap-2 flex-wrap align-items-center">
              <input
                type="text"
                placeholder="Search assets..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                style={styles.input}
              />
              <select
                value={assetCategoryFilter}
                onChange={(e) => setAssetCategoryFilter(e.target.value)}
                style={styles.select}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.assetCategoryID} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <button style={{ ...btnStyles.base, ...btnStyles.primary }} onClick={() => setEditingAsset({})}>
                <i className="bi bi-plus-circle"></i> Add Asset
              </button>
              <button
                style={{ ...btnStyles.base, ...btnStyles.light, fontSize: '0.75rem' }}
                onClick={() => setCardView(!cardView)}
              >
                <i className={`bi ${cardView ? 'bi-table' : 'bi-grid-3x3-gap-fill'}`}></i>
                {cardView ? 'Table View' : 'Card View'}
              </button>
            </div>
          </div>

          {/* CARD VIEW */}
          {cardView ? (
            <div className="d-flex flex-wrap justify-content-start">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.assetID}
                  style={{
                    background: 'linear-gradient(135deg, rgba(30,30,30,0.85), rgba(10,10,10,0.8))',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    color: '#fff',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    maxWidth: '300px',
                    margin: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                    e.currentTarget.style.boxShadow = '0 14px 36px rgba(59, 167, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.6)';
                  }}
                >
                  {asset.imageURL ? (
                    <img
                      src={asset.imageURL}
                      alt={asset.assetName}
                      style={{
                        height: 160,
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '14px',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 160,
                        backgroundColor: '#333',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        color: '#999',
                        fontStyle: 'italic',
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <div>
                    <h5 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{asset.assetName}</h5>
                    <p style={{ fontSize: '0.85rem', color: '#ccc' }}><strong>Model:</strong> {asset.assetModel || '—'}</p>
                    <p style={{ fontSize: '0.85rem', color: '#ccc' }}><strong>Value:</strong> ₹{asset.assetValue || 0}</p>
                    <p style={{ fontSize: '0.85rem', color: '#ccc' }}><strong>Category:</strong> {asset.categoryName || '—'}</p>
                    <span style={{
                      backgroundColor: asset.assetStatus === 'Available' ? '#198754'
                        : asset.assetStatus === 'Allocated' ? '#ffc107'
                          : '#6c757d',
                      color: asset.assetStatus === 'Allocated' ? '#000' : '#fff',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {asset.assetStatus}
                    </span>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button
                      style={{ ...btnStyles.base, ...btnStyles.outline }}
                      onClick={() => setEditingAsset(asset)}
                    >
                      <i className="bi bi-pencil"></i>Edit
                    </button>
                    <button
                      style={{ ...btnStyles.base, ...btnStyles.danger }}
                      onClick={() => deleteAsset(asset.assetID)}
                    >
                      <i className="bi bi-trash"></i>Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AssetTable assets={filteredAssets} onEdit={setEditingAsset} onDelete={deleteAsset} />
          )}

          {filteredAssets.length === 0 && <div style={styles.noResults}>No matching assets found.</div>}
          {editingAsset !== null && (
            <div className="position-relative mt-4">
              <button style={styles.closeBtn} onClick={() => setEditingAsset(null)} title="Close">×</button>
              <AddEditAssetForm
                asset={editingAsset}
                categories={categories}
                onClose={() => {
                  setEditingAsset(null);
                  getAssets();
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {tab === 'categories' && (
        <div style={styles.tile}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="text-light mb-0">Asset Categories</h5>
            <div className="d-flex gap-2 flex-wrap">
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                style={styles.input}
              />
              <button style={{ ...btnStyles.base, ...btnStyles.primary }} onClick={() => setEditingCat({})}>
                <i className="bi bi-plus-circle"></i> Add Category
              </button>
            </div>
          </div>
          <div className="table-responsive rounded bg-dark bg-opacity-75 shadow-lg">
            <table className="table text-white align-middle mb-0">
              <thead className="bg-white text-dark">
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Category</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.assetCategoryID}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td>{cat.assetCategoryID}</td>
                    <td>{cat.categoryName}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          style={{ ...btnStyles.base, ...btnStyles.outline, fontSize: '0.75rem' }}
                          onClick={() => setEditingCat(cat)}
                        >
                          <i className="bi bi-pencil"></i>Edit
                        </button>
                        <button
                          style={{ ...btnStyles.base, ...btnStyles.danger, fontSize: '0.75rem' }}
                          onClick={() => deleteCategory(cat.assetCategoryID)}
                        >
                          <i className="bi bi-trash"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCategories.length === 0 && <div style={styles.noResults}>No matching categories found.</div>}
          {editingCat !== null && (
            <div className="position-relative mt-4">
              <button style={styles.closeBtn} onClick={() => setEditingCat(null)} title="Close">×</button>
              <AddEditCategoryForm
                category={editingCat}
                onClose={() => {
                  setEditingCat(null);
                  getCategories();
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}