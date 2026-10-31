'use client';

import React, { useEffect, useState } from 'react';
import SinyoraLogo from './SinyoraLogo';

export default function WelcomeLoader() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 1700);

    const hideTimer = setTimeout(() => {
      setPhase('hidden');
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background:
          'radial-gradient(circle at 50% 42%, #2e1522 0%, #150b10 70%, #0d0609 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
      }}
    >
      <div style={{ marginBlockEnd: '1rem' }}>
        <SinyoraLogo size="lg" />
      </div>

      <div
        style={{
          fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#f5cdd8',
          fontWeight: 600,
          marginBlockEnd: '0.4rem',
        }}
      >
        Welcome to
      </div>

      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2.5rem, 7vw, 5.2rem)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background:
            'linear-gradient(180deg, #fff6d1 0%, #f5d67b 40%, #d4af37 75%, #aa7c11 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: '#d4af37',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 20px rgba(212, 175, 55, 0.35))',
          lineHeight: 1.1,
          marginBlockEnd: '0.55rem',
        }}
      >
        SINYORA GEE
      </h1>

      <p
        style={{
          fontSize: 'clamp(0.95rem, 2.2vw, 1.4rem)',
          letterSpacing: '0.22em',
          textTransform: 'lowercase',
          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 600,
          color: '#fce8ee',
          marginBlockEnd: '2rem',
        }}
      >
        luxury facials and spa
      </p>

      {/* Gold Shimmer Loading Bar */}
      <div
        style={{
          inlineSize: 'min(240px, 70vw)',
          blockSize: '3px',
          background: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          className="welcome-loader-bar"
          style={{
            blockSize: '100%',
            background:
              'linear-gradient(90deg, #f3a6b8 0%, #f7df8b 50%, #d4af37 100%)',
            borderRadius: '999px',
          }}
        />
      </div>
    </div>
  );
}
