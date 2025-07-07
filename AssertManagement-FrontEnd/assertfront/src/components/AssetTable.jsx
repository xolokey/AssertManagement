import React from 'react';

/**
 * Displays a Bootstrap-styled asset table with actions.
 * @param {Object[]} assets - Array of asset objects.
 * @param {Function} onEdit - Function to handle editing an asset.
 * @param {Function} onDelete - Function to handle deleting an asset.
 */
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
              {/* Image */}
              <td>
                {a.imageURL ? (
                  <img
                    src={a.imageURL}
                    alt={`${a.assetName || 'Asset'} image`}
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

              {/* Asset info */}
              <td>{a.assetNo || '—'}</td>
              <td>{a.assetName || '—'}</td>
              <td>{a.assetModel || '—'}</td>

              {/* Status badge */}
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
                  {a.assetStatus || 'Unknown'}
                </span>
              </td>

              <td>{a.assetValue || 0}</td>
              <td>{a.categoryName || '—'}</td>

              {/* Action buttons */}
              <td>
                <button
                  className="btn btn-sm btn-outline-light me-2"
                  onClick={() => onEdit(a)}
                  aria-label={`Edit ${a.assetName}`}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(a.assetID)}
                  aria-label={`Delete ${a.assetName}`}
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
