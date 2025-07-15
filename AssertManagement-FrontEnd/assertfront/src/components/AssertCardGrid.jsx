import React from 'react';

export default function AssetCardGrid({ assets = [], onEdit, onDelete }) {
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
      className="d-flex flex-wrap gap-4 mt-4"
      style={{
        justifyContent: 'start',
      }}
    >
      {assets.map((a) => (
        <div
          key={a.assetID}
          className="shadow-sm"
          style={{
            width: '280px',
            borderRadius: '16px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            position: 'relative',
            transition: 'transform 0.2s ease, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
        >
          <img
            src={a.imageURL || 'https://via.placeholder.com/280x150?text=No+Image'}
            alt={a.assetName}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
          <h5 className="fw-semibold mb-1">{a.assetName || 'Unnamed Asset'}</h5>
          <p className="text-light small mb-1">
            <i className="bi bi-cpu me-1"></i>Model: <strong>{a.assetModel || '—'}</strong>
          </p>
          <p className="text-light small mb-1">
            <i className="bi bi-hash me-1"></i>Asset No: {a.assetNo || '—'}
          </p>
          <p className="text-light small mb-1">
            <i className="bi bi-tag me-1"></i>Value: ₹{a.assetValue || '0'}
          </p>

          <span
            className="badge mb-3"
            style={{
              backgroundColor:
                a.assetStatus === 'Available'
                  ? '#198754'
                  : a.assetStatus === 'Allocated'
                  ? '#ffc107'
                  : '#6c757d',
              color: a.assetStatus === 'Allocated' ? '#000' : '#fff',
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: '50px',
            }}
          >
            {a.assetStatus || 'Unknown'}
          </span>

          <div className="d-flex justify-content-between mt-2">
            <button
              onClick={() => onEdit?.(a)}
              className="btn btn-outline-info btn-sm"
            >
              <i className="bi bi-pencil me-1"></i>Edit
            </button>
            <button
              onClick={() => onDelete?.(a.assetID)}
              className="btn btn-danger btn-sm"
            >
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
