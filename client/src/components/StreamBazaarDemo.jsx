import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import ChatWidget from '../ChatWidget';
import FomoToast from './FomoToast';
import GlowCard from './GlowCard';
import PolicyModal from './PolicyModal';
import FALLBACK_PRODUCTS from '../utils/fallbackProducts.json';
import { 
  getFavicon, 
  isGamingCategory, 
  getDomainFromUrl,
  getGameIcon
} from '../utils/logoHelper';
import { detectServiceSpecs } from '../utils/serviceAiDetector';
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
  const raw = product?.primaryColor || product?.color;
  if (raw && !isColorTooDark(raw)) return raw;

  const name = (product?.name || '').toLowerCase();
  if (name.includes('crunchyroll')) return '#ff6600';
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
  if (name.includes('fancode')) return '#ff5722';
  if (name.includes('steam') || name.includes('gta') || name.includes('forza')) return '#d4a359';

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
const PurchaseModal = ({ product, initialPlan, onClose }) => {
  const [step, setStep] = useState(1);

  const plans = useMemo(() => product?.plans || [], [product?.plans]);

  // Determine initial selected plan index safely
  const initialIndex = useMemo(() => {
    if (!plans.length) return 0;
    if (!initialPlan) return 0;
    const foundIdx = plans.findIndex(p => 
      p === initialPlan || 
      (p._id && initialPlan._id && p._id === initialPlan._id) ||
      (String(p.duration || '').trim() === String(initialPlan.duration || '').trim() && 
       String(p.price || '').trim() === String(initialPlan.price || '').trim() &&
       String(p.label || '').trim() === String(initialPlan.label || '').trim())
    );
    return foundIdx >= 0 ? foundIdx : 0;
  }, [plans, initialPlan]);

  const [selectedPlanIdx, setSelectedPlanIdx] = useState(initialIndex);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Clamped safe index ensuring it's always valid
  const safeIdx = Math.min(Math.max(0, selectedPlanIdx), Math.max(0, plans.length - 1));
  const selectedPlan = plans[safeIdx] || plans[0] || null;

  const brandColor = getSafeBrandColor(product);
  const colorRgb = hexToRgb(brandColor);
  const isGaming = isGamingCategory(product.category);
  const accountBadge = getAccountBadge(product.description);
  const specs = detectServiceSpecs(product, selectedPlan);

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
      { id: 'Android', label: 'Android', icon: Icons.Android },
      { id: 'iOS', label: 'iPhone/iPad', icon: Icons.Apple }
    ];
  }, [isGaming]);

  const isAvailable = useCallback((devId) => {
    if (!selectedPlan) return true;
    const supp = selectedPlan.supportedDevices || [];
    if (!Array.isArray(supp) || supp.length === 0) return true;
    return supp.some(d => String(d).toLowerCase().trim() === String(devId).toLowerCase().trim());
  }, [selectedPlan]);

  // Reset selectedDevice if not supported on newly selected plan
  useEffect(() => {
    if (selectedDevice && selectedPlan) {
      if (!isAvailable(selectedDevice)) {
        setSelectedDevice(null);
      }
    }
  }, [selectedPlan, selectedDevice, isAvailable]);

  const handleTelegramOrder = () => {
    if (!selectedPlan || !selectedDevice) return;
    const price = selectedPlan.price || 'Contact Support';
    const duration = selectedPlan.duration || 'Standard';

    const msg = 
`👋 Hello StreamBazaar Support, I want to purchase an account!

🛍️ **Service:** ${product.name}
⏱️ **Plan:** ${duration}
💰 **Price:** ${price}
📱 **Selected Device:** ${selectedDevice}
🛡️ **Guarantee:** 100% Full Replacement
✨ **Specs:** ${specs.summaryQuality}

Please share the payment QR / UPI ID and setup credentials. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://t.me/owner_trusted_streams?text=${encoded}`, '_blank');
  };

  const currentPriceFormatted = selectedPlan?.price || '';

  return (
    <motion.div
      className="sb-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      onClick={onClose}
    >
      <motion.div
        className="sb-modal-card"
        initial={{ scale: 0.97, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 8 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        style={{
          '--c': brandColor,
          borderColor: brandColor,
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(${colorRgb}, 0.35)`
        }}
      >
        <button
          className="sb-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="sb-modal-header">
          <CardLogo product={product} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 className="sb-modal-title">{product.name}</h3>
              <span style={{ color: '#3b82f6', fontSize: '14px' }}>✓</span>
            </div>

            <div className="sb-badges-row" style={{ marginTop: '4px' }}>
              <span className="sb-badge" style={accountBadge.style}>
                {accountBadge.icon} {accountBadge.label}
              </span>
              <span className="sb-badge" style={{
                border: `1px solid rgba(${colorRgb}, 0.5)`,
                background: `rgba(${colorRgb}, 0.15)`,
                color: brandColor
              }}>
                {(product.category || 'STREAMING').toUpperCase()}
              </span>
              <span className="sb-badge" style={{
                border: '1px solid rgba(52, 211, 153, 0.4)',
                background: 'rgba(52, 211, 153, 0.12)',
                color: '#34d399'
              }}>
                {specs.featureBadge}
              </span>
            </div>

            <p style={{ color: '#888', fontSize: '11.5px', margin: '4px 0 0', lineHeight: 1.3 }}>
              {product.description || (isGaming ? 'Private account. Instant delivery.' : 'Premium shared profiles. Instant access upon purchase.')}
            </p>
          </div>
        </div>

        <div className="sb-modal-body">
          {/* Enhanced Modern Stepper Indicator */}
          <div className="sb-stepper-container">
            <button
              type="button"
              className={`sb-step-tab ${step === 1 ? 'active' : ''}`}
              onClick={() => setStep(1)}
              style={
                step === 1 
                  ? { borderColor: brandColor, background: `rgba(${colorRgb}, 0.16)` } 
                  : {
                      borderColor: `rgba(${colorRgb}, 0.55)`,
                      background: `linear-gradient(135deg, rgba(${colorRgb}, 0.15), rgba(255, 255, 255, 0.04))`,
                      cursor: 'pointer',
                      boxShadow: `0 0 12px rgba(${colorRgb}, 0.2)`
                    }
              }
              title={step === 2 ? 'Click to change duration plan' : ''}
            >
              {step === 2 ? (
                <div style={{
                  position: 'relative',
                  width: '24px',
                  height: '24px',
                  borderRadius: '7px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: `1.5px solid ${brandColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 8px rgba(${colorRgb}, 0.4)`
                }}>
                  <img
                    src={getFavicon(product.name, product.customIcon)}
                    alt=""
                    style={{ width: '14px', height: '14px', objectFit: 'contain', borderRadius: '3px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: brandColor,
                    color: '#fff',
                    fontSize: '8px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 4px rgba(0, 0, 0, 0.8)'
                  }}>
                    ⇄
                  </span>
                </div>
              ) : (
                <span
                  className="sb-step-circle"
                  style={{ background: brandColor, color: '#fff', boxShadow: `0 0 10px rgba(${colorRgb}, 0.5)` }}
                >
                  1
                </span>
              )}
              <span className="sb-step-title" style={{
                color: '#fff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {step === 2 ? 'Change Plan' : 'Choose Plan'}
                {step === 2 && (
                  <span style={{ fontSize: '11px', color: brandColor, opacity: 0.9 }}>🔄</span>
                )}
              </span>
            </button>

            <span className="sb-step-arrow">➜</span>

            <button
              type="button"
              disabled={!selectedPlan}
              className={`sb-step-tab ${step === 2 ? 'active' : ''}`}
              onClick={() => { if (selectedPlan) setStep(2); }}
              style={{
                borderColor: step === 2 ? brandColor : 'transparent',
                background: step === 2 ? `rgba(${colorRgb}, 0.16)` : 'transparent',
                cursor: selectedPlan ? 'pointer' : 'not-allowed',
                opacity: selectedPlan ? 1 : 0.45
              }}
            >
              <span
                className="sb-step-circle"
                style={step >= 2 ? { background: brandColor, color: '#fff', boxShadow: `0 0 10px rgba(${colorRgb}, 0.5)` } : {}}
              >
                2
              </span>
              <span className="sb-step-title" style={{ color: step === 2 ? '#fff' : selectedPlan ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.35)' }}>
                Select Device &amp; Buy
              </span>
            </button>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
            >
              <div style={{ color: '#888', fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                AVAILABLE DURATION PLANS ({plans.length})
              </div>

              <div className="sb-plans-scroll">
                {plans.map((pl, idx) => {
                  const isSelected = idx === safeIdx;
                  const plPrice = pl.price || '₹199';
                  const rowSpecs = detectServiceSpecs(product, pl);

                  return (
                    <div
                      key={idx}
                      className={`sb-plan-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedPlanIdx(idx)}
                      style={{
                        background: isSelected
                          ? `rgba(${colorRgb}, 0.16)`
                          : 'rgba(255, 255, 255, 0.025)',
                        borderColor: isSelected ? brandColor : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? `0 0 16px rgba(${colorRgb}, 0.35)` : 'none'
                      }}
                    >
                      <div className="sb-plan-row-left">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="sb-plan-row-dur">
                            {pl.duration || '1 Month'}
                          </span>
                          <span className="sb-plan-quality-tag" style={{ color: brandColor, borderColor: `rgba(${colorRgb}, 0.4)` }}>
                            {rowSpecs.featureBadge}
                          </span>
                        </div>
                        <div className="sb-plan-row-sub">
                          {isGaming ? '🎮 Lifetime License • ⚡ Instant Access' : '🛡️ 100% Replacement Warranty • ⚡ Instant Delivery'}
                        </div>
                      </div>

                      <div className="sb-plan-row-right">
                        <span className="sb-plan-price-num" style={{ color: isSelected ? brandColor : '#fff' }}>
                          {plPrice}
                        </span>

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

              {selectedPlan ? (
                <button
                  className="sb-cta-btn"
                  onClick={() => setStep(2)}
                  style={{
                    background: `linear-gradient(135deg, ${brandColor}, #6366f1)`,
                    color: '#fff',
                    boxShadow: `0 8px 25px rgba(${colorRgb}, 0.45)`,
                    cursor: 'pointer'
                  }}
                >
                  <span>Continue to Select Device ({currentPriceFormatted})</span>
                  <span>➜</span>
                </button>
              ) : (
                <button
                  className="sb-cta-btn"
                  disabled
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#888',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: 'none',
                    cursor: 'not-allowed'
                  }}
                >
                  <span>👉 Please Select a Duration Plan to Continue</span>
                </button>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
            >
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

              <div className="sb-summary-grid">
                <div>
                  <div className="sb-sum-label">PLAN DURATION</div>
                  <div className="sb-sum-value">{selectedPlan?.duration || '1 Month'} Access</div>
                </div>
                <div>
                  <div className="sb-sum-label">SELECTED DEVICE</div>
                  <div className="sb-sum-value" style={{ color: selectedDevice ? '#34d399' : '#f59e0b' }}>
                    {selectedDevice || '— (Select above)'}
                  </div>
                </div>
                <div>
                  <div className="sb-sum-label">SPECS &amp; QUALITY</div>
                  <div className="sb-sum-value" style={{ color: '#fff' }}>
                    {specs.summaryQuality}
                  </div>
                </div>
                <div>
                  <div className="sb-sum-label">WARRANTY</div>
                  <div className="sb-sum-value" style={{ color: '#34d399' }}>
                    🛡️ 100% Full Replacement
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
                    Instant Automated Access <br />
                    Delivery in &lt; 2 mins
                  </div>
                </div>
              </div>

              <button
                className="sb-cta-btn"
                disabled={!selectedDevice}
                onClick={handleTelegramOrder}
                style={{
                  background: selectedDevice
                    ? `linear-gradient(135deg, ${brandColor}, #10b981)`
                    : 'rgba(255, 255, 255, 0.06)',
                  color: selectedDevice ? '#fff' : '#777',
                  border: selectedDevice ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: selectedDevice ? 'pointer' : 'not-allowed',
                  boxShadow: selectedDevice ? `0 10px 30px rgba(${colorRgb}, 0.5)` : 'none'
                }}
              >
                <span>💬</span>
                <span>
                  {selectedDevice 
                    ? `Buy on Telegram (${currentPriceFormatted})` 
                    : '⚠️ Please Select a Device Above to Continue'}
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── STOCK STATUS & PRICING HELPERS ─────────────────────────────
const isProductOutOfStock = (product) => {
  const raw = (product?.status || 'Available').trim().toLowerCase();
  return raw.includes('out') || raw === 'oos';
};

const isProductComingSoon = (product) => {
  const raw = (product?.status || 'Available').trim().toLowerCase();
  return raw.includes('coming');
};

const getProductStartingPrice = (product) => {
  if (!product?.plans || product.plans.length === 0) return '₹199';
  let min = Infinity;
  for (const pl of product.plans) {
    const num = parseInt(String(pl.price).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num < min) min = num;
  }
  return min === Infinity ? (product.plans[0].price || '₹199') : `₹${min}`;
};

// ─── HIGH-CONVERTING GLOWING PRODUCT CARD ────────────────────────
const ProductCard = ({ product, onOpenBuy }) => {
  const isGaming = isGamingCategory(product.category);
  const brandColor = getSafeBrandColor(product);

  const platform = isGaming ? getGamingPlatform(product) : null;
  const platformBadge = isGaming ? getPlatformBadge(platform) : null;
  const accountBadge = getAccountBadge(product.description);
  const specs = detectServiceSpecs(product, product.plans?.[0]);

  const rawStatus = (product.status || 'Available').trim().toLowerCase();
  const isOutOfStock = rawStatus.includes('out') || rawStatus === 'oos';
  const isComingSoon = rawStatus.includes('coming');

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

  return (
    <GlowCard
      color={brandColor}
      off={false}
      className={`sb-card ${isOutOfStock ? 'sb-card-oos' : isComingSoon ? 'sb-card-coming-soon' : ''}`}
    >
      <div className="sb-card-content">
        {/* Header: Logo + Title + Badges */}
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
                  border: `1px solid ${brandColor}88`,
                  background: `${brandColor}22`,
                  color: brandColor
                }}>
                  {(product.category || 'STREAMING').toUpperCase()}
                </span>
              )}
              <span className="sb-badge" style={accountBadge.style}>
                {accountBadge.icon} {accountBadge.label}
              </span>
              {isOutOfStock && (
                <span className="sb-badge-oos">
                  <span className="sb-beacon-wrap">
                    <span className="sb-dot-ping-oos"></span>
                    <span className="sb-dot-core-oos"></span>
                  </span>
                  <span>RESTOCK IN PROGRESS ⚡</span>
                </span>
              )}
              {isComingSoon && (
                <span className="sb-badge-coming-soon">
                  <span className="sb-beacon-wrap">
                    <span className="sb-dot-ping-cs"></span>
                    <span className="sb-dot-core-cs"></span>
                  </span>
                  <span>DROPPING SOON ⏳</span>
                </span>
              )}
            </div>

            <p className="sb-card-desc">
              {product.description || (isGaming ? 'Private account. Instant delivery.' : 'Premium shared profiles. Instant access upon purchase.')}
            </p>
          </div>
        </div>

        {/* Feature Highlights: Full-length auto-adjusted layout */}
        <div className="sb-card-features">
          <span className="sb-feat-pill">⚡ Instant Delivery</span>
          <span className="sb-feat-sep">•</span>
          <span className="sb-feat-pill">🛡️ 100% Guarantee</span>
          <span className="sb-feat-sep">•</span>
          <span className="sb-feat-pill sb-feat-dynamic">
            {specs.featureBadge}
          </span>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div 
        className="sb-card-action"
        style={{
          borderTopColor: isOutOfStock 
            ? 'rgba(255, 45, 85, 0.22)' 
            : isComingSoon 
              ? 'rgba(251, 191, 36, 0.22)' 
              : 'rgba(255, 255, 255, 0.06)'
        }}
      >
        <div className="sb-card-price-area">
          <span className="sb-price-label">STARTING AT</span>
          <span 
            className="sb-card-price" 
            style={{ 
              color: isComingSoon 
                ? '#fde047' 
                : brandColor 
            }}
          >
            {lowestPrice}
          </span>
          <span style={{ color: '#aaa', fontSize: '11px', fontWeight: 700 }}>
            {defaultDuration} Access
          </span>
        </div>

        {isOutOfStock ? (
          <button className="sb-btn-oos" disabled>
            <span>Out of Stock</span>
            <span className="sb-bell-ring" style={{ fontSize: '15px', lineHeight: 1 }}>
              🔕
            </span>
          </button>
        ) : isComingSoon ? (
          <button className="sb-btn-coming-soon" disabled>
            <span>Coming Soon</span>
            <span className="sb-hourglass-tick" style={{ fontSize: '14px', lineHeight: 1 }}>
              ⏳
            </span>
          </button>
        ) : (
          <button
            className="sb-card-buy-btn"
            onClick={() => onOpenBuy(product, product.plans?.[0])}
            style={{
              background: `linear-gradient(135deg, ${brandColor}, #6366f1)`
            }}
          >
            <span>Get Plan</span>
            <span style={{ fontSize: '13px' }}>⚡</span>
          </button>
        )}
      </div>
    </GlowCard>
  );
};

// ─── MAIN HOME APPLICATION COMPONENT ─────────────────────────────
export default function StreamBazaarDemo() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [modalData, setModalData] = useState(null);
  const [policyTab, setPolicyTab] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [gamingPlatformFilter, setGamingPlatformFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  // Dynamic Typewriter Animated Placeholder
  const SEARCH_PHRASES = useMemo(() => [
    "Search Netflix, Prime Video, Hotstar...",
    "Search GTA V Enhanced, Black Myth: Wukong...",
    "Search ChatGPT Plus, Claude Pro, Canva...",
    "Search NordVPN, ExpressVPN, Surfshark...",
    "Search Crunchyroll Mega Fan, SonyLIV...",
    "Search Steam Keys, PlayStation, Xbox..."
  ], []);

  const [placeholderText, setPlaceholderText] = useState(SEARCH_PHRASES[0]);

  useEffect(() => {
    let pIdx = 0;
    let cIdx = 0;
    let isDeleting = false;
    let timeoutId;

    const tick = () => {
      const currentPhrase = SEARCH_PHRASES[pIdx];
      if (isDeleting) {
        cIdx--;
        setPlaceholderText(currentPhrase.substring(0, cIdx));
        if (cIdx <= 0) {
          isDeleting = false;
          pIdx = (pIdx + 1) % SEARCH_PHRASES.length;
          timeoutId = setTimeout(tick, 450);
          return;
        }
        timeoutId = setTimeout(tick, 30);
      } else {
        cIdx++;
        setPlaceholderText(currentPhrase.substring(0, cIdx));
        if (cIdx >= currentPhrase.length) {
          isDeleting = true;
          timeoutId = setTimeout(tick, 2200);
          return;
        }
        timeoutId = setTimeout(tick, 60);
      }
    };

    timeoutId = setTimeout(tick, 600);
    return () => clearTimeout(timeoutId);
  }, [SEARCH_PHRASES]);

  const lastDataRef = React.useRef('');

  // Live polling from MongoDB (Optimized with zero re-render thrashing)
  const fetchPlans = useCallback(async () => {
    try {
      const apiBase = import.meta.env.PROD ? '' : 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/plans?v=` + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const str = JSON.stringify(data);
          if (str !== lastDataRef.current) {
            lastDataRef.current = str;
            setProducts(data);
            setModalData(prev => {
              if (!prev) return null;
              const updated = data.find(p => p._id === prev.product?._id || p.name === prev.product?.name);
              return updated ? { ...prev, product: updated } : prev;
            });
          }
        }
      }
    } catch (err) {
      console.warn('API error:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchPlans();

    // Fast 1.5-second live sync interval for zero-delay updates across any device
    const interval = setInterval(() => {
      if (!document.hidden) fetchPlans();
    }, 1500);

    const onVisible = () => {
      if (!document.hidden) fetchPlans();
    };

    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);

    // Multi-tab 0ms zero-latency instant sync via BroadcastChannel
    let bc;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('streambazaar_updates');
        bc.onmessage = (e) => {
          if (e.data?.products && Array.isArray(e.data.products) && e.data.products.length > 0) {
            // ⚡ DIRECT 0.00ms ZERO-LATENCY PAYLOAD SYNC
            lastDataRef.current = JSON.stringify(e.data.products);
            setProducts(e.data.products);
          } else if (e.data?.type === 'PLANS_UPDATED') {
            fetchPlans();
          }
        };
      }
    } catch (e) {}

    const onStorage = (e) => {
      if (e.key === 'streambazaar_live_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            lastDataRef.current = e.newValue;
            setProducts(parsed);
          }
        } catch (err) {}
      } else if (e.key === 'streambazaar_plans_updated') {
        fetchPlans();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, [fetchPlans]);

  // Universal Smart Filtered Products with Synonym & Plan Intelligence
  const displayedProducts = useMemo(() => {
    return products.filter(p => {
      if (searchQuery && searchQuery.trim()) {
        const rawQ = searchQuery.toLowerCase().trim();
        const pName = (p.name || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pDesc = (p.description || '').toLowerCase();
        const pPlat = (p.platform || '').toLowerCase();

        // Plan features & quality text
        const planText = (p.plans || [])
          .map(pl => `${pl.label || ''} ${pl.quality || ''} ${pl.duration || ''}`)
          .join(' ')
          .toLowerCase();

        // High-intent category synonyms:
        const isOttQuery = rawQ === 'ott' || rawQ === 'ott apps' || rawQ === 'stream' || rawQ === 'movie' || rawQ === 'movies' || rawQ === 'series' || rawQ === 'cinema';
        const isGameQuery = rawQ === 'game' || rawQ === 'games' || rawQ === 'gaming' || rawQ === 'game name';
        const isAiQuery = rawQ === 'ai' || rawQ === 'ai tools' || rawQ === 'ai name' || rawQ === 'artificial intelligence' || rawQ === 'bot';
        const isVpnQuery = rawQ === 'vpn' || rawQ === 'vpns' || rawQ === 'vpn name' || rawQ === 'proxy' || rawQ === 'shield';

        const matchesSynonym = 
          (isOttQuery && (pCat.includes('stream') || pName.includes('netflix') || pName.includes('crunchyroll') || pName.includes('prime') || pName.includes('hotstar') || pName.includes('youtube') || pName.includes('spotify') || pName.includes('zee5'))) ||
          (isGameQuery && (isGamingCategory(pCat) || pPlat.includes('steam') || pPlat.includes('playstation') || pPlat.includes('xbox') || pName.includes('gta') || pName.includes('wukong'))) ||
          (isAiQuery && (pCat.includes('ai') || pName.includes('gpt') || pName.includes('chatgpt') || pName.includes('claude') || pName.includes('canva'))) ||
          (isVpnQuery && (pCat.includes('vpn') || pName.includes('nord') || pName.includes('surfshark') || pName.includes('express')));

        const matchesStandard = 
          pName.includes(rawQ) || 
          pCat.includes(rawQ) || 
          pDesc.includes(rawQ) || 
          pPlat.includes(rawQ) ||
          planText.includes(rawQ);

        // Global search overrides tab limitations!
        if (!matchesSynonym && !matchesStandard) return false;
        return true;
      }

      // Normal category filtering when NOT searching:
      if (activeCategory === 'Gaming') {
        if (!isGamingCategory(p.category)) return false;

        if (gamingPlatformFilter !== 'All') {
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
        }
        return true;
      }

      if (activeCategory !== 'All') {
        if (activeCategory !== 'Gaming' && p.category !== activeCategory) return false;
      }

      return true;
    });
  }, [products, activeCategory, gamingPlatformFilter, searchQuery]);

  const matchedSearchProducts = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    return displayedProducts;
  }, [searchQuery, displayedProducts]);

  return (
    <div className="sb-page">
      <div className="sb-ambient-1" />
      <div className="sb-ambient-2" />
      <div className="sb-ambient-3" />

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
              <span>Official Digital Store</span>
            </div>
          </div>
        </Link>

        {/* Actions: Telegram Support */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="https://t.me/owner_trusted_streams"
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

      {/* Hero Showcase Section */}
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
          <img
            src="/logo.png"
            alt="StreamBazaar Logo"
            className="hero-logo"
          />

          <div className="hero-badge">✨ India's #1 Most Trusted OTT &amp; Gaming Seat Marketplace</div>

          <h1>
            Watch &amp; Play Anything for<br />
            <span>Up to 90% Less</span>
          </h1>

          <p className="hero-sub">
            Instant delivery, pin-protected private profiles, 100% full replacement guarantee, and 24/7 human customer support on Telegram.
          </p>

          {/* Replaced generic CTA buttons with interactive Cyber-Luxe Trust & Live Status Island */}
          <div className="sb-hero-trust-island">
            <div className="sb-trust-item">
              <span className="sb-trust-icon">⚡</span>
              <div>
                <div className="sb-trust-title">Instant Delivery</div>
                <div className="sb-trust-sub">&lt; 60s automated access</div>
              </div>
            </div>

            <div className="sb-trust-divider" />

            <div className="sb-trust-item" onClick={() => setPolicyTab('warranty')} style={{ cursor: 'pointer' }}>
              <span className="sb-trust-icon">🛡️</span>
              <div>
                <div className="sb-trust-title">100% Guarantee</div>
                <div className="sb-trust-sub">Full duration replacement</div>
              </div>
            </div>

            <div className="sb-trust-divider" />

            <div className="sb-trust-item">
              <span className="sb-trust-icon">⭐</span>
              <div>
                <div className="sb-trust-title">4.9/5 Rating</div>
                <div className="sb-trust-sub">12,400+ satisfied buyers</div>
              </div>
            </div>

            <div className="sb-trust-divider" />

            <a
              href="https://t.me/owner_trusted_streams"
              target="_blank"
              rel="noopener noreferrer"
              className="sb-trust-telegram-btn"
              title="Open Official Telegram Channel"
            >
              <span className="sb-pulse-dot" />
              <span>24/7 Live Support</span>
              <span style={{ fontSize: '12px' }}>↗</span>
            </a>
          </div>

          {/* Dedicated Centered Search Bar with Typewriter Animation, Pills & Dropdown */}
          <div className="sb-search-hero-wrap">
            <div className="sb-search-hero-box">
              <span style={{ fontSize: '18px', color: '#a855f7' }}>🔍</span>
              <div className="sb-search-input-wrap">
                <input
                  ref={searchInputRef}
                  className="sb-search-hero-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  aria-label="Search catalog"
                />
                {!searchQuery && (
                  <div className="sb-search-typewriter-overlay">
                    <span>{placeholderText}</span>
                    <span className="sb-typewriter-cursor" />
                  </div>
                )}
              </div>
              {searchQuery && (
                <button
                  type="button"
                  className="sb-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear Search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Smart Autocomplete / Live Suggestion Dropdown */}
            {isSearchFocused && (
              <div className="sb-search-dropdown">
                <div className="sb-search-dropdown-header">
                  <span>{searchQuery.trim() ? `Matching Products (${matchedSearchProducts.length})` : 'Popular Suggestions'}</span>
                  <span className="sb-search-live-badge">⚡ Live Search</span>
                </div>
                <div className="sb-search-dropdown-list">
                  {searchQuery.trim() ? (
                    matchedSearchProducts.length > 0 ? (
                      matchedSearchProducts.slice(0, 6).map((p) => {
                        const isOos = isProductOutOfStock(p);
                        const isCs = isProductComingSoon(p);
                        return (
                          <div
                            key={p._id || p.name}
                            className="sb-search-dropdown-item"
                            onMouseDown={() => {
                              setSearchQuery(p.name);
                              setIsSearchFocused(false);
                            }}
                          >
                            <div className="sb-dropdown-item-left">
                              <span className="sb-dropdown-cat-tag">{(p.category || 'STREAMING').toUpperCase()}</span>
                              <span className="sb-dropdown-name">{p.name}</span>
                            </div>
                            <div className="sb-dropdown-item-right">
                              <span className="sb-dropdown-price">{getProductStartingPrice(p)}</span>
                              <span className={`sb-dropdown-status ${isOos ? 'oos' : isCs ? 'cs' : 'avail'}`}>
                                {isOos ? 'Out of Stock' : isCs ? 'Coming Soon' : 'Available'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="sb-search-no-results">
                        No products found for "{searchQuery}". Try "ott", "game", "ai", or "vpn".
                      </div>
                    )
                  ) : (
                    <div className="sb-search-quick-triggers">
                      <div className="sb-search-trigger-item" onMouseDown={() => setSearchQuery('ott')}>
                        <span>📺</span> <span>Browse all OTT Streaming Apps (Netflix, Prime, Crunchyroll)</span>
                      </div>
                      <div className="sb-search-trigger-item" onMouseDown={() => setSearchQuery('game')}>
                        <span>🎮</span> <span>Browse PC & Console Games (GTA V, Wukong, Steam)</span>
                      </div>
                      <div className="sb-search-trigger-item" onMouseDown={() => setSearchQuery('ai')}>
                        <span>🤖</span> <span>Browse AI+ Productivity Tools (ChatGPT Plus, Canva)</span>
                      </div>
                      <div className="sb-search-trigger-item" onMouseDown={() => setSearchQuery('vpn')}>
                        <span>🛡️</span> <span>Browse High-Speed VPN Shields (NordVPN, ExpressVPN)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Suggestion Clickable Filter Pills */}
            <div className="sb-search-pills">
              <span className="sb-pills-label">Popular:</span>
              <button
                type="button"
                className={`sb-pill-chip ${searchQuery.toLowerCase() === 'ott' ? 'active' : ''}`}
                onClick={() => setSearchQuery(searchQuery.toLowerCase() === 'ott' ? '' : 'ott')}
              >
                <span>📺</span> OTT Apps
              </button>
              <button
                type="button"
                className={`sb-pill-chip ${searchQuery.toLowerCase() === 'game' ? 'active' : ''}`}
                onClick={() => setSearchQuery(searchQuery.toLowerCase() === 'game' ? '' : 'game')}
              >
                <span>🎮</span> Games
              </button>
              <button
                type="button"
                className={`sb-pill-chip ${searchQuery.toLowerCase() === 'ai' ? 'active' : ''}`}
                onClick={() => setSearchQuery(searchQuery.toLowerCase() === 'ai' ? '' : 'ai')}
              >
                <span>🤖</span> AI Tools
              </button>
              <button
                type="button"
                className={`sb-pill-chip ${searchQuery.toLowerCase() === 'vpn' ? 'active' : ''}`}
                onClick={() => setSearchQuery(searchQuery.toLowerCase() === 'vpn' ? '' : 'vpn')}
              >
                <span>🛡️</span> VPNs
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Container */}
      <main id="deals" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>

        {/* Active Search Feedback Bar */}
        {searchQuery.trim() && (
          <div className="sb-search-feedback-bar">
            <div className="sb-search-feedback-text">
              <span>🔍</span>
              <span>
                Showing <strong>{displayedProducts.length}</strong> {displayedProducts.length === 1 ? 'product' : 'products'} for <em>"{searchQuery}"</em>
              </span>
            </div>
            <button
              className="sb-search-feedback-clear"
              onClick={() => setSearchQuery('')}
            >
              Clear Search ✕
            </button>
          </div>
        )}

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
                  setGamingPlatformFilter('All');
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gaming Platform Sub-Filter Bar - ONLY SHOWS WHEN 'Gaming' CATEGORY IS ACTIVE */}
        {activeCategory === 'Gaming' && (
          <motion.div
            className="sb-platform-bar"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
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
                    onClick={() => setGamingPlatformFilter(p.id)}
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
          </motion.div>
        )}

        {/* Product Cards Grid with Glowing Border */}
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
          <div className="sb-search-empty-state">
            <div style={{ fontSize: '38px', marginBottom: '8px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>No products found</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '6px 0 16px' }}>
              We couldn't find any products matching "{searchQuery}". Try popular categories:
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setSearchQuery('ott')} className="sb-pill-chip">📺 OTT Apps</button>
              <button type="button" onClick={() => setSearchQuery('game')} className="sb-pill-chip">🎮 Games</button>
              <button type="button" onClick={() => setSearchQuery('ai')} className="sb-pill-chip">🤖 AI Tools</button>
              <button type="button" onClick={() => setSearchQuery('vpn')} className="sb-pill-chip">🛡️ VPNs</button>
              <button type="button" onClick={() => setSearchQuery('')} className="sb-pill-chip" style={{ borderColor: '#ef4444', color: '#f87171' }}>Clear Search ✕</button>
            </div>
          </div>
        )}

        {/* StreamBazaar Official Protection & Trust Hub */}
        <section className="sb-trust-hub-section">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="sb-policy-pill-badge">🛡️ STREAMBAZAAR BUYER PROTECTION</div>
            <h3 style={{ fontSize: '26px', fontWeight: 900, margin: '10px 0 6px', color: '#fff', letterSpacing: '-0.5px' }}>
              Official Trust, Warranty &amp; Guarantees
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Every active subscription includes 100% replacement warranty, instant Telegram ticket dispatch, and private PIN protection.
            </p>
          </div>

          <div className="sb-trust-hub-grid">
            {[
              {
                id: 'accounts',
                icon: '👤',
                title: 'Accounts & Profile Guidelines',
                desc: 'Separate private profile inside a shared account with personal 4-digit PIN lock. Master login rules and full duration.',
                action: 'View Accounts Policy →',
                color: '#a855f7'
              },
              {
                id: 'devices',
                icon: '📱',
                title: 'Devices & Screen Limits',
                desc: 'Install on Mobile, Smart TV, or PC/Laptop. Clear 1-screen active streaming rule prevents account locks.',
                action: 'View Device Rules →',
                color: '#3b82f6'
              },
              {
                id: 'privacy',
                icon: '🔒',
                title: '100% Privacy & Security',
                desc: 'Only UPI and Telegram collected. Never card numbers, bank details, or contacts. 7-day deletion upon request.',
                action: 'View Privacy Policy →',
                color: '#10b981'
              },
              {
                id: 'terms',
                icon: '⚖️',
                title: 'Terms & Replacement Policy',
                desc: 'Honest reseller terms. If credentials ever stop working, verified replacement is dispatched for the rest of your plan.',
                action: 'View Terms & Warranty →',
                color: '#f59e0b'
              },
              {
                id: 'support',
                icon: '💬',
                title: 'Support & Ordering Guide',
                desc: 'Everything happens step-by-step on Telegram. Fast 5-15 minute access delivery and dedicated order resolution.',
                action: 'View Support Guide →',
                color: '#818cf8'
              }
            ].map((card) => (
              <div
                key={card.id}
                className="sb-trust-hub-card"
                onClick={() => setPolicyTab(card.id)}
                style={{ '--accent': card.color }}
              >
                <div className="sb-trust-hub-icon-wrap" style={{ background: `${card.color}18`, borderColor: `${card.color}35` }}>
                  <span style={{ fontSize: '22px' }}>{card.icon}</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{card.title}</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.5, flex: 1 }}>{card.desc}</p>
                <span className="sb-trust-hub-action" style={{ color: card.color }}>
                  {card.action}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Official StreamBazaar Unique Centered Trust & Policy Footer */}
      <footer className="sb-footer" style={{ borderTop: 'none', padding: '44px 16px 30px', background: 'rgba(8, 9, 17, 0.98)' }}>
        <div className="sb-footer-centered-wrap">

          {/* Centered Brand Seal */}
          <div className="sb-footer-brand-box">
            <img src="/logo.png" alt="StreamBazaar" style={{ width: '42px', height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))' }} />
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              Stream<span style={{ color: '#a855f7' }}>Bazaar</span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, maxWidth: '440px', lineHeight: '1.5' }}>
              India's premier verified digital seat & OTT subscription marketplace. 100% genuine accounts, private PIN protection & instant dispatch.
            </p>
          </div>

          {/* Policy Establishment Box (Main Center - Kab Bani Thi) */}
          <div className="sb-footer-established-card">
            <div className="sb-footer-protocol-badge">
              <span className="sb-live-dot" style={{ background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span>Official Consumer Protection Protocol</span>
            </div>
            <div className="sb-footer-est-title">
              Policy Established: <span style={{ color: '#10b981', fontWeight: 800 }}>January 2024</span> • Active &amp; Fully Verified
            </div>
            <p className="sb-footer-est-desc">
              StreamBazaar buyer warranty, profile privacy standards, and zero-risk replacement SLAs are formally registered and enforced across every active subscription.
            </p>
            <div className="sb-footer-trust-chips">
              <span style={{ color: '#10b981' }}>✓ 100% Duration Guaranteed</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#60a5fa' }}>🔒 4-Digit PIN Isolated</span>
            </div>
          </div>


          {/* Categorized Community & Official Support */}
          <div className="sb-footer-support-row">
            <span>Official Support Hub:</span>
            <a
              href="https://t.me/owner_trusted_streams"
              target="_blank"
              rel="noopener noreferrer"
              className="sb-footer-support-chip"
            >
              @owner_trusted_streams
            </a>
            <span style={{ color: '#475569' }}>•</span>
            <span>Avg Response: <strong style={{ color: '#10b981' }}>&lt; 5 mins</strong></span>
          </div>

          {/* Centered Copyright */}
          <div className="sb-footer-bottom-centered">
            <div>© 2024 - {new Date().getFullYear()} StreamBazaar Marketplace. All rights reserved.</div>
            <div style={{ color: '#475569', fontSize: '10.5px' }}>
              Authentic 1-Device Private Profile Accounts • Full Duration Replacement Protection
            </div>
          </div>

        </div>
      </footer>

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

      {/* Policy Modal */}
      <AnimatePresence>
        {policyTab && (
          <PolicyModal
            initialTab={policyTab}
            onClose={() => setPolicyTab(null)}
          />
        )}
      </AnimatePresence>

      {/* Sheena AI Chatbot & FOMO Live Purchases Toast */}
      <ChatWidget />
      <FomoToast />
    </div>
  );
}
