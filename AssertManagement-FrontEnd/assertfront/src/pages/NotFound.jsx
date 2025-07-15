// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.text}>Oops! The page <code>{location.pathname}</code> doesn't exist.</p>
        <button onClick={() => navigate('/')} style={styles.button}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    background: 'linear-gradient(135deg, #1f1f1f, #2c2c2c)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '2rem 3rem',
    borderRadius: '16px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  heading: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  text: {
    fontSize: '18px',
    marginBottom: '1.5rem',
    color: '#ccc',
  },
  button: {
    background: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};
