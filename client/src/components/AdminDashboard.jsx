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
import { Vibrant } from 'node-vibrant/browser';
import '../App.css';

const API_BASE = (import.meta.env.PROD ? '' : 'http://localhost:5000') + '/api';

const getProxiedUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('/') || url.startsWith('http://localhost') || url.startsWith('https://streambazaar')) return url;
  const rootBase = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;
  return `${rootBase}/api/proxy-image?url=${encodeURIComponent(url)}`;
};

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
  { id: 3, name: "Zeeshan Hussain", email: "zeeshanhussain0999@gmail.com", role: "Admin", status: "Active" },
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
  'wwe 2k25': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_184x69.jpg',
  'wwe bundles': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_184x69.jpg',
  'forza horizon 5': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/capsule_184x69.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_184x69.jpg',
  'gta trilogy': 'https://cdn.akamai.steamstatic.com/steam/apps/1546930/capsule_184x69.jpg',
  'spider-man 2': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_184x69.jpg',
  'spider-man series': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_184x69.jpg',
  'uncharted': 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/capsule_184x69.jpg',
  'crimson desert': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=60',
  'the last of us': 'https://cdn.akamai.steamstatic.com/steam/apps/1888930/capsule_184x69.jpg',
  'black myth wukong': 'https://cdn.akamai.steamstatic.com/steam/apps/2358720/capsule_184x69.jpg',
  'ghost of tsushima': 'https://cdn.akamai.steamstatic.com/steam/apps/2215430/capsule_184x69.jpg',
  'elden ring': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_184x69.jpg',
  'resident evil': 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_184x69.jpg',
  'hogwarts legacy': 'https://cdn.akamai.steamstatic.com/steam/apps/990080/capsule_184x69.jpg',
  'god of war': 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_184x69.jpg',
  'cyberpunk 2077': 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_184x69.jpg',
  'pragmata': 'https://cdn.akamai.steamstatic.com/steam/apps/1240440/capsule_184x69.jpg',
  'assassin\'s creed': 'https://cdn.akamai.steamstatic.com/steam/apps/2208920/capsule_184x69.jpg',
  'khazan': 'https://cdn.akamai.steamstatic.com/steam/apps/2801450/capsule_184x69.jpg', // Placeholder
  'f1 24': 'https://cdn.akamai.steamstatic.com/steam/apps/2488620/capsule_184x69.jpg',
  'f1 25': 'https://cdn.akamai.steamstatic.com/steam/apps/3059520/capsule_184x69.jpg',
  'stellar blade': 'https://cdn.akamai.steamstatic.com/steam/apps/3489700/capsule_184x69.jpg',
  'mafia': 'https://cdn.akamai.steamstatic.com/steam/apps/1030840/capsule_184x69.jpg',
  'tekken 7': 'https://cdn.akamai.steamstatic.com/steam/apps/389730/capsule_184x69.jpg',
  'tekken 8': 'https://cdn.akamai.steamstatic.com/steam/apps/1778820/capsule_184x69.jpg',
  'expedition 33': 'https://cdn.akamai.steamstatic.com/steam/apps/2690040/capsule_184x69.jpg',
  'red dead redemption': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_184x69.jpg',
  'hitman': 'https://cdn.akamai.steamstatic.com/steam/apps/1659040/capsule_184x69.jpg',
  'rockstar pack': 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/capsule_184x69.jpg',
  'far cry': 'https://cdn.akamai.steamstatic.com/steam/apps/2369390/capsule_184x69.jpg',
  'poppy playtime': 'https://cdn.akamai.steamstatic.com/steam/apps/1721470/capsule_184x69.jpg',
  'minecraft': 'https://cdn.akamai.steamstatic.com/steam/apps/1240440/capsule_184x69.jpg', // placeholder
  'special steam accounts': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_184x69.jpg', // placeholder
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
  let domain;
  if (matchedKey) {
    domain = DOMAINS[matchedKey];
  } else {
    domain = `${lowerName.split(' ')[0].replace(/[^a-z0-9]/g, '')}.com`;
  }

  // Use Logo.dev CDN if a token is configured
  const token = import.meta.env.VITE_LOGO_DEV_TOKEN || import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
  if (token) {
    return `https://img.logo.dev/${domain}?token=${token}`;
  }

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
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
const PLATFORMS = ['TV', 'PC', 'iOS', 'Android', 'Laptop', 'PS2', 'PS3', 'PS4', 'PS5', 'Xbox', 'Xbox S', 'Xbox X'];


