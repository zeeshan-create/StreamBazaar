import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Storefront from './components/Storefront';
import AdminDashboard from './components/AdminDashboard';
import HomeLive from './components/HomeLive';
import HomeLive1 from './components/HomeLive1';
import SearchDemo from './components/SearchDemo';
import ColorGuide from './components/ColorGuide';
import StreamBazaarDemo from './components/StreamBazaarDemo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StreamBazaarDemo />} />
      <Route path="/demo" element={<StreamBazaarDemo />} />
      <Route path="/legacy" element={<Storefront />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/trial-home" element={<HomeLive />} />
      <Route path="/trial-home-1" element={<HomeLive1 />} />
      <Route path="/trial-search" element={<SearchDemo />} />
      <Route path="/trial-color" element={<ColorGuide />} />
    </Routes>
  );
}

export default App;
