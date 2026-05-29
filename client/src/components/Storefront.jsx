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

const TELEGRAM_LINK = 'https://t.me/owner_trusted_streams';
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const DOMAINS = {
  'youtube premium': 'youtube.com',
  'youtube music': 'music.youtube.com',
  'youtube': 'youtube.com',
  'sony liv': 'sonyliv.com',
  'netflix': 'netflix.com',
  'amazon prime': 'primevideo.com',
  'hoichoi tv': 'hoichoi.tv',
  'hoichoi': 'hoichoi.tv',
  'discovery plus': 'discoveryplus.com',
  'airtel xstream': 'airtelxstream.in',
  'apple music': 'music.apple.com',
  'apple tv+': 'tv.apple.com',
  'spotify premium': 'spotify.com',
  'linkedin premium': 'linkedin.com',
  'adobe creative': 'adobe.com',
  'google one': 'one.google.com',
  'jio hotstar': 'jiohotstar.com',
  'zee5': 'zee5.com',
  'surfshark vpn': 'surfshark.com',
  'nordvpn': 'nordvpn.com',
  'steam gaming': 'store.steampowered.com',
  'playstation': 'playstation.com',
  'microsoft copilot': 'microsoft.com',
  'chatgpt plus': 'openai.com',
  'claude ai': 'claude.ai',
  'canva pro': 'canva.com',
  'picsart pro': 'picsart.com',
  'envato elements': 'elements.envato.com',
  'grok ai': 'x.ai',
  'elevenlabs': 'elevenlabs.io',
  'iptv': 'iptvsmarters.com',
  'lionsgate play': 'lionsgateplay.com',
  'crunchy roll': 'crunchyroll.com',
};

const GAME_IMGS = {
  'wwe 2k25': 'https://cdn.akamai.steamstatic.com/steam/apps/2315690/capsule_184x69.jpg',
  'forza horizon 5': 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/capsule_184x69.jpg',
  'gta v': 'https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_184x69.jpg',
  'spider-man 2': 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/capsule_184x69.jpg',
  'uncharted': 'https://cdn.akamai.steamstatic.com/steam/apps/1659420/capsule_184x69.jpg',
  'crimson desert': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&auto=format&fit=crop&q=60',
  'the last of us ii': 'https://cdn.akamai.steamstatic.com/steam/apps/1888930/capsule_184x69.jpg',
  'black myth wukong': 'https://cdn.akamai.steamstatic.com/steam/apps/2358720/capsule_184x69.jpg',
  'ghost of tsushima': 'https://cdn.akamai.steamstatic.com/steam/apps/2215430/capsule_184x69.jpg',
  'elden ring': 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/capsule_184x69.jpg',
  'resident evil': 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/capsule_184x69.jpg',
  'hogwarts legacy': 'https://cdn.akamai.steamstatic.com/steam/apps/990080/capsule_184x69.jpg',
  'god of war': 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_184x69.jpg',
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
  { id: 'Laptop',  label: 'Laptop',  emoji: '💻' },
  { id: 'PC',      label: 'PC',      emoji: '🖥️' },
  { id: 'iOS',     label: 'iOS',     emoji: '📱' },
  { id: 'Android', label: 'Android', emoji: '🤖' },
];

// Gaming products (Steam / PlayStation) only support PC devices
const DEVICES_GAMING = [
  { id: 'Laptop', label: 'Laptop', emoji: '💻' },
  { id: 'PC',     label: 'PC',     emoji: '🖥️' },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Delivery',   desc: 'Get your login credentials within minutes of placing your order.' },
  { icon: '🔒', title: 'Secure Seat Access', desc: 'Private profile on shared accounts — your data stays safe.' },
  { icon: '📱', title: '1 Device Access',    desc: 'Works on Laptop, PC, iOS and Android — your choice.' },
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
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};
const modalVariants = {
  hidden:  { opacity: 0, scale: 0.82, y: 36, rotateX: 8 },
  visible: { opacity: 1, scale: 1,    y: 0,  rotateX: 0, transition: { type: 'spring', stiffness: 380, damping: 26, mass: 0.8 } },
  exit:    { opacity: 0, scale: 0.88, y: 20, transition: { duration: 0.16, ease: 'easeIn' } },
};
const deviceItemVariants = {
  hidden:  { opacity: 0, y: 14, scale: 0.85 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 22, delay: i * 0.06 } }),
};
const cardVariants = {
  hidden:  { opacity: 0, y: 28, scale: 0.95 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.04 } }),
  exit:    { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};
const planRowVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.28, delay: i * 0.05, ease: 'easeOut' } }),
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

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const cacheBuster = Date.now(); // 100% instant cache bypass
    fetch(`${API_BASE}/api/plans?v=${cacheBuster}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setPlans(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleKey = useCallback((e) => { if (e.key === 'Escape') setPopup(null); }, []);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const filtered = plans.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat    = activeCategory === 'all' || p.category === activeCategory;
    return matchSearch && matchCat;
  }).sort((a, b) => {
    // Gaming cards always appear last
    if (a.category === 'Gaming' && b.category !== 'Gaming') return 1;
    if (a.category !== 'Gaming' && b.category === 'Gaming') return -1;
    return 0;
  });

  const openPopup = (product, plan) => {
    setPopup({ product, plan, device: null });
  };

  const handleBuy = async () => {
    if (!popup || !popup.device) return;
    const { product, plan, device } = popup;
    
    try {
      await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product.name,
          plan: plan.label,
          device: device,
          price: plan.price
        })
      });
    } catch (err) {
      console.error('Failed to log actual checkout click:', err);
    }

    const msg = `Hi! I want to buy ${product.name} — ${plan.label} — Device: ${device} — Price: ${plan.price}`;
    window.open(`${TELEGRAM_LINK}?text=${encodeURIComponent(msg)}`, '_blank');
    setPopup(null);
  };

  const getFavicon = name => {
    let domain = DOMAINS[name.toLowerCase()];
    if (!domain) {
      // Smart domain fallback based on name
      domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    }
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
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
                filtered.map(product => (
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
                     <img src={getFavicon(product.name)} className="search-result-logo" alt={product.name} />
                     <div className="search-result-info">
                       <div className="search-result-name">{product.name}</div>
                       <div className="search-result-price">Starts at {product.plans[0].price}</div>
                     </div>
                   </div>
                ))
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
              {filtered.map((product, idx) => (
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
                  style={{ '--card-accent': product.color }}
                  whileHover={{ y: -6, boxShadow: `0 0 0 1px ${product.color}55, 0 24px 56px -10px ${product.color}33`, transition: { duration: 0.2 } }}
                >
                  {/* Card Header */}
                  <div className="card-header">
                    <div
                      className="card-logo-wrap"
                      style={{ background: `${product.color}18`, border: `1px solid ${product.color}30` }}
                    >
                      {imgErr[product.name] ? (
                        <div style={{ fontSize: '1.5rem' }}>🎬</div>
                      ) : (
                        <img
                          src={getFavicon(product.name)}
                          alt={product.name}
                          className="card-logo"
                          onError={() => setImgErr(p => ({ ...p, [product.name]: true }))}
                        />
                      )}
                    </div>
                    <div className="card-title-area">
                      <div className="card-name">
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
                      <div className="card-desc">{product.description}</div>
                    </div>
                    <span
                      className="card-badge"
                      style={{ background: `${product.color}18`, color: product.color, border: `1px solid ${product.color}30` }}
                    >
                      {product.category}
                    </span>
                  </div>

                  {/* Plans */}
                  <motion.div
                    className="plans-list"
                    initial="hidden"
                    animate="visible"
                  >
                    {product.plans.map((plan, i) => {
                      const gameIcon = product.category === 'Gaming' ? getGameIcon(plan.label) : null;
                      return (
                        <motion.div
                          key={i}
                          custom={i}
                          variants={planRowVariants}
                          className="plan-row"
                          style={{ background: `linear-gradient(90deg, ${product.color}15 0%, transparent 100%)`, borderLeft: `3px solid ${product.color}` }}
                          whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.2)', transition: { duration: 0.15 } }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            if (product.status && product.status !== 'Available') return;
                            openPopup(product, plan);
                          }}
                        >
                          {gameIcon && (
                            <img src={gameIcon} className="plan-game-icon" alt={plan.label} />
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: 0, paddingRight: '10px' }}>
                            <span className="plan-row-label" style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.2' }}>{plan.label}</span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', backgroundColor: `${product.color}20`, color: product.color, border: `1px solid ${product.color}40`, whiteSpace: 'nowrap' }}>
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
                            <span className="plan-row-price" style={{ color: product.color, fontWeight: 'bold', fontSize: '1.05rem', letterSpacing: '0.5px' }}>{plan.price}</span>
                            <motion.span
                              className={`plan-row-buy ${product.status && product.status !== 'Available' ? 'disabled' : ''}`}
                              whileHover={product.status === 'Available' ? { scale: 1.1, backgroundColor: `${product.color}40`, borderColor: product.color } : {}}
                            >
                              {product.status && product.status !== 'Available' ? product.status : 'Buy'}
                            </motion.span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ))}
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
              style={{ '--popup-color': popup.product.color }}
            >
              {/* Close */}
              <button className="popup-close" onClick={() => setPopup(null)}>
                <X size={16} />
              </button>

              {/* Header */}
              <div className="popup-header">
                <img
                  src={popup.product.category === 'Gaming' ? (getGameIcon(popup.plan.label) || getFavicon(popup.product.name)) : getFavicon(popup.product.name)}
                  alt={popup.product.name}
                  className="popup-logo"
                  onError={e => { e.target.style.display = 'none'; }}
                  style={popup.product.category === 'Gaming' ? { width: '80px', height: '36px', objectFit: 'cover', borderRadius: '6px' } : {}}
                />
                <div>
                  <div className="popup-title">{popup.product.name}</div>
                  <div className="popup-subtitle">1 Device Seat Access</div>
                </div>
              </div>

              {/* Selected Plan */}
              <div className="popup-plan-chip">
                <strong>{popup.plan.label}</strong> {popup.plan.quality ? `· ${popup.plan.quality}` : ''} &nbsp;·&nbsp; {popup.plan.duration} &nbsp;·&nbsp;
                <strong style={{ color: popup.product.color }}>{popup.plan.price}</strong>
              </div>

              {/* Device Selector */}
              <div className="popup-device-label">Select Your Device</div>
              <motion.div
                className="device-grid"
                style={{ gridTemplateColumns: popup.product.category === 'Gaming' ? 'repeat(2,1fr)' : 'repeat(4,1fr)' }}
                initial="hidden"
                animate="visible"
              >
                {(popup.product.category === 'Gaming' ? DEVICES_GAMING : DEVICES).map((d, i) => (
                  <motion.button
                    key={d.id}
                    custom={i}
                    variants={deviceItemVariants}
                    className={`device-btn ${popup.device === d.id ? 'selected' : ''}`}
                    whileHover={{ scale: 1.08, y: -3, boxShadow: `0 8px 24px rgba(0,0,0,0.3)` }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPopup(prev => ({ ...prev, device: d.id }))}
                  >
                    <motion.span
                      className="device-icon"
                      animate={popup.device === d.id ? { rotate: [0, -8, 8, 0], scale: [1, 1.25, 1] } : {}}
                      transition={{ duration: 0.35 }}
                    >{d.emoji}</motion.span>
                    {d.label}
                  </motion.button>
                ))}
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
                  <span style={{ color: popup.product.color }}>{popup.plan.price}</span>
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
