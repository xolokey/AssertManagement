import React, { useState } from 'react';

/**
 * A small 3‑D “flip‑card” that shows text on the front
 * and an icon / image on the back while hovering.
 *
 * Props
 * ──
 * label   : string (front‑face text)
 * icon    : ReactNode (back‑face JSX ‑ emoji / ⬆ imported img / svg)
 * onClick : () => void
 */
export default function FlipTile({ label, icon, onClick }) {
  const [hover, setHover] = useState(false);

  /* ----- shared sizes ----- */
  const size = 200; // tile height in px

  /* ----- wrapper keeping 3‑D context ----- */
  const wrapper = {
    perspective: '800px',
    width: '100%',
    height: size,
    cursor: 'pointer',
  };

  /* ----- card faces ----- */
  const card = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s',
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
  };

  const back = {
    ...face,
    transform: 'rotateY(180deg)',
    background: 'rgba(13,110,253,0.9)',
    borderColor: 'rgba(13,110,253,0.9)',
  };

  return (
    <div
      style={wrapper}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onClick={onClick}
      tabIndex={0}     /* allows keyboard focus */
    >
      <div style={card}>
        {/* front */}
        <div style={face}>{label}</div>

        {/* back */}
        <div style={back}>{icon}</div>
      </div>
    </div>
  );
}
