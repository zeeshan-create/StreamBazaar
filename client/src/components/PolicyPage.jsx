import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PolicyModal from './PolicyModal';
import OttBackground from './OttBackground';
import './StreamBazaarDemo.css';

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState('accounts');

  return (
    <div className="sb-page" style={{ minHeight: '100vh', background: '#07060f' }}>
      <OttBackground />

      {/* Navbar */}
      <nav className="sb-navbar" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8, 9, 17, 0.95)' }}>
        <Link to="/" className="sb-nav-logo-wrap">
          <img src="/logo.png" alt="StreamBazaar" className="sb-nav-logo-img" />
          <div style={{ fontSize: '18px', fontWeight: 900 }}>
            Stream<span style={{ color: '#a855f7' }}>Bazaar</span>
          </div>
        </Link>
        <Link
          to="/"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            fontSize: '12.5px',
            fontWeight: 800,
            padding: '8px 18px',
            borderRadius: '12px',
            textDecoration: 'none'
          }}
        >
          ← Back to Store
        </Link>
      </nav>

      <main style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="sb-policy-pill-badge" style={{ display: 'inline-block', marginBottom: '8px' }}>
            🛡️ OFFICIAL STREAMBAZAAR LEGAL POLICIES
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
            Buyer Protection, Warranty &amp; Terms
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto' }}>
            We guarantee 100% active access, zero-risk replacement protection, and private profile security across all streaming and gaming seats.
          </p>
        </div>

        {/* Embedded Full Policy Display */}
        <div style={{
          background: 'rgba(14, 16, 28, 0.92)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}>
          <PolicyModal initialTab={activeTab} onClose={() => window.history.back()} />
        </div>
      </main>
    </div>
  );
}
