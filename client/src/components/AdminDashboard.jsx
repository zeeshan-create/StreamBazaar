import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Save, X, LayoutDashboard, 
  ChevronRight, ArrowLeft, PlusCircle, Package,
  Users, Settings, Image as ImageIcon, Bell, Search, Menu, LogOut,
  Eye, EyeOff, Copy, Check, CheckSquare, Globe, ShieldAlert,
  DollarSign, Activity, Lock, RefreshCw, Smartphone, Monitor
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../App.css';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

// Analytical Mock Datasets for SVG Chart
const CHART_DATA = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    points: '10,160 80,140 150,110 220,130 290,90 360,70 430,40',
    gridX: [10, 80, 150, 220, 290, 360, 430],
    revenue: '₹14,500',
    orders: 38
  },
  '30D': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    points: '10,150 150,120 290,60 430,30',
    gridX: [10, 150, 290, 430],
    revenue: '₹62,400',
    orders: 148
  },
  '90D': {
    labels: ['March', 'April', 'May'],
    points: '10,170 220,90 430,20',
    gridX: [10, 220, 430],
    revenue: '₹1,88,200',
    orders: 490
  }
};

const MOCK_NOTIFICATIONS = [
  { id: 1, text: "New subscription order for WWE 2K25 · 3M", time: "2 mins ago", type: "success" },
  { id: 2, text: "System security backup completed", time: "1 hour ago", type: "info" },
  { id: 3, text: "Netflix Premium credentials updated", time: "3 hours ago", type: "warning" }
];

const MOCK_USERS = [
  { id: 1, name: "Rahul Sharma", email: "rahul@streambazaar.in", role: "Viewer", status: "Active" },
  { id: 2, name: "Anjali Gupta", email: "anjali@streambazaar.in", role: "Editor", status: "Active" },
  { id: 3, name: "Vikram Singh", email: "vikram@streambazaar.in", role: "Admin", status: "Active" },
  { id: 4, name: "Aman Verma", email: "aman@streambazaar.in", role: "Viewer", status: "Inactive" },
  { id: 5, name: "Sneha Patel", email: "sneha@streambazaar.in", role: "Viewer", status: "Active" }
];

