import React from 'react';
import './GlowBorder.css';

/**
 * GlowCard component
 * Wraps service cards with an active glowing rotating border and breathing outer glow.
 * @param {string} color - Service brand color (e.g. "#e50914")
 * @param {boolean} off - Out of stock state (disables glowing border)
 */
export default function GlowCard({ color = '#a855f7', off = false, className = '', children, ...rest }) {
  return (
    <article
      className={`glowcard${off ? ' off' : ''} ${className}`}
      style={{ '--c': color, ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </article>
  );
}
