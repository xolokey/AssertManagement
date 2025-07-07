import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import logo from '../assets/logotrans.png';
import './Login.css';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/Auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'Admin')        navigate('/admin');
      else if (data.user.role === 'Employee') navigate('/employee');
      else setError('Unauthorized Role.');
    } catch {
      setError('Invalid Email or Password.');
    }
  };

  return (
    <div className="split-layout">
      <div className="left-panel">
        <img src={logo} alt="HexaTrack" className="top-left-logo" />
        <div className="login-card shadow-lg">
          <h4 className="text-center mb-4 fw-semibold text-white-50">
            Sign In To Continue
          </h4>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-white-50">Email address</label>
              <input
                type="email"
                className="form-control bg-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label text-white-50">Password</label>
              <input
                type="password"
                className="form-control bg-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 text-end">
              <a href="/forgot-password" className="link-light small">
                Forgot Password?
              </a>
            </div>

            {error && <div className="alert alert-danger py-1">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
      <div className="right-panel">
        <spline-viewer url="https://prod.spline.design/WlWQiM7Btr76TSOr/scene.splinecode" />
      </div>
    </div>
  );
}
