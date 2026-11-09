import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POLICIES = [
  {
    id: 'warranty',
    title: '100% Replacement Warranty Policy',
    icon: '🛡️',
    badge: 'ZERO-RISK GUARANTEE',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeColor: '#34d399',
    badgeBorder: 'rgba(16, 185, 129, 0.35)',
    subtitle: 'Comprehensive full-term protection and replacement terms',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Commitment Box */}
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.08)', 
          border: '1px solid rgba(16, 185, 129, 0.28)', 
          borderRadius: '16px', 
          padding: '16px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div style={{ color: '#34d399', fontWeight: 800, fontSize: '14.5px' }}>
              Full-Term Warranty Commitment
            </div>
          </div>
          <p style={{ color: '#d1fae5', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Every subscription purchased on StreamBazaar comes with a <strong>100% replacement warranty</strong> throughout its full duration. If your credentials ever encounter any login issue, password reset, or interruption, our dedicated support delivers a verified replacement within <strong>5 to 15 minutes</strong> on Telegram.
          </p>
        </div>

        {/* 100% Covered Grid */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '13.5px', fontWeight: 800, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✅</span> What is 100% Covered Under Warranty:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { icon: '🔑', title: 'Provider Password Resets', desc: 'Instant fresh credentials if official streaming service resets password.' },
              { icon: '🔒', title: 'PIN / Profile Lockouts', desc: 'Rapid PIN unlock and private profile restoration.' },
              { icon: '⏳', title: 'Full Duration Access', desc: 'Active access guaranteed for the entire 1, 3, 6, or 12 months duration.' },
              { icon: '🚀', title: 'Speedy SLA (5-15 Mins)', desc: 'Fast priority replacement dispatched via Telegram support.' }
            ].map((item, i) => (
              <div key={i} style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '12px' 
              }}>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                <div style={{ color: '#fff', fontSize: '12.5px', fontWeight: 700, marginBottom: '2px' }}>{item.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '11.5px', lineHeight: '1.45' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Warranty Terms & Conditions Box */}
        <div style={{ 
          background: 'rgba(245, 158, 11, 0.07)', 
          border: '1px solid rgba(245, 158, 11, 0.22)', 
          borderRadius: '14px', 
          padding: '14px 16px' 
        }}>
          <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span>⚠️</span> Warranty Terms &amp; Conditions (Fair Use):
          </div>
          <ul style={{ color: '#fef3c7', fontSize: '12px', lineHeight: '1.65', paddingLeft: '18px', margin: 0 }}>
            <li>Do not change the master account email or recovery settings on shared profiles.</li>
            <li>Stream strictly on your designated 1-device active screen at a time to prevent provider flag.</li>
            <li>For games, follow the specified online/offline guidance provided in your setup guide.</li>
            <li>Following these fair-use terms guarantees immediate replacement support.</li>
          </ul>
        </div>

        {/* How to Claim Replacement */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '13px', fontWeight: 800, margin: '0 0 8px' }}>
            ⚡ How to Claim a Free Replacement:
          </h4>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.06)', 
            borderRadius: '12px', 
            padding: '12px 14px' 
          }}>
            <ol style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: '1.7', paddingLeft: '18px', margin: 0 }}>
              <li>Open official Telegram support: <strong style={{ color: '#c084fc' }}>@owner_trusted_streams</strong>.</li>
              <li>Share your Order ID or registered purchase details.</li>
              <li>Our verification agent tests the credentials and delivers fresh access within minutes.</li>
            </ol>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'delivery',
    title: 'Instant Delivery & Activation Policy',
    icon: '⚡',
    badge: 'FAST DISPATCH (< 2 MINS)',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeColor: '#c084fc',
    badgeBorder: 'rgba(168, 85, 247, 0.35)',
    subtitle: 'Step-by-step walkthrough of how your credentials are delivered',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.28)', borderRadius: '16px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '14.5px' }}>Instant Automated Ticket Generation</div>
          </div>
          <p style={{ color: '#f3e8ff', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            When you tap <strong>"Buy on Telegram"</strong> on any product card, an automated order ticket is constructed containing the service title, duration, price, and selected active device.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { step: 'Step 1', title: 'Payment Verification', desc: 'Pay safely using Google Pay, PhonePe, Paytm UPI, QR Code, Card, or Crypto USDT.' },
            { step: 'Step 2', title: 'Receive Credentials', desc: 'Your designated Email/ID and Password arrive immediately in the Telegram chat.' },
            { step: 'Step 3', title: 'Profile & PIN Login', desc: 'Select your assigned private profile, enter the 4-digit PIN, and start enjoying 4K streaming or gaming.' }
          ].map((st, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px 14px', alignItems: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '5px 10px', borderRadius: '7px', whiteSpace: 'nowrap' }}>
                {st.step}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>{st.title}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>{st.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'privacy',
    title: '100% Privacy, Security & Data Protection',
    icon: '🔒',
    badge: '100% PRIVATE',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeColor: '#60a5fa',
    badgeBorder: 'rgba(59, 130, 246, 0.35)',
    subtitle: 'Zero data harvesting, encrypted chats, and strict profile isolation',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.28)', borderRadius: '16px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span>
            <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '14.5px' }}>Your Personal Privacy is Paramount</div>
          </div>
          <p style={{ color: '#dbeafe', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            StreamBazaar operates on privacy-first architecture. We never collect, store, or sell banking details, debit/credit cards, or phone contacts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>🛡️ Profile PIN Lock</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>Each shared profile is protected with a personal 4-digit PIN so no one else can view your personal watchlist or browsing history.</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>🚫 Zero Auto-Debit Traps</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>No sneaky recurring subscriptions. You only pay for the exact plan duration you choose.</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>🔐 End-to-End Encryption</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>All purchase discussions take place via secure Telegram protocols with zero third-party telemetry.</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>💳 Zero Banking Storage</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5' }}>We never store debit or credit card details. All transactions happen through verified payment gateways.</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'FAQ & Platform Setup Guidelines',
    icon: '❓',
    badge: 'QUICK HELP',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeColor: '#fbbf24',
    badgeBorder: 'rgba(245, 158, 11, 0.35)',
    subtitle: 'Clear answers regarding multiple devices, platforms, and renewals',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { q: 'Can I use the account on multiple devices?', a: 'All StreamBazaar seats are 1-Active Screen profiles. You can install the application on your Smart TV, Mobile, and Laptop, but stream on 1 screen at a time to prevent provider suspension.' },
          { q: 'Why do Spotify and Crunchyroll not show 4K UHD?', a: 'StreamBazaar uses AI detection to match real-world specs. Spotify delivers 320kbps Hi-Res Audio, Crunchyroll streams 1080p Full HD Mega Fan anime, and OTT movies stream in 4K Ultra HD. We never give misleading specifications!' },
          { q: 'How do Steam and PlayStation games work?', a: 'You receive an authentic account with the full game in its library. You can download and play on PC, Steam Deck, PS4, PS5, or Xbox with official cloud saves and trophies.' },
          { q: 'What happens if my subscription expires?', a: 'Simply reach out to @owner_trusted_streams to renew. Your profile and watch history can be seamlessly extended.' }
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '13.5px', marginBottom: '4px' }}>{item.q}</div>
            <div style={{ color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.5' }}>{item.a}</div>
          </div>
        ))}
      </div>
    )
  }
];

