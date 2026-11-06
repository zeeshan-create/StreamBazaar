import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink, Search } from 'lucide-react';
import ChatWidget from '../ChatWidget';
import FomoToast from './FomoToast';
import FALLBACK_PRODUCTS from '../utils/fallbackProducts.json';
import { 
  getFavicon, 
  isGamingCategory, 
  getDomainFromUrl,
  GAME_IMGS
} from '../utils/logoHelper';
import './StreamBazaarDemo.css';

// ─── HIGH-DPI SVG VECTOR ICONS ───────────────────────────────────
const Icons = {
  Apple: ({ size = 20 }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
    </svg>
  ),
  Android: ({ size = 20 }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path d="M2.76 3.061a.5.5 0 0 1 .679.2l1.283 2.352A8.9 8.9 0 0 1 8 5a8.9 8.9 0 0 1 3.278.613l1.283-2.352a.5.5 0 1 1 .878.478l-1.252 2.295C14.475 7.266 16 9.477 16 12H0c0-2.523 1.525-4.734 3.813-5.966L2.56 3.74a.5.5 0 0 1 .2-.678ZM5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
    </svg>
  ),
  TV: ({ size = 20 }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5M13.991 3l.024.001a1.5 1.5 0 0 1 .538.143.76.76 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.5 1.5 0 0 1-.143.538.76.76 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.5 1.5 0 0 1-.538-.143.76.76 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.5 1.5 0 0 1 .143-.538.76.76 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2"/>
    </svg>
  ),
  PC: ({ size = 20 }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/>
    </svg>
  ),
  Laptop: ({ size = 20 }) => (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor">
      <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/>
    </svg>
  ),
  Steam: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12S18.605 0 11.979 0z"/>
    </svg>
  ),
  PlayStation: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356M9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.45 8.45 0 0 1-4.018-.323Z"/>
    </svg>
  ),
  Xbox: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M7.202 15.967a8 8 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33m-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.4 8.4 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.5 9.5 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4 4 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.8 7.8 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12 12 0 0 1-.654-.319Z"/>
    </svg>
  ),
  ShieldCheck: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
    </svg>
  ),
  Zap: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.251.068a.5.5 0 0 1 .453.658L9.805 6.5H14a.5.5 0 0 1 .388.815l-9 11a.5.5 0 0 1-.84-.523L6.375 10H2a.5.5 0 0 1-.388-.815l9-11a.5.5 0 0 1 .639-.117z"/>
    </svg>
  ),
  Check: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
    </svg>
  )
};

// ─── HIGH-CONTRAST SAFE BRAND COLOR HELPER ───────────────────────
// Solves dark/blank text bug for Crunchyroll (#030b14), ChatGPT, etc.
const isColorTooDark = (c) => {
  if (!c) return true;
  c = c.trim().toLowerCase();
  if (['#000000', '#111111', '#222222', '#333333', '#444444', '#1a1a1a', '#0d0f17', '#030b14', 'black', 'transparent'].includes(c)) return true;
  if (c.startsWith('#')) {
    let hex = c.substring(1);
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      return brightness < 50;
    }
  }
  return false;
};

const getSafeBrandColor = (product) => {
  const name = (product?.name || '').toLowerCase();
  if (name.includes('crunchyroll')) return '#ff6600'; // Official Crunchyroll Vibrant Orange!
  if (name.includes('chatgpt') || name.includes('openai')) return '#10a37f';
  if (name.includes('netflix')) return '#e50914';
  if (name.includes('prime') || name.includes('amazon')) return '#00a8e1';
  if (name.includes('hotstar')) return '#06a5fb';
  if (name.includes('zee5')) return '#9333ea';
  if (name.includes('sonyliv') || name.includes('sony liv')) return '#f59e0b';
  if (name.includes('spotify')) return '#1db954';
  if (name.includes('canva')) return '#00c4cc';
  if (name.includes('claude')) return '#d97757';
  if (name.includes('youtube')) return '#ff0033';
  if (name.includes('nordvpn')) return '#3b82f6';
  if (name.includes('surfshark')) return '#06b6d4';
  if (name.includes('expressvpn')) return '#ef4444';
  if (name.includes('proton')) return '#8b5cf6';

  const raw = product?.primaryColor || product?.color;
  if (raw && !isColorTooDark(raw)) return raw;
  return '#a855f7';
};

