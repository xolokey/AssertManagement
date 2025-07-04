// src/pages/ResetPassword.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useSearchParams } from 'react-router-dom';

import logo from '../assets/logo.png';
import bg from '../assets/bg.jpg';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [hover, setHover] = useState(false); // 👈 hover state

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirm) {
      setMessage('❗ Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/auth/reset-password', {
        token,
        newPassword: password
      });
      setMessage('✅ ' + response.data);
    } catch (err) {
      setMessage('❗ ' + (err.response?.data || 'Something went wrong'));
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      background: 'rgba(0,0,0,0.7)',
      padding: '2rem',
      borderRadius: '16px',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
    },
    logo: {
      display: 'block',
      margin: '0 auto 0.5rem',
      height: '300px',
      marginTop: '-7rem',
      marginBottom: '-5rem',

    },
    input: {
      width: '100%',
      padding: '0.6rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
      marginBottom: '1rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      color: '#fff',
    },
    button: {
      width: '100%',
      padding: '0.6rem',
      backgroundColor: '#0d6efd',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform .15s ease, box-shadow .15s ease',
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
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleReset}>
        <img src={logo} alt="HexaTrack Logo" style={styles.logo} />
        <h4 className="text-center mb-4">Reset Password</h4>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          required
          onChange={(e) => setConfirm(e.target.value)}
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
        >
          Reset Password
        </button>

        {message && <div style={styles.message}>{message}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;
