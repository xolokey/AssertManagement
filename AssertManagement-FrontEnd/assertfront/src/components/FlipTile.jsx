import React, { useState } from 'react';

export default function FlipTile({ label, icon, onClick, size = 200 }) {
  const [hover, setHover] = useState(false);

  // Styles
  const wrapper = {
    perspective: '800px',
    width: '100%',
    height: size,
    cursor: 'pointer',
    outline: hover ? '2px solid #0d6efd' : 'none',
    borderRadius: 16,
  };

  const card = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s ease-in-out',
    transformStyle: 'preserve-3d',
    transform: hover ? 'rotateY(180deg)' : 'none',
  };

  const face = {
    position: 'absolute',
    inset: 0,
    borderRadius: 16,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    background: 'rgba(0,0,0,0.55)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    fontWeight: 600,
    fontSize: '1.1rem',
    textAlign: 'center',
  };

  const back = {
  ...face,
  transform: 'rotateY(180deg) scale(1.05)',

  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.85))',
  backgroundSize: '400% 400%',
  animation: 'gradientShift 8s ease infinite',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: 16,
  color: '#fff',
  fontSize: 38,
  textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',

  boxShadow: '0 0 15px rgba(104,145,232,0.4), 0 0 30px rgba(149,189,249,0.15)',

  transition: 'transform 0.6s ease-in-out, box-shadow 0.4s ease-in-out',
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
        {/* Front face */}
        <div style={face}>{label}</div>

        {/* Back face */}
        <div style={back}>{icon}</div>
      </div>
    </div>
  );
}
