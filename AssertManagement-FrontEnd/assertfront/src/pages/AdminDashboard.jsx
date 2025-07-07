import React, { useState } from 'react';
import EmployeeManagement   from './Admin/EmployeeManagement';
import AssetManagement      from './Admin/AssetManagement';
import AdminServiceRequests from './Admin/AdminServiceRequests';
import AdminAuditRequests   from './Admin/AdminAuditRequests';
import AdminAssetAllocation from './Admin/AdminAssetAllocation';

import FlipTile from '../components/FlipTile';
import logo     from '../assets/logotrans.png';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'employees':   return <EmployeeManagement />;
      case 'assets':      return <AssetManagement />;
      case 'services':    return <AdminServiceRequests />;
      case 'audits':      return <AdminAuditRequests />;
      case 'allocations': return <AdminAssetAllocation />;
      default:            return null;
    }
  };

  const tiles = [
    { id: 'employees',   label: 'Employees',         icon: <span style={{ fontSize: 64 }}>💼</span> },
    { id: 'assets',      label: 'Assets',            icon: <span style={{ fontSize: 64 }}>💻</span> },
    { id: 'services',    label: 'Service Requests',  icon: <span style={{ fontSize: 64 }}>🛠️</span> },
    { id: 'audits',      label: 'Audit Requests',    icon: <span style={{ fontSize: 64 }}>📋</span> },
    { id: 'allocations', label: 'Asset Allocations', icon: <span style={{ fontSize: 64 }}>🔗</span> },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', color: '#eef3ff' }}>
      {/* Spline Viewer */}
      <spline-viewer
        url="https://prod.spline.design/HtFMPbpjD5vlYwdg/scene.splinecode"
        style={{
          top:'2in',
          position: 'fixed',
          //inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      ></spline-viewer>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.3))',
          //backdropFilter: 'blur(2px)',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1.25rem',
        }}
      >
        <img src={logo} alt="HexaTrack" style={{ height: 54, width: 'auto', marginRight: '1rem' }} />
        {activeTab && (
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setActiveTab('')}
          >
            Go to Dashboard
          </button>
        )}
        <button
          className="btn btn-outline-light btn-sm ms-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        {activeTab === '' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {tiles.map((t) => (
              <FlipTile
                key={t.id}
                label={t.label}
                icon={t.icon}
                onClick={() => setActiveTab(t.id)}
              />
            ))}
          </div>
        ) : (
          renderTab()
        )}
      </main>
    </div>
  );
}
