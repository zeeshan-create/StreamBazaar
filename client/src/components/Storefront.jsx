import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, MessageCircle, Laptop2, Monitor, Smartphone, X,
  LayoutGrid, Tv2, Shield, Gamepad2, Cpu, Zap, CheckCircle2,
  ShieldCheck, HeartHandshake, Award, ExternalLink, LayoutDashboard,
  Sun, Moon, AlertTriangle, RefreshCw, Clock, Camera, Ban
} from 'lucide-react';
import '../App.css';
import ChatWidget from '../ChatWidget';
import FomoToast from './FomoToast';


const CustomIcons = {
  Apple: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
    </svg>
  ),
  Android: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M2.76 3.061a.5.5 0 0 1 .679.2l1.283 2.352A8.9 8.9 0 0 1 8 5a8.9 8.9 0 0 1 3.278.613l1.283-2.352a.5.5 0 1 1 .878.478l-1.252 2.295C14.475 7.266 16 9.477 16 12H0c0-2.523 1.525-4.734 3.813-5.966L2.56 3.74a.5.5 0 0 1 .2-.678ZM5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
    </svg>
  ),
  TV: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5M13.991 3l.024.001a1.5 1.5 0 0 1 .538.143.76.76 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.5 1.5 0 0 1-.143.538.76.76 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.5 1.5 0 0 1-.538-.143.76.76 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.5 1.5 0 0 1 .143-.538.76.76 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2"/>
    </svg>
  ),
  PC: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/>
    </svg>
  ),
  Laptop: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/>
    </svg>
  ),
  PlayStation: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356M9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.45 8.45 0 0 1-4.018-.323Z"/>
    </svg>
  ),
  Xbox: () => (
    <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
      <path d="M7.202 15.967a8 8 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33m-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.4 8.4 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.5 9.5 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4 4 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.8 7.8 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12 12 0 0 1-.654-.319Z"/>
    </svg>
  ),
};

