'use client';

import React from 'react';

interface SinyoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function SinyoraLogo({ size = 'md' }: SinyoraLogoProps) {
  const dimensions = {
    sm: { width: 125, height: 52 },
    md: { width: 155, height: 64 },
    lg: { width: 210, height: 86 },
  }[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        lineHeight: 1,
      }}
      aria-label="Sinyora Gee — Skincare • Makeup • Beauty"
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 320 132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id="sgPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAD0DA" />
            <stop offset="50%" stopColor="#F3A6B8" />
            <stop offset="100%" stopColor="#E68FA5" />
          </linearGradient>
          <linearGradient id="sgGoldSpark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5D6" />
            <stop offset="50%" stopColor="#F5D376" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Top Crown with 3 Pearl Tips (matching uploaded logo) */}
        <g transform="translate(106, 4)">
          <path
            d="M6 22 L3 9 L14 16 L21 5 L28 16 L39 9 L36 22 Z"
            stroke="#FCE8EE"
            strokeWidth="2.4"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M6 22 Q21 20 36 22"
            stroke="#FCE8EE"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="2.5" cy="7" r="2.6" stroke="#FCE8EE" strokeWidth="2" fill="none" />
          <circle cx="21" cy="3" r="2.8" stroke="#FCE8EE" strokeWidth="2" fill="none" />
          <circle cx="39.5" cy="7" r="2.6" stroke="#FCE8EE" strokeWidth="2" fill="none" />
        </g>

        {/* Top 4-Point Diamond Star */}
        <path
          d="M180 12 Q180 20 188 20 Q180 20 180 28 Q180 20 172 20 Q180 20 180 12 Z"
          fill="#FFF7FA"
        />

        {/* Cursive "Sinyora" */}
        <text
          x="156"
          y="63"
          textAnchor="middle"
          fill="url(#sgPinkGrad)"
          style={{
            fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
            fontSize: '64px',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          Sinyora
        </text>

        {/* Bold Serif "Gee" */}
        <text
          x="160"
          y="104"
          textAnchor="middle"
          fill="url(#sgPinkGrad)"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '50px',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}
        >
          Gee
        </text>

        {/* Bottom-Left Twin Sparkles */}
        <path
          d="M36 92 Q36 98 42 98 Q36 98 36 104 Q36 98 30 98 Q36 98 36 92 Z"
          fill="#F3A6B8"
        />
        <path
          d="M47 99 Q47 103 51 103 Q47 103 47 107 Q47 103 43 103 Q47 103 47 99 Z"
          fill="#F3A6B8"
        />

        {/* Bottom-Right Looped Ribbon Heart + Sparkle */}
        <path
          d="M256 102 C252 94, 245 86, 250 81 C254 77, 259 83, 259 87 C260 81, 267 76, 271 81 C275 86, 267 97, 252 104 C256 101, 261 103, 265 106"
          stroke="#F3A6B8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M280 68 Q280 77 289 77 Q280 77 280 86 Q280 77 271 77 Q280 77 280 68 Z"
          fill="#F3A6B8"
        />

        {/* Bottom Tagline: SKINCARE • MAKEUP • BEAUTY */}
        <text
          x="160"
          y="126"
          textAnchor="middle"
          fill="#F5DCE3"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.26em',
          }}
        >
          SKINCARE • MAKEUP • BEAUTY
        </text>
      </svg>
    </div>
  );
}
