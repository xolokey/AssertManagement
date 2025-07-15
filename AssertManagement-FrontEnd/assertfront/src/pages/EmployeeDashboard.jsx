import React, { useState } from 'react';
import ViewAssignedAssets from './Employee/ViewAssignedAssets';
import RequestAsset from './Employee/RequestAsset';
import RaiseServiceRequest from './Employee/RaiseServiceRequest';
import RequestHistory from './Employee/RequestHistory';

import FlipTile from '../components/FlipTile';
import logo from '../assets/logotrans.png';

export default function EmployeeDashboard() {
  const [tab, setTab] = useState('');

  const user = {
    name: localStorage.getItem('name') || 'Welcome Back!!',
    role: localStorage.getItem('role') || 'Employee',
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const renderTab = () => {
    switch (tab) {
      case 'myAssets':
        return <ViewAssignedAssets />;
      case 'request':
        return <RequestAsset />;
      case 'raise-service':
        return <RaiseServiceRequest />;
      case 'request-history':
        return <RequestHistory />;
      default:
        return null;
    }
  };

  const tiles = [
    { id: 'myAssets', label: 'My Assets', icon: <span style={{ fontSize: 64 }}>🗂️</span> },
    { id: 'request', label: 'Request Asset', icon: <span style={{ fontSize: 64 }}>➕</span> },
    { id: 'raise-service', label: 'Service Request', icon: <span style={{ fontSize: 64 }}>🛠️</span> },
    { id: 'request-history', label: 'Request History', icon: <span style={{ fontSize: 64 }}>📜</span> },
  ];

  const isDashboard = tab === '';

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflowX: 'hidden',
        fontFamily: 'Poppins, sans-serif',
        color: '#eef3ff',
      }}
    >
      {/* 3D Background */}
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

      {/* Overlay for readability */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          color: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          // background: 'linear-gradient(to bottom right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          zIndex: 2,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 3,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <img
            src={logo}
            alt="HexaTrack"
            style={{ height: 54, cursor: 'pointer' }}
            onClick={() => setTab('')}
          />
          {tab ? (
            <button className="btn btn-outline-light btn-sm" onClick={() => setTab('')}>
              ⬅ Dashboard
            </button>
          ) : (
            <h5 className="mb-0 text-white-50 fw-semibold">Employee Dashboard</h5>
          )}
        </div>

        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '2rem',
          paddingBottom: '3rem',
        }}
      >
        {isDashboard ? (
          <div
            className="dashboard-tiles"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {tiles.map((tile) => (
              <FlipTile
                key={tile.id}
                label={tile.label}
                icon={tile.icon}
                onClick={() => setTab(tile.id)}
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
