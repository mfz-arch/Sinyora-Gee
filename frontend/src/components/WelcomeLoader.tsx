'use client';

import React, { useEffect, useState } from 'react';

export default function WelcomeLoader() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 1750);

    const hideTimer = setTimeout(() => {
      setPhase('hidden');
    }, 2350);

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
        minBlockSize: '100dvh',
        inlineSize: '100%',
        background:
          'radial-gradient(circle at 50% 48%, #2e1522 0%, #150b10 70%, #0d0609 100%)',
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        padding: '1.5rem',
        paddingBlockEnd: '4dvh',
        textAlign: 'center',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
        pointerEvents: phase === 'fading' ? 'none' : 'all',
      }}
    >
      <div
        style={{
          fontSize: 'clamp(0.9rem, 1.8vw, 1.15rem)',
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: '#f5cdd8',
          fontWeight: 700,
          marginBlockEnd: '0.75rem',
        }}
      >
        Welcome to
      </div>

      {/* Stylized Thick Freestyle Gold SINYORA GEE */}
      <h1
        className="hero-brand-title-gold"
        style={{
          marginBlockEnd: '0.7rem',
        }}
      >
        SINYORA GEE
      </h1>

      <p
        style={{
          fontSize: 'clamp(1rem, 2.2vw, 1.45rem)',
          letterSpacing: '0.24em',
          textTransform: 'lowercase',
          fontFamily:
            "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 600,
          color: '#fce8ee',
          marginBlockEnd: '2.1rem',
        }}
      >
        luxury facials and spa
      </p>

      {/* Gold Shimmer Loading Bar */}
      <div
        style={{
          inlineSize: 'min(260px, 72vw)',
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