const TELEGRAM_LINK = 'https://t.me/owner_trusted_streams';
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const getProxiedUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  if (url.startsWith('/') || url.startsWith('http://localhost') || url.startsWith('https://streambazaar')) return url;
  return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}`;
};

const isGamingCategory = (cat) => {
  if (!cat) return false;
  const c = cat.toLowerCase().trim();
  return c === 'gaming' || c === 'steam' || c === 'playstation' || c === 'xbox' || c === 'epic' || c === 'steam gaming' || c === 'games' || c === 'game' || c.includes('gaming') || c.includes('game');
};

const renderPlaceholder = (name, isGaming, color) => {
  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : '?';
  const accentColor = color || '#6366f1';
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
      border: `1px dashed ${accentColor}55`,
      borderRadius: isGaming ? '10px' : '12px',
      color: accentColor,
      fontWeight: 'bold',
      fontSize: isGaming ? '1.5rem' : '1.25rem',
      textShadow: `0 0 10px ${accentColor}40`,
      position: 'relative'
    }}>
      <span>{firstLetter}</span>
      <span style={{ fontSize: '0.65rem', opacity: 0.6, position: 'absolute', bottom: isGaming ? '8px' : '4px' }}>
        {isGaming ? '🎮' : '📺'}
      </span>
    </div>
  );
};

const DOMAINS = {
  'youtube premium': 'youtube.com',
  'youtube music': 'music.youtube.com',
  'youtube': 'youtube.com',
  'sony liv': 'sonyliv.com',
  'sony': 'sonyliv.com',
  'sonyliv': 'sonyliv.com',
  'netflix': 'netflix.com',
  'amazon prime': 'primevideo.com',
  'amazon': 'primevideo.com',
  'prime': 'primevideo.com',
  'hoichoi tv': 'hoichoi.tv',
  'hoichoi': 'hoichoi.tv',
  'discovery plus': 'discoveryplus.com',
  'discovery': 'discoveryplus.com',
  'airtel xstream': 'airtelxstream.in',
  'airtel': 'airtelxstream.in',
  'apple music': 'music.apple.com',
  'apple tv+': 'tv.apple.com',
  'spotify premium': 'spotify.com',
  'spotify': 'spotify.com',
  'linkedin premium': 'linkedin.com',
  'adobe creative': 'adobe.com',
  'google one': 'one.google.com',
  'jio hotstar': 'jiohotstar.com',
  'jio': 'jiocinema.com',
  'jiocinema': 'jiocinema.com',
  'zee5': 'zee5.com',
  'surfshark vpn': 'surfshark.com',
  'surfshark': 'surfshark.com',
  'nordvpn': 'nordvpn.com',
  'nord': 'nordvpn.com',
  'steam gaming': 'store.steampowered.com',
  'steam': 'store.steampowered.com',
  'playstation': 'playstation.com',
  'microsoft copilot': 'microsoft.com',
  'chatgpt plus': 'openai.com',
  'chatgpt': 'openai.com',
  'claude ai': 'claude.ai',
  'claude': 'anthropic.com',
  'canva pro': 'canva.com',
  'canva': 'canva.com',
  'picsart pro': 'picsart.com',
  'envato elements': 'elements.envato.com',
  'grok ai': 'x.ai',
  'elevenlabs': 'elevenlabs.io',
  'iptv': 'iptvsmarters.com',
  'lionsgate play': 'lionsgateplay.com',
  'lionsgate': 'lionsgateplay.com',
  'crunchy roll': 'crunchyroll.com',
  'crunchyroll': 'crunchyroll.com',
  'ullu': 'ullu.app',
  'aha': 'aha.video',
  'altbalaji': 'altt.co.in',
  'voot': 'voot.com',
  'sun nxt': 'sunnxt.com',
  'sunnxt': 'sunnxt.com',
  'epic on': 'epicon.in',
  'eros now': 'erosnow.com',
  'kaspersky': 'kaspersky.com',
  'express vpn': 'expressvpn.com',
  'expressvpn': 'expressvpn.com',
  'vpn': 'nordvpn.com',
  'epic': 'epicgames.com',
  'server': 'digitalocean.com',
  'stream server': 'plex.tv',
  'ott': 'netflix.com'
};

const BRAND_COLORS = {
  'netflix': '#e50914',
  'youtube': '#ff0000',
  'amazon': '#00a8e1',
  'prime': '#00a8e1',
  'hotstar': '#030b14',
  'jio hotstar': '#030b14',
  'jio': '#c5286e',
  'jiocinema': '#c5286e',
  'sony': '#df1827',
  'sonyliv': '#df1827',
  'zee5': '#8224e3',
  'chatgpt': '#10a37f',
  'claude': '#d97757',
  'canva': '#00c4cc',
  'spotify': '#1db954',
  'discord': '#5865f2',
  'discovery': '#0f4ff5',
  'airtel': '#ff0000',
  'lionsgate': '#f5ce38',
  'aha': '#ff6d00',
  'ullu': '#eeb914',
  'nord': '#4687ff',
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
  'jio': 'Streaming',
  'jiocinema': 'Streaming',
  'sony': 'Streaming',
  'sonyliv': 'Streaming',
  'zee5': 'Streaming',
  'chatgpt': 'AI+',
  'claude': 'AI+',
  'canva': 'AI+',
  'spotify': 'Streaming',
  'discord': 'AI+',
  'discovery': 'Streaming',
  'airtel': 'Streaming',
  'lionsgate': 'Streaming',
  'aha': 'Streaming',
  'ullu': 'Streaming',
  'nord': 'VPN',
  'nordvpn': 'VPN',
  'surfshark': 'VPN',
  'iptv': 'Streaming',
  'hoichoi': 'Streaming'
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
const getGameIcon = (label) => {
  const lowercase = label.toLowerCase();
  for (const key in GAME_IMGS) {
    if (lowercase.includes(key)) {
      return GAME_IMGS[key];
    }
  }
  return null;
};

const CATEGORIES = [
  { id: 'all',       name: 'All',       icon: <LayoutGrid size={15} /> },
  { id: 'Streaming', name: 'Streaming', icon: <Tv2       size={15} /> },
  { id: 'VPN',       name: 'VPN',       icon: <Shield    size={15} /> },
  { id: 'Gaming',    name: 'Gaming',    icon: <Gamepad2  size={15} /> },
  { id: 'AI+',       name: 'AI+',       icon: <Cpu       size={15} /> },
];

const DEVICES = [
  { id: 'PC', label: 'PC', emoji: '🖥️' },
  { id: 'Laptop', label: 'Laptop', emoji: '💻' },
  { id: 'PlayStation', label: 'PlayStation', emoji: '🎮' },
  { id: 'Xbox', label: 'Xbox', emoji: '🎮' },
  { id: 'Android', label: 'Android', emoji: '🤖' },
  { id: 'iOS', label: 'iOS', emoji: '📱' },
  { id: 'Tablet', label: 'Tablet', emoji: '📱' },
  { id: 'TV', label: 'TV', emoji: '📺' },
];

// Gaming products (Steam / PlayStation) only support PC devices
const DEVICES_GAMING = [
  { id: 'Laptop', label: 'Laptop', emoji: '💻' },
  { id: 'PC',     label: 'PC',     emoji: '🖥️' },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Delivery',   desc: 'Get your login credentials within minutes of placing your order.' },
  { icon: '🔒', title: 'Secure Seat Access', desc: 'Private profile on shared accounts — your data stays safe.' },
  { icon: '📱', title: '1 Device Access',    desc: 'Works on TV, PC, iOS and Android — your choice.' },
  { icon: '🎯', title: 'Best Prices',        desc: 'Premium subscriptions at up to 90% off official prices.' },
  { icon: '💬', title: 'Telegram Support',   desc: 'Direct chat support for instant help, no bots, no wait.' },
  { icon: '🔄', title: 'Full Guarantee',     desc: 'Account stopped? We replace it immediately, no questions asked.' },
  { icon: '🌍', title: 'Global Access',      desc: 'Use your subscriptions anywhere in the world without restrictions.' },
  { icon: '🛡️', title: 'Verified Accounts',  desc: '100% legal, genuine, and carefully verified premium accounts.' },
  { icon: '💳', title: 'Secure Payments',    desc: 'Multiple safe payment methods accepted directly via Telegram.' },
  { icon: '🚀', title: 'High Uptime',        desc: '99.9% uptime for all OTT and premium service platforms.' },
];

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } },
};
const modalVariants = {
  hidden:  { opacity: 0, scale: 0.96, y: 15 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.1, ease: 'easeIn' } },
};
const deviceItemVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.12, ease: 'easeOut', delay: i * 0.02 } 
  }),
};
const cardVariants = {
  hidden:  { opacity: 0, y: 15, scale: 0.98 },
  visible: (i) => ({ 
    opacity: 1, y: 0, scale: 1, 
    transition: { duration: 0.2, ease: 'easeOut', delay: Math.min(i * 0.03, 0.24) } 
  }),
  exit:    { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.15, ease: 'easeIn' } },
};
const planRowVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: (i) => ({ 
    opacity: 1, x: 0, 
    transition: { duration: 0.15, ease: 'easeOut', delay: Math.min(i * 0.03, 0.18) } 
  }),
};

export default function App() {
  const [plans, setPlans]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [activeCategory, setCategory] = useState('all');
  const [popup, setPopup]             = useState(null); // { product, plan, device }
  const [imgErr, setImgErr]           = useState({});
  const [showResults, setShowResults] = useState(false);
  const searchRef                     = useRef(null);
  
  const [theme, setTheme]             = useState(localStorage.getItem('theme') || 'dark');
  const [openFaq, setOpenFaq]         = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleFaq = (index) => {
    setOpenFaq(prev => prev === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const plansJsonRef = useRef('');

  const fetchPlans = useCallback(() => {
    const cacheBuster = Date.now();
    fetch(`${API_BASE}/api/plans?v=${cacheBuster}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const formatted = d.map((p, idx) => {
          const lower = p.name.toLowerCase();
          
          const finalColor = p.primaryColor || p.color;
          p.color = finalColor;
          
          if (!p.color || p.color === '#000000' || p.color === '#333' || p.color === '#333333' || p.color === '') {
             const matchedBrand = Object.keys(BRAND_COLORS).find(k => lower.includes(k));
             if (matchedBrand) p.color = BRAND_COLORS[matchedBrand];
          }

          const VIBRANT_COLORS = ['#ff0055', '#00e5a0', '#00b8ff', '#ffaa00', '#b800ff', '#ff00aa', '#00ffcc', '#ff3366', '#33ccff', '#ffcc00'];
          const sanitizeColor = (c) => {
            if (!c) return null;
            c = c.trim();
            if (/^[0-9A-Fa-f]{3,6}$/.test(c)) return '#' + c;
            return c;
          };
          const rawColor = sanitizeColor(p.color);
          const isDarkColor = (c) => !c || ['#000000', '#111111', '#222222', '#333333', '#444444', '#1a1a1a', '#0d0f17', 'black', 'transparent'].includes(c.toLowerCase());
          p.effectiveColor = isDarkColor(rawColor) ? VIBRANT_COLORS[idx % VIBRANT_COLORS.length] : rawColor;

          if (!p.category || p.category.trim() === '') {
             const matchedCat = Object.keys(BRAND_CATEGORIES).find(k => lower.includes(k));
             p.category = matchedCat ? BRAND_CATEGORIES[matchedCat] : 'Streaming';
          }
          
          return p;
        });
        
        // Deep serialization check to avoid redundant React renders and lag
        const jsonStr = JSON.stringify(formatted);
        if (jsonStr !== plansJsonRef.current) {
          plansJsonRef.current = jsonStr;
          setPlans(formatted);
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    
    // Initial fetch
    fetchPlans();
    
    // Low-latency live polling (1 second) for instant updates across all clients
    const interval = setInterval(() => {
      fetchPlans();
    }, 1000);
    
    // Sync instantly when user tabs back or page becomes visible
    const handleSync = () => {
      fetchPlans();
    };
    window.addEventListener('focus', handleSync);
    document.addEventListener('visibilitychange', handleSync);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleSync);
    };
  }, [fetchPlans]);

  const handleKey = useCallback((e) => { if (e.key === 'Escape') setPopup(null); }, []);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const filtered = plans.filter(p => {
    const q = searchTerm.toLowerCase();
    const pCat = p.category ? p.category.trim().toLowerCase() : '';
    const aCat = activeCategory.trim().toLowerCase();
    
    const matchSearch = p.name.toLowerCase().includes(q) || pCat.includes(q);
    const matchCat    = aCat === 'all' || pCat === aCat || (aCat === 'gaming' && isGamingCategory(pCat));
    return matchSearch && matchCat;
  }).sort((a, b) => {
    // Gaming cards always appear last
    const aIsGaming = isGamingCategory(a.category);
    const bIsGaming = isGamingCategory(b.category);
    if (aIsGaming && !bIsGaming) return 1;
    if (!aIsGaming && bIsGaming) return -1;
    return 0;
  });

  const openPopup = (product, plan) => {
    setPopup({ product, plan, device: null });
  };

  const handleBuy = () => {
    if (!popup || !popup.device) return;
    const { product, plan, device } = popup;
    
    // Fire and forget, no await to prevent lag on checkout
    fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: product.name,
        plan: plan.label,
        device: device,
        price: plan.price
      })
    }).catch(err => console.error('Failed to log actual checkout click:', err));

    const msg = `Hi! I want to buy ${product.name} — ${plan.label} — Device: ${device} — Price: ${plan.price}`;
    window.open(`${TELEGRAM_LINK}?text=${encodeURIComponent(msg)}`, '_blank');
    setPopup(null);
  };

  const CUSTOM_ICONS = {
    'airtel': 'https://icon.horse/icon/airtelxstream.in',
    'discovery': 'https://icon.horse/icon/discoveryplus.in'
  };

    const getFavicon = name => {
    if (!name) return null;
    const lowerName = name.toLowerCase();
    
    // Check custom overrides first
    const matchedCustom = Object.keys(CUSTOM_ICONS).find(k => lowerName.includes(k));
    if (matchedCustom) return CUSTOM_ICONS[matchedCustom];

    const gameIcon = getGameIcon(name);
    if (gameIcon) return gameIcon;

    let domain = DOMAINS[lowerName];
    if (!domain) {
      // Smart domain fallback based on name
      domain = `${lowerName.replace(/[^a-z0-9]/g, '')}.com`;
    }
    
    // Use Logo.dev CDN if token is available
    const token = import.meta.env.VITE_LOGO_DEV_TOKEN || import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
    if (token) {
      return `https://img.logo.dev/${domain}?token=${token}`;
    }
    
    // Use high-quality Google Favicons API (sz=256 ensures high resolution)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  };

  return (
    <div className="app-container">
      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav>
        <motion.div
          style={{ cursor: 'pointer' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src="/logo.png" alt="StreamBazaar" className="nav-logo" />
        </motion.div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/admin"
            className="admin-nav-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
          >
            <LayoutDashboard size={15} /> Admin
          </Link>
          
          <button
            onClick={toggleTheme}
            className="header-badge-btn"
            style={{
              width: '38px',
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'var(--card)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              color: 'var(--color-text)'
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} style={{ color: '#fbbf24' }} /> : <Moon size={16} />}
          </button>

          <motion.a
            href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer"
            className="btn-tg" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            <MessageCircle size={15} /> Live Support
          </motion.a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-ring" />
        <div className="hero-ring" />
        <div className="hero-ring" />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <img src="/logo.png" alt="StreamBazaar Logo" className="hero-logo" />
          <div className="hero-badge">🌟 Premium Digital Seat Access Store</div>
          <h1>Premium Subscriptions<br /><span>At Lowest Prices</span></h1>
          <p className="hero-sub">
            <span>Instant Access</span> &nbsp;•&nbsp; <span>Secure Login</span> &nbsp;•&nbsp; <span>1 Device Support</span>
          </p>
          <div className="hero-ctas">
            <motion.a
              href="#deals"
              className="btn-primary"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              View Plans <ExternalLink size={16} />
            </motion.a>
            <motion.a
              href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer"
              className="btn-ghost"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={16} /> Contact Support
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── SEARCH ─────────────────────────────────────────────── */}
      <div className="search-wrap" ref={searchRef}>
        <Search size={17} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search Netflix, ChatGPT, GTA V..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
        />
        
        <AnimatePresence>
          {showResults && searchTerm && (
            <motion.div 
              className="search-results-dropdown"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {filtered.length > 0 ? (
                filtered.map(product => {
                   const effectiveColor = product.effectiveColor || '#ff0055';
                   const displayPrice = product.plans?.[0]?.price || '';
                   const formattedPrice = displayPrice.startsWith('₹') ? displayPrice : '₹' + displayPrice;

                   return (
                     <div key={product._id} className="search-result-item" onClick={() => {
                        setSearchTerm('');
                        setShowResults(false);
                        setTimeout(() => {
                           const el = document.getElementById(`card-${product._id}`);
                           if (el) {
                             const y = el.getBoundingClientRect().top + window.scrollY - 100;
                             window.scrollTo({ top: y, behavior: 'smooth' });
                           }
                        }, 100);
                     }}>
                       <img src={product.customIcon || getFavicon(product.name)} className="search-result-logo" alt={product.name} />
                       <div className="search-result-info">
                         <div className="search-result-name">{product.name}</div>
                         <div className="search-result-price" style={{ color: effectiveColor, fontWeight: '700' }}>Starts at {formattedPrice}</div>
                       </div>
                     </div>
                   );
                })
              ) : (
                <div className="search-no-results">No products found</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CATEGORY TABS ──────────────────────────────────────── */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            {cat.icon} {cat.name}
          </motion.button>
        ))}
      </div>

      {/* ── PRODUCT GRID ───────────────────────────────────────── */}
      <section className="ott-section" id="deals">
        {loading ? (
          <div className="ott-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="ott-card skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-logo"></div>
                  <div className="skeleton-title"></div>
                </div>
                <div className="skeleton-plan"></div>
                <div className="skeleton-plan"></div>
                <div className="skeleton-plan"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ott-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, idx) => {
                const isGaming = product.category && product.category.toLowerCase().includes('gam');
                const effectiveColor = product.effectiveColor;

                if (false && isGaming) {
                  return (
                    <motion.div
                      key={product._id || product.id}
                      layout
                      id={`card-${product._id || product.id}`}
                      custom={idx}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{ 
                        borderRadius: '24px', 
                        border: `1px solid ${effectiveColor}80`, 
                        background: '#0d0f17',
                        boxShadow: `0 0 20px ${effectiveColor}20, inset 0 0 20px ${effectiveColor}10`,
                        padding: '1.25rem',
                        '--card-accent': effectiveColor,
                        display: 'flex', flexDirection: 'column', gap: '1.25rem'
                      }}
                      whileHover={{ y: -8, scale: 1.015, boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 40px rgba(0,0,0,0.35)`, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                      whileTap={{ scale: 0.97, y: 0 }}
                    >
                      {/* Game Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          {(() => {
                            const isEpicGame = (product.customIcon && (product.customIcon.includes('lutris') || product.customIcon.includes('igdb') || product.customIcon.includes('epicgames'))) || (product.name && product.name.toLowerCase().includes('epic'));
                            return (
                              <img 
                                src={product.customIcon || getGameIcon(product.name) || getFavicon(product.name)} 
                                alt={product.name} 
                                style={{ 
                                  width: '68px', 
                                  height: isEpicGame ? '92px' : '68px', 
                                  borderRadius: '12px', 
                                  objectFit: 'cover',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                  border: '1px solid rgba(255,255,255,0.1)'
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            );
                          })()}
                          <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text)' }}>{product.name}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: 1.4, maxWidth: '200px' }}>
                              {product.description || "Offline game activation for PC. Full updates supported."}
                            </p>
                          </div>
                        </div>
                        {(() => {
                          const isEpicGame = (product.customIcon && (product.customIcon.includes('lutris') || product.customIcon.includes('igdb') || product.customIcon.includes('epicgames'))) || (product.name && product.name.toLowerCase().includes('epic'));
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.25rem 0.75rem', borderRadius: '999px', border: `1px solid ${effectiveColor}40`, background: `${effectiveColor}15`, fontSize: '0.75rem', fontWeight: 700, color: effectiveColor, whiteSpace: 'nowrap', marginTop: '0.5rem', letterSpacing: '0.5px' }}>
                              {isEpicGame ? (
                                <>
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 0L1.75 3v13.5L12 24l10.25-7.5V3L12 0zm7.25 15.5l-7.25 5.3-7.25-5.3V5.5l7.25-2.1 7.25 2.1v10z"/></svg>
                                  EPIC GAMES
                                </>
                              ) : (
                                <>
                                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 .002C5.378.002.001 5.378.001 12c0 5.485 3.68 10.113 8.745 11.583l1.834-2.617c-.12-.047-.234-.1-.34-.17a1.996 1.996 0 0 1-1.042-2.196l-3.238-1.57a3.468 3.468 0 0 1-.365-2.072 3.486 3.486 0 1 1 5.568-1.393l3.187 1.545a1.986 1.986 0 0 1 2.894 1.13c.287.97.027 2.016-.677 2.723l1.833 2.616c5.064-1.47 8.745-6.098 8.745-11.583 0-6.622-5.377-11.998-12-11.998zm-7.6 15.485c-.88-.002-1.6-.723-1.6-1.602 0-.882.72-1.602 1.6-1.602.88.002 1.6.723 1.6 1.602 0 .88-.72 1.6-1.6 1.602z"/></svg>
                                  STEAM
                                </>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Game Plans */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {product.plans.map((plan, i) => (
                          <motion.div
                            key={i}
                            style={{ 
                              borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', 
                              background: 'rgba(255,255,255,0.03)', overflow: 'hidden',
                              display: 'flex', cursor: 'pointer'
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (product.status && product.status !== 'Available') return;
                              openPopup(product, plan);
                            }}
                          >
                            <div style={{ width: '4px', background: effectiveColor }} />
                            <div style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                              <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: 'var(--text)' }}>{plan.label}</h4>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: `${effectiveColor}15`, color: effectiveColor, border: `1px solid ${effectiveColor}60`, whiteSpace: 'nowrap', fontWeight: 'bold' }}>{plan.duration}</span>
                                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: `${effectiveColor}15`, color: effectiveColor, border: `1px solid ${effectiveColor}60`, whiteSpace: 'nowrap', fontWeight: 'bold' }}>PC Game Seat Access</span>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ 
                                  fontSize: '1.6rem', 
                                  fontWeight: 700, 
                                  letterSpacing: '-0.5px',
                                  color: effectiveColor,
                                  textShadow: `0 2px 12px ${effectiveColor}30`
                                }}>{(plan.price || '').startsWith('₹') ? plan.price : '₹' + (plan.price || '')}</div>
                                <button style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', background: '#2f3136', border: '1px solid #4a4d55', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                  Buy
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }

                return (
                <motion.div
                  key={product._id || product.id}
                  layout
                  id={`card-${product._id || product.id}`}
                  className="ott-card"
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ 
                    '--card-accent': effectiveColor,
                    border: `1px solid ${effectiveColor}60`,
                    background: 'var(--card)',
                    boxShadow: `0 0 15px ${effectiveColor}15, inset 0 0 15px ${effectiveColor}10`
                  }}
                  whileHover={{ y: -8, scale: 1.015, boxShadow: `0 0 0 1px ${effectiveColor}88, 0 28px 60px -12px ${effectiveColor}44`, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                  whileTap={{ scale: 0.97, y: 0 }}
                >
                  {/* Card Header */}
                  <div className="card-header" style={{ alignItems: isGamingCategory(product.category) ? 'flex-start' : 'center', gap: '0.85rem' }}>
                    <div
                      className="card-logo-wrap"
                      style={{ 
                        background: `${effectiveColor}18`, 
                        border: `1px solid ${effectiveColor}30`,
                        width: isGamingCategory(product.category) ? '65px' : '52px',
                        height: isGamingCategory(product.category) ? '86px' : '52px',
                        borderRadius: isGamingCategory(product.category) ? '10px' : '14px',
                        boxShadow: isGamingCategory(product.category) ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {(() => {
                        const isGaming = isGamingCategory(product.category);
                        const imgUrl = isGaming ? (product.customIcon || product.plans?.[0]?.image || getGameIcon(product.name) || getFavicon(product.name)) : (product.customIcon || getFavicon(product.name));
                        if (imgErr[product.name] || !imgUrl) {
                          return renderPlaceholder(product.name, isGaming, effectiveColor);
                        }
                        return (
                          <img
                            src={getProxiedUrl(imgUrl)}
                            alt={product.name}
                            style={{ 
                              width: isGaming ? '65px' : '44px',
                              height: isGaming ? '86px' : '44px',
                              objectFit: isGaming ? 'cover' : 'contain',
                              borderRadius: isGaming ? '10px' : '8px'
                            }}
                            onError={() => setImgErr(p => ({ ...p, [product.name]: true }))}
                          />
                        );
                      })()}
                    </div>
                    <div className="card-title-area">
                      <div 
                        className="card-name"
                        style={{
                          whiteSpace: isGamingCategory(product.category) ? 'normal' : 'nowrap',
                          lineHeight: isGamingCategory(product.category) ? '1.2' : 'inherit',
                          fontSize: isGamingCategory(product.category) ? '1.02rem' : '1.1rem'
                        }}
                      >
                        {product.name}
                        {product.status && product.status !== 'Available' && (
                          <span className="status-badge-inline" style={{ 
                            background: product.status === 'Coming Soon' ? '#fbbf2422' : '#ef444422',
                            color: product.status === 'Coming Soon' ? '#fbbf24' : '#ef4444',
                            border: `1px solid ${product.status === 'Coming Soon' ? '#fbbf2444' : '#ef444444'}`
                          }}>
                            {product.status}
                          </span>
                        )}
                      </div>
                      <div className="card-desc" style={{ marginTop: isGamingCategory(product.category) ? '0.2rem' : '0' }}>
                        {product.description || (isGamingCategory(product.category) ? 'Offline PC Access.' : '')}
                      </div>
                    </div>
                    {(() => {
                      const isEpicGame = (product.customIcon && (product.customIcon.includes('lutris') || product.customIcon.includes('igdb') || product.customIcon.includes('epicgames') || product.customIcon.includes('epic'))) || (product.name && product.name.toLowerCase().includes('epic'));
                      if (isGamingCategory(product.category)) {
                         return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '0.2rem 0.5rem', borderRadius: '50px', border: `1px solid ${effectiveColor}40`, background: `${effectiveColor}15`, fontSize: '0.65rem', fontWeight: 700, color: effectiveColor, whiteSpace: 'nowrap', letterSpacing: '0.5px', alignSelf: 'flex-start', marginTop: '2px' }}>
                              {isEpicGame ? (
                                <>
                                  <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 0L1.75 3v13.5L12 24l10.25-7.5V3L12 0zm7.25 15.5l-7.25 5.3-7.25-5.3V5.5l7.25-2.1 7.25 2.1v10z"/></svg>
                                  EPIC
                                </>
                              ) : (
                                <>
                                  <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 .002C5.378.002.001 5.378.001 12c0 5.485 3.68 10.113 8.745 11.583l1.834-2.617c-.12-.047-.234-.1-.34-.17a1.996 1.996 0 0 1-1.042-2.196l-3.238-1.57a3.468 3.468 0 0 1-.365-2.072 3.486 3.486 0 1 1 5.568-1.393l3.187 1.545a1.986 1.986 0 0 1 2.894 1.13c.287.97.027 2.016-.677 2.723l1.833 2.616c5.064-1.47 8.745-6.098 8.745-11.583 0-6.622-5.377-11.998-12-11.998zm-7.6 15.485c-.88-.002-1.6-.723-1.6-1.602 0-.882.72-1.602 1.6-1.602.88.002 1.6.723 1.6 1.602 0 .88-.72 1.6-1.6 1.602z"/></svg>
                                  STEAM
                                </>
                              )}
                            </div>
                         );
                      }
                      return (
                        <span
                          className="card-badge"
                          style={{ background: `${effectiveColor}18`, color: effectiveColor, border: `1px solid ${effectiveColor}30` }}
                        >
                          {product.category ? product.category.toUpperCase() : 'STREAMING'}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Plans */}
                  <motion.div
                    className="plans-list"
                    initial="hidden"
                    animate="visible"
                  >
                    {product.plans.map((plan, i) => {
                      const gameIcon = (isGamingCategory(product.category) || plan.image) ? (plan.image || getGameIcon(plan.label) || product.customIcon || getGameIcon(product.name) || getFavicon(product.name)) : null;
                      return (
                        <motion.div
                          key={i}
                          custom={i}
                          variants={planRowVariants}
                          className="plan-row"
                          style={{ background: `linear-gradient(90deg, ${effectiveColor}15 0%, transparent 100%)`, borderLeft: `3px solid ${effectiveColor}` }}
                          whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.2)', transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (product.status && product.status !== 'Available') return;
                            openPopup(product, plan);
                          }}
                        >
                          {gameIcon && (
                            <img 
                              src={getProxiedUrl(gameIcon)} 
                              className={`plan-game-icon ${isGamingCategory(product.category) ? 'gaming' : 'ott'}`} 
                              alt={plan.label} 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: 0, paddingRight: '10px' }}>
                            <span className="plan-row-label" style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.2' }}>{plan.label}</span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${effectiveColor}20`, color: effectiveColor, border: `1px solid ${effectiveColor}40`, whiteSpace: 'nowrap' }}>
                                {plan.duration}
                              </span>
                              {(!gameIcon && plan.quality && plan.quality.toLowerCase() !== plan.label.toLowerCase()) && (
                                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
                                  {plan.quality}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                            <span className="plan-row-price" style={{ 
                                color: effectiveColor,
                                fontWeight: '900', 
                                fontSize: '1.15rem', 
                                letterSpacing: '0.5px',
                                textShadow: `0 2px 10px ${effectiveColor}30`
                              }}>{(plan.price || '').startsWith('₹') ? plan.price : '₹' + (plan.price || '')}</span>
                            <motion.span
                              className={`plan-row-buy ${product.status && product.status !== 'Available' ? 'disabled' : ''}`}
                              style={{ border: `1px solid ${effectiveColor}50`, color: effectiveColor }}
                              whileHover={product.status === 'Available' ? { scale: 1.05, backgroundColor: `${effectiveColor}30`, borderColor: effectiveColor, boxShadow: `0 0 10px ${effectiveColor}40` } : {}}
                            >
                              {product.status && product.status !== 'Available' ? product.status : 'Buy'}
                            </motion.span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              );})}
            </AnimatePresence>

            {!loading && filtered.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <p>No results found for &ldquo;{searchTerm}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="features-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
            >
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="testimonials-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          What Our Customers Say
        </motion.h2>
        <div className="testimonials-grid">
          {[
            { name: 'Rahul Sharma', role: 'Verified Buyer', text: 'Amazing service! Got my Netflix login details within 2 minutes of payment. Highly recommended!', initial: 'R' },
            { name: 'Anjali Gupta', role: 'Professional Gamer', text: 'Been buying Steam seat access from StreamBazaar for 6 months now. Uptime is 100% and support is great.', initial: 'A' },
            { name: 'Vikram Singh', role: 'OTT Enthusiast', text: 'Cheapest prices in India! I saved over ₹5000 this year on my subscriptions using this site.', initial: 'V' }
          ].map((t, i) => (
            <motion.div 
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="testimonial-stars">
                {[...Array(5)].map((_, j) => <CheckCircle2 key={j} size={14} />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-user">
                <div className="testimonial-avatar">{t.initial}</div>
                <div className="testimonial-info">
                  <h5>{t.name}</h5>
                  <p>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── POLICIES & HELP FAQs ───────────────────────────────── */}
      <section className="policies-help-section" id="help">
        {/* Left Column: FAQs Accordion */}
        <div className="help-col">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Help & FAQs
          </motion.h2>
          <div className="faq-list">
            {[
              {
                q: "How does StreamBazaar seat access work?",
                a: "StreamBazaar provides premium, shared, or individual seat access. You are assigned a private profile under a secure parent account, allowing you to stream in full 4K UHD or access gaming seats at up to 90% cheaper prices than retail plans."
              },
              {
                q: "Will I get instant delivery after payment?",
                a: "Yes! Our Telegram storefront automatically verifies checkouts, sending your credentials and profile login instructions securely within 2 to 5 minutes."
              },
              {
                q: "Can I log in on multiple devices simultaneously?",
                a: "Our gaming and streaming plans are locked to exactly 1 active device seat to maintain account stability and prevent suspension. Please check out only on the device you intend to use."
              },
              {
                q: "What if the credentials or login details stop working?",
                a: "No worries! All plans come with our 100% replacement guarantee. Simply reach out to live support on Telegram, and we will replace or repair your credentials immediately."
              }
            ].map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-trigger"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      className="faq-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Policies */}
        <div className="policies-col">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Refund & Replacement Policy
          </motion.h2>
          
          <div className="policy-card">
            <h4><CheckCircle2 size={18} style={{ color: '#22c55e' }} /> Refund Eligible Conditions</h4>
            <ul className="policy-list">
              <li>OTT platform issues (server-side)</li>
              <li>Invalid or non-working account credentials</li>
              <li>Login issues caused by our service</li>
              <li>Wrong ID / password delivered</li>
              <li>Quantity mismatch in order</li>
            </ul>
          </div>

          <div className="policy-card">
            <h4><RefreshCw size={18} style={{ color: '#3b82f6' }} /> Replacement Policy</h4>
            <ul className="policy-list">
              <li>For any valid issue, a new account or new ID/password replacement will be provided.</li>
              <li>Replacement will be processed only after verification by our team.</li>
              <li>Refund will only be issued if replacement is not possible.</li>
            </ul>
          </div>

          <div className="policy-card">
            <h4><Ban size={18} style={{ color: '#ef4444' }} /> Non-Refundable Conditions</h4>
            <ul className="policy-list">
              <li>Customer mistakes (e.g., wrong plan selected)</li>
              <li>Account sharing or misuse by buyer</li>
              <li>Device compatibility problems</li>
              <li>Change of mind after purchase</li>
            </ul>
          </div>

          <div className="policy-card">
            <h4><Camera size={18} style={{ color: '#f59e0b' }} /> Proof & Verification</h4>
            <p>
              Customers must provide screenshots or relevant proof of the issue for verification before any refund or replacement is processed. Our support team may request additional details via Telegram.
            </p>
          </div>

          <div className="policy-card">
            <h4><Clock size={18} style={{ color: '#a855f7' }} /> Processing Time</h4>
            <p>
              Approved refunds will be processed within <strong>3–7 working days</strong>. Replacements are typically provided within 2–24 hours after verification.
            </p>
          </div>

          <div className="policy-card">
            <h4><Shield size={18} style={{ color: 'var(--color-primary)' }} /> 1-Device Seat Limit Rules</h4>
            <p>
              Each checkout grants access for precisely 1 active device seat. Sharing login details with others or logging in on multiple devices violates our security terms and leads to profile locking.
            </p>
          </div>

          <div className="policy-card">
            <h4><HeartHandshake size={18} style={{ color: 'var(--color-primary)' }} /> Safe Usage & Terms</h4>
            <p>
              Modifying the master account credentials (email, password, or billing details) is strictly prohibited. Users must log in using the assigned profile and follow the security guidelines provided upon delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer>
        <img src="/logo.png" alt="StreamBazaar" className="footer-logo" />
        <p className="footer-text">
          © {new Date().getFullYear()} StreamBazaar Store. All Rights Reserved.<br />
          Powered by <span>TrustedStreams</span>
        </p>
        <div className="footer-links">
          <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="footer-link">
            <MessageCircle size={15} /> Telegram Community
          </a>
          <a href="#" className="footer-link">
            <ShieldCheck size={15} /> Privacy Policy
          </a>
        </div>
      </footer>

      {/* ── DEVICE SELECTOR POPUP ──────────────────────────────── */}
      <AnimatePresence>
        {popup && (
          <motion.div
            className="popup-overlay"
            variants={overlayVariants}
            initial="hidden" animate="visible" exit="exit"
            onClick={() => setPopup(null)}
            style={{ perspective: 1200 }}
          >
            <motion.div
              className="popup-modal"
              variants={modalVariants}
              initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              style={{ '--popup-color': popup.product.effectiveColor }}
            >
              {/* Close */}
              <button className="popup-close" onClick={() => setPopup(null)}>
                <X size={16} />
              </button>

              {/* Header */}
              <div className="popup-header">
                {(() => {
                  const isGaming = isGamingCategory(popup.product.category);
                  const imgUrl = (isGaming || popup.plan.image) ? (popup.plan.image || getGameIcon(popup.plan.label) || popup.product.customIcon || getGameIcon(popup.product.name) || getFavicon(popup.product.name)) : (popup.product.customIcon || getFavicon(popup.product.name));
                  if (imgErr[`popup-${popup.product.name}`] || !imgUrl) {
                    return (
                      <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                        {renderPlaceholder(popup.product.name, isGaming, popup.product.effectiveColor)}
                      </div>
                    );
                  }
                  return (
                    <img
                      src={getProxiedUrl(imgUrl)}
                      alt={popup.product.name}
                      className="popup-logo"
                      onError={() => setImgErr(p => ({ ...p, [`popup-${popup.product.name}`]: true }))}
                      style={isGaming ? { width: '48px', height: '64px', objectFit: 'cover', borderRadius: '8px' } : { width: '48px', height: '48px', objectFit: 'contain' }}
                    />
                  );
                })()}
                <div>
                  <div className="popup-title">{popup.product.name}</div>
                  <div className="popup-subtitle">1 Device Seat Access</div>
                </div>
              </div>

              {/* Selected Plan */}
              <div className="popup-plan-chip">
                <strong>{popup.plan.label}</strong> {popup.plan.quality ? `· ${popup.plan.quality}` : ''} &nbsp;·&nbsp; {popup.plan.duration} &nbsp;·&nbsp;
                <strong style={{ color: popup.product.effectiveColor }}>{popup.plan.price}</strong>
              </div>

              {/* Device Selector */}
              <div className="popup-device-label">Select Your Device</div>
              <motion.div
                className="device-grid"
                style={{ gridTemplateColumns: isGamingCategory(popup.product.category) ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)' }}
                initial="hidden"
                animate="visible"
              >
                {(isGamingCategory(popup.product.category) ? [
                  { id: 'PC', label: 'PC', icon: CustomIcons.PC },
                  { id: 'Laptop', label: 'Laptop', icon: CustomIcons.Laptop },
                  { id: 'PS2', label: 'PS2', icon: CustomIcons.PlayStation },
                  { id: 'PS3', label: 'PS3', icon: CustomIcons.PlayStation },
                  { id: 'PS4', label: 'PS4', icon: CustomIcons.PlayStation },
                  { id: 'PS5', label: 'PS5', icon: CustomIcons.PlayStation },
                  { id: 'Xbox', label: 'Xbox', icon: CustomIcons.Xbox },
                  { id: 'Xbox S', label: 'Xbox S', icon: CustomIcons.Xbox },
                  { id: 'Xbox X', label: 'Xbox X', icon: CustomIcons.Xbox }
                ] : [
                  { id: 'TV', label: 'TV', icon: CustomIcons.TV },
                  { id: 'PC', label: 'PC', icon: CustomIcons.PC },
                  { id: 'iOS', label: 'iOS', icon: CustomIcons.Apple },
                  { id: 'Android', label: 'Android', icon: CustomIcons.Android }
                ]).map((d, i) => {
                  const supportedRaw = popup.plan.supportedDevices || (popup.plan.device ? [popup.plan.device] : (isGamingCategory(popup.product.category) ? ['PC', 'Laptop', 'PS2', 'PS3', 'PS4', 'PS5', 'Xbox', 'Xbox S', 'Xbox X'] : ['TV', 'PC', 'iOS', 'Android']));
                  const supported = supportedRaw.map(x => x ? x.toLowerCase() : '');
                  const available = supported.includes(d.id.toLowerCase());
                  return (

                  <motion.button
                    key={d.id}
                    custom={i}
                    variants={deviceItemVariants}
                    className={`device-btn ${popup.device === d.id ? 'selected' : ''} ${available ? 'available' : 'out-of-stock'}`}
                    whileHover={available ? { scale: 1.08, y: -3, boxShadow: `0 8px 24px rgba(0,0,0,0.3)` } : {}}
                    whileTap={available ? { scale: 0.92 } : {}}
                    onClick={() => { if(available) setPopup(prev => ({ ...prev, device: d.id })) }}
                  >
                    <motion.span
                      className="device-icon"
                      animate={popup.device === d.id ? { rotate: [0, -8, 8, 0], scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.35 }}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem' }}
                    >
                      {d.icon()}
                    </motion.span>
                    {d.label}
                    {available ? (
                      <span className="device-status-badge available">Available</span>
                    ) : (
                      <span className="device-status-badge oos">Out of Stock</span>
                    )}
                  </motion.button>
                );
              })}
              </motion.div>



              {/* Summary */}
              <div className="popup-summary">
                <div className="summary-item">
                  <label>Access</label>
                  <span>1 Device</span>
                </div>
                <div className="summary-item">
                  <label>Device</label>
                  <span>{popup.device || '—'}</span>
                </div>
                <div className="summary-item">
                  <label>Duration</label>
                  <span>{popup.plan.duration}</span>
                </div>
                <div className="summary-item">
                  <label>Plan Type</label>
                  <span>{popup.plan.type}</span>
                </div>
                <div className="summary-price" style={{ gridColumn: '1 / -1' }}>
                  <label>Total Price</label>
                  <span style={{ color: popup.product.effectiveColor }}>{popup.plan.price}</span>
                </div>
              </div>

              {/* Purchase Options */}
              <motion.button
                className={`popup-buy-btn ${!popup.device ? 'disabled' : ''}`}
                whileHover={popup.device ? { scale: 1.02 } : {}}
                whileTap={popup.device ? { scale: 0.98 } : {}}
                onClick={handleBuy}
                style={{ width: '100%', marginTop: '1.25rem' }}
              >
                <MessageCircle size={16} />
                {popup.device ? 'Buy on Telegram' : 'Select a Device'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* ── STREAMBOT AI CHAT ─────────────────────────────────── */}
      <ChatWidget />
      <FomoToast />
    </div>
  );
}
