'use client';

import React from 'react';

interface SinyoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function SinyoraLogo({ size = 'md' }: SinyoraLogoProps) {
  const dimensions = {
    sm: { width: 155, height: 64 },
    md: { width: 188, height: 76 },
    lg: { width: 240, height: 98 },
  }[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        userSelect: 'none',
        lineHeight: 1,
        filter: 'drop-shadow(0 2px 10px rgba(243, 166, 184, 0.35))',
      }}
      aria-label="Sinyora Gee — Skincare • Makeup • Beauty"
    >
      <svg
        className={`sinyora-logo-svg sinyora-logo-${size}`}
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 300 126"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id="sgPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE6EE" />
            <stop offset="45%" stopColor="#FFB6C9" />
            <stop offset="100%" stopColor="#F48FB1" />
          </linearGradient>
        </defs>

        {/* Top Crown with 3 Pearl Tips (bright & crisp) */}
        <g transform="translate(96, 2)">
          <path
            d="M6 22 L3 8 L15 16 L22 4 L29 16 L41 8 L38 22 Z"
            stroke="#FFF7FA"
            strokeWidth="2.8"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M6 22 Q22 20 38 22"
            stroke="#FFF7FA"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle
            cx="2.5"
            cy="6"
            r="2.8"
            stroke="#FFF7FA"
            strokeWidth="2.3"
            fill="none"
          />
          <circle
            cx="22"
            cy="2"
            r="3"
            stroke="#FFF7FA"
            strokeWidth="2.3"
            fill="none"
          />
          <circle
            cx="41.5"
            cy="6"
            r="2.8"
            stroke="#FFF7FA"
            strokeWidth="2.3"
            fill="none"
          />
        </g>

        {/* Top 4-Point Diamond Star */}
        <path
          d="M174 10 Q174 19 183 19 Q174 19 174 28 Q174 19 165 19 Q174 19 174 10 Z"
          fill="#FFFFFF"
        />

        {/* Cursive "Sinyora" */}
        <text
          x="148"
          y="62"
          textAnchor="middle"
          fill="url(#sgPinkGrad)"
          style={{
            fontFamily: "'Great Vibes', 'Brush Script MT', cursive",
            fontSize: '68px',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          Sinyora
        </text>

        {/* Bold Serif "Gee" */}
        <text
          x="150"
          y="102"
          textAnchor="middle"
          fill="url(#sgPinkGrad)"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '52px',
            fontWeight: 800,
            letterSpacing: '0.03em',
          }}
        >
          Gee
        </text>

        {/* Bottom-Left Twin Sparkles */}
        <path
          d="M28 88 Q28 95 35 95 Q28 95 28 102 Q28 95 21 95 Q28 95 28 88 Z"
          fill="#FFB6C9"
        />
        <path
          d="M40 96 Q40 101 45 101 Q40 101 40 106 Q40 101 35 101 Q40 101 40 96 Z"
          fill="#FFB6C9"
        />

        {/* Bottom-Right Looped Ribbon Heart + Sparkle */}
        <path
          d="M246 100 C242 92, 235 84, 240 79 C244 75, 249 81, 249 85 C250 79, 257 74, 261 79 C265 84, 257 95, 242 102 C246 99, 251 101, 255 104"
          stroke="#FFB6C9"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M270 65 Q270 75 280 75 Q270 75 270 85 Q270 75 260 75 Q270 75 270 65 Z"
          fill="#FFB6C9"
        />

        {/* Bottom Tagline: SKINCARE • MAKEUP • BEAUTY */}
        <text
          x="150"
          y="122"
          textAnchor="middle"
          fill="#FFF5F8"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.24em',
          }}
        >
          SKINCARE • MAKEUP • BEAUTY
        </text>
      </svg>
    </div>
  );
}
