import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import logo from '../assets/logotrans.png';
import './Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear any old session on load
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/Auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'Admin') {
        navigate('/admin');
      } else if (data.user.role === 'Employee') {
        navigate('/employee');
      } else {
        setError('Unauthorized role');
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Invalid Email or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      {/* Left Panel - Login Form */}
      <div className="left-panel">
        <img src={logo} alt="HexaTrack" className="top-left-logo" />
        <div className="login-card shadow-lg">
          <h4 className="text-center mb-4 fw-semibold text-white-50">
            Sign In To Continue
          </h4>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white-50">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control bg-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="form-label text-white-50">
                Password
              </label>
              <input
                type="password"
                id="password"
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

            {error && (
              <div className="alert alert-danger py-1 text-center">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 login-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - 3D Background */}
      <div className="right-panel">
        <div className="spline-wrapper">
          <spline-viewer url="https://prod.spline.design/WlWQiM7Btr76TSOr/scene.splinecode"style={{ top:'0.8in'}}/>
        </div>
      </div>
    </div>
  );
}


