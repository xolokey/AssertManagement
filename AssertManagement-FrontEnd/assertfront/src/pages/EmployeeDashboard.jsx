import React, { useState } from 'react';
import ViewAssignedAssets    from './Employee/ViewAssignedAssets';
import RequestAsset          from './Employee/RequestAsset';
import RaiseServiceRequest   from './Employee/RaiseServiceRequest';
import RequestHistory        from './Employee/RequestHistory';

import FlipTile from '../components/FlipTile';
import logo     from '../assets/logotrans.png';

export default function EmployeeDashboard() {
  const [tab, setTab] = useState('');

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

  const tiles = [
    { id: 'myAssets',        label: 'My Assets',        icon: <span style={{ fontSize: 64 }}>🗂️</span> },
    { id: 'request',         label: 'Request Asset',    icon: <span style={{ fontSize: 64 }}>➕</span> },
    { id: 'raise-service',   label: 'Service Request',  icon: <span style={{ fontSize: 64 }}>🛠️</span> },
    { id: 'request-history', label: 'Request History',  icon: <span style={{ fontSize: 64 }}>📜</span> },
  ];

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      fontFamily: 'Poppins, sans-serif',
      color: '#eef3ff',
    }}>
      {/* 3D Background Viewer */}
      <spline-viewer
        url="https://prod.spline.design/HtFMPbpjD5vlYwdg/scene.splinecode"
        style={{
          position: 'fixed',
          top:'2in',
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      ></spline-viewer>

      {/* Dark Gradient Overlay */}
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
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1.25rem',
        }}
      >
        <img src={logo} alt="HexaTrack" style={{ height: 54, marginRight: '1rem' }} />
        {tab && (
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setTab('')}
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

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        {tab === '' ? (
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
                onClick={() => setTab(t.id)}
              />
            ))}
          </div>
        ) : (
          renderTab()
        )}
        {/*<img src={logo} alt="HexaTrack" style={{ height: 200, marginRight: '1rem' }} />*/}
      </main>
    </div>
  );
}
