// src/pages/Admin/AssetManagement.js
import React, { useEffect, useState } from 'react';
import axiosInstance          from '../../api/axiosInstance';
import AssetTable             from '../../components/AssetTable';
import AddEditAssetForm       from '../../components/AddEditAssetForm';
import AddEditCategoryForm    from '../../components/AddEditCategoryForm';

export default function AssetManagement() {
  /* ───── state ───── */
  const [assets,        setAssets]        = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [tab,           setTab]           = useState('assets');
  const [editingAsset,  setEditingAsset]  = useState(null);
  const [editingCat,    setEditingCat]    = useState(null);

  /* unwrap helper                                          */
  const unwrap = (p) =>
    Array.isArray(p)            ? p
    : Array.isArray(p?.$values) ? p.$values
    : Array.isArray(p?.data)    ? p.data
    : [];

  /* fetch lists                                            */
  const getAssets = async () => {
    try { setAssets(unwrap((await axiosInstance.get('/Asset')).data)); }
    catch { setAssets([]); }
  };
  const getCategories = async () => {
    try { setCategories(unwrap((await axiosInstance.get('/AssetCategory')).data)); }
    catch { setCategories([]); }
  };
  useEffect(() => { getAssets(); getCategories(); }, []);

  /* delete helpers                                         */
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

  /* quick style tokens                                     */
  const tile   = { background:'#1e1e1e', border:'1px solid #333', borderRadius:12, padding:24, marginTop:24, boxShadow:'0 4px 12px rgba(0,0,0,.45)', color:'#fff' };
  const tabBtn = (on) => ({ background:on? '#0d6efd':'transparent', color:on? '#fff':'#aaa', border:'1px solid #0d6efd', padding:'6px 16px', marginRight:8, borderRadius:8, cursor:'pointer' });
  const addBtn = { background:'#0d6efd', color:'#fff', border:'none', padding:'8px 14px', borderRadius:8 };

  /* ───── ui ───── */
  return (
    <div style={{padding:20,color:'#fff'}}>
      <h2>Asset Management</h2>

      {/* tabs */}
      <div className="mb-3">
        <button style={tabBtn(tab==='assets')}      onClick={()=>setTab('assets')}>Assets</button>
        <button style={tabBtn(tab==='categories')}  onClick={()=>setTab('categories')}>Categories</button>
      </div>

      {/* ───── assets tile ───── */}
      {tab==='assets' && (
        <div style={tile}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Assets</h5>
            <button style={addBtn} onClick={()=>setEditingAsset({})}>+ Add Asset</button>
          </div>

          <AssetTable
            assets   ={assets}
            onEdit   ={setEditingAsset}
            onDelete ={deleteAsset}
          />

          {editingAsset && (
            <AddEditAssetForm
              asset       ={editingAsset}
              categories  ={categories}
              onClose     ={()=>{ setEditingAsset(null); getAssets(); }}
            />
          )}
        </div>
      )}

      {/* ───── categories tile ───── */}
      {tab==='categories' && (
        <div style={tile}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Asset Categories</h5>
            <button style={addBtn} onClick={()=>setEditingCat({})}>+ Add Category</button>
          </div>

          {/* bootstrap‑styled table 🠗 */}
          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover align-middle mb-0">
              <thead style={{background:'rgba(255,255,255,.05)'}}>
                <tr>
                  <th style={{width:80}}>ID</th>
                  <th>Category</th>
                  <th style={{width:150}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat=>(
                  <tr key={cat.assetCategoryID}>
                    <td>{cat.assetCategoryID}</td>
                    <td>{cat.categoryName}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-light me-2"
                        onClick={()=>setEditingCat(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={()=>deleteCategory(cat.assetCategoryID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingCat && (
            <AddEditCategoryForm
              category  ={editingCat}
              onClose   ={()=>{ setEditingCat(null); getCategories(); }}
            />
          )}
        </div>
      )}
    </div>
  );
}
