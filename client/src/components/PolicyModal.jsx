import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POLICIES = [
  {
    id: 'warranty',
    title: '🛡️ 100% Replacement Warranty Policy',
    badge: 'ZERO-RISK GUARANTEE',
    subtitle: 'Comprehensive protection throughout your entire subscription duration',
    content: (
      <div>
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <div style={{ color: '#34d399', fontWeight: 800, fontSize: '14px' }}>Full-Term Warranty Commitment</div>
          </div>
          <p style={{ color: '#d1fae5', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Every subscription purchased on StreamBazaar comes with a 100% replacement warranty. If your credentials face any interruption, login error, or provider password reset, our dedicated human support issues a verified replacement within <strong>5 to 15 minutes</strong>.
          </p>
        </div>

        <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 800, marginBottom: '10px' }}>What is 100% Covered Under Warranty:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
          {[
            { icon: '🔑', title: 'Provider Password Resets', desc: 'Instant fresh credentials if streaming service resets password.' },
            { icon: '🔒', title: 'PIN / Profile Lockouts', desc: 'Rapid PIN unlock and profile restoration.' },
            { icon: '⏳', title: 'Full Duration Access', desc: '100% active access guaranteed for 1, 3, 6, or 12 months.' },
            { icon: '🚀', title: 'Speedy SLA', desc: 'Replacements provided within 5 to 15 minutes on Telegram.' }
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{item.icon}</div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{item.title}</div>
              <div style={{ color: '#94a3b8', fontSize: '11.5px', lineHeight: '1.4' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>How to Claim a Replacement:</h4>
        <ol style={{ color: '#cbd5e1', fontSize: '12.5px', lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
          <li>Open our official Telegram support: <strong>@owner_trusted_streams</strong>.</li>
          <li>Share your Order ID or registered purchase details.</li>
          <li>Our verification agent tests the credentials and delivers your replacement within minutes.</li>
        </ol>
      </div>
    )
  },
  {
    id: 'delivery',
    title: '⚡ Instant Delivery & Activation Policy',
    badge: 'AUTOMATED DISPATCH',
    subtitle: 'Step-by-step walkthrough of how your credentials are delivered',
    content: (
      <div>
        <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '14px' }}>Instant Automated Ticket Generation</div>
          </div>
          <p style={{ color: '#f3e8ff', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            When you tap <strong>"Buy on Telegram"</strong> on any product card, an automated order ticket is constructed containing the service title, duration, price, and selected active device.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {[
            { step: 'Step 1', title: 'Payment Verification', desc: 'Pay safely using Google Pay, PhonePe, Paytm UPI, QR Code, Card, or Crypto USDT.' },
            { step: 'Step 2', title: 'Receive Credentials', desc: 'Your designated Email/ID and Password arrive immediately in the chat.' },
            { step: 'Step 3', title: 'Profile & PIN Login', desc: 'Select your assigned private profile, enter the 4-digit PIN, and start enjoying 4K streaming or gaming.' }
          ].map((st, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '12px 14px', alignItems: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
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
    title: '🔒 Privacy, Security & Data Protection',
    badge: '100% PRIVATE',
    subtitle: 'Zero data harvesting, encrypted chats, and strict profile isolation',
    content: (
      <div>
        <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>🔒</span>
            <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '14px' }}>Your Personal Privacy is Paramount</div>
          </div>
          <p style={{ color: '#dbeafe', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            StreamBazaar operates on privacy-first architecture. We never collect, store, or sell banking details, debit/credit cards, or phone contacts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>🛡️ Profile PIN Lock</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4' }}>Each shared profile is protected with a personal 4-digit PIN so no one else can view your personal watchlist or browsing history.</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>🚫 Zero Auto-Debit Traps</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4' }}>No sneaky recurring subscriptions. You only pay for the exact plan duration you choose.</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>🔐 End-to-End Encryption</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4' }}>All purchase discussions take place via secure Telegram protocols with zero third-party telemetry.</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'faq',
    title: '❓ Frequently Asked Questions & Usage Rules',
    badge: 'QUICK HELP',
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
  },
  {
    id: 'terms',
    title: '📜 Terms of Service & Customer Conduct',
    badge: 'LEGAL & FAIR USE',
    subtitle: 'Fair use policies ensuring account longevity and stability for everyone',
    content: (
      <div>
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>📜</span>
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '14px' }}>Fair Usage Guidelines</div>
          </div>
          <p style={{ color: '#fef3c7', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            To ensure 100% uptime for all community members, please follow our simple guidelines:
          </p>
        </div>

        <ul style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
          <li>Do not attempt to change the account master password or recovery email on shared profiles.</li>
          <li>Only stream on your designated private profile and do not tamper with other profiles.</li>
          <li>For Steam/PlayStation games, play in online or offline mode as specified in your setup guide.</li>
          <li>Violation of fair-use rules will void warranty coverage.</li>
        </ul>
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
        initial={{ scale: 0.93, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '94%' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '19px', fontWeight: 900, color: '#fff' }}>
                Stream<span style={{ color: '#a855f7' }}>Bazaar</span> Policies
              </span>
              <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                100% VERIFIED
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              Official replacement warranty, instant dispatch rules, and customer privacy terms
            </div>
          </div>
          <button
            onClick={onClose}
            className="sb-modal-close-btn"
            style={{ width: '32px', height: '32px', fontSize: '18px' }}
            title="Close Policy"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="sb-policy-tabs">
          {POLICIES.map(p => (
            <button
              key={p.id}
              className={`sb-policy-tab-btn ${activeTab === p.id ? 'active' : ''}`}
              onClick={() => setActiveTab(p.id)}
            >
              {p.title.split(' ')[0]} {p.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ minHeight: '260px', padding: '16px 0 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0 }}>
                {current.title}
              </h3>
              <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: 600 }}>
                {current.subtitle}
              </span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', background: 'rgba(255, 255, 255, 0.05)', padding: '3px 8px', borderRadius: '6px' }}>
              {current.badge}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {current.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Contact */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Official Support:</span>
            <code style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '6px', color: '#c084fc', fontSize: '11.5px', fontWeight: 700 }}>
              @owner_trusted_streams
            </code>
            <button
              onClick={handleCopySupport}
              style={{ background: 'none', border: 'none', color: copied ? '#34d399' : '#888', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
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
              fontSize: '12px',
              fontWeight: 800,
              padding: '8px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)'
            }}
          >
            💬 Open Telegram Support
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
