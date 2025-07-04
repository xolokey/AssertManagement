// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';    // ← use your axios instance
import logo from '../assets/logo.png';
import bg   from '../assets/bg.jpg';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [error,   setError]   = useState('');
  const [hover,   setHover]   = useState(false);   // 👈 hover state for button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');

    try {
      await axios.post('/auth/forgot-password', { email });
      setMessage('Password reset link sent to your email.');
    } catch {
      setError('Failed to send reset email. Please try again.');
    }
  };

  /* — inline styles — */
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '100%',
      maxWidth: 400,
      background: 'rgba(0,0,0,0.7)',
      padding: '2rem',
      borderRadius: 16,
      color: '#fff',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(6px)',
      textAlign: 'center',
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
      padding: '.6rem',
      borderRadius: 6,
      border: '1px solid #ccc',
      marginBottom: '1rem',
      background: 'rgba(255,255,255,0.1)',
      color: '#fff',
    },
    button: {
      width: '100%',
      padding: '.6rem',
      border: 'none',
      borderRadius: 6,
      fontWeight: 600,
      color: '#fff',
      cursor: 'pointer',
      background: '#0d6efd',
      transition: 'transform .15s ease, box-shadow .15s ease',
      /* hover / focus style when `hover` === true */
      ...(hover && {
        transform : 'translateY(-1px)',
        boxShadow : '0 4px 12px rgba(13,110,253,0.5)',
      }),
    },
    msg: {
      marginTop: '1rem',
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <img src={logo} alt="HexaTrack" style={styles.logo} />

        <h4 className="fw-semibold mb-4">Forgot Password</h4>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={()     => setHover(true)}
          onBlur={()      => setHover(false)}
        >
          Send Reset Link
        </button>

        {message && <p style={{ ...styles.msg, color: 'lightgreen' }}>{message}</p>}
        {error   && <p style={{ ...styles.msg, color: 'salmon'     }}>{error}</p>}
      </form>
    </div>
  );
}
