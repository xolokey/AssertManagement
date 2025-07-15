import React, { useState, useEffect } from 'react';
import EmployeeManagement from './Admin/EmployeeManagement';
import AssetManagement from './Admin/AssetManagement';
import AdminServiceRequests from './Admin/AdminServiceRequests';
import AdminAuditRequests from './Admin/AdminAuditRequests';
import AdminAssetAllocation from './Admin/AdminAssetAllocation';

import FlipTile from '../components/FlipTile';
import logo from '../assets/logotrans.png';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);

  // const user = {
  //   name: localStorage.getItem('name') || 'Admin',
  //   role: localStorage.getItem('role') || 'Administrator',
  // };


  useEffect(() => {
    const timeout = setTimeout(() => setShowGreeting(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'employees': return <EmployeeManagement />;
      case 'assets': return <AssetManagement />;
      case 'services': return <AdminServiceRequests />;
      case 'audits': return <AdminAuditRequests />;
      case 'allocations': return <AdminAssetAllocation />;
      default: return null;
    }
  };

  const tiles = [
    { id: 'employees', label: 'Employees', icon: <span style={{ fontSize: 64 }}>👥</span> },
    { id: 'assets', label: 'Assets', icon: <span style={{ fontSize: 64 }}>💻</span> },
    { id: 'services', label: 'Service Requests', icon: <span style={{ fontSize: 64 }}>🛠️</span> },
    { id: 'audits', label: 'Audit Requests', icon: <span style={{ fontSize: 64 }}>📋</span> },
    { id: 'allocations', label: 'Asset Allocations', icon: <span style={{ fontSize: 64 }}>🔗</span> },
  ];

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      fontFamily: 'Poppins, sans-serif',
      color: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
    }}>
       <spline-viewer
        url="https://prod.spline.design/51OYrfxvceNXpuod/scene.splinecode"
        style={{
          position: 'fixed',
          top: '0.8in',
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          //background: 'linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          pointerEvents: 'none',
        }}
      />


      {/* ─── Overlay ─── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
        zIndex: 0,
      }} />

      {/* ─── Header ─── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        background: 'rgba(43, 43, 43, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}>
        <img
          src={logo}
          alt="HexaTrack"
          style={{ height: 54, width: 'auto', marginRight: '1.25rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('')}
        />

        {activeTab ? (
          <button className="btn btn-outline-light btn-sm" onClick={() => setActiveTab('')}>
            ← Dashboard
          </button>
        ) : (
          <h5 className="mb-0 text-white-50 fw-semibold">Admin Dashboard</h5>
        )}

        <div className="ms-auto d-flex align-items-center gap-3">
          {/* <div className="text-end d-none d-md-block">
            <div className="fw-semibold">🧑 {user.name}</div>
            <small className="text-white-50">{user.role}</small>
          </div> */}
          <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content  */}
      <main style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        {activeTab === '' ? (
          <div className="tile-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}>
            {tiles.map((tile) => (
              <FlipTile key={tile.id} label={tile.label} icon={tile.icon} onClick={() => setActiveTab(tile.id)} />
            ))}
          </div>
        ) : (
          <div className="fade-in">{renderTab()}</div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease forwards;
        }

        .tile-grid > div {
          transition: transform 0.25s ease;
        }

        .tile-grid > div:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
