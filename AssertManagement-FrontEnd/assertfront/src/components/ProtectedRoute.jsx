// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  // Not logged in: no token or user
  if (!token || !user?.role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
