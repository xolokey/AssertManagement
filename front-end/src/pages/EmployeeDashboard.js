// src/pages/EmployeeDashboard.js
import React, { useState } from 'react';
import ViewAssignedAssets    from './Employee/ViewAssignedAssets';
import RequestAsset          from './Employee/RequestAsset';
import RaiseServiceRequest   from './Employee/RaiseServiceRequest';
import RequestHistory        from './Employee/RequestHistory';

import FlipTile   from '../components/FlipTile';    // 👈 reusable flip‑card
import logo       from '../assets/logo_DB.png';
import bg         from '../assets/bg.jpg';



export default function EmployeeDashboard() {
  const [tab, setTab] = useState('');

  /* ————— helpers ————— */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const renderTab = () => {
    switch (tab) {
      case 'myAssets':        return <ViewAssignedAssets />;
      case 'request':         return <RequestAsset />;
      case 'raise-service':   return <RaiseServiceRequest />;
      case 'request-history': return <RequestHistory />;
      default:                return null;
    }
  };

  /* ————— styles ————— */
  const styles = {
    page: {
      minHeight: '100vh',
      color: '#eef3ff',
      backgroundImage: `url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      overflowX: 'hidden',
    },
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      padding: '.6rem 1rem',
    },
    logo: {
      height: 70,             // ⬅ bigger logo fills header
      width: 'auto',
    },
    content: { padding: '2rem' },
    tileGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
    },
  };

  /* ————— dashboard tiles ————— */
  const tiles = [
    {
      id: 'myAssets',
      label: 'My Assets',
      icon: (
      <span style={{ fontSize: 64 /* px */, lineHeight: 1 }}>
      🗂️
      </span>
      ),
    },
    {
      id: 'request',
      label: 'Request Asset',
      icon: <span style={{ fontSize: 64 }}>➕</span>,
    },
    {
      id: 'raise-service',
      label: 'Service Request',
      icon: <span style={{ fontSize: 64 }}>🛠️</span>,
    },
    {
      id: 'request-history',
      label: 'Request History',
      icon: <span style={{ fontSize: 64 }}>📜</span>,
    },
  ];

  /* ————— JSX ————— */
  return (
    <div style={styles.page}>
      {/* ===== Header ===== */}
      <header style={styles.header}>
        <img src={logo} alt="HexaTrack" style={styles.logo} />
        <button
          className="btn btn-outline-light btn-sm ms-3"
          onClick={() => setTab('')}
        >
          Go to Dashboard
        </button>
        <button
          className="btn btn-outline-light btn-sm ms-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* ===== Main ===== */}
      <main style={styles.content}>
        {tab === '' ? (
          <div style={styles.tileGrid}>
            {tiles.map((t) => (
              <FlipTile
                key={t.id}
                label={t.label}
                icon={t.icon}
                onClick={() => setTab(t.id)}
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