const hexToRgb = (hex) => {
  if (!hex || !hex.startsWith('#')) return '168, 85, 247';
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  if (isNaN(num)) return '168, 85, 247';
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
};

// ─── PLATFORM IDENTIFIERS ────────────────────────────────────────
const getGamingPlatform = (product) => {
  if (!product) return 'steam';
  if (product.platform) {
    const p = product.platform.toLowerCase();
    if (['xbox', 'playstation', 'epic', 'steam'].includes(p)) return p;
  }
  const name = (product.name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  if (name.includes('xbox') || desc.includes('xbox')) return 'xbox';
  if (name.includes('playstation') || name.includes('ps5') || name.includes('ps4') || desc.includes('playstation')) return 'playstation';
  if (name.includes('epic') || desc.includes('epic')) return 'epic';
  return 'steam';
};

const getPlatformBadge = (platform) => {
  const p = (platform || '').toLowerCase();
  if (p === 'playstation') {
    return {
      label: 'PLAYSTATION',
      icon: <Icons.PlayStation size={12} />,
      style: {
        border: '1px solid rgba(223, 190, 130, 0.5)',
        background: 'rgba(223, 190, 130, 0.16)',
        color: '#dfbe82'
      }
    };
  }
  if (p === 'xbox') {
    return {
      label: 'XBOX',
      icon: <Icons.Xbox size={12} />,
      style: {
        border: '1px solid rgba(74, 222, 128, 0.5)',
        background: 'rgba(74, 222, 128, 0.16)',
        color: '#4ade80'
      }
    };
  }
  return {
    label: 'STEAM',
    icon: <Icons.Steam size={12} />,
    style: {
      border: '1px solid rgba(229, 195, 120, 0.5)',
      background: 'rgba(175, 143, 79, 0.16)',
      color: '#e5c378'
    }
  };
};

const getAccountBadge = (desc) => {
  const lower = (desc || '').toLowerCase();
  if (lower.includes('private')) {
    return {
      label: 'PRIVATE ACCOUNT',
      icon: <Icons.ShieldCheck size={11} />,
      style: {
        border: '1px solid rgba(52, 211, 153, 0.5)',
        background: 'rgba(6, 95, 70, 0.28)',
        color: '#34d399'
      }
    };
  }
  return {
    label: 'SHARED PROFILE',
    icon: <Icons.Zap size={11} />,
    style: {
      border: '1px solid rgba(96, 165, 250, 0.5)',
      background: 'rgba(30, 58, 138, 0.28)',
      color: '#60a5fa'
    }
  };
};

// ─── LOGO COMPONENT ──────────────────────────────────────────────
const CardLogo = ({ product }) => {
  const isGaming = isGamingCategory(product.category);

  // High-res cover image resolution: prioritize direct plan image, then GAME_IMGS match, then customIcon/favicon
  const resolvedUrl = useMemo(() => {
    if (isGaming) {
      if (product.plans?.[0]?.image) return product.plans[0].image;
      const gameIcon = getGameIcon(product.name);
      if (gameIcon) return gameIcon;
      if (product.customIcon && (product.customIcon.includes('steam') || product.customIcon.includes('capsule') || product.customIcon.startsWith('http') || product.customIcon.startsWith('/'))) {
        return product.customIcon;
      }
    }
    return getFavicon(product.name, product.customIcon);
  }, [product.name, product.customIcon, product.category, product.plans, isGaming]);

  const [imgSrc, setImgSrc] = useState(resolvedUrl);

  useEffect(() => {
    setImgSrc(resolvedUrl);
  }, [resolvedUrl]);

  const handleError = () => {
    if (isGaming) {
      const fallback = getGameIcon(product.name);
      if (fallback && imgSrc !== fallback) {
        setImgSrc(fallback);
        return;
      }
      setImgSrc('/placeholder-game.png');
      return;
    }
    if (imgSrc && !imgSrc.includes('google.com/s2/favicons') && !imgSrc.startsWith('/')) {
      const domain = getDomainFromUrl(imgSrc) || `${product.name.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '')}.com`;
      setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
      return;
    }
    setImgSrc('/placeholder-ott.png');
  };

  if (isGaming) {
    return (
      <div className="sb-game-capsule">
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleError}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="sb-ott-logo">
      <img
        src={imgSrc}
        alt={product.name}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

// ─── 2-STEP SMOOTH POP-UP PURCHASE MODAL ─────────────────────────
// Step 1: All Plans pop up with animation -> User selects plan -> clicks "Continue to Device"
// Step 2: Device selection -> User selects device -> Direct Telegram Purchase!
const PurchaseModal = ({ product, initialPlan, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(initialPlan || product.plans?.[0]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const brandColor = getSafeBrandColor(product);
  const colorRgb = hexToRgb(brandColor);
  const isGaming = isGamingCategory(product.category);
  const accountBadge = getAccountBadge(product.description);

  // Device list: 3x3 for Gaming, 4-grid for OTT
  const deviceList = useMemo(() => {
    if (isGaming) {
      return [
        { id: 'PC', label: 'PC', icon: Icons.PC },
        { id: 'Laptop', label: 'Laptop', icon: Icons.Laptop },
        { id: 'PS2', label: 'PS2', icon: Icons.PlayStation },
        { id: 'PS3', label: 'PS3', icon: Icons.PlayStation },
        { id: 'PS4', label: 'PS4', icon: Icons.PlayStation },
        { id: 'PS5', label: 'PS5', icon: Icons.PlayStation },
        { id: 'Xbox', label: 'Xbox', icon: Icons.Xbox },
        { id: 'Xbox S', label: 'Xbox S', icon: Icons.Xbox },
        { id: 'Xbox X', label: 'Xbox X', icon: Icons.Xbox }
      ];
    }
    return [
      { id: 'TV', label: 'TV', icon: Icons.TV },
      { id: 'PC', label: 'PC', icon: Icons.PC },
      { id: 'iOS', label: 'iOS', icon: Icons.Apple },
      { id: 'Android', label: 'Android', icon: Icons.Android }
    ];
  }, [isGaming]);

  // Live stock availability
  const isAvailable = (devId) => {
    const raw = selectedPlan?.supportedDevices;
    if (!raw) {
      if (isGaming) return devId === 'PC' || devId === 'Laptop';
      return true;
    }
    const devArray = Array.isArray(raw) ? raw : String(raw).split(' ');
    const lowerArr = devArray.map(x => x.toLowerCase());
    return lowerArr.some(x => devId.toLowerCase().includes(x) || x.includes(devId.toLowerCase()));
  };

  // Direct Telegram purchase message generator
  const handleTelegramOrder = () => {
    if (!selectedDevice) return;
    const priceText = selectedPlan.price.startsWith('₹') ? selectedPlan.price : `₹${selectedPlan.price}`;
    const qualityText = selectedPlan.quality || (isGaming ? 'Full Game Access' : '4K Ultra HD + Dolby Vision');
    
    const msg = [
      `🛒 *StreamBazaar Order Ticket*`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📦 *Service:* ${product.name}`,
      `⭐ *Plan:* ${selectedPlan.label || 'Premium Access'}`,
      `📺 *Quality:* ${qualityText}`,
      `⏱️ *Duration:* ${selectedPlan.duration}`,
      `📱 *Selected Device:* ${selectedDevice}`,
      `💰 *Total Price:* ${priceText}`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🛡️ 100% Replacement Warranty Included`,
      `👉 Please share UPI / Payment details for instant activation!`
    ].join('%0A');

    window.open(`https://t.me/TrustedStreams?text=${msg}`, '_blank');
    onClose();
  };

  const currentPriceFormatted = selectedPlan.price.startsWith('₹') ? selectedPlan.price : `₹${selectedPlan.price}`;

  return (
    <motion.div
      className="sb-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sb-modal-card"
        style={{
          border: `1.5px solid rgba(${colorRgb}, 0.5)`,
          boxShadow: `0 30px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(${colorRgb}, 0.25)`
        }}
        initial={{ scale: 0.94, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div style={{ height: '3px', background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)` }} />

        {/* Close Button */}
        <button className="sb-modal-close" onClick={onClose}>✕</button>

        <div className="sb-modal-body">
          {/* Header Row: Logo + Title + Badges */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
            <CardLogo product={product} />

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 className="sb-card-title" style={{ fontSize: '18px', margin: 0 }}>
                  {product.name}
                </h3>
                <span style={{ color: '#3b82f6', fontSize: '14px' }}>✓</span>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', margin: '4px 0' }}>
                <span className="sb-badge" style={accountBadge.style}>
                  {accountBadge.icon} {accountBadge.label}
                </span>
                <span style={{ color: '#888', fontSize: '11px' }}>· 1 Device Access</span>
              </div>

              <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11px', margin: 0, lineHeight: 1.3 }}>
                {product.description || 'Instant delivery within 2 minutes via Telegram.'}
              </p>
            </div>
          </div>

          {/* STEP INDICATOR */}
          <div className="sb-step-indicator">
            <span className={`sb-step-bubble ${step === 1 ? 'active' : 'inactive'}`}>
              1. CHOOSE PLAN
            </span>
            <span style={{ color: '#555', fontSize: '12px' }}>➜</span>
            <span className={`sb-step-bubble ${step === 2 ? 'active' : 'inactive'}`}>
              2. SELECT DEVICE
            </span>
          </div>

          {/* ════════════ STEP 1: CHOOSE PLAN & DURATION ════════════ */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{ marginBottom: '16px' }}>
                {product.plans.map((pl, idx) => {
                  const isSelected = selectedPlan.duration === pl.duration && selectedPlan.price === pl.price;
                  const planPrice = pl.price.startsWith('₹') ? pl.price : `₹${pl.price}`;
                  return (
                    <div
                      key={idx}
                      className={`sb-modal-plan-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedPlan(pl)}
                      style={{
                        border: `1.5px solid ${isSelected ? brandColor : 'rgba(255, 255, 255, 0.08)'}`,
                        boxShadow: isSelected ? `0 0 16px rgba(${colorRgb}, 0.25)` : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ color: '#fff', fontSize: '13.5px', fontWeight: 800 }}>
                          {pl.label || (isGaming ? 'PC Game Seat Access' : 'Premium Access')}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            color: brandColor,
                            background: `rgba(${colorRgb}, 0.16)`,
                            padding: '1.5px 7px',
                            borderRadius: '4px'
                          }}>
                            {pl.duration}
                          </span>
                          <span style={{ fontSize: '10px', color: '#999' }}>
                            {pl.quality || (isGaming ? 'Full Game Access' : '4K UHD + HDR')}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* 100% High-Contrast, Bright Bold Price */}
                        <span style={{
                          color: '#ffffff',
                          fontSize: '19px',
                          fontWeight: 900,
                          letterSpacing: '0.3px',
                          textShadow: isSelected ? `0 0 12px rgba(${colorRgb}, 0.6)` : 'none'
                        }}>
                          {planPrice}
                        </span>

                        {/* Radio Check Button */}
                        <div
                          className="sb-radio-outer"
                          style={{
                            border: `2px solid ${isSelected ? brandColor : '#555'}`,
                            background: isSelected ? brandColor : 'transparent'
                          }}
                        >
                          {isSelected && <Icons.Check size={11} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue to Step 2 Button */}
              <button
                className="sb-cta-btn"
                onClick={() => setStep(2)}
                style={{
                  background: `linear-gradient(135deg, ${brandColor}, #6366f1)`,
                  color: '#fff',
                  boxShadow: `0 8px 25px rgba(${colorRgb}, 0.45)`
                }}
              >
                <span>Continue to Select Device ({currentPriceFormatted})</span>
                <span>➜</span>
              </button>
            </motion.div>
          )}

          {/* ════════════ STEP 2: SELECT DEVICE & ORDER VIA TELEGRAM ════════════ */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <button className="sb-back-link" onClick={() => setStep(1)}>
                <span>←</span>
                <span>Change Plan ({selectedPlan.duration} · {currentPriceFormatted})</span>
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#888', fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  CHOOSE YOUR DEVICE
                </span>
                <span style={{ color: selectedDevice ? '#34d399' : '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
                  {selectedDevice ? `Selected: ${selectedDevice}` : '⚠️ Tap to choose'}
                </span>
              </div>

              {/* Device Buttons Grid */}
              <div className={`sb-device-grid ${isGaming ? 'gaming-grid' : 'ott-grid'}`}>
                {deviceList.map((dev) => {
                  const available = isAvailable(dev.id);
                  const isSelected = selectedDevice === dev.id;

                  return (
                    <div
                      key={dev.id}
                      className="sb-device-item"
                      onClick={() => {
                        if (available) setSelectedDevice(dev.id);
                      }}
                      style={{
                        background: isSelected
                          ? `rgba(${colorRgb}, 0.22)`
                          : available
                          ? 'rgba(255, 255, 255, 0.025)'
                          : 'rgba(239, 68, 68, 0.03)',
                        border: `1.5px solid ${isSelected ? brandColor : available ? 'rgba(255, 255, 255, 0.09)' : 'rgba(239, 68, 68, 0.25)'}`,
                        cursor: available ? 'pointer' : 'not-allowed',
                        opacity: available ? 1 : 0.55,
                        boxShadow: isSelected ? `0 0 18px rgba(${colorRgb}, 0.45)` : 'none'
                      }}
                    >
                      {/* Hanging Stock Badge */}
                      <span className={`sb-stock-badge ${available ? 'avail' : 'oos'}`}>
                        {available ? 'AVAILABLE' : 'OUT OF STOCK'}
                      </span>

                      <div style={{ color: isSelected ? brandColor : available ? '#fff' : '#666', marginTop: '6px' }}>
                        <dev.icon size={22} />
                      </div>
                      <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600 }}>
                        {dev.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Ticket Summary */}
              <div className="sb-summary-grid">
                <div>
                  <div className="sb-sum-label">SERVICE & PLAN</div>
                  <div className="sb-sum-value">{product.name} ({selectedPlan.duration})</div>
                </div>
                <div>
                  <div className="sb-sum-label">SELECTED DEVICE</div>
                  <div className="sb-sum-value" style={{ color: selectedDevice ? '#34d399' : '#f59e0b' }}>
                    {selectedDevice || '— (Select above)'}
                  </div>
                </div>
                <div>
                  <div className="sb-sum-label">QUALITY</div>
                  <div className="sb-sum-value">
                    {selectedPlan.quality || (isGaming ? 'Full Game Access' : '4K Ultra HD')}
                  </div>
                </div>
                <div>
                  <div className="sb-sum-label">WARRANTY</div>
                  <div className="sb-sum-value" style={{ color: '#34d399' }}>
                    🛡️ 100% Replacement
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="sb-sum-label">TOTAL AMOUNT</div>
                    <div style={{ color: '#fff', fontSize: '26px', fontWeight: 900 }}>
                      {currentPriceFormatted}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', textAlign: 'right' }}>
                    Instant Access <br />
                    Delivery in &lt; 2 mins
                  </div>
                </div>
              </div>

              {/* Direct Telegram Order Button */}
              <button
                className="sb-cta-btn"
                onClick={handleTelegramOrder}
                style={{
                  background: selectedDevice
                    ? `linear-gradient(135deg, ${brandColor}, #6366f1)`
                    : 'rgba(255, 255, 255, 0.08)',
                  color: selectedDevice ? '#fff' : '#777',
                  cursor: selectedDevice ? 'pointer' : 'not-allowed',
                  boxShadow: selectedDevice ? `0 10px 30px rgba(${colorRgb}, 0.45)` : 'none'
                }}
              >
                <span>💬</span>
                <span>
                  {selectedDevice 
                    ? `Buy on Telegram (${currentPriceFormatted})` 
                    : 'Please Select a Device First'}
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── HIGH-CONVERTING PRODUCT CARD ────────────────────────────────
const ProductCard = ({ product, onOpenBuy }) => {
  const isGaming = isGamingCategory(product.category);
  const brandColor = getSafeBrandColor(product);
  const colorRgb = hexToRgb(brandColor);

  const platform = isGaming ? getGamingPlatform(product) : null;
  const platformBadge = isGaming ? getPlatformBadge(platform) : null;
  const accountBadge = getAccountBadge(product.description);

  // Lowest price from plans
  const lowestPrice = useMemo(() => {
    if (!product.plans || product.plans.length === 0) return '₹199';
    let min = Infinity;
    for (const pl of product.plans) {
      const num = parseInt(String(pl.price).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num) && num < min) min = num;
    }
    return min === Infinity ? (product.plans[0].price || '₹199') : `₹${min}`;
  }, [product.plans]);

  const defaultDuration = product.plans?.[0]?.duration || '1 Month';
  const defaultQuality = product.plans?.[0]?.quality || (isGaming ? 'Full Game' : '4K Ultra HD');

  return (
    <motion.div
      layout
      className="sb-card"
      style={{
        border: `1.5px solid rgba(${colorRgb}, 0.35)`,
        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${colorRgb}, 0.08)`
      }}
    >
      <div>
        {/* Header: Logo + Full Title + Badges */}
        <div className="sb-card-header">
          <CardLogo product={product} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
              <h4 className="sb-card-title">{product.name}</h4>
              <span style={{ color: '#3b82f6', fontSize: '13px', marginTop: '2px' }}>✓</span>
            </div>

            <div className="sb-badges-row">
              {isGaming && platformBadge && (
                <span className="sb-badge" style={platformBadge.style}>
                  {platformBadge.icon} {platformBadge.label}
                </span>
              )}
              {!isGaming && (
                <span className="sb-badge" style={{
                  border: `1px solid rgba(${colorRgb}, 0.5)`,
                  background: `rgba(${colorRgb}, 0.15)`,
                  color: brandColor
                }}>
                  {(product.category || 'STREAMING').toUpperCase()}
                </span>
              )}
              <span className="sb-badge" style={accountBadge.style}>
                {accountBadge.icon} {accountBadge.label}
              </span>
            </div>

            <p className="sb-card-desc">
              {product.description || (isGaming ? 'Private account. Instant delivery.' : 'Premium shared profiles. Instant access upon purchase.')}
            </p>
          </div>
        </div>

        {/* Plans List right on Card - Exact Match to Screenshots */}
        <div className="sb-card-plans-list">
          {(product.plans || []).slice(0, 3).map((plan, i) => {
            const deviceLabel = isGaming ? 'PC Game Seat Access' : '1 Device Seat Access';
            const deviceIcon = isGaming ? '🎮' : '🖥️';
            const priceFormatted = (plan.price || '').startsWith('₹') ? plan.price : '₹' + (plan.price || '');
            const durationLabel = plan.duration || plan.label || '1 Month';

            return (
              <div
                key={i}
                className="sb-card-plan-row"
                onClick={() => onOpenBuy(product, plan)}
                style={{
                  borderColor: `rgba(${colorRgb}, 0.22)`,
                  background: 'rgba(255, 255, 255, 0.025)'
                }}
              >
                <div className="sb-plan-row-left">
                  <span className="sb-plan-row-pill" style={{
                    color: brandColor,
                    borderColor: `rgba(${colorRgb}, 0.35)`,
                    background: `rgba(${colorRgb}, 0.08)`
                  }}>
                    <span>{deviceIcon}</span>
                    <span>{deviceLabel}</span>
                  </span>
                  <span className="sb-plan-row-dur">
                    {durationLabel}
                  </span>
                </div>

                <div className="sb-plan-row-right">
                  <span className="sb-plan-row-price" style={{ color: brandColor }}>
                    {priceFormatted}
                  </span>
                  <button
                    className="sb-plan-row-buy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBuy(product, plan);
                    }}
                  >
                    Buy
                  </button>
                </div>
              </div>
            );
          })}

          {/* View All Plans link if more than 3 plans */}
          {product.plans && product.plans.length > 3 && (
            <button
              className="sb-view-all-plans-btn"
              onClick={() => onOpenBuy(product, product.plans[0])}
              style={{ color: brandColor }}
            >
              + View all {product.plans.length} plans
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── MAIN HOME APPLICATION COMPONENT ─────────────────────────────
export default function StreamBazaarDemo() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [modalData, setModalData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [gamingPlatformFilter, setGamingPlatformFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Secret admin shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Live polling from MongoDB (Works locally and in production deployment)
  const fetchPlans = useCallback(async () => {
    try {
      const apiBase = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/plans?v=` + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.warn('API error:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    const interval = setInterval(() => {
      if (!document.hidden) fetchPlans();
    }, 3500);
    return () => clearInterval(interval);
  }, [fetchPlans]);

  // Filtered Products
  const displayedProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Text Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const name = (p.name || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const plat = (p.platform || '').toLowerCase();
        const matchesQuery = name.includes(q) || cat.includes(q) || desc.includes(q) || plat.includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Gaming Platform Filter (Steam, PlayStation, Xbox)
      if (gamingPlatformFilter !== 'All') {
        if (!isGamingCategory(p.category)) return false;

        const target = gamingPlatformFilter.toLowerCase();
        const pPlat = (p.platform || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pDesc = (p.description || '').toLowerCase();
        const detected = getGamingPlatform(p).toLowerCase();

        let matches = false;
        if (target === 'steam') {
          matches = pPlat === 'steam' || detected === 'steam' || pDesc.includes('steam') || pDesc.includes('pc') || (!pPlat.includes('playstation') && !pPlat.includes('xbox'));
        } else if (target === 'playstation') {
          matches = pPlat === 'playstation' || detected === 'playstation' || pPlat.includes('ps') || pDesc.includes('playstation') || pDesc.includes('ps4') || pDesc.includes('ps5') || pName.includes('ps4') || pName.includes('ps5');
        } else if (target === 'xbox') {
          matches = pPlat === 'xbox' || detected === 'xbox' || pPlat.includes('xbox') || pDesc.includes('xbox') || pName.includes('xbox');
        }

        if (!matches) return false;
      } else if (activeCategory !== 'All') {
        // 3. Category Filter
        if (activeCategory === 'Gaming' && !isGamingCategory(p.category)) return false;
        if (activeCategory !== 'Gaming' && p.category !== activeCategory) return false;
      }

      return true;
    });
  }, [products, activeCategory, gamingPlatformFilter, searchQuery]);

  return (
    <div className="sb-page">
      <div className="sb-ambient-1" />
      <div className="sb-ambient-2" />

      {/* Sticky Modern Navbar */}
      <nav className="sb-navbar">
        <Link to="/" className="sb-nav-logo-wrap" title="StreamBazaar Home">
          <img src="/logo.png" alt="StreamBazaar" className="sb-nav-logo-img" />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Stream<span style={{ color: '#a855f7' }}>Bazaar</span>
            </div>
            <div className="sb-live-pill" style={{ marginTop: '2px' }}>
              <span className="sb-live-dot" />
              <span>Instant Delivery Live</span>
            </div>
          </div>
        </Link>

        {/* Actions: Discreet Admin Dashboard Link + Telegram Support */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to="/admin"
            className="sb-admin-btn"
            style={{ opacity: 0.7, padding: '7px 11px', fontSize: '11.5px' }}
            title="Owner Admin Dashboard (Ctrl + Shift + A)"
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
            </svg>
            <span>⚙️</span>
          </Link>

          <a
            href="https://t.me/TrustedStreams"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              color: '#fff',
              fontSize: '12.5px',
              fontWeight: 800,
              padding: '9px 18px',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 20px rgba(168, 85, 247, 0.35)'
            }}
          >
            💬 Telegram Store
          </a>
        </div>
      </nav>

      {/* Hero Showcase Section - Matches Image 2 */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-ring" />
        <div className="hero-ring" />
        <div className="hero-ring" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* 3D Gold & Cyan StreamBazaar Shopping Bag Logo */}
          <img
            src="/logo.png"
            alt="StreamBazaar Logo"
            className="hero-logo"
          />

          {/* Badge */}
          <div className="hero-badge">🌟 Premium Digital Seat Access Store</div>

          {/* Main Title */}
          <h1>
            Premium Subscriptions<br />
            <span>At Lowest Prices</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-sub">
            <span>Instant Access</span> &nbsp;•&nbsp; <span>Secure Login</span> &nbsp;•&nbsp; <span>1 Device Support</span>
          </p>

          {/* Two CTA Buttons */}
          <div className="hero-ctas">
            <motion.a
              href="#deals"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('deals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Plans <ExternalLink size={16} />
            </motion.a>
            <motion.a
              href="https://t.me/TrustedStreams"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={16} /> Contact Support
            </motion.a>
          </div>

          {/* Dedicated Centered Search Bar */}
          <div className="sb-search-hero-wrap">
            <div className="sb-search-hero-box">
              <span style={{ fontSize: '18px', color: '#a855f7' }}>🔍</span>
              <input
                className="sb-search-hero-input"
                type="text"
                placeholder="Search Netflix, Crunchyroll, GTA V, VPN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="sb-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Container */}
      <main id="deals" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>

        {/* Category Navigation Pills */}
        <div className="sb-cats-scroll">
          {[
            { id: 'All', label: 'All Services', icon: '⊞' },
            { id: 'Streaming', label: 'Streaming & OTT', icon: '📺' },
            { id: 'Gaming', label: 'Gaming Seats', icon: '🎮' },
            { id: 'VPN', label: 'VPN Shields', icon: '🛡️' },
            { id: 'AI+', label: 'AI & Productivity', icon: '⚙️' }
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`sb-cat-pill ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (cat.id !== 'Gaming') setGamingPlatformFilter('All');
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gaming Platform Sub-Filter Bar */}
        {(activeCategory === 'Gaming' || activeCategory === 'All') && (
          <div className="sb-platform-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🎮</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#ccc' }}>
                Filter Gaming Platform:
              </span>
            </div>

            <div className="sb-platform-pills">
              {[
                { id: 'All', label: 'All Platforms', icon: '🌟', color: '#f59e0b' },
                { id: 'steam', label: 'Steam', icon: <Icons.Steam size={13} />, color: '#d4a359' },
                { id: 'playstation', label: 'PlayStation', icon: <Icons.PlayStation size={13} />, color: '#60a5fa' },
                { id: 'xbox', label: 'Xbox', icon: <Icons.Xbox size={13} />, color: '#4ade80' }
              ].map((p) => {
                const isActive = gamingPlatformFilter.toLowerCase() === p.id.toLowerCase();
                return (
                  <button
                    key={p.id}
                    className={`sb-platform-pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setGamingPlatformFilter(p.id);
                      if (p.id !== 'All') {
                        setActiveCategory('Gaming');
                      }
                    }}
                    style={{
                      borderColor: isActive ? (p.color || '#fff') : 'rgba(255, 255, 255, 0.1)',
                      background: isActive ? `${p.color}22` : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? (p.color || '#fff') : '#bbb',
                      boxShadow: isActive ? `0 0 14px ${p.color}44` : 'none'
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Cards Grid with Silky Category Slide-In Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${gamingPlatformFilter}-${searchQuery}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="sb-grid"
          >
            {displayedProducts.map((p) => (
              <ProductCard
                key={p._id || p.name}
                product={p}
                onOpenBuy={(prod, pl) => setModalData({ product: prod, plan: pl })}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {displayedProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <div style={{ fontSize: '38px', marginBottom: '10px' }}>🔍</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>No products found</div>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
              Try searching with another keyword or selecting "All Services".
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <section style={{
          marginTop: '70px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '24px',
          padding: '36px 28px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 8px' }}>
              Instant Activation in 3 Steps
            </h3>
            <p style={{ color: '#888', fontSize: '13.5px', margin: 0 }}>
              Fatafat bina kisi jhanjhat ke purchase karein:
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {[
              { step: '1', title: 'Tap Get Plan', desc: 'Sare plans animation ke sath khulenge. Apna duration aur quality select karein.' },
              { step: '2', title: 'Select Device', desc: 'TV, PC, Mobile ya Console select karein with instant live stock availability.' },
              { step: '3', title: 'Buy on Telegram', desc: 'Direct Telegram ticket ban kar khulta hai, instant 2 minute mein login mil jata hai.' }
            ].map((st, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '18px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '14px',
                  color: '#fff',
                  marginBottom: '12px'
                }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#fff' }}>{st.title}</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: 1.4 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 2-Step Interactive Pop-Up Modal */}
      <AnimatePresence>
        {modalData && (
          <PurchaseModal
            product={modalData.product}
            initialPlan={modalData.plan}
            onClose={() => setModalData(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Telegram Support Pill */}
      <a
        href="https://t.me/TrustedStreams"
        target="_blank"
        rel="noopener noreferrer"
        className="sb-floating-tg"
      >
        <span style={{ fontSize: '18px' }}>💬</span>
        <span>Order via Telegram</span>
      </a>

      {/* Sheena AI Chatbot & FOMO Live Purchases Toast */}
      <ChatWidget />
      <FomoToast />
    </div>
  );
}