export default function PolicyModal({ initialTab = 'warranty', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const current = POLICIES.find(p => p.id === activeTab) || POLICIES[0];

  const handleCopySupport = () => {
    navigator.clipboard.writeText('@owner_trusted_streams');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="sb-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sb-modal-card sb-policy-modal"
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Bar Indicator (Android / iOS feel) */}
        <div className="sb-mobile-pull-handle" />

        {/* Modal Sticky Header */}
        <div className="sb-policy-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{current.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                  {current.title}
                </h3>
                <span style={{ 
                  background: current.badgeBg, 
                  color: current.badgeColor, 
                  border: `1px solid ${current.badgeBorder}`,
                  fontSize: '9.5px', 
                  fontWeight: 800, 
                  padding: '2px 7px', 
                  borderRadius: '9999px',
                  letterSpacing: '0.04em'
                }}>
                  {current.badge}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '3px' }}>
                {current.subtitle}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="sb-modal-close-btn"
            style={{ 
              width: '34px', 
              height: '34px', 
              fontSize: '16px', 
              borderRadius: '50%',
              flexShrink: 0
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Quick Category Switcher Pill Bar */}
        <div className="sb-policy-pill-nav">
          {POLICIES.map(p => (
            <button
              key={p.id}
              className={`sb-policy-pill-item ${activeTab === p.id ? 'active' : ''}`}
              onClick={() => setActiveTab(p.id)}
            >
              <span>{p.icon}</span>
              <span>{p.id === 'warranty' ? 'Warranty' : p.id === 'delivery' ? 'Delivery' : p.id === 'privacy' ? 'Privacy' : 'FAQ'}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Policy Body */}
        <div className="sb-policy-modal-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky Footer Contact & Telegram Help */}
        <div className="sb-policy-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ fontSize: '11.5px', color: '#888' }}>Support:</span>
            <code style={{ 
              background: 'rgba(255, 255, 255, 0.06)', 
              padding: '3px 8px', 
              borderRadius: '6px', 
              color: '#c084fc', 
              fontSize: '11px', 
              fontWeight: 700 
            }}>
              @owner_trusted_streams
            </code>
            <button
              onClick={handleCopySupport}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: copied ? '#34d399' : '#94a3b8', 
                fontSize: '11px', 
                cursor: 'pointer', 
                fontWeight: 700,
                padding: '2px 4px'
              }}
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>

          <a
            href="https://t.me/owner_trusted_streams"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              color: '#fff',
              fontSize: '11.5px',
              fontWeight: 800,
              padding: '8px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.35)',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>💬</span> Telegram Help
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
