import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['Employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
