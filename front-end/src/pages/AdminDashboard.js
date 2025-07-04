import React, { useState } from 'react';
import EmployeeManagement   from './Admin/EmployeeManagement';
import AssetManagement      from './Admin/AssetManagement';
import AdminServiceRequests from './Admin/AdminServiceRequests';
import AdminAuditRequests   from './Admin/AdminAuditRequests';
import AdminAssetAllocation from './Admin/AdminAssetAllocation';

import FlipTile from '../components/FlipTile';
import logo     from '../assets/logo_DB.png';
import bg       from '../assets/bg.jpg';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('');

  const logout = () => {
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

  const styles = {
    page: {
      minHeight: '100vh',
      color: '#eef3ff',
      background: `url(${bg}) center/cover fixed`,
      overflowX: 'hidden',
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'rgba(0,0,0,.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      padding: '.6rem 1rem',
    },
    logo: {
      height: 64,
      marginRight: '1rem',
    },
    dashBtn:  { marginLeft: '1rem' },
    logoutBtn:{ marginLeft: 'auto' },
    content:  { padding: '2rem' },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: '1.5rem',
      padding: '2rem',
    },
  };

  const tiles = [
    {
      id: 'employees',
      label: 'Employees',
      icon: <span style={{ fontSize: 64 }}>🧑‍💼</span>,
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: <span style={{ fontSize: 64 }}>💻</span>,
    },
    {
      id: 'services',
      label: 'Service Requests',
      icon: <span style={{ fontSize: 64 }}>🛠️</span>,
    },
    {
      id: 'audits',
      label: 'Audit Requests',
      icon: <span style={{ fontSize: 64 }}>📋</span>,
    },
    {
      id: 'allocations',
      label: 'Asset Allocations',
      icon: <span style={{ fontSize: 64 }}>🔗</span>,
    },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <img src={logo} alt="HexaTrack" style={styles.logo} />
        <button
          className="btn btn-outline-light btn-sm"
          style={styles.dashBtn}
          onClick={() => setActiveTab('')}
        >
          Go to Dashboard
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          style={styles.logoutBtn}
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main style={styles.content}>
        {activeTab === '' ? (
          <div style={styles.grid}>
            {tiles.map(t => (
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
