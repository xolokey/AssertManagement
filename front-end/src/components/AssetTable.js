// ────────────────────────────────────────────────────────────────
// src/components/AssetTable.js  ⏤ styled to match EmployeeTable
// ────────────────────────────────────────────────────────────────
import React from 'react';

export default function AssetTable({ assets = [], onEdit, onDelete }) {
  if (!Array.isArray(assets) || assets.length === 0) {
    return (
      <p className="text-white-50 my-3">
        No assets found.
      </p>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped table-hover align-middle mb-0">
        <thead style={{ background: 'rgba(255,255,255,.05)' }}>
          <tr>
            <th style={{ width: 90 }}>Image</th>
            <th style={{ width: 120 }}>Asset No</th>
            <th>Name</th>
            <th>Model</th>
            <th style={{ width: 120 }}>Status</th>
            <th style={{ width: 100 }}>Value</th>
            <th style={{ width: 140 }}>Category</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((a) => (
            <tr key={a.assetID}>
              {/* image */}
              <td>
                {a.imageURL ? (
                  <img
                    src={a.imageURL}
                    alt="asset"
                    style={{
                      width: 70,
                      height: 45,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #444',
                    }}
                  />
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>

              {/* plain fields */}
              <td>{a.assetNo}</td>
              <td>{a.assetName}</td>
              <td>{a.assetModel}</td>

              {/* status badge */}
              <td>
                <span
                  className={`badge ${
                    a.assetStatus === 'Available'
                      ? 'bg-success'
                      : a.assetStatus === 'Allocated'
                      ? 'bg-warning text-dark'
                      : 'bg-secondary'
                  }`}
                >
                  {a.assetStatus}
                </span>
              </td>

              <td>{a.assetValue}</td>
              <td>{a.categoryName}</td>

              {/* action buttons */}
              <td>
                <button
                  className="btn btn-sm btn-outline-light me-2"
                  onClick={() => onEdit(a)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(a.assetID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
