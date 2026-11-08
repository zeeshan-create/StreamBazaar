import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './components/Storefront';
import AdminDashboard from './components/AdminDashboard';
import HomeLive from './components/HomeLive';
import HomeLive1 from './components/HomeLive1';
import SearchDemo from './components/SearchDemo';
import ColorGuide from './components/ColorGuide';
import StreamBazaarDemo from './components/StreamBazaarDemo';
import OttBackground from './components/OttBackground';
import PolicyPage from './components/PolicyPage';

function App() {
  return (
    <>
      <OttBackground />
      <Routes>
        <Route path="/" element={<StreamBazaarDemo />} />
        <Route path="/demo" element={<StreamBazaarDemo />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/terms" element={<PolicyPage />} />
        <Route path="/warranty" element={<PolicyPage />} />
        <Route path="/legacy" element={<Storefront />} />
        
        {/* 🚫 HONEYPOT / BOUNCE: Anyone guessing /admin is instantly thrown back to home */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/ADMIN" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* 🔒 SECRET PRIVATE OWNER VAULT: Only you know this link */}
        <Route path="/sb-master-vault-974" element={<AdminDashboard />} />

        <Route path="/trial-home" element={<HomeLive />} />
        <Route path="/trial-home-1" element={<HomeLive1 />} />
        <Route path="/trial-search" element={<SearchDemo />} />
        <Route path="/trial-color" element={<ColorGuide />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
