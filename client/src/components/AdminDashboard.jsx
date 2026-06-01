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

const API_BASE = (import.meta.env.PROD ? '' : 'http://localhost:5000') + '/api';

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

const DOMAINS = {
  'netflix': 'netflix.com',
  'youtube': 'youtube.com',
  'amazon': 'primevideo.com',
  'prime': 'primevideo.com',
  'hotstar': 'hotstar.com',
  'jio hotstar': 'hotstar.com',
  'jio': 'jiocinema.com',
  'jiocinema': 'jiocinema.com',
  'sony': 'sonyliv.com',
  'sonyliv': 'sonyliv.com',
  'zee5': 'zee5.com',
  'chatgpt': 'openai.com',
  'claude': 'anthropic.com',
  'canva': 'canva.com',
  'spotify': 'spotify.com',
  'crunchyroll': 'crunchyroll.com',
  'discord': 'discord.com',
  'disney': 'disneyplus.com',
  'hoichoi': 'hoichoi.tv',
  'discovery plus': 'discoveryplus.in',
  'discovery': 'discoveryplus.in',
  'airtel xstream': 'airtelxstream.in',
  'airtel': 'airtelxstream.in',
  'iptv': 'iptv-org.github.io',
  'ullu': 'ullu.app',
  'aha': 'aha.video',
  'altbalaji': 'altt.co.in',
  'voot': 'voot.com',
  'sun nxt': 'sunnxt.com',
  'sunnxt': 'sunnxt.com',
  'lionsgate': 'lionsgateplay.com',
  'epic on': 'epicon.in',
  'eros now': 'erosnow.com',
  'nord vpn': 'nordvpn.com',
  'nordvpn': 'nordvpn.com',
  'nord': 'nordvpn.com',
  'surfshark': 'surfshark.com',
  'express vpn': 'expressvpn.com',
  'expressvpn': 'expressvpn.com',
  'vpn': 'nordvpn.com',
  'epic': 'epicgames.com',
  'server': 'digitalocean.com',
  'stream server': 'plex.tv',
  'ott': 'netflix.com',
  'kaspersky': 'kaspersky.com'
};

const GAME_IMGS = {
  'gta 5': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_231x87.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_231x87.jpg',
  'rdr 2': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_231x87.jpg',
  'red dead': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_231x87.jpg',
  'cyberpunk': 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_231x87.jpg',
  'wwe': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_231x87.jpg',
  'forza': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/capsule_231x87.jpg',
  'fifa': 'https://cdn.akamai.steamstatic.com/steam/apps/2195250/capsule_231x87.jpg',
  'fc 24': 'https://cdn.akamai.steamstatic.com/steam/apps/2195250/capsule_231x87.jpg',
  'spider-man': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_231x87.jpg',
  'spiderman': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_231x87.jpg',
  'god of war': 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_231x87.jpg',
  'hogwarts': 'https://cdn.akamai.steamstatic.com/steam/apps/990080/capsule_231x87.jpg',
  'resident evil': 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_231x87.jpg',
  'elden ring': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_231x87.jpg',
  'call of duty': 'https://cdn.akamai.steamstatic.com/steam/apps/1938090/capsule_231x87.jpg'
};

const BRAND_COLORS = {
  'netflix': '#e50914',
  'youtube': '#ff0000',
  'amazon': '#00a8e1',
  'prime': '#00a8e1',
  'hotstar': '#030b14',
  'jio hotstar': '#030b14',
  'sony': '#df1827',
  'sonyliv': '#df1827',
  'zee5': '#8224e3',
  'chatgpt': '#10a37f',
  'claude': '#d97757',
  'canva': '#00c4cc',
  'spotify': '#1db954',
  'discord': '#5865f2',
  'nordvpn': '#4687ff',
  'surfshark': '#00d6aa'
};

const BRAND_CATEGORIES = {
  'netflix': 'Streaming',
  'youtube': 'Streaming',
  'amazon': 'Streaming',
  'prime': 'Streaming',
  'hotstar': 'Streaming',
  'jio hotstar': 'Streaming',
  'sony': 'Streaming',
  'sonyliv': 'Streaming',
  'zee5': 'Streaming',
  'chatgpt': 'AI+',
  'claude': 'AI+',
  'canva': 'AI+',
  'spotify': 'Streaming',
  'nordvpn': 'VPN',
  'surfshark': 'VPN',
  'iptv': 'Streaming',
  'hoichoi': 'Streaming'
};

