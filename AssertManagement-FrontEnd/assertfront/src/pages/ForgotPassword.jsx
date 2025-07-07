import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import logo from '../assets/logotrans.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('/auth/forgot-password', { email });
      setMessage('Password Reset link Sent to your Email.');
    } catch {
      setError('Failed to Send Reset Email. Please Try-Again.');
    }
  };

  const styles = {
    container: {
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#111',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '6%',
      position: 'relative',
      fontFamily: 'Poppins, sans-serif',
    },
    spline: {
      position: 'fixed',
      top: '1in', // shifted 1 inch down
      right: 0,
      width: '60%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    },
    logo: {
      position: 'absolute',
      top: '1rem',
      left: '1.5rem',
      height: '60px',
      width: 'auto',
      zIndex: 10,
    },
    card: {
      zIndex: 2,
      width: '100%',
      maxWidth: '400px',
      background: 'rgba(0, 0, 0, 0.55)',
      padding: '2rem',
      borderRadius: '16px',
      color: '#fff',
      backdropFilter: 'blur(6px)',
      animation: 'fadeInUp 0.9s ease',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      background: focus ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
      color: '#fff',
      marginBottom: '1rem',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: focus ? '0 0 0 2px rgba(13, 110, 253, 0.4)' : 'none',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#0d6efd',
      color: '#fff',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      ...(hover && {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(13,110,253,0.5)',
      }),
    },
    msg: {
      marginTop: '1rem',
      fontWeight: 500,
    },
    success: { color: 'lightgreen' },
    error: { color: 'salmon' },
  };

  return (
    <div style={styles.container}>
      <spline-viewer
        url="https://prod.spline.design/WlWQiM7Btr76TSOr/scene.splinecode"
        style={styles.spline}
      ></spline-viewer>

      <img src={logo} alt="HexaTrack" style={styles.logo} />

      <div style={styles.card}>
        <h4 className="text-white-50 mb-4">Forgot your password?</h4>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />

          <button
            type="submit"
            style={styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Send Reset Link
          </button>

          {message && (
            <p style={{ ...styles.msg, ...styles.success }}>{message}</p>
          )}
          {error && <p style={{ ...styles.msg, ...styles.error }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
