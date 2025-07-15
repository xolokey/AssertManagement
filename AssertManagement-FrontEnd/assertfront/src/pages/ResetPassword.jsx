import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axiosInstance';

import logo from '../assets/logotrans.png';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [hover, setHover] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirm) {
      setMessage('❗ Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      setMessage('✅ ' + res.data);
    } catch (err) {
      setMessage('❗ ' + (err.response?.data || 'Something went wrong'));
    }
  };

  const styles = {
    container: {
      height: '100vh',
      width: '100%',
      backgroundColor: '#111',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '6%',
      position: 'relative',
      fontFamily: 'Poppins, sans-serif',
    },
    spline: {
      position: 'fixed',
      top: 0,
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
    heading: {
      fontSize: '1.6rem',
      fontWeight: 600,
      color: '#ffffffcc',
      marginBottom: '1.25rem',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      background: 'rgba(255, 255, 255, 0.10)',
      color: '#fff',
      marginBottom: '1rem',
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
    message: {
      marginTop: '1rem',
      fontWeight: 500,
      color: message?.startsWith('✅') ? 'lightgreen' : 'salmon',
    },
  };

  return (
    <div style={styles.container}>
      <spline-viewer
        url="https://prod.spline.design/WlWQiM7Btr76TSOr/scene.splinecode"
        style={styles.spline}
      ></spline-viewer>

      <img src={logo} alt="HexaTrack" style={styles.logo} />

      <form style={styles.card} onSubmit={handleReset}>
        <h4 style={styles.heading}>
          🔐 Reset your password
        </h4>

        <input
          type="password"
          placeholder="New password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Reset Password
        </button>

        {message && <div style={styles.message}>{message}</div>}
      </form>
    </div>
  );
}

