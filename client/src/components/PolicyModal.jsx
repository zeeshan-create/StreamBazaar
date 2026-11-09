import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const POLICIES = [
  {
    id: 'accounts',
    tabLabel: 'Accounts',
    title: 'Accounts',
    icon: '👤',
    badge: 'SHARED PROFILE MODEL',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeColor: '#c084fc',
    badgeBorder: 'rgba(168, 85, 247, 0.35)',
    subtitle: 'What you get with your subscription',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Intro */}
        <div style={{
          background: 'rgba(168, 85, 247, 0.08)',
          border: '1px solid rgba(168, 85, 247, 0.28)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>🔑</span>
            <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '14.5px' }}>
              Account Architecture
            </div>
          </div>
          <p style={{ color: '#f3e8ff', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            You get your own profile on a shared account. It is not a private account.
          </p>
        </div>

        {/* Group "What you receive" */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> What you receive:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Your own profile:</strong> A separate profile inside a shared account.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Login details:</strong> Email/ID and password, sent to you on Telegram.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Profile PIN:</strong> Your profile has its own 4-digit PIN.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Plan quality:</strong> Shown on each product card: [HD/4K].</div>
            </div>
          </div>
        </div>

        {/* Group "Please do not" */}
        <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#f87171', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠️</span> Please do not:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fecaca', lineHeight: '1.55' }}>
              <span style={{ color: '#ef4444', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Change the master login:</strong> Do not change the account email, password or recovery settings.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fecaca', lineHeight: '1.55' }}>
              <span style={{ color: '#ef4444', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Touch other profiles:</strong> Other profiles belong to other customers.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fecaca', lineHeight: '1.55' }}>
              <span style={{ color: '#ef4444', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Share your login:</strong> Sharing can get the account blocked for everyone.</div>
            </div>
          </div>
        </div>

        {/* Group "Good to know" */}
        <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>💡</span> Good to know:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#e0f2fe', lineHeight: '1.55' }}>
              <span style={{ color: '#38bdf8', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Access can end early:</strong> The streaming provider can block an account at any time. If that happens, we replace it.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#e0f2fe', lineHeight: '1.55' }}>
              <span style={{ color: '#38bdf8', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Duration:</strong> As long as the plan you bought: [1/3/6/12] months.</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'devices',
    tabLabel: 'Devices',
    title: 'Devices',
    icon: '📱',
    badge: '1 SCREEN AT A TIME',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeColor: '#60a5fa',
    badgeBorder: 'rgba(59, 130, 246, 0.35)',
    subtitle: 'Where and how you can watch',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Intro */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.28)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>📺</span>
            <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '14.5px' }}>
              Screen Guidelines
            </div>
          </div>
          <p style={{ color: '#dbeafe', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Install on as many devices as you like. Watch on one screen at a time.
          </p>
        </div>

        {/* Group "Supported devices" */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> Supported devices:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Mobile:</strong> Install the app and sign in.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Smart TV:</strong> Sign in on the TV app. It may ask for a code or PIN.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Laptop or PC:</strong> Use the app or a web browser.</div>
            </div>
          </div>
        </div>

        {/* Group "Screen limit" */}
        <div style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠️</span> Screen limit:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fef3c7', lineHeight: '1.55' }}>
              <span style={{ color: '#f59e0b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>One screen at a time:</strong> Using two screens together can cause a block.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fef3c7', lineHeight: '1.55' }}>
              <span style={{ color: '#f59e0b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Many installs are fine:</strong> Installing on several devices is okay if you do not stream on them together.</div>
            </div>
          </div>
        </div>

        {/* Group "If something goes wrong" */}
        <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#34d399', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛠️</span> If something goes wrong:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Signed out suddenly:</strong> Sign in again. If it fails, message us on Telegram.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Switching devices:</strong> Tell us before you log in on a new device.</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'privacy',
    tabLabel: 'Privacy',
    title: 'Privacy',
    icon: '🔒',
    badge: 'NO CARD NUMBERS STORED',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeColor: '#34d399',
    badgeBorder: 'rgba(16, 185, 129, 0.35)',
    subtitle: 'How we handle your information',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Intro */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.28)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div style={{ color: '#34d399', fontWeight: 800, fontSize: '14.5px' }}>
              Privacy Commitment
            </div>
          </div>
          <p style={{ color: '#d1fae5', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            We only collect what we need to complete your order.
          </p>
        </div>

        {/* Group "What we collect" */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#34d399', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> What we collect:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>We collect:</strong> Your Telegram username/ID, your UPI ID or transaction reference, and your order details.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>We never collect:</strong> Card numbers, bank account details, PINs or your phone contacts.</div>
            </div>
          </div>
        </div>

        {/* Group "How we use it" */}
        <div style={{ background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> How we use it:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#dbeafe', lineHeight: '1.55' }}>
              <span style={{ color: '#3b82f6', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Only for your order:</strong> To deliver access, verify payment and give support.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#dbeafe', lineHeight: '1.55' }}>
              <span style={{ color: '#3b82f6', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Never sold:</strong> We do not sell your data or use it for marketing.</div>
            </div>
          </div>
        </div>

        {/* Group "Your control" */}
        <div style={{ background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#c084fc', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> Your control:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#f3e8ff', lineHeight: '1.55' }}>
              <span style={{ color: '#a855f7', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Delete on request:</strong> Message us on Telegram and we will delete it within 7 days.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#f3e8ff', lineHeight: '1.55' }}>
              <span style={{ color: '#a855f7', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>How long we keep it:</strong> Order and payment records for 12 months, then deleted.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#f3e8ff', lineHeight: '1.55' }}>
              <span style={{ color: '#a855f7', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>About Telegram:</strong> Chats are stored on Telegram servers. We do not claim they are end-to-end encrypted.</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'terms',
    tabLabel: 'Terms',
    title: 'Terms',
    icon: '⚖️',
    badge: 'HONEST & TRANSPARENT',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeColor: '#fbbf24',
    badgeBorder: 'rgba(245, 158, 11, 0.35)',
    subtitle: 'Clear terms before you pay',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Intro */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.28)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>📜</span>
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '14.5px' }}>
              Honest Terms &amp; Transparency
            </div>
          </div>
          <p style={{ color: '#fef3c7', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Please read this before you pay. Honest terms are how we earn your trust.
          </p>
        </div>

        {/* Group "Who we are" */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> Who we are:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Not official:</strong> We are an independent reseller. We are not affiliated with Netflix, Spotify, Sony or any other brand.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Payment:</strong> UPI only.</div>
            </div>
          </div>
        </div>

        {/* Group "Refund policy" */}
        <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#f87171', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> Refund policy:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fecaca', lineHeight: '1.55' }}>
              <span style={{ color: '#ef4444', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>No refunds:</strong> We do not give refunds once access is delivered. Please check the product and plan before you pay.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#fecaca', lineHeight: '1.55' }}>
              <span style={{ color: '#ef4444', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Replacement instead:</strong> If your access stops working, we replace it for the rest of your plan.</div>
            </div>
          </div>
        </div>

        {/* Group "When you get a replacement" */}
        <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#34d399', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> When you get a replacement:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Covered:</strong> Login not working, password reset by the provider, profile or PIN lockout, access blocked by the provider.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Not covered:</strong> Changing the master email or password, sharing your login, streaming on more than one screen, or a plan that has already ended.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>How to claim:</strong> Send your Order ID on Telegram. We reply within [X] hours.</div>
            </div>
          </div>
        </div>

        {/* Group "Changes" */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#94a3b8', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> Changes:
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
            <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
            <div><strong style={{ color: '#fff' }}>Updates:</strong> If these terms change, this page is updated.</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'support',
    tabLabel: 'Support',
    title: 'Support',
    icon: '💬',
    badge: 'TELEGRAM DISPATCH',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeColor: '#818cf8',
    badgeBorder: 'rgba(99, 102, 241, 0.35)',
    subtitle: 'How to order and get help',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Intro */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.28)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <div style={{ color: '#818cf8', fontWeight: 800, fontSize: '14.5px' }}>
              Step-by-Step Telegram Flow
            </div>
          </div>
          <p style={{ color: '#e0e7ff', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
            Everything happens on Telegram, step by step.
          </p>
        </div>

        {/* Group "How to order" */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#818cf8', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> How to order:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>1. Message us:</strong> Tell us the product and plan you want.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>2. Pay by UPI:</strong> Send the payment screenshot.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.55' }}>
              <span style={{ color: '#64748b', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>3. Get access:</strong> Login details arrive on Telegram, usually in [X] minutes.</div>
            </div>
          </div>
        </div>

        {/* Group "Need help?" */}
        <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.22)', borderRadius: '14px', padding: '14px 16px' }}>
          <div style={{ color: '#34d399', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛠️</span> Need help?:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Send your Order ID:</strong> We will check and fix it or replace it.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#d1fae5', lineHeight: '1.55' }}>
              <span style={{ color: '#10b981', marginTop: '2px' }}>•</span>
              <div><strong style={{ color: '#fff' }}>Support hours:</strong> [HH:MM - HH:MM] IST.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

const mapLegacyTab = (tab) => {
  if (!tab) return 'accounts';
  if (tab === 'warranty') return 'terms';
  if (tab === 'delivery') return 'support';
  if (tab === 'faq') return 'devices';
  return tab;
};

export default function PolicyModal({ initialTab = 'accounts', onClose }) {
  const [activeTab, setActiveTab] = useState(() => mapLegacyTab(initialTab));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(mapLegacyTab(initialTab));
    }
  }, [initialTab]);

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

        {/* Quick Category Switcher Pill Bar (5 Categories) */}
        <div className="sb-policy-pill-nav">
          {POLICIES.map(p => (
            <button
              key={p.id}
              className={`sb-policy-pill-item ${activeTab === p.id ? 'active' : ''}`}
              onClick={() => setActiveTab(p.id)}
            >
              <span>{p.icon}</span>
              <span>{p.tabLabel}</span>
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
