import React from 'react';

/**
 * @param {Object[]} assets - List of asset objects.
 * @param {Function} onEdit - Callback when Edit is clicked.
 * @param {Function} onDelete - Callback when Delete is clicked.
 */
export default function AssetTable({ assets = [], onEdit, onDelete }) {
  if (!Array.isArray(assets) || assets.length === 0) {
    return (
      <div style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
        <i className="bi bi-box-seam" style={{ fontSize: 24, marginRight: 8 }}></i>
        No assets available.
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 14px 34px rgba(0,0,0,0.45)',
        marginTop: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          color: '#fff',
          fontSize: '0.93rem',
          minWidth: '900px',
        }}
      >
        <thead>
          <tr
            style={{
              background: 'linear-gradient(90deg, #141e30, #243b55)',
              color: '#f1f1f1',
              textAlign: 'left',
            }}
          >
            <th style={{ padding: '14px 20px', width: 90 }}>Image</th>
            <th style={{ padding: '14px 20px' }}>Asset No</th>
            <th style={{ padding: '14px 20px' }}>Name</th>
            <th style={{ padding: '14px 20px' }}>Model</th>
            <th style={{ padding: '14px 20px' }}>Status</th>
            <th style={{ padding: '14px 20px' }}>Value</th>
            <th style={{ padding: '14px 20px' }}>Category</th>
            <th style={{ padding: '14px 20px', width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr
              key={a.assetID}
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              {/* Image */}
              <td style={{ padding: '14px 20px' }}>
                {a.imageURL ? (
                  <img
                    src={a.imageURL}
                    alt={a.assetName || 'Asset'}
                    style={{
                      width: 70,
                      height: 45,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  />
                ) : (
                  <span style={{ color: '#888' }}>—</span>
                )}
              </td>

              {/* Text Details */}
              <td style={{ padding: '14px 20px' }}>{a.assetNo || '—'}</td>
              <td style={{ padding: '14px 20px' }}>{a.assetName || '—'}</td>
              <td style={{ padding: '14px 20px' }}>{a.assetModel || '—'}</td>

              {/* Status Badge */}
              <td style={{ padding: '14px 20px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '50px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    backgroundColor:
                      a.assetStatus === 'Available'
                        ? '#0d3b26ff'
                        : a.assetStatus === 'Allocated'
                        ? '#ffc107'
                        : '#6c757d',
                    color:
                      a.assetStatus === 'Allocated' ? '#000' : '#fff',
                    minWidth: 80,
                    textAlign: 'center',
                  }}
                >
                  <i
                    className={`bi ${
                      a.assetStatus === 'Available'
                        ? 'bi-check-circle'
                        : a.assetStatus === 'Allocated'
                        ? 'bi-box-arrow-in-right'
                        : 'bi-dash-circle'
                    }`}
                  />
                  {a.assetStatus || 'Unknown'}
                </span>
              </td>

              {/* Value & Category */}
              <td style={{ padding: '14px 20px' }}>
                ₹{a.assetValue ?? '0'}
              </td>
              <td style={{ padding: '14px 20px' }}>{a.categoryName || '—'}</td>

              {/* Actions */}
              <td style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onEdit?.(a)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #0dcaf0',
                      color: '#0dcaf0',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0dcaf0';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#0dcaf0';
                    }}
                  >
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(a.assetID)}
                    style={{
                      background: '#dc3545',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="bi bi-trash me-1"></i>Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