const MOCK_MEDIA = [
  { id: 1, name: "YouTube Premium cover", url: "https://www.google.com/s2/favicons?domain=youtube.com&sz=128", date: "2026-05-10" },
  { id: 2, name: "Netflix UHD capsule cover", url: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128", date: "2026-05-12" },
  { id: 3, name: "Steam Gaming wide capsule", url: "https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_184x69.jpg", date: "2026-05-15" },
  { id: 4, name: "GTA V capsule cover", url: "https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_184x69.jpg", date: "2026-05-18" }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Layout Tab control
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, users, media, settings
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Data States
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Tab Filtering & Views
  const [productView, setProductView] = useState('grid'); // grid, list
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Dashboard Interactive States
  const [chartFilter, setChartFilter] = useState('30D');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Users management states
  const [users, setUsers] = useState(MOCK_USERS);
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');
  
  // Media manager states
  const [copiedId, setCopiedId] = useState(null);
  const [mediaList, setMediaList] = useState(MOCK_MEDIA);
  const [dragActive, setDragActive] = useState(false);

  // Settings states
  const [settingsTab, setSettingsTab] = useState('general'); // general, security, notifications, integrations
  const [apiKey, setApiKey] = useState('sb_live_a8f92bd8c9d04402a83e0c03636f');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const ADMIN_USERNAME = 'Ai+rizwan#1974000hussain!#/';
  const ADMIN_PASSWORD = '@#12Rizwan55Hussain/!#7861974000!12';

  // Debouncing search inputs (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchServices();
    } else {
      setError('Invalid username or password. Please try again!');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSent(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotSent(false);
        setForgotEmail('');
      }, 2000);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/plans`);
      const data = await res.json();
      setServices(data);
      setLoading(false);

      // Fetch dynamic buyer orders
      const resUsers = await fetch(`${API_BASE}/admin/orders`);
      const dataUsers = await resUsers.json();
      const mapped = dataUsers.map(u => ({
        ...u,
        id: u._id || u.id
      }));
      setUsers(mapped);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  // Keyboard navigation & Escape key close handlers
  const handleEscapeKey = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowAddForm(false);
      setSelectedUser(null);
      setShowInviteModal(false);
      setShowForgotModal(false);
      setShowNotifications(false);
      setShowProfileMenu(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  const handleEditStart = (service) => {
    setEditingId(service._id);
    setEditForm({ ...service });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingId(null);
        fetchServices();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/plans/${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setShowAddForm(false);
        fetchServices();
      }
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  // User Actions
  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (inviteEmail) {
      const newUser = {
        id: users.length + 1,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Active'
      };
      setUsers(prev => [...prev, newUser]);
      setShowInviteModal(false);
      setInviteEmail('');
    }
  };

  // Media Library drag/drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newMedia = {
        id: mediaList.length + 1,
        name: file.name.split('.')[0] + " upload",
        url: "https://www.google.com/s2/favicons?domain=steampowered.com&sz=128",
        date: new Date().toISOString().split('T')[0]
      };
      setMediaList(prev => [newMedia, ...prev]);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const deleteMedia = (id) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
  };

  const regenerateApiKey = () => {
    const randomHex = [...Array(28)].map(() => Math.floor(Math.random()*16).toString(16)).join('');
    setApiKey(`sb_live_${randomHex}`);
  };

  const filteredServices = services.filter(s => {
    return s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
           s.category.toLowerCase().includes(debouncedSearch.toLowerCase());
  });

  return (
    <div className="admin-layout-wrapper">
      {/* ── AUTH PAGES (LOGIN PANEL) ────────────────────────────────── */}
      {!isAuthenticated ? (
        <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '1rem' }}>
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleLogin}
            style={{ 
              background: 'var(--color-surface)', 
              padding: '2.5rem 2rem', 
              borderRadius: '24px', 
              border: '1px solid var(--color-border)', 
              textAlign: 'center', 
              width: '100%', 
              maxWidth: '420px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <LayoutDashboard size={32} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Admin Access</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>Sign in to continue to your interactive StreamBazaar dashboard.</p>
            
            <div className="admin-form-group" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <label htmlFor="admin_user">Username</label>
              <input 
                id="admin_user"
                type="text" 
                className="admin-form-input" 
                placeholder="Enter secret username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="admin-form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <label htmlFor="admin_pass">Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  id="admin_pass"
                  type={showPassword ? "text" : "password"} 
                  className="admin-form-input" 
                  placeholder="Enter secret password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: '3rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <button className="btn-primary" style={{ width: '100%', padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              <Lock size={16} /> Login to Console
            </button>

            <button 
              type="button" 
              onClick={() => setShowForgotModal(true)} 
              style={{ display: 'block', margin: '1.5rem auto 0', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot password?
            </button>

            <Link to="/" style={{ display: 'block', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}>
              ← Return to public website
            </Link>
          </motion.form>

          {/* Forgot Password Reset Modal */}
          <AnimatePresence>
            {showForgotModal && (
              <div className="popup-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="popup-modal"
                  style={{ width: '92%', maxWidth: '400px', padding: '2rem' }}
                >
                  <button className="popup-close" onClick={() => setShowForgotModal(false)} aria-label="Close modal">
                    <X size={16} />
                  </button>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Reset Password</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>We'll send a password recovery magic link to your registered administrator email.</p>
                  
                  <form onSubmit={handleForgotSubmit}>
                    <div className="admin-form-group">
                      <label htmlFor="forgot_email">Email address</label>
                      <input 
                        id="forgot_email"
                        type="email" 
                        className="admin-form-input" 
                        placeholder="admin@streambazaar.in"
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    {forgotSent && (
                      <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} /> Magic recovery link sent to your inbox!
                      </div>
                    )}
                    <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', borderRadius: '10px', justifyContent: 'center' }}>
                      Send recovery link
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ── ELITE ADMIN CONSOLE WORKFLOW ──────────────────────────── */
        <>
          {/* ── COLLAPSIBLE SIDEBAR DRAWER ────────────────────────── */}
          <nav className={`admin-sidebar-nav ${sidebarExpanded ? 'expanded' : ''}`} aria-label="Sidebar Navigation">
            <div className="sidebar-header">
              <Link to="/">
                <img src="/logo.png" alt="StreamBazaar Logo" className="sidebar-logo" />
              </Link>
              <button 
                className="sidebar-close-btn" 
                onClick={() => setSidebarExpanded(false)}
                aria-label="Collapse sidebar drawer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="sidebar-menu">
              <button 
                className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => { setActiveTab('overview'); setSidebarExpanded(false); }}
              >
                <LayoutDashboard size={18} /> Overview
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => { setActiveTab('products'); setSidebarExpanded(false); }}
              >
                <Package size={18} /> Products & Plans
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => { setActiveTab('users'); setSidebarExpanded(false); }}
              >
                <Users size={18} /> User Management
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => { setActiveTab('media'); setSidebarExpanded(false); }}
              >
                <ImageIcon size={18} /> Media Library
              </button>
              <button 
                className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setSidebarExpanded(false); }}
              >
                <Settings size={18} /> Platform Settings
              </button>
            </div>

            <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
              <button 
                onClick={() => setIsAuthenticated(false)}
                className="sidebar-btn" 
                style={{ color: 'var(--color-danger)' }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </nav>

          {/* ── MAIN CONTENT CONTAINER ────────────────────────────── */}
          <div className="admin-main-container">
            
            {/* ── STICKY TOPBAR HEADER ────────────────────────────── */}
            <header className="admin-topbar">
              <div className="topbar-left">
                <button 
                  className="sidebar-toggle-btn"
                  onClick={() => setSidebarExpanded(prev => !prev)}
                  aria-label="Expand sidebar drawer menu"
                >
                  <Menu size={20} />
                </button>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', textTransform: 'capitalize' }}>
                  {activeTab} Panel
                </h1>
              </div>

              <div className="topbar-right">
                {/* Responsive Search Input */}
                {activeTab === 'products' && (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Search items..." 
                      className="admin-form-input" 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: '2.5rem', width: '200px', height: '38px', fontSize: '0.82rem', borderRadius: '8px' }}
                    />
                  </div>
                )}

                {/* Notifications Dropdown Bell */}
                <div style={{ position: 'relative' }}>
                  <button 
                    className="header-badge-btn" 
                    onClick={() => { setShowNotifications(prev => !prev); setShowProfileMenu(false); }}
                    aria-label="Toggle notifications dropdown list"
                  >
                    <Bell size={18} />
                    {notifications.length > 0 && <span className="badge-count">{notifications.length}</span>}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <div className="header-dropdown" style={{ width: '300px' }}>
                        <div className="dropdown-header-title">Unread Alerts</div>
                        {notifications.map(n => (
                          <div key={n.id} className="dropdown-item-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                              <span style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                background: n.type === 'success' ? 'var(--color-success)' : n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)' 
                              }} />
                              {n.text}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '0.8rem' }}>{n.time}</span>
                          </div>
                        ))}
                        <button 
                          onClick={() => setNotifications([])}
                          style={{ width: '100%', textAlign: 'center', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', borderTop: '1px solid var(--color-border)' }}
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Admin avatar dropdown */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => { setShowProfileMenu(prev => !prev); setShowNotifications(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    aria-label="Toggle profile user actions"
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>
                      VS
                    </div>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <div className="header-dropdown">
                        <div className="dropdown-header-title" style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>Vikram Singh</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Platform Administrator</span>
                        </div>
                        <div className="dropdown-item-row" onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}><Settings size={15} /> Settings</div>
                        <div className="dropdown-item-row" style={{ color: 'var(--color-danger)' }} onClick={() => setIsAuthenticated(false)}><LogOut size={15} /> Logout</div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            {/* ── MAIN SCROLLABLE CONTENT BODY ──────────────────────── */}
            <main style={{ flex: 1, padding: 'clamp(1rem, 3vw, 2rem)', overflowY: 'auto' }}>
              
              {/* ── TAB 1: OVERVIEW DASHBOARD ───────────────────────── */}
              {activeTab === 'overview' && (
                <div>
                  {/* Stats Cards Row */}
                  <div className="kpi-row">
                    <div className="kpi-stat-card" style={{ '--pulse-color': 'rgba(34, 197, 94, 0.08)' }}>
                      <span className="kpi-label">Sales Revenue</span>
                      <span className="kpi-value">₹1,48,500</span>
                      <div className="kpi-footer">
                        <span className="kpi-trend up"><Activity size={12} /> +24%</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>vs last month</span>
                      </div>
                    </div>

                    <div className="kpi-stat-card" style={{ '--pulse-color': 'rgba(124, 58, 237, 0.08)' }}>
                      <span className="kpi-label">Active Seats</span>
                      <span className="kpi-value">420</span>
                      <div className="kpi-footer">
                        <span className="kpi-trend up"><Activity size={12} /> +12%</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>current device count</span>
                      </div>
                    </div>

                    <div className="kpi-stat-card" style={{ '--pulse-color': 'rgba(245, 158, 11, 0.08)' }}>
                      <span className="kpi-label">Total Orders</span>
                      <span className="kpi-value">1,280</span>
                      <div className="kpi-footer">
                        <span className="kpi-trend up"><Activity size={12} /> +8%</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>automated checkouts</span>
                      </div>
                    </div>

                    <div className="kpi-stat-card" style={{ '--pulse-color': 'rgba(239, 68, 68, 0.08)' }}>
                      <span className="kpi-label">Support Response</span>
                      <span className="kpi-value">&lt; 5m</span>
                      <div className="kpi-footer">
                        <span className="kpi-trend up"><Activity size={12} /> 99.8%</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>uptime efficiency</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Analytical Line Chart */}
                  <div className="admin-chart-card">
                    <div className="chart-header">
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Revenue Analytics Overview</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Realtime checkout orders tracking</p>
                      </div>
                      
                      <div className="chart-filters">
                        {['7D', '30D', '90D'].map(f => (
                          <button 
                            key={f}
                            className={`chart-filter-btn ${chartFilter === f ? 'active' : ''}`}
                            onClick={() => setChartFilter(f)}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="svg-chart-container">
                      <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2="500" y2="50" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />

                        {CHART_DATA[chartFilter].gridX.map((x, idx) => (
                          <line key={idx} x1={x} y1="0" x2={x} y2="180" stroke="var(--color-border)" strokeWidth="0.5" />
                        ))}
                        
                        {/* Glow Gradient path */}
                        <path 
                          d={`M10,180 L${CHART_DATA[chartFilter].points} L430,180 Z`} 
                          fill="url(#chartGlow)" 
                        />
                        
                        {/* Highlight line path */}
                        <path 
                          d={`M${CHART_DATA[chartFilter].points}`} 
                          fill="none" 
                          stroke="var(--color-primary)" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', padding: '0 10px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {CHART_DATA[chartFilter].labels.map((lbl, idx) => (
                          <span key={idx}>{lbl}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Total Period Revenue</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-success)' }}>{CHART_DATA[chartFilter].revenue}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Period Orders count</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)' }}>{CHART_DATA[chartFilter].orders} checkouts</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity and performing tables grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                    <div className="admin-chart-card" style={{ margin: 0 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Order Checkout Stream</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                          { name: "John Doe", game: "Netflix Premium · 3M", amount: "₹450", time: "5 mins ago" },
                          { name: "Amit Patel", game: "WWE 2K25 · 30D", amount: "₹249", time: "25 mins ago" },
                          { name: "Rohan Das", game: "Sony LIV · 45D", amount: "₹180", time: "1 hour ago" },
                          { name: "Sara Khan", game: "Black Myth Wukong · 3M", amount: "₹599", time: "3 hours ago" }
                        ].map((act, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{act.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{act.game}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>{act.amount}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{act.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB 2: PRODUCTS & PLANS MANAGER ─────────────────── */}
              {activeTab === 'products' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setProductView('grid')}
                        className="user-filter-btn" 
                        style={{ background: productView === 'grid' ? 'var(--color-primary)' : 'var(--card)', color: productView === 'grid' ? 'white' : 'var(--color-text-muted)' }}
                      >
                        Grid Layout
                      </button>
                      <button 
                        onClick={() => setProductView('list')}
                        className="user-filter-btn"
                        style={{ background: productView === 'list' ? 'var(--color-primary)' : 'var(--card)', color: productView === 'list' ? 'white' : 'var(--color-text-muted)' }}
                      >
                        List Layout
                      </button>
                    </div>

                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setEditForm({ name: '', category: 'Streaming', color: '#6366f1', description: '', status: 'Available', plans: [{ label: '', quality: '', duration: '', price: '₹', type: '' }] });
                        setShowAddForm(true);
                      }}
                      style={{ padding: '0.6rem 1.25rem', borderRadius: '10px' }}
                    >
                      <Plus size={16} /> Add New Service
                    </button>
                  </div>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>Loading StreamBazaar plans catalog...</div>
                  ) : (
                    <div>
                      {productView === 'grid' ? (
                        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                          {filteredServices.map(s => (
                            <div key={s._id} className="admin-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '1.5rem' }}>
                              {editingId === s._id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                  <div className="admin-form-group">
                                    <label>Service Name</label>
                                    <input className="admin-form-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                  </div>
                                  <div className="admin-form-group">
                                    <label>Category</label>
                                    <input className="admin-form-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} />
                                  </div>
                                  <div className="admin-form-group">
                                    <label>Accent Color</label>
                                    <input className="admin-form-input" value={editForm.color} onChange={e => setEditForm({...editForm, color: e.target.value})} />
                                  </div>
                                  <div className="admin-form-group">
                                    <label>Status</label>
                                    <select className="admin-form-input" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                                      <option value="Available">Available</option>
                                      <option value="Out of Stock">Out of Stock</option>
                                      <option value="Coming Soon">Coming Soon</option>
                                    </select>
                                  </div>
                                  <div className="admin-form-group">
                                    <label>Description</label>
                                    <textarea className="admin-form-input" rows={2} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                                  </div>

                                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                                    <label style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'block' }}>Plans & Pricing</label>
                                    {editForm.plans && editForm.plans.map((plan, idx) => (
                                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                        <input className="admin-form-input" style={{ flex: 1 }} placeholder="Label (e.g. Premium 4K · 30D)" value={plan.label} onChange={e => {
                                          const newPlans = [...editForm.plans];
                                          newPlans[idx].label = e.target.value;
                                          setEditForm({...editForm, plans: newPlans});
                                        }} />
                                        <input className="admin-form-input" style={{ width: '80px' }} placeholder="Price" value={plan.price} onChange={e => {
                                          const newPlans = [...editForm.plans];
                                          newPlans[idx].price = e.target.value;
                                          setEditForm({...editForm, plans: newPlans});
                                        }} />
                                        <button className="admin-action-btn delete" onClick={() => {
                                          const newPlans = editForm.plans.filter((_, i) => i !== idx);
                                          setEditForm({...editForm, plans: newPlans});
                                        }}><Trash2 size={16} /></button>
                                      </div>
                                    ))}
                                    <button className="btn-ghost" onClick={() => setEditForm({...editForm, plans: [...(editForm.plans || []), { label: 'New Plan', quality: '', duration: '', price: '₹', type: '' }]})} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: 'fit-content', marginTop: '0.5rem' }}>
                                      <Plus size={14} /> Add Plan
                                    </button>
                                  </div>
                                  
                                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button className="btn-primary" onClick={() => handleSave(s._id)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}><Save size={16} /> Save</button>
                                    <button className="btn-ghost" onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}><X size={16} /> Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}22`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Package size={22} style={{ color: s.color }} />
                                    </div>
                                    <div>
                                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{s.name}</h3>
                                      <span style={{ fontSize: '0.72rem', background: 'var(--card-hover)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-text-muted)', marginRight: '0.5rem' }}>{s.category}</span>
                                      <span style={{ fontSize: '0.72rem', color: s.status === 'Available' ? 'var(--color-success)' : 'var(--color-danger)' }}>{s.status}</span>
                                    </div>
                                  </div>
                                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', height: '36px', overflow: 'hidden' }}>{s.description || 'No description provided.'}</p>
                                  
                                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>{s.plans?.length || 0} pricing tiers</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button className="admin-action-btn" onClick={() => handleEditStart(s)} aria-label="Edit product"><Edit2 size={16} /></button>
                                      <button className="admin-action-btn delete" onClick={() => handleDelete(s._id)} aria-label="Delete product"><Trash2 size={16} /></button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* List view table */
                        <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Product Name</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Pricing Tiers</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredServices.map(s => (
                                <tr key={s._id} style={{ borderBottom: '1px solid var(--color-border)', transition: '0.2s' }}>
                                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{s.name}</td>
                                  <td style={{ padding: '1rem 1.5rem' }}>{s.category}</td>
                                  <td style={{ padding: '1rem 1.5rem' }}>
                                    <span style={{ color: s.status === 'Available' ? 'var(--color-success)' : 'var(--color-danger)' }}>{s.status}</span>
                                  </td>
                                  <td style={{ padding: '1rem 1.5rem' }}>{s.plans?.length || 0} plans</td>
                                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                      <button className="admin-action-btn" onClick={() => { handleEditStart(s); setProductView('grid'); }} aria-label="Edit product"><Edit2 size={15} /></button>
                                      <button className="admin-action-btn delete" onClick={() => handleDelete(s._id)} aria-label="Delete product"><Trash2 size={15} /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Product Modal Overlay */}
                  <AnimatePresence>
                    {showAddForm && (
                      <div className="popup-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="popup-modal"
                          style={{ width: '92%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                          <button className="popup-close" onClick={() => setShowAddForm(false)} aria-label="Close modal">
                            <X size={16} />
                          </button>
                          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Add New Product</h2>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label>Service/Game Title</label>
                              <input className="admin-form-input" placeholder="Netflix, Grok AI, etc." onChange={e => setEditForm({...editForm, name: e.target.value})} />
                            </div>
                            <div className="admin-form-group">
                              <label>Category</label>
                              <input className="admin-form-input" placeholder="Streaming, Gaming, AI+, VPN" onChange={e => setEditForm({...editForm, category: e.target.value})} />
                            </div>
                            <div className="admin-form-group">
                              <label>Accent Hex Color</label>
                              <input className="admin-form-input" placeholder="#e50914" onChange={e => setEditForm({...editForm, color: e.target.value})} />
                            </div>
                            <div className="admin-form-group">
                              <label>Description Description</label>
                              <textarea className="admin-form-input" rows={2} placeholder="Premium shared profiles..." onChange={e => setEditForm({...editForm, description: e.target.value})} />
                            </div>

                            <div className="admin-form-group">
                              <label style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'block' }}>Plans & Pricing</label>
                              {editForm.plans && editForm.plans.map((plan, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                  <input className="admin-form-input" style={{ flex: 1 }} placeholder="Label (e.g. Premium 4K · 30D)" value={plan.label} onChange={e => {
                                    const newPlans = [...editForm.plans];
                                    newPlans[idx].label = e.target.value;
                                    setEditForm({...editForm, plans: newPlans});
                                  }} />
                                  <input className="admin-form-input" style={{ width: '80px' }} placeholder="Price" value={plan.price} onChange={e => {
                                    const newPlans = [...editForm.plans];
                                    newPlans[idx].price = e.target.value;
                                    setEditForm({...editForm, plans: newPlans});
                                  }} />
                                  <button className="admin-action-btn delete" onClick={() => {
                                    const newPlans = editForm.plans.filter((_, i) => i !== idx);
                                    setEditForm({...editForm, plans: newPlans});
                                  }}><Trash2 size={16} /></button>
                                </div>
                              ))}
                              <button className="btn-ghost" onClick={() => setEditForm({...editForm, plans: [...(editForm.plans || []), { label: 'New Plan', quality: '', duration: '', price: '₹', type: '' }]})} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: 'fit-content', marginTop: '0.5rem' }}>
                                <Plus size={14} /> Add Plan
                              </button>
                            </div>
                            
                            <button className="btn-primary" onClick={handleAdd} style={{ marginTop: '1rem', padding: '0.85rem', borderRadius: '10px', justifyContent: 'center' }}>
                              Create Service Entry
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── TAB 3: USER MANAGEMENT PAGE ─────────────────────── */}
              {activeTab === 'users' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="user-filter-tabs">
                      {['All', 'Admin', 'Editor', 'Viewer'].map(r => (
                        <button 
                          key={r}
                          className={`user-filter-btn ${userRoleFilter === r ? 'active' : ''}`}
                          onClick={() => setUserRoleFilter(r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    <button 
                      className="btn-primary"
                      onClick={() => setShowInviteModal(true)}
                      style={{ padding: '0.6rem 1.25rem', borderRadius: '10px' }}
                    >
                      <PlusCircle size={16} /> Invite New Staff
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                          <th style={{ padding: '1rem 1.5rem' }}>Name</th>
                          <th style={{ padding: '1rem 1.5rem' }}>Email</th>
                          <th style={{ padding: '1rem 1.5rem' }}>Role</th>
                          <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                          <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(u => userRoleFilter === 'All' || u.role === userRoleFilter).map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                                {u.name[0].toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 600 }}>{u.name}</span>
                            </td>
                            <td style={{ padding: '1rem 1.5rem' }}>{u.email}</td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                              <span style={{ fontSize: '0.75rem', background: u.role === 'Admin' ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', color: u.role === 'Admin' ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 600 }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 1.5rem' }}>
                              <button 
                                onClick={() => toggleUserStatus(u.id)}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: u.status === 'Active' ? 'var(--color-success)' : 'var(--color-text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
                                aria-label="Toggle user active status"
                              >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'Active' ? 'var(--color-success)' : 'var(--color-text-muted)' }} />
                                {u.status}
                              </button>
                            </td>
                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                              <button 
                                className="user-filter-btn" 
                                onClick={() => setSelectedUser(u)}
                                style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
                              >
                                Permissions Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* User Permissions side-drawer/modal */}
                  <AnimatePresence>
                    {selectedUser && (
                      <div className="popup-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="popup-modal"
                          style={{ width: '92%', maxWidth: '440px', padding: '2rem' }}
                        >
                          <button className="popup-close" onClick={() => setSelectedUser(null)} aria-label="Close modal">
                            <X size={16} />
                          </button>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Security & Permissions</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                              {selectedUser.name[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700 }}>{selectedUser.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{selectedUser.email}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                              <span>Allow catalog editing</span>
                              <input type="checkbox" defaultChecked={selectedUser.role !== 'Viewer'} style={{ cursor: 'pointer' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                              <span>Allow user invitations</span>
                              <input type="checkbox" defaultChecked={selectedUser.role === 'Admin'} style={{ cursor: 'pointer' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                              <span>System log inspection</span>
                              <input type="checkbox" defaultChecked={selectedUser.role === 'Admin'} style={{ cursor: 'pointer' }} />
                            </div>
                          </div>

                          <button className="btn-primary" onClick={() => setSelectedUser(null)} style={{ width: '100%', marginTop: '2rem', padding: '0.85rem', borderRadius: '10px', justifyContent: 'center' }}>
                            Confirm & Save Permissions
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Invite New User Modal */}
                  <AnimatePresence>
                    {showInviteModal && (
                      <div className="popup-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className="popup-modal"
                          style={{ width: '92%', maxWidth: '400px', padding: '2rem' }}
                        >
                          <button className="popup-close" onClick={() => setShowInviteModal(false)} aria-label="Close modal">
                            <X size={16} />
                          </button>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Invite staff member</h3>
                          
                          <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label htmlFor="invite_email">Staff Email</label>
                              <input 
                                id="invite_email"
                                type="email" 
                                className="admin-form-input" 
                                placeholder="name@streambazaar.in" 
                                value={inviteEmail} 
                                onChange={e => setInviteEmail(e.target.value)} 
                                required
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="invite_role">System Role</label>
                              <select 
                                id="invite_role"
                                className="admin-form-input" 
                                value={inviteRole} 
                                onChange={e => setInviteRole(e.target.value)}
                              >
                                <option value="Viewer">Viewer</option>
                                <option value="Editor">Editor</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </div>
                            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem', borderRadius: '10px', justifyContent: 'center' }}>
                              Send Invitation Link
                            </button>
                          </form>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── TAB 4: MEDIA LIBRARY GRID ───────────────────────── */}
              {activeTab === 'media' && (
                <div>
                  {/* Drag-and-drop Dropzone uploader */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{ 
                      border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: dragActive ? 'var(--primary-glow)' : 'var(--color-surface)',
                      borderRadius: '16px',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      marginBottom: '2rem',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Drag & Drop product asset covers here</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Supports JPG, PNG, and WebP images. Max size 2MB.</p>
                  </div>

                  {/* Media gallery grid */}
                  <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    {mediaList.map(m => (
                      <div key={m.id} className="admin-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px', overflow: 'hidden', transition: 'var(--transition-base)' }}>
                        <div style={{ height: '110px', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)', padding: '0.5rem', position: 'relative' }}>
                          <img src={m.url} alt={m.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                        </div>
                        <div style={{ padding: '0.85rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem' }}>Uploaded: {m.date}</span>
                          
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => copyToClipboard(m.url, m.id)}
                              className="user-filter-btn" 
                              style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              {copiedId === m.id ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                              {copiedId === m.id ? "Copied!" : "Copy link"}
                            </button>
                            <button 
                              onClick={() => deleteMedia(m.id)}
                              className="admin-action-btn delete" 
                              style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                              aria-label="Delete media asset"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 5: PLATFORM SETTINGS ────────────────────────── */}
              {activeTab === 'settings' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  
                  {/* Settings sub-tabs selectors */}
                  <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                    {['general', 'security', 'notifications', 'integrations'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setSettingsTab(tab)}
                        className={`chart-filter-btn ${settingsTab === tab ? 'active' : ''}`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="admin-chart-card" style={{ margin: 0 }}>
                    {/* General Settings */}
                    {settingsTab === 'general' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>General Store Config</h3>
                        <div className="admin-form-group">
                          <label htmlFor="store_title">Digital Store Name</label>
                          <input id="store_title" className="admin-form-input" defaultValue="StreamBazaar Premium Store" />
                        </div>
                        <div className="admin-form-group">
                          <label htmlFor="store_currency">Currency pricing</label>
                          <select id="store_currency" className="admin-form-input">
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label htmlFor="store_timezone">Store timezone</label>
                          <select id="store_timezone" className="admin-form-input">
                            <option value="IST">Kolkata (GMT+5:30)</option>
                            <option value="EST">New York (GMT-5:00)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Security Settings */}
                    {settingsTab === 'security' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>System Security API Keys</h3>
                        <div className="admin-form-group">
                          <label htmlFor="api_key_field">Live system Telegram Bot API Key</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              id="api_key_field"
                              type="text" 
                              className="admin-form-input" 
                              value={apiKey} 
                              readOnly 
                              style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} 
                            />
                            <button 
                              onClick={() => { copyToClipboard(apiKey); setApiKeyCopied(true); setTimeout(() => setApiKeyCopied(false), 1500); }}
                              className="btn-ghost" 
                              style={{ width: '42px', height: '42px', padding: 0, justifyContent: 'center', borderRadius: '8px' }}
                              aria-label="Copy api key"
                            >
                              {apiKeyCopied ? <Check size={16} style={{ color: 'var(--color-success)' }} /> : <Copy size={16} />}
                            </button>
                            <button 
                              onClick={regenerateApiKey}
                              className="btn-ghost" 
                              style={{ width: '42px', height: '42px', padding: 0, justifyContent: 'center', borderRadius: '8px' }}
                              aria-label="Regenerate api key"
                            >
                              <RefreshCw size={16} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Two-Factor Staff Sign-In</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Require OTP key upon admin login.</div>
                          </div>
                          <input type="checkbox" style={{ cursor: 'pointer' }} />
                        </div>
                      </div>
                    )}

                    {/* Notifications Settings */}
                    {settingsTab === 'notifications' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>System Alerts</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Telegram Order Broadcasts</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Alert admins when user clicks checkout.</div>
                          </div>
                          <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Inventory Stock Triggers</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Alert support when keys drop below threshold limit.</div>
                          </div>
                          <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                        </div>
                      </div>
                    )}

                    {/* Integrations Settings */}
                    {settingsTab === 'integrations' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Linked platform integrations</h3>
                        {[
                          { name: "Telegram Store Messenger", desc: "Automated user credentials deliveries bot.", active: true },
                          { name: "Google Analytics core", desc: "User acquisition tracking analytics.", active: false },
                          { name: "TrustedStreams seeding", desc: "Synchronize backend service.db database dynamically.", active: true }
                        ].map((int, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== 2 ? '1px solid var(--color-border)' : 'none', paddingBottom: idx !== 2 ? '1rem' : 0 }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{int.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{int.desc}</div>
                            </div>
                            <input type="checkbox" defaultChecked={int.active} style={{ cursor: 'pointer' }} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sticky Save Changes footer button on mobile */}
                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '2.5rem', paddingTop: '1.25rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => alert('Platform configurations saved successfully!')}
                        className="btn-primary" 
                        style={{ padding: '0.65rem 1.75rem', borderRadius: '10px' }}
                      >
                        Save Configurations
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </>
      )}
    </div>
  );
}