const CUSTOM_ICONS = {
  'airtel': 'https://icon.horse/icon/airtelxstream.in',
  'discovery': 'https://icon.horse/icon/discoveryplus.in'
};

const getFavicon = (serviceName) => {
  if (!serviceName) return null;
  const lowerName = serviceName.toLowerCase().trim();
  
  const matchedCustom = Object.keys(CUSTOM_ICONS).find(k => lowerName.includes(k));
  if (matchedCustom) return CUSTOM_ICONS[matchedCustom];

  const matchedKey = Object.keys(DOMAINS).find(key => lowerName.includes(key));
  if (matchedKey) {
    return `https://www.google.com/s2/favicons?domain=${DOMAINS[matchedKey]}&sz=256`;
  }
  const cleanName = lowerName.split(' ')[0].replace(/[^a-z0-9]/g, '');
  return `https://www.google.com/s2/favicons?domain=${cleanName}.com&sz=256`;
};

const getGameIcon = (gameName) => {
  if (!gameName) return null;
  const lowerName = gameName.toLowerCase();
  for (let key in GAME_IMGS) {
    if (lowerName.includes(key)) return GAME_IMGS[key];
  }
  return null;
};

const DESC_OPTIONS = [
  "Premium shared profiles. Instant access upon purchase.",
  "Private account. Instant delivery.",
  "Premium Seat Access • Guaranteed",
  "4K Ultra HD • 1 Device Seat Access",
  "Offline game activation for PC. Full updates supported.",
  "100% legal, genuine, and carefully verified premium accounts.",
  "Personal email upgrade. Secure and private access."
];
const PLAN_LABELS = [
  "4K UHD", "4K Ultra HD", "Full HD 1080p", "720p", "Premium Plan", 
  "Individual Plan", "Shared Profile", "Private Profile", 
  "1 Device Seat Access", "2 Device Seat Access", "PC Game Seat Access", 
  "PlayStation", "Xbox"
];
const DURATION_OPTIONS = [
  '1 Month',
  '3 Months',
  '6 Months',
  '12 Months'
];
const PLATFORMS = ['TV', 'PC', 'iOS', 'Android', 'Laptop', 'PS4', 'PS5', 'Xbox'];


