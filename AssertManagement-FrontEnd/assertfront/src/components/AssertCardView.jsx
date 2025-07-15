import React from 'react';

/**
 * AssetCardView - Displays a beautiful glassmorphic list of asset cards.
 * @param {Object[]} assets - List of asset objects.
 * @param {Function} onEdit - Callback when Edit is clicked.
 * @param {Function} onDelete - Callback when Delete is clicked.
 */
export default function AssetCardView({ assets = [], onEdit, onDelete }) {
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
        paddingBottom: '1rem',
      }}
    >
      {assets.map((a) => (
        <div
          key={a.assetID}
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '22px',
            padding: '20px',
            color: '#fff',
            backdropFilter: 'blur(18px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px) rotateX(2deg)';
            e.currentTarget.style.boxShadow = '0 28px 80px rgba(0,0,0,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
          }}
        >
          {/* Glowing edge animation */}
          <div
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '24px',
              background: 'conic-gradient(from 180deg at 50% 50%, #00fff0, #8a2be2, #ff7f50, #00fff0)',
              filter: 'blur(16px)',
              zIndex: 0,
              animation: 'rotateGlow 10s linear infinite',
              opacity: 0.1,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Image */}
            <div style={{ marginBottom: 14, borderRadius: 14, overflow: 'hidden' }}>
              {a.imageURL ? (
                <img
                  src={a.imageURL}
                  alt={a.assetName}
                  style={{
                    width: '100%',
                    height: 170,
                    objectFit: 'cover',
                    borderRadius: '14px',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 170,
                    backgroundColor: '#2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '14px',
                    color: '#888',
                    fontStyle: 'italic',
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {/* Info */}
            <h5 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              <i className="bi bi-cpu me-2" />
              {a.assetName || 'Unnamed'}
            </h5>

            <div style={{ fontSize: '0.95rem', color: '#ccc', lineHeight: 1.6 }}>
              <div><strong>Asset No:</strong> {a.assetNo || '—'}</div>
              <div><strong>Model:</strong> {a.assetModel || '—'}</div>
              <div><strong>Category:</strong> {a.categoryName || '—'}</div>
              <div>
                <strong>Status:</strong>{' '}
                <span
                  style={{
                    padding: '5px 14px',
                    fontSize: '0.75rem',
                    borderRadius: '50px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background:
                      a.assetStatus === 'Available'
                        ? 'linear-gradient(to right, #00ff99, #1abc9c)'
                        : a.assetStatus === 'Allocated'
                        ? 'linear-gradient(to right, #ffc107, #ff6f00)'
                        : 'linear-gradient(to right, #6c757d, #495057)',
                    color: '#fff',
                    boxShadow: 'inset 0 0 4px rgba(0,0,0,0.2)',
                  }}
                >
                  <i className={`bi ${
                    a.assetStatus === 'Available'
                      ? 'bi-check-circle'
                      : a.assetStatus === 'Allocated'
                      ? 'bi-box-arrow-in-right'
                      : 'bi-dash-circle'
                  }`} />
                  {a.assetStatus || '—'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                className="btn"
                style={{
                  background: 'linear-gradient(to right, #0dcaf0, #39f)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(13,202,240,0.4)',
                }}
                onClick={() => onEdit?.(a)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="bi bi-pencil me-1" />
                Edit
              </button>

              <button
                className="btn"
                style={{
                  background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255,65,108,0.4)',
                }}
                onClick={() => onDelete?.(a.assetID)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.07)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <i className="bi bi-trash me-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