const isGamingCategory = (cat) => {
  if (!cat) return false;
  const c = cat.toLowerCase().trim();
  return c === 'gaming' || c === 'steam' || c === 'playstation' || c === 'xbox' || c === 'epic' || c === 'steam gaming' || c === 'games' || c === 'game' || c.includes('gaming') || c.includes('game');
};

const LogoUploader = ({ editForm, setEditForm, getFavicon, onNameChange }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const searchTimeoutRef = React.useRef(null);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    setImgError(false);
  }, [editForm.customIcon, editForm.name]);

  const handleSearch = (val) => {
    if (onNameChange) {
      onNameChange(val);
    } else {
      setEditForm(prev => ({ ...prev, name: val }));
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (val.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const gameRes = await fetch(`${API_BASE}/search-games?q=${encodeURIComponent(val)}`);
          if (gameRes.ok) {
            const gameData = await gameRes.json().catch(() => []);
            if (Array.isArray(gameData)) {
              const mapped = gameData.map(g => {
                let persistentIcon = g.icon || g.logo;
                if (g.type === 'OTT/Brand' && g.domain) {
                  const token = import.meta.env.VITE_LOGO_DEV_TOKEN || import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
                  persistentIcon = token ? `https://img.logo.dev/${g.domain}?token=${token}` : `https://www.google.com/s2/favicons?domain=${g.domain}&sz=256`;
                }
                const displayName = g.name || (g.domain && g.domain !== 'Steam Game' ? g.domain.split('.')[0].charAt(0).toUpperCase() + g.domain.split('.')[0].slice(1) : '') || 'Brand';
                return {
                  name: displayName,
                  domain: g.domain || 'Steam Game',
                  icon: persistentIcon,
                  type: g.type || 'Game'
                };
              });
              setSuggestions(mapped);
            }
          }
        } catch (e) {
          console.error("Game search error:", e);
        }
      }, 300);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    const isGameType = isGamingCategory(item.type) || item.type === 'Game';

    // Resolve the best persistent icon URL immediately
    let bestIcon = item.icon || (item.domain && !item.domain.includes(' ')
      ? `https://www.google.com/s2/favicons?domain=${item.domain}&sz=256`
      : null);
    if (bestIcon && bestIcon.includes('brandfetch.io') && item.domain) {
      const token = import.meta.env.VITE_LOGO_DEV_TOKEN || import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
      bestIcon = token
        ? `https://img.logo.dev/${item.domain}?token=${token}`
        : `https://www.google.com/s2/favicons?domain=${item.domain}&sz=256`;
    }

    // Determine category and default colors
    let resolvedCategory = isGameType ? 'Gaming' : 'Streaming';
    let resolvedPrimary = '#6366f1';
    let resolvedSecondary = '#4f46e5';

    const lowerVal = (item.name || '').toLowerCase();
    const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
    if (matchedBrand) {
      if (BRAND_CATEGORIES[matchedBrand]) resolvedCategory = BRAND_CATEGORIES[matchedBrand];
      if (BRAND_COLORS[matchedBrand]) {
        resolvedPrimary = BRAND_COLORS[matchedBrand];
        resolvedSecondary = BRAND_COLORS[matchedBrand];
      }
    }

    // Single atomic state update to prevent race conditions
    setEditForm(prev => {
      const categoryIsDefaultOrUnchanged = !prev.category || prev.category === 'Streaming' || prev.category === 'Gaming' || prev.category === prev.originalCategory;
      const colorsAreDefaultOrUnchanged = !prev.primaryColor || prev.primaryColor === '#6366f1' || prev.primaryColor === '#000000' || prev.primaryColor === prev.originalPrimaryColor;
      
      return {
        ...prev,
        name: item.name || (item.domain && item.domain !== 'Steam Game' ? item.domain.split('.')[0].charAt(0).toUpperCase() + item.domain.split('.')[0].slice(1) : '') || 'Brand',
        customIcon: bestIcon,
        category: categoryIsDefaultOrUnchanged ? resolvedCategory : prev.category,
        primaryColor: colorsAreDefaultOrUnchanged ? resolvedPrimary : prev.primaryColor,
        secondaryColor: colorsAreDefaultOrUnchanged ? resolvedSecondary : prev.secondaryColor
      };
    });

    setSuggestions([]);

    if (!bestIcon) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        const palette = await Vibrant.from(img).getPalette();
        const primary   = palette.Vibrant     ? palette.Vibrant.hex     : resolvedPrimary;
        const secondary = palette.DarkVibrant ? palette.DarkVibrant.hex
                        : palette.Muted       ? palette.Muted.hex       : resolvedSecondary;
        setEditForm(prev => {
          const colorsAreDefaultOrUnchanged = !prev.primaryColor || prev.primaryColor === '#6366f1' || prev.primaryColor === '#000000' || prev.primaryColor === prev.originalPrimaryColor || prev.primaryColor === resolvedPrimary;
          if (!colorsAreDefaultOrUnchanged) return prev;
          return { ...prev, primaryColor: primary, secondaryColor: secondary };
        });
      } catch (_) {
        // Keeping defaults if vibrant fails
      }
    };
    img.src = getProxiedUrl(bestIcon);
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
      img.onload = async () => {
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
        
        let extractedPrimary = editForm.primaryColor || '#6366f1';
        let extractedSecondary = editForm.secondaryColor || '#6366f1';
        
        try {
          const palette = await Vibrant.from(img).getPalette();
          if (palette.Vibrant) extractedPrimary = palette.Vibrant.hex;
          if (palette.DarkVibrant) extractedSecondary = palette.DarkVibrant.hex;
          else if (palette.Muted) extractedSecondary = palette.Muted.hex;
        } catch(e) {}
        
        setEditForm(prev => ({ ...prev, customIcon: dataUrl, primaryColor: extractedPrimary, secondaryColor: extractedSecondary }));
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
          {(() => {
             const isGaming = isGamingCategory(editForm.category);
             const iconSrc = editForm.customIcon || (isGaming ? (getGameIcon(editForm.name) || getFavicon(editForm.name)) : getFavicon(editForm.name));
             if (!iconSrc && !editForm.name) return null;
             return (
               <div style={{ 
                 width: isGaming ? '48px' : '48px', 
                 height: isGaming ? '64px' : '48px', 
                 borderRadius: isGaming ? '6px' : '8px', 
                 overflow: 'hidden',
                 background: '#222',
                 boxShadow: isGaming ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 flexShrink: 0
               }}>
                 {iconSrc && !imgError ? (
                   <img 
                     src={iconSrc} style={{ width: '100%', height: '100%', objectFit: isGaming ? 'cover' : 'contain', padding: isGaming ? '0' : '4px' }} 
                     alt="Preview" 
                     onError={(e) => {
                       if (!e.target.dataset.triedProxy) {
                         e.target.dataset.triedProxy = 'true';
                         e.target.src = getProxiedUrl(iconSrc);
                         return;
                       }
                       if (iconSrc === editForm.customIcon) {
                         const fallback = isGaming ? (getGameIcon(editForm.name) || getFavicon(editForm.name)) : getFavicon(editForm.name);
                         if (fallback && fallback !== editForm.customIcon) {
                           e.target.src = fallback;
                           e.target.dataset.triedProxy = '';
                           return;
                         }
                       }
                       setImgError(true);
                     }}
                   />
                 ) : (
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: isGaming ? '18px' : '14px', fontWeight: 'bold', color: 'var(--color-text-muted)', background: '#333' }}>
                     {editForm.name ? editForm.name.charAt(0).toUpperCase() : '?'}
                   </div>
                 )}
               </div>
             );
          })()}
          <div style={{ flex: 1, position: 'relative' }}>
             <input className="admin-form-input" style={{ width: '100%' }} placeholder="Enter name to search brand (e.g. Netflix, Spotify)..." value={editForm.name || ''} onChange={e => handleSearch(e.target.value)} />
             {suggestions.length > 0 && (
               <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', zIndex: 10, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', marginTop: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                 {suggestions.map((s, idx) => (
                    <div key={idx} onClick={() => handleSelect(s)} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                       <div style={{ 
                         width: s.type === 'Game' ? '36px' : '36px', 
                         height: s.type === 'Game' ? '48px' : '36px', 
                         borderRadius: '4px', 
                         overflow: 'hidden', 
                         background: '#111', 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center',
                         flexShrink: 0
                       }}>
                          {(() => {
                            const directUrl = s.icon || (s.type === 'Game' ? (getGameIcon(s.name) || '') : `https://www.google.com/s2/favicons?domain=${s.domain}&sz=128`);
                            return (
                              <img 
                                src={directUrl} style={{ width: '100%', height: '100%', objectFit: s.type === 'Game' ? 'cover' : 'contain', padding: s.type === 'Game' ? '0' : '2px' }} 
                                alt={s.name} 
                                onError={e => {
                                  if (!e.target.dataset.triedProxy) {
                                    e.target.dataset.triedProxy = 'true';
                                    e.target.src = getProxiedUrl(directUrl);
                                    return;
                                  }
                                  if (!e.target.dataset.triedFallback) {
                                    e.target.dataset.triedFallback = 'true';
                                    const fallbackImg = getGameIcon(s.name);
                                    if (fallbackImg && fallbackImg !== directUrl) {
                                      e.target.src = getProxiedUrl(fallbackImg);
                                      return;
                                    }
                                  }
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }} 
                              />
                            );
                          })()}
                         <div style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-muted)', background: '#222' }}>
                           {s.name ? s.name.charAt(0).toUpperCase() : '?'}
                         </div>
                       </div>
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password / OTP states
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [resetUsername, setResetUsername] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [forgotError, setForgotError] = useState('');

  // Change credentials states
  const [currentUsername, setCurrentUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateCredError, setUpdateCredError] = useState('');
  const [updateCredSuccess, setUpdateCredSuccess] = useState('');


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



  // Debouncing search inputs (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load services automatically on authentication status check
  useEffect(() => {
    if (isAuthenticated) {
      fetchServices();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      // Automatic logout when user navigates away from the Admin component
      sessionStorage.removeItem('adminAuthenticated');
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid username or password. Please try again!');
      }
    } catch (err) {
      setError('Server connection error. Please try again later.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    
    if (forgotStep === 1) {
      if (!forgotEmail) {
        setForgotError('Email is required');
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/admin/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setForgotStep(2);
          setForgotSent(true);
        } else {
          setForgotError(data.error || 'Failed to send verification code. Check your email address.');
        }
      } catch (err) {
        setForgotError('Connection error. Please try again.');
      }
    } else {
      if (!otp || !resetUsername || !resetPassword) {
        setForgotError('All fields are required');
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/admin/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: forgotEmail,
            otp: otp.trim(),
            newUsername: resetUsername,
            newPassword: resetPassword
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('Admin credentials reset successfully! You can now log in.');
          setUsername(resetUsername);
          setPassword(resetPassword);
          setShowForgotModal(false);
          setForgotStep(1);
          setForgotSent(false);
          setOtp('');
          setResetUsername('');
          setResetPassword('');
        } else {
          setForgotError(data.error || 'Verification code failed or expired.');
        }
      } catch (err) {
        setForgotError('Connection error. Please try again.');
      }
    }
  };

  const handleUpdateCredentials = async () => {
    setUpdateCredError('');
    setUpdateCredSuccess('');
    if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
      setUpdateCredError('All fields are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/admin/update-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUsername, currentPassword, newUsername, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUpdateCredSuccess('Admin credentials updated successfully!');
        setCurrentUsername('');
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
      } else {
        setUpdateCredError(data.error || 'Failed to update credentials');
      }
    } catch (err) {
      setUpdateCredError('Connection error. Please try again.');
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE}/plans?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      const normalized = data.map(p => {
        let cat = p.category ? p.category.trim() : '';
        const catLower = cat.toLowerCase();
        if (catLower.includes('gam') || catLower === 'steam' || catLower === 'playstation' || catLower === 'xbox') {
          p.category = 'Gaming';
        } else if (catLower === 'vpn') {
          p.category = 'VPN';
        } else if (catLower.includes('ai')) {
          p.category = 'AI+';
        } else if (!p.category || p.category.trim() === '') {
          p.category = 'Streaming';
        }
        return p;
      });
      setServices(normalized);
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
    setEditForm({ 
      ...service,
      originalCategory: service.category,
      originalPrimaryColor: service.primaryColor,
      originalSecondaryColor: service.secondaryColor
    });
  };

  const handleSave = async (id) => {
    try {
      const sanitizedPlans = (editForm.plans || []).map(p => {
        let price = (p.price || '').trim();
        if (price && !price.startsWith('₹')) {
          price = '₹' + price;
        }
        return { ...p, price };
      });
      const payload = { ...editForm, plans: sanitizedPlans };

      const res = await fetch(`${API_BASE}/admin/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingId(null);
        fetchServices();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save: ${errData.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(`Save connection error: ${err.message}`);
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

  const handleDeleteAll = async () => {
    if (!window.confirm('⚠️ WARNING: Are you absolutely sure you want to delete ALL products? This action cannot be undone.')) return;
    const doubleCheck = window.prompt('Type "DELETE ALL" to confirm deletion of all products:');
    if (doubleCheck !== 'DELETE ALL') {
      alert('Confirmation code mismatch. Deletion cancelled.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/admin/plans-all`, { method: 'DELETE' });
      if (res.ok) {
        alert('All products have been deleted successfully.');
        fetchServices();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to delete: ${errData.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete all error:', err);
      alert(`Connection error: ${err.message}`);
    }
  };

  const handleAdd = async () => {
    try {
      const sanitizedPlans = (editForm.plans || []).map(p => {
        let price = (p.price || '').trim();
        if (price && !price.startsWith('₹')) {
          price = '₹' + price;
        }
        return { ...p, price };
      });
      const payload = { ...editForm, plans: sanitizedPlans };

      const res = await fetch(`${API_BASE}/admin/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowAddForm(false);
        fetchServices();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to add service: ${errData.error || res.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Add error:', err);
      alert(`Add connection error: ${err.message}`);
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

            <Link to="/" onClick={handleLogout} style={{ display: 'block', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}>
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
                  <button type="button" className="popup-close" onClick={() => { setShowForgotModal(false); setForgotStep(1); setForgotSent(false); setForgotError(''); }} aria-label="Close modal">
                    <X size={16} />
                  </button>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
                    {forgotStep === 1 ? 'Reset Password' : 'Verify & Reset'}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    {forgotStep === 1 
                      ? 'We will send a 6-digit secure access verification code to your registered admin email.' 
                      : 'Enter the 6-digit code sent to your email and your new login credentials.'}
                  </p>
                  
                  <form onSubmit={handleForgotSubmit}>
                    {forgotStep === 1 ? (
                      <div className="admin-form-group">
                        <label htmlFor="forgot_email">Registered Email address</label>
                        <input 
                          id="forgot_email"
                          type="email" 
                          className="admin-form-input" 
                          placeholder="Enter registered email"
                          value={forgotEmail}
                          onChange={e => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="admin-form-group">
                          <label htmlFor="otp_code">6-Digit Verification Code</label>
                          <input 
                            id="otp_code"
                            type="text" 
                            maxLength="6"
                            className="admin-form-input" 
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                          />
                        </div>
                        <div className="admin-form-group">
                          <label htmlFor="reset_username">New Username</label>
                          <input 
                            id="reset_username"
                            type="text" 
                            className="admin-form-input" 
                            placeholder="Enter new username"
                            value={resetUsername}
                            onChange={e => setResetUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="admin-form-group">
                          <label htmlFor="reset_pass">New Password</label>
                          <input 
                            id="reset_pass"
                            type="password" 
                            className="admin-form-input" 
                            placeholder="Enter new password"
                            value={resetPassword}
                            onChange={e => setResetPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {forgotError && (
                      <div style={{ color: 'var(--color-danger)', fontSize: '0.82rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldAlert size={14} /> {forgotError}
                      </div>
                    )}
                    
                    {forgotSent && forgotStep === 2 && (
                      <div style={{ color: 'var(--color-success)', fontSize: '0.85rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Check size={16} /> Code sent! Please check your inbox.
                      </div>
                    )}

                    <button className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', borderRadius: '10px', justifyContent: 'center' }}>
                      {forgotStep === 1 ? 'Send verification code' : 'Update Credentials'}
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
              <Link to="/" onClick={handleLogout}>
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
                onClick={handleLogout}
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
                      ZH
                    </div>
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <div className="header-dropdown">
                        <div className="dropdown-header-title" style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>Zeeshan Hussain</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>Platform Administrator</span>
                        </div>
                        <div className="dropdown-item-row" onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}><Settings size={15} /> Settings</div>
                        <div className="dropdown-item-row" style={{ color: 'var(--color-danger)' }} onClick={handleLogout}><LogOut size={15} /> Logout</div>
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


                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setEditForm({ name: '', category: 'Streaming', primaryColor: '#6366f1', secondaryColor: '#4f46e5', description: 'default', status: 'Available', plans: [{ label: 'default', quality: '', duration: 'default', price: '₹', type: '', supportedDevices: ['TV', 'PC', 'iOS', 'Android'], image: '' }] });
                          setShowAddForm(true);
                        }}
                        style={{ padding: '0.6rem 1.25rem', borderRadius: '10px' }}
                      >
                        <Plus size={16} /> Add New Service
                      </button>
                      <button 
                        className="admin-action-btn delete"
                        onClick={handleDeleteAll}
                        style={{ 
                          padding: '0.6rem 1.25rem', 
                          borderRadius: '10px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                      >
                        <Trash2 size={16} /> Delete All
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>Loading StreamBazaar plans catalog...</div>
                  ) : (
                    <div>
                      {productView === 'grid' ? (
                        <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                          {filteredServices.map(s => (
                            <div key={s._id} className="admin-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '18px', padding: '1.5rem', position: 'relative', zIndex: editingId === s._id ? 100 : 1 }}>
                              {editingId === s._id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                  <LogoUploader 
    editForm={editForm} 
    setEditForm={setEditForm} 
    getFavicon={getFavicon} 
    onNameChange={(e_val) => {
                                        const val = e_val;
                                        const lowerVal = val.toLowerCase();
                                        setEditForm(prev => {
                                          let newCategory = prev.category;
                                          let newPrimary = prev.primaryColor;
                                          let newSecondary = prev.secondaryColor;
                                          const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                          if (matchedBrand) {
                                            const catIsDefault = !prev.category || prev.category === 'Streaming';
                                            const colorIsDefault = !prev.primaryColor || prev.primaryColor === '#6366f1' || prev.primaryColor === '#000000';
                                            if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                            if (colorIsDefault && BRAND_COLORS[matchedBrand]) { newPrimary = BRAND_COLORS[matchedBrand]; newSecondary = BRAND_COLORS[matchedBrand]; }
                                          }
                                          return { ...prev, name: val, category: newCategory, primaryColor: newPrimary, secondaryColor: newSecondary };
                                        });
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
                                  {isGamingCategory(editForm.category) && (
                                    <div className="admin-form-group">
                                      <label>Gaming Platform</label>
                                      <select 
                                        className="admin-form-input" 
                                        value={editForm.platform || ''} 
                                        onChange={e => setEditForm({...editForm, platform: e.target.value})}
                                      >
                                        <option value="">Auto-detect (Recommended)</option>
                                        <option value="steam">Steam</option>
                                        <option value="playstation">PlayStation</option>
                                        <option value="xbox">Xbox</option>
                                        <option value="epic">Epic Games</option>
                                      </select>
                                    </div>
                                  )}
                                  <div className="admin-form-group">
                                    <label>Brand Colors (Auto-Extracted)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                      <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Primary Color</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                          <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.primaryColor || '').trim())) ? '#' + editForm.primaryColor.trim() : editForm.primaryColor || '#333' }}></div>
                                          <input className="admin-form-input" style={{ flex: 1 }} placeholder="#e50914" value={editForm.primaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, primaryColor: val}); }} />
                                        </div>
                                      </div>
                                      <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Secondary Color</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                          <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.secondaryColor || '').trim())) ? '#' + editForm.secondaryColor.trim() : editForm.secondaryColor || '#333' }}></div>
                                          <input className="admin-form-input" style={{ flex: 1 }} placeholder="#7a0010" value={editForm.secondaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, secondaryColor: val}); }} />
                                        </div>
                                      </div>
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
                                            <input className="admin-form-input" placeholder="Price" value={plan.price || ''} onChange={e => {
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
                                    <div style={{ 
                                      width: isGamingCategory(s.category) ? '48px' : '48px', 
                                      height: isGamingCategory(s.category) ? '64px' : '48px', 
                                      borderRadius: isGamingCategory(s.category) ? '8px' : '12px', 
                                      background: `${s.color}22`, 
                                      border: `1px solid ${s.color}33`, 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'center', 
                                      overflow: 'hidden',
                                      flexShrink: 0
                                    }}>
                                      {isGamingCategory(s.category) ? (
                                        <img 
                                          src={s.customIcon || s.plans?.[0]?.image || getGameIcon(s.name) || getFavicon(s.name)} 
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                          onError={(e) => {
                                            const direct = s.customIcon || s.plans?.[0]?.image || getGameIcon(s.name) || getFavicon(s.name);
                                            if (!e.target.dataset.triedProxy) {
                                              e.target.dataset.triedProxy = 'true';
                                              e.target.src = getProxiedUrl(direct);
                                              return;
                                            }
                                            if (s.customIcon) {
                                              const fallback = s.plans?.[0]?.image || getGameIcon(s.name) || getFavicon(s.name);
                                              if (fallback && fallback !== s.customIcon) {
                                                e.target.src = fallback;
                                                e.target.dataset.triedProxy = '';
                                                return;
                                              }
                                            }
                                            e.target.style.display = 'none'; 
                                            e.target.nextSibling.style.display = 'block'; 
                                          }} 
                                        />
                                      ) : (
                                        <img 
                                          src={s.customIcon || getFavicon(s.name)} 
                                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} 
                                          onError={(e) => {
                                            const direct = s.customIcon || getFavicon(s.name);
                                            if (!e.target.dataset.triedProxy) {
                                              e.target.dataset.triedProxy = 'true';
                                              e.target.src = getProxiedUrl(direct);
                                              return;
                                            }
                                            if (s.customIcon) {
                                              const fallback = getFavicon(s.name);
                                              if (fallback && fallback !== s.customIcon) {
                                                e.target.src = fallback;
                                                e.target.dataset.triedProxy = '';
                                                return;
                                              }
                                            }
                                            e.target.style.display = 'none'; 
                                            e.target.nextSibling.style.display = 'block'; 
                                          }} 
                                        />
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
                                  setEditForm(prev => {
                                    let newCategory = prev.category;
                                    let newPrimary = prev.primaryColor;
                                    let newSecondary = prev.secondaryColor;
                                    const matchedBrand = Object.keys(BRAND_CATEGORIES).find(k => lowerVal.includes(k));
                                    if (matchedBrand) {
                                      const catIsDefault = !prev.category || prev.category === 'Streaming';
                                      const colorIsDefault = !prev.primaryColor || prev.primaryColor === '#6366f1' || prev.primaryColor === '#000000';
                                      if (catIsDefault && BRAND_CATEGORIES[matchedBrand]) newCategory = BRAND_CATEGORIES[matchedBrand];
                                      if (colorIsDefault && BRAND_COLORS[matchedBrand]) { newPrimary = BRAND_COLORS[matchedBrand]; newSecondary = BRAND_COLORS[matchedBrand]; }
                                    }
                                    return { ...prev, name: val, category: newCategory, primaryColor: newPrimary, secondaryColor: newSecondary };
                                  });
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
                            {isGamingCategory(editForm.category) && (
                              <div className="admin-form-group">
                                <label>Gaming Platform</label>
                                <select 
                                  className="admin-form-input" 
                                  value={editForm.platform || ''} 
                                  onChange={e => setEditForm({...editForm, platform: e.target.value})}
                                >
                                  <option value="">Auto-detect (Recommended)</option>
                                  <option value="steam">Steam</option>
                                  <option value="playstation">PlayStation</option>
                                  <option value="xbox">Xbox</option>
                                  <option value="epic">Epic Games</option>
                                </select>
                              </div>
                            )}
                            <div className="admin-form-group">
                              <label>Brand Colors (Auto-Extracted)</label>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Primary Color</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.primaryColor || '').trim())) ? '#' + editForm.primaryColor.trim() : editForm.primaryColor || '#333' }}></div>
                                    <input className="admin-form-input" style={{ flex: 1 }} placeholder="#e50914" value={editForm.primaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, primaryColor: val}); }} />
                                  </div>
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Secondary Color</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.25rem' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: (/^[0-9A-Fa-f]{3,6}$/.test((editForm.secondaryColor || '').trim())) ? '#' + editForm.secondaryColor.trim() : editForm.secondaryColor || '#333' }}></div>
                                    <input className="admin-form-input" style={{ flex: 1 }} placeholder="#7a0010" value={editForm.secondaryColor || ''} onChange={e => { let val = e.target.value; if (val.length > 0 && !val.startsWith('#') && /^[0-9A-Fa-f]*$/.test(val)) val = '#' + val; setEditForm({...editForm, secondaryColor: val}); }} />
                                  </div>
                                </div>
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
                                      <input className="admin-form-input" placeholder="Price" value={plan.price || ''} onChange={e => {
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

                        {/* Change Admin Credentials */}
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>Change Admin Credentials</h4>
                          {updateCredError && (
                            <div style={{ color: 'var(--color-danger)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <ShieldAlert size={14} /> {updateCredError}
                            </div>
                          )}
                          {updateCredSuccess && (
                            <div style={{ color: 'var(--color-success)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Check size={14} /> {updateCredSuccess}
                            </div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label htmlFor="curr_username">Current Username</label>
                              <input 
                                id="curr_username"
                                type="text" 
                                className="admin-form-input" 
                                placeholder="Enter current username"
                                value={currentUsername}
                                onChange={e => setCurrentUsername(e.target.value)}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="curr_pass">Current Password</label>
                              <input 
                                id="curr_pass"
                                type="password" 
                                className="admin-form-input" 
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="admin-form-group">
                              <label htmlFor="new_username">New Username</label>
                              <input 
                                id="new_username"
                                type="text" 
                                className="admin-form-input" 
                                placeholder="Enter new username"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="new_pass">New Password</label>
                              <input 
                                id="new_pass"
                                type="password" 
                                className="admin-form-input" 
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                              />
                            </div>
                          </div>
                          <button 
                            type="button" 
                            className="btn-primary" 
                            style={{ width: 'fit-content', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', alignSelf: 'flex-start' }}
                            onClick={handleUpdateCredentials}
                          >
                            Update Credentials
                          </button>
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