const LogoUploader = ({ editForm, setEditForm, getFavicon, onNameChange }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  
  const handleSearch = async (val) => {
    if (onNameChange) {
      onNameChange(val);
    } else {
      setEditForm({...editForm, name: val});
    }

    if (val.length > 2) {
      try {
        const [brandRes, gameRes] = await Promise.all([
          fetch(`https://api.brandfetch.io/v2/search/${val}`).catch(() => ({ json: () => [] })),
          fetch(window.location.hostname === 'localhost' ? `http://localhost:5000/api/search-games?q=${val}` : `/api/search-games?q=${val}`).catch(() => ({ json: () => [] }))
        ]);
        
        const brandData = await brandRes.json();
        const gameData = await gameRes.json();
        
        let combined = [];
        if (Array.isArray(brandData)) {
          combined = [...combined, ...brandData.map(b => ({
            name: b.name,
            domain: b.domain,
            icon: b.icon,
            type: 'OTT/Brand'
          }))];
        }
        if (Array.isArray(gameData)) {
          combined = [...combined, ...gameData.map(g => ({
            name: g.name,
            domain: 'Steam Game',
            icon: g.logo || g.icon,
            type: 'Game'
          }))];
        }
        
        setSuggestions(combined);
      } catch (err) {}
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    if (onNameChange) {
      onNameChange(item.name);
    } else {
      setEditForm({ ...editForm, name: item.name });
    }

    const hslToHex = (h, s, l) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    
    const getAutoColor = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
      return hslToHex(Math.abs(hash) % 360, 85, 60);
    };

    const autoColor = getAutoColor(item.name);

    // Extract color from image if possible
    const bestIcon = item.icon || `https://www.google.com/s2/favicons?domain=${item.domain}&sz=256`;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        let maxS = 0; let domR = 0, domG = 0, domB = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i+3] > 127) {
            const pr = data[i], pg = data[i+1], pb = data[i+2];
            r += pr; g += pg; b += pb; count++;
            const max = Math.max(pr, pg, pb), min = Math.min(pr, pg, pb);
            const s = max === 0 ? 0 : (max - min) / max;
            if (s > maxS && max > 50) {
              maxS = s; domR = pr; domG = pg; domB = pb;
            }
          }
        }
        let extractedColor = autoColor;
        if (maxS > 0.2) {
          extractedColor = '#' + [domR, domG, domB].map(x => x.toString(16).padStart(2, '0')).join('');
        } else if (count > 0) {
          extractedColor = '#' + [Math.floor(r/count), Math.floor(g/count), Math.floor(b/count)].map(x => x.toString(16).padStart(2, '0')).join('');
        }
        
        setEditForm(prev => ({ 
          ...prev, 
          name: item.name, 
          customIcon: bestIcon,
          color: extractedColor,
          ...(item.type === 'Game' && (!prev.category || prev.category === 'Streaming') ? { category: 'Gaming' } : {})
        }));
      } catch(e) {
        setEditForm(prev => ({ 
          ...prev, 
          name: item.name, 
          customIcon: bestIcon,
          color: (!prev.color || ['#000000', '#111111', '#222222', '#333333', '#444444', '#1a1a1a'].includes(prev.color.toLowerCase())) ? autoColor : prev.color,
          ...(item.type === 'Game' && (!prev.category || prev.category === 'Streaming') ? { category: 'Gaming' } : {})
        }));
      }
    };
    img.onerror = () => {
      setEditForm(prev => ({ 
        ...prev, 
        name: item.name, 
        customIcon: bestIcon,
        color: (!prev.color || ['#000000', '#111111', '#222222', '#333333', '#444444', '#1a1a1a'].includes(prev.color.toLowerCase())) ? autoColor : prev.color,
        ...(item.type === 'Game' && (!prev.category || prev.category === 'Streaming') ? { category: 'Gaming' } : {})
      }));
    };
    img.src = bestIcon;
    setSuggestions([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 256;
        let w = img.width;
        let h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/webp', 0.9);
        let extractedColor = editForm.color;
        try {
          const data = ctx.getImageData(0, 0, w, h).data;
          let r = 0, g = 0, b = 0, count = 0;
          let maxS = 0; let domR = 0, domG = 0, domB = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i+3] > 127) {
              const pr = data[i], pg = data[i+1], pb = data[i+2];
              r += pr; g += pg; b += pb; count++;
              const max = Math.max(pr, pg, pb), min = Math.min(pr, pg, pb);
              const s = max === 0 ? 0 : (max - min) / max;
              if (s > maxS && max > 50) {
                maxS = s; domR = pr; domG = pg; domB = pb;
              }
            }
          }
          if (maxS > 0.2) {
            extractedColor = '#' + [domR, domG, domB].map(x => x.toString(16).padStart(2, '0')).join('');
          } else if (count > 0) {
            extractedColor = '#' + [Math.floor(r/count), Math.floor(g/count), Math.floor(b/count)].map(x => x.toString(16).padStart(2, '0')).join('');
          }
        } catch(e) {}
        setEditForm(prev => ({ ...prev, customIcon: dataUrl, color: extractedColor }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: '1.5rem', background: 'var(--color-surface)', borderRadius: '12px' }}>
      <div className="admin-form-group">
        <label>Service/Game Title (Auto-Search)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {(editForm.customIcon || getFavicon(editForm.name)) && (
            <img src={editForm.customIcon || getFavicon(editForm.name)} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain', background: '#222' }} alt="Preview" />
          )}
          <div style={{ flex: 1, position: 'relative' }}>
             <input className="admin-form-input" style={{ width: '100%' }} placeholder="Enter name to search brand (e.g. Netflix, Spotify)..." value={editForm.name || ''} onChange={e => handleSearch(e.target.value)} />
             {suggestions.length > 0 && (
               <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                 {suggestions.map((s, idx) => (
                    <div key={idx} onClick={() => handleSelect(s)} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                       <img src={s.icon || `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`} style={{ width: s.type === 'Game' ? '56px' : '28px', height: '28px', borderRadius: '4px', objectFit: 'contain', background: '#111' }} alt={s.name} onError={e => e.target.style.display='none'} />
                       <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                         <span style={{ fontWeight: '600' }}>{s.name}</span>
                         <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.domain}</span>
                       </div>
                       <span style={{ fontSize: '10px', padding: '2px 6px', background: s.type === 'Game' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: s.type === 'Game' ? '#4ade80' : '#818cf8', borderRadius: '4px' }}>{s.type}</span>
                    </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('logo-upload').click()}
        style={{ border: `2px dashed ${dragActive ? 'var(--color-primary)' : 'var(--color-border)'}`, padding: '1.5rem', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '10px' }}
      >
        <input type="file" id="logo-upload" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = null; }} />
        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: '500' }}>Drag & Drop Custom Image or Click to Browse</div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', opacity: 0.7 }}>(Auto-optimizes to WebP. Leave empty to use auto-search logo)</div>
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState('products'); // products, media, settings
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Data States
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Tab Filtering & Views
  const [productView, setProductView] = useState('grid'); // grid, list
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
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
      const res = await fetch(`${API_BASE}/plans?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      setServices(data);
      setLoading(false);

      // Fetch dynamic buyer orders
      const resUsers = await fetch(`${API_BASE}/admin/orders`, { cache: 'no-store' });
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

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Convert to highest quality WebP
        const convertedUrl = canvas.toDataURL('image/webp', 1.0);
        
        const newMedia = {
          id: Date.now(),
          name: file.name.split('.')[0],
          url: convertedUrl,
          date: new Date().toISOString().split('T')[0]
        };
        setMediaList(prev => [newMedia, ...prev]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const fileInputRef = useRef(null);
  
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
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
    const sName = s.name || '';
    const sCat = s.category || '';
    const matchesSearch = sName.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                          sCat.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'All' || s.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

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
                className={`sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => { setActiveTab('products'); setSidebarExpanded(false); }}
              >
                <Package size={18} /> Products & Plans
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
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--card)', padding: '4px', borderRadius: '12px' }}>
                      {['All', 'Streaming', 'VPN', 'Gaming', 'AI+'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setActiveCategoryFilter(cat)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: activeCategoryFilter === cat ? 'var(--color-primary)' : 'transparent',
                            color: activeCategoryFilter === cat ? 'white' : 'var(--color-text-muted)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>


                    <button 
                      className="btn-primary"
                      onClick={() => {
                        setEditForm({ name: '', category: 'Streaming', color: '#6366f1', description: 'default', status: 'Available', plans: [{ label: 'default', quality: '', duration: 'default', price: '₹', type: '', supportedDevices: ['TV', 'PC', 'iOS', 'Android'], image: '' }] });
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
                                  <LogoUploader 
    editForm={editForm} 
    setEditForm={setEditForm} 
    getFavicon={getFavicon} 
    onNameChange={(e_val) => {
                                        const val = e_val;
                                        const lowerVal = val.toLowerCase();
                                        let newCategory = editForm.category;
                                        let newColor = editForm.color;
                                        
                                        const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                        if (matchedBrand) {
                                          const catIsDefault = !editForm.category || editForm.category === 'Streaming';
                                          const colorIsDefault = !editForm.color || editForm.color === '#6366f1' || editForm.color === '#000000';
                                          if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                          if (colorIsDefault && BRAND_COLORS[matchedBrand]) newColor = BRAND_COLORS[matchedBrand];
                                        }
                                        setEditForm({...editForm, name: val, category: newCategory, color: newColor});
                                      }} 
  />
                                  <div className="admin-form-group">
                                    <label>Category</label>
                                    <select 
                                      className="admin-form-input" 
                                      value={['Streaming', 'Gaming', 'VPN', 'AI+'].includes(editForm.category) ? editForm.category : 'Custom'}
                                      onChange={e => {
                                        if (e.target.value === 'Custom') {
                                          setEditForm({...editForm, category: ''});
                                        } else {
                                          setEditForm({...editForm, category: e.target.value});
                                        }
                                      }}
                                    >
                                      <option value="Streaming" style={{color: '#ef4444'}}>Streaming</option>
                                      <option value="Gaming" style={{color: '#22c55e'}}>Gaming</option>
                                      <option value="VPN" style={{color: '#3b82f6'}}>VPN</option>
                                      <option value="AI+" style={{color: '#a855f7'}}>AI+</option>
                                      <option value="Custom">Custom...</option>
                                    </select>
                                    {!['Streaming', 'Gaming', 'VPN', 'AI+'].includes(editForm.category) && editForm.category !== undefined && (
                                      <input 
                                        className="admin-form-input" 
                                        style={{ marginTop: '0.5rem' }} 
                                        placeholder="Enter custom category" 
                                        value={editForm.category || ''} 
                                        onChange={e => setEditForm({...editForm, category: e.target.value})} 
                                        autoFocus
                                      />
                                    )}
                                  </div>
                                  <div className="admin-form-group">
                                    <label>Accent Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.color || '').trim())) ? '#' + editForm.color.trim() : editForm.color || '#333' }}></div>
                                      <input className="admin-form-input" style={{ flex: 1 }} value={editForm.color || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, color: val}); }} />
                                    </div>
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
                                    <select 
                                      className="admin-form-input" 
                                      value={(editForm.description === 'default' || editForm.description === undefined || editForm.description === null) ? 'default' : (DESC_OPTIONS.includes(editForm.description) ? editForm.description : 'Custom')}
                                      onChange={e => {
                                        if (e.target.value === 'Custom') setEditForm({...editForm, description: ''});
                                        else setEditForm({...editForm, description: e.target.value});
                                      }}
                                    >
                                      <option value="default" disabled>Select a description</option>
                                      {DESC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      <option value="Custom">Custom...</option>
                                    </select>
                                    {(!['default', undefined, null].includes(editForm.description) && !DESC_OPTIONS.includes(editForm.description)) && (
                                      <input 
                                        className="admin-form-input" 
                                        style={{ marginTop: '0.5rem' }} 
                                        placeholder="Enter custom description" 
                                        value={editForm.description || ''} 
                                        onChange={e => setEditForm({...editForm, description: e.target.value})} 
                                        autoFocus
                                      />
                                    )}
                                  </div>

                                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                                    <label style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'block' }}>Plans & Pricing</label>
                                    {editForm.plans && editForm.plans.map((plan, idx) => (
                                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-background)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Plan {idx + 1}</span>
                                          <button className="admin-action-btn delete" onClick={() => {
                                            const newPlans = editForm.plans.filter((_, i) => i !== idx);
                                            setEditForm({...editForm, plans: newPlans});
                                          }}><Trash2 size={16} /></button>
                                        </div>
                                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                          <label style={{ fontSize: '0.85rem' }}>Plan Label</label>
                                          <select 
                                            className="admin-form-input" 
                                            value={(plan.label === 'default' || plan.label === undefined || plan.label === null) ? 'default' : (PLAN_LABELS.includes(plan.label) ? plan.label : 'Custom')}
                                            onChange={e => {
                                              const newPlans = [...editForm.plans];
                                              newPlans[idx] = { ...newPlans[idx], label: e.target.value === 'Custom' ? '' : e.target.value };
                                              setEditForm({...editForm, plans: newPlans});
                                            }}
                                          >
                                            <option value="default" disabled>Select label</option>
                                            {PLAN_LABELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            <option value="Custom">Custom...</option>
                                          </select>
                                          {(!['default', undefined, null].includes(plan.label) && !PLAN_LABELS.includes(plan.label)) && (
                                            <input 
                                              className="admin-form-input" 
                                              style={{ marginTop: '0.5rem' }} 
                                              placeholder="Enter custom label" 
                                              value={plan.label || ''} 
                                              onChange={e => {
                                                const newPlans = [...editForm.plans];
                                                newPlans[idx] = { ...newPlans[idx], label: e.target.value };
                                                setEditForm({...editForm, plans: newPlans});
                                              }} 
                                              autoFocus
                                            />
                                          )}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Duration</label>
                                            <select 
                                              className="admin-form-input" 
                                              value={(plan.duration === 'default' || plan.duration === undefined || plan.duration === null) ? 'default' : (DURATION_OPTIONS.includes(plan.duration) ? plan.duration : 'Custom')}
                                              onChange={e => {
                                                const newPlans = [...editForm.plans];
                                                newPlans[idx] = { ...newPlans[idx], duration: e.target.value === 'Custom' ? '' : e.target.value };
                                                setEditForm({...editForm, plans: newPlans});
                                              }}
                                            >
                                              <option value="default" disabled>Select</option>
                                              {DURATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                              <option value="Custom">Custom...</option>
                                            </select>
                                            {(!['default', undefined, null].includes(plan.duration) && !DURATION_OPTIONS.includes(plan.duration)) && (
                                              <input 
                                                className="admin-form-input" 
                                                style={{ marginTop: '0.5rem' }} 
                                                placeholder="Custom" 
                                                value={plan.duration || ''} 
                                                onChange={e => {
                                                  const newPlans = [...editForm.plans];
                                                  newPlans[idx] = { ...newPlans[idx], duration: e.target.value };
                                                  setEditForm({...editForm, plans: newPlans});
                                                }} 
                                                autoFocus
                                              />
                                            )}
                                          </div>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Price (₹)</label>
                                            <input className="admin-form-input" placeholder="Price" value={plan.price} onChange={e => {
                                              const newPlans = [...editForm.plans];
                                              newPlans[idx] = { ...newPlans[idx], price: e.target.value };
                                              setEditForm({...editForm, plans: newPlans});
                                            }} />
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Platform/Device</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                              {PLATFORMS.map(opt => {
                                                const currentSupported = plan.supportedDevices || (plan.device ? [plan.device] : ['TV', 'PC', 'iOS', 'Android']);
                                                const isSelected = currentSupported.includes(opt);
                                                return (
                                                  <div 
                                                    key={opt}
                                                    onClick={() => {
                                                      const newPlans = [...editForm.plans];
                                                      let newSupported = [...currentSupported];
                                                      if (isSelected) {
                                                        newSupported = newSupported.filter(d => d !== opt);
                                                      } else {
                                                        newSupported.push(opt);
                                                      }
                                                      newPlans[idx] = { ...newPlans[idx], supportedDevices: newSupported };
                                                      setEditForm({...editForm, plans: newPlans});
                                                    }}
                                                    style={{
                                                      padding: '0.2rem 0.6rem',
                                                      fontSize: '0.75rem',
                                                      borderRadius: '12px',
                                                      cursor: 'pointer',
                                                      background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                                      color: isSelected ? 'white' : 'var(--text-muted)',
                                                      border: '1px solid ' + (isSelected ? 'var(--color-primary)' : 'var(--color-border)')
                                                    }}
                                                  >
                                                    {opt}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                          
                                        </div>

                                      </div>
                                    ))}
                                    <button className="btn-ghost" onClick={() => setEditForm({...editForm, plans: [...(editForm.plans || []), { label: 'default', quality: '', duration: 'default', price: '₹', type: '', supportedDevices: ['TV', 'PC', 'iOS', 'Android'], image: '' }]})} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: 'fit-content', marginTop: '0.5rem' }}>
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
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}22`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                      {s.category === 'Gaming' ? (
                                        <img src={s.plans?.[0]?.image || getGameIcon(s.name) || getFavicon(s.name)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                      ) : (
                                        <img src={s.customIcon || getFavicon(s.name)} style={{ width: '28px', height: '28px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                      )}
                                      <Package size={22} style={{ color: s.color, display: 'none' }} />
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
                          
                          <datalist id="category-recommendations">
                            <option value="Streaming" />
                            <option value="Gaming" />
                            <option value="AI+" />
                            <option value="VPN" />
                          </datalist>
                          <datalist id="duration-recommendations">
                            <option value="30 Days" />
                            <option value="1 Month" />
                            <option value="45 Days" />
                            <option value="2 Months" />
                            <option value="3 Months" />
                            <option value="6 Months" />
                            <option value="1 Year" />
                            <option value="Lifetime" />
                          </datalist>
                          <datalist id="plan-labels">
                            <option value="4K UHD" />
                            <option value="4K Ultra HD" />
                            <option value="Full HD 1080p" />
                            <option value="720p" />
                            <option value="Premium Plan" />
                            <option value="Individual Plan" />
                            <option value="Shared Profile" />
                            <option value="Private Profile" />
                            <option value="1 Device Seat Access" />
                            <option value="2 Device Seat Access" />
                            <option value="PC Game Seat Access" />
                            <option value="PlayStation" />
                            <option value="Xbox" />
                          </datalist>
                          <datalist id="description-recommendations">
                            <option value="Premium shared profiles. Instant access upon purchase." />
                            <option value="Private account. Instant delivery." />
                            <option value="Premium Seat Access • Guaranteed" />
                            <option value="4K Ultra HD • 1 Device Seat Access" />
                            <option value="Offline game activation for PC. Full updates supported." />
                            <option value="100% legal, genuine, and carefully verified premium accounts." />
                            <option value="Personal email upgrade. Secure and private access." />
                          </datalist>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <LogoUploader 
    editForm={editForm} 
    setEditForm={setEditForm} 
    getFavicon={getFavicon} 
    onNameChange={(e_val) => {
                                  const val = e_val;
                                  const lowerVal = val.toLowerCase();
                                  
                                  let newCategory = editForm.category;
                                  let newColor = editForm.color;
                                  
                                  const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                  if (matchedBrand) {
                                    const catIsDefault = !editForm.category || editForm.category === 'Streaming';
                                    const colorIsDefault = !editForm.color || editForm.color === '#6366f1' || editForm.color === '#000000';
                                    if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                    if (colorIsDefault && BRAND_COLORS[matchedBrand]) newColor = BRAND_COLORS[matchedBrand];
                                  }
                                  
                                  setEditForm({...editForm, name: val, category: newCategory, color: newColor});
                                }} 
  />
                            <div className="admin-form-group">
                              <label>Category</label>
                              <select 
                                className="admin-form-input" 
                                value={['Streaming', 'Gaming', 'VPN', 'AI+'].includes(editForm.category) ? editForm.category : 'Custom'}
                                onChange={e => {
                                  if (e.target.value === 'Custom') {
                                    setEditForm({...editForm, category: ''});
                                  } else {
                                    setEditForm({...editForm, category: e.target.value});
                                  }
                                }}
                              >
                                <option value="Streaming" style={{color: '#ef4444'}}>Streaming</option>
                                <option value="Gaming" style={{color: '#22c55e'}}>Gaming</option>
                                <option value="VPN" style={{color: '#3b82f6'}}>VPN</option>
                                <option value="AI+" style={{color: '#a855f7'}}>AI+</option>
                                <option value="Custom">Custom...</option>
                              </select>
                              {!['Streaming', 'Gaming', 'VPN', 'AI+'].includes(editForm.category) && editForm.category !== undefined && (
                                <input 
                                  className="admin-form-input" 
                                  style={{ marginTop: '0.5rem' }} 
                                  placeholder="Enter custom category" 
                                  value={editForm.category || ''} 
                                  onChange={e => setEditForm({...editForm, category: e.target.value})} 
                                  autoFocus
                                />
                              )}
                            </div>
                            <div className="admin-form-group">
                              <label>Accent Hex Color</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.color || '').trim())) ? '#' + editForm.color.trim() : editForm.color || '#333' }}></div>
                                <input className="admin-form-input" style={{ flex: 1 }} placeholder="#e50914" value={editForm.color || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, color: val}); }} />
                              </div>
                            </div>
                            <div className="admin-form-group">
                              <label>Description</label>
                              <select 
                                className="admin-form-input" 
                                value={(editForm.description === 'default' || editForm.description === undefined || editForm.description === null) ? 'default' : (DESC_OPTIONS.includes(editForm.description) ? editForm.description : 'Custom')}
                                onChange={e => {
                                  if (e.target.value === 'Custom') setEditForm({...editForm, description: ''});
                                  else setEditForm({...editForm, description: e.target.value});
                                }}
                              >
                                <option value="default" disabled>Select a description</option>
                                {DESC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                <option value="Custom">Custom...</option>
                              </select>
                              {(!['default', undefined, null].includes(editForm.description) && !DESC_OPTIONS.includes(editForm.description)) && (
                                <input 
                                  className="admin-form-input" 
                                  style={{ marginTop: '0.5rem' }} 
                                  placeholder="Enter custom description" 
                                  value={editForm.description || ''} 
                                  onChange={e => setEditForm({...editForm, description: e.target.value})} 
                                  autoFocus
                                />
                              )}
                            </div>

                            <div className="admin-form-group">
                              <label style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'block' }}>Plans & Pricing</label>
                              {editForm.plans && editForm.plans.map((plan, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-background)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Plan {idx + 1}</span>
                                    <button type="button" className="admin-action-btn delete" onClick={() => {
                                      const newPlans = editForm.plans.filter((_, i) => i !== idx);
                                      setEditForm({...editForm, plans: newPlans});
                                    }}><Trash2 size={16} /></button>
                                  </div>
                                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.85rem' }}>Plan Label</label>
                                    <select 
                                      className="admin-form-input" 
                                      value={(plan.label === 'default' || plan.label === undefined || plan.label === null) ? 'default' : (PLAN_LABELS.includes(plan.label) ? plan.label : 'Custom')}
                                      onChange={e => {
                                        const newPlans = [...editForm.plans];
                                        newPlans[idx] = { ...newPlans[idx], label: e.target.value === 'Custom' ? '' : e.target.value };
                                        setEditForm({...editForm, plans: newPlans});
                                      }}
                                    >
                                      <option value="default" disabled>Select label</option>
                                      {PLAN_LABELS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      <option value="Custom">Custom...</option>
                                    </select>
                                    {(!['default', undefined, null].includes(plan.label) && !PLAN_LABELS.includes(plan.label)) && (
                                      <input 
                                        className="admin-form-input" 
                                        style={{ marginTop: '0.5rem' }} 
                                        placeholder="Enter custom label" 
                                        value={plan.label || ''} 
                                        onChange={e => {
                                          const newPlans = [...editForm.plans];
                                          newPlans[idx] = { ...newPlans[idx], label: e.target.value };
                                          setEditForm({...editForm, plans: newPlans});
                                        }} 
                                        autoFocus
                                      />
                                    )}
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.85rem' }}>Duration</label>
                                      <select 
                                        className="admin-form-input" 
                                        value={(plan.duration === 'default' || plan.duration === undefined || plan.duration === null) ? 'default' : (DURATION_OPTIONS.includes(plan.duration) ? plan.duration : 'Custom')}
                                        onChange={e => {
                                          const newPlans = [...editForm.plans];
                                          newPlans[idx] = { ...newPlans[idx], duration: e.target.value === 'Custom' ? '' : e.target.value };
                                          setEditForm({...editForm, plans: newPlans});
                                        }}
                                      >
                                        <option value="default" disabled>Select</option>
                                        {DURATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        <option value="Custom">Custom...</option>
                                      </select>
                                      {(!['default', undefined, null].includes(plan.duration) && !DURATION_OPTIONS.includes(plan.duration)) && (
                                        <input 
                                          className="admin-form-input" 
                                          style={{ marginTop: '0.5rem' }} 
                                          placeholder="Custom" 
                                          value={plan.duration || ''} 
                                          onChange={e => {
                                            const newPlans = [...editForm.plans];
                                            newPlans[idx] = { ...newPlans[idx], duration: e.target.value };
                                            setEditForm({...editForm, plans: newPlans});
                                          }} 
                                          autoFocus
                                        />
                                      )}
                                    </div>
                                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: '0.85rem' }}>Price (₹)</label>
                                      <input className="admin-form-input" placeholder="Price" value={plan.price} onChange={e => {
                                        const newPlans = [...editForm.plans];
                                        newPlans[idx] = { ...newPlans[idx], price: e.target.value };
                                        setEditForm({...editForm, plans: newPlans});
                                      }} />
                                    </div>
                                  </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                            <label style={{ fontSize: '0.85rem' }}>Platform/Device</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                                              {PLATFORMS.map(opt => {
                                                const currentSupported = plan.supportedDevices || (plan.device ? [plan.device] : ['TV', 'PC', 'iOS', 'Android']);
                                                const isSelected = currentSupported.includes(opt);
                                                return (
                                                  <div 
                                                    key={opt}
                                                    onClick={() => {
                                                      const newPlans = [...editForm.plans];
                                                      let newSupported = [...currentSupported];
                                                      if (isSelected) {
                                                        newSupported = newSupported.filter(d => d !== opt);
                                                      } else {
                                                        newSupported.push(opt);
                                                      }
                                                      newPlans[idx] = { ...newPlans[idx], supportedDevices: newSupported };
                                                      setEditForm({...editForm, plans: newPlans});
                                                    }}
                                                    style={{
                                                      padding: '0.2rem 0.6rem',
                                                      fontSize: '0.75rem',
                                                      borderRadius: '12px',
                                                      cursor: 'pointer',
                                                      background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                                                      color: isSelected ? 'white' : 'var(--text-muted)',
                                                      border: '1px solid ' + (isSelected ? 'var(--color-primary)' : 'var(--color-border)')
                                                    }}
                                                  >
                                                    {opt}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                          
                                        </div>

                                </div>
                              ))}
                              <button type="button" className="btn-ghost" onClick={() => setEditForm({...editForm, plans: [...(editForm.plans || []), { label: 'default', quality: '', duration: 'default', price: '₹', type: '', supportedDevices: ['TV', 'PC', 'iOS', 'Android'], image: '' }]})} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', width: 'fit-content', marginTop: '0.5rem' }}>
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



              {/* ── TAB 4: MEDIA LIBRARY GRID ───────────────────────── */}
              {activeTab === 'media' && (
                <div>
                  {/* Drag-and-drop Dropzone uploader */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
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
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileInput} 
                      accept="image/png, image/jpeg, image/webp" 
                      style={{ display: 'none' }} 
                    />
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Drag & Drop product asset covers here</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Supports JPG, PNG, and WebP images. Or click to upload. Max size 2MB.</p>
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
