import React from 'react';
import './OttBackground.css';

// Brand names with authentic signature colors
const OTT = [
  { name: 'Netflix', color: '#e50914' },
  { name: 'Amazon Prime', color: '#0b8cff' },
  { name: 'JioHotstar', color: '#2563eb' },
  { name: 'Crunchyroll', color: '#f97316' },
  { name: 'ZEE5', color: '#8b5cf6' },
  { name: 'Sony LIV', color: '#f59e0b' },
  { name: 'Spotify', color: '#1db954' },
  { name: 'YouTube', color: '#ef4444' },
  { name: 'Steam', color: '#d4a359' },
  { name: 'Canva', color: '#00c4cc' },
  { name: 'ChatGPT', color: '#10a37f' },
  { name: 'PlayStation', color: '#0070d1' },
  { name: 'Xbox', color: '#107c10' }
];

export default function OttBackground() {
  return (
    <div className="ottbg" aria-hidden="true">
      {OTT.slice(0, 8).map((_, i) => {
        const items = [...OTT.slice(i), ...OTT.slice(0, i)];
        const strip = (k) => (
          <span key={k}>
            {items.map((s, idx) => (
              <b key={`${s.name}-${idx}`} style={{ color: s.color }}>
                {s.name}
              </b>
            ))}
          </span>
        );
        return (
          <div
            key={i}
            className={`ottbg-row${i % 2 ? ' r' : ''}`}
            style={{ animationDuration: `${34 + i * 5}s` }}
          >
            {strip(0)}
            {strip(1)}
          </div>
        );
      })}
    </div>
  );
}
