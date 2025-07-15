import React, { useState } from 'react';

export default function FlipTile({ label, icon, onClick, size = 200 }) {
  const [hover, setHover] = useState(false);

  const wrapper = {
    perspective: '1000px',
    width: '100%',
    height: size,
    cursor: 'pointer',
    borderRadius: 16,
    outline: 'none',
  };

  const card = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s ease-in-out',
    transform: hover ? 'rotateY(180deg)' : 'none',
  };

  const faceCommon = {
    position: 'absolute',
    inset: 0,
    borderRadius: 16,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    textAlign: 'center',
    fontWeight: 600,
    userSelect: 'none',
  };

  const front = {
    ...faceCommon,
    background: 'rgba(74, 74, 80, 0.85)', // darker base
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#d4d4d4',
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(6px)',
    boxShadow: hover
      ? '0 6px 18px rgba(0, 0, 0, 0.7)'
      : '0 4px 12px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease-in-out',
  };

  const back = {
    ...faceCommon,
    transform: 'rotateY(180deg)',
    fontSize: 42,
    color: '#fefefe',
    background: 'linear-gradient(135deg,rgb(131, 42, 255), #0c0c0f,rgb(58, 71, 255))',
    boxShadow:
      '0 0 18px rgba(0, 102, 255, 0.35), 0 0 38px rgba(0, 153, 255, 0.2)',
    animation: 'glow 5s ease-in-out infinite',
    textShadow: '0 2px 6px rgba(0,0,0,0.6)',
  };

  return (
    <div
      style={wrapper}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Tile: ${label}`}
    >
      <div style={card}>
        <div style={front}>{label}</div>
        <div style={back}>{icon}</div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes glow {
          0%   { box-shadow: 0 0 10px rgba(0,150,255,0.1); }
          50%  { box-shadow: 0 0 25px rgba(0,150,255,0.4); }
          100% { box-shadow: 0 0 10px rgba(0,150,255,0.1); }
        }
      `}</style>
    </div>
  );
}
