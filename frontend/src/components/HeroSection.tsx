'use client';

import React, { useState } from 'react';
import { Calendar, ShoppingBag, Eye, X } from 'lucide-react';
import { STUDIO_INFO } from '@/data/initialData';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [showFlyerModal, setShowFlyerModal] = useState(false);

  return (
    <section id="top" className="hero-skincare-backdrop">
      <div
        className="page-shell hero-fluid-container"
        style={{
          inlineSize: '100%',
          maxInlineSize: '980px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1.15rem',
        }}
      >
        {/* Main Large Gold Title: SINYORA GEE */}
        <h1 className="hero-brand-title-gold">SINYORA GEE</h1>

        {/* Centered Subtitle: LUXURY FACIAL & SPA */}
        <p className="hero-brand-subtitle">LUXURY FACIAL &amp; SPA</p>

        {/* Wide Horizontal Description */}
        <p
          style={{
            inlineSize: '100%',
            maxInlineSize: '760px',
            marginInline: 'auto',
            fontSize: 'clamp(1rem, 1.55vw, 1.2rem)',
            color: '#fdf4f7',
            lineHeight: 1.75,
            marginBlock: '0.35rem 0.25rem',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.65)',
          }}
        >
          Experience clinical-grade facial machines, Korean glass skin
          treatments, soothing full-body massage, flawless makeup and curated
          skincare essentials.
        </p>

        {/* Dedicated Line: Royal Hostel or Own Domicile */}
        <p
          style={{
            inlineSize: '100%',
            maxInlineSize: '680px',
            marginInline: 'auto',
            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            color: '#fce8ee',
            fontWeight: 600,
            letterSpacing: '0.02em',
            marginBlock: '0 1rem',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.7)',
          }}
        >
          Services done at{' '}
          <strong style={{ color: '#f7df8b' }}>{STUDIO_INFO.location}</strong>{' '}
          or in the comfort of{' '}
          <strong style={{ color: '#f7df8b' }}>your own domicile</strong>.
        </p>

        {/* Horizontal Row of 3 Buttons matching the hand-drawn template */}
        <div className="hero-cta-row">
          <button
            type="button"
            onClick={onOpenBooking}
            className="btn-gold"
          >
            <Calendar size={15} />
            <span>Book a treatment</span>
          </button>

          <a href="#products" className="btn-primary">
            <ShoppingBag size={15} />
            <span>Cosmetic shop</span>
          </a>

          <button
            type="button"
            onClick={() => setShowFlyerModal(true)}
            className="btn-hero-outline"
          >
            <Eye size={15} />
            <span>View price flyer</span>
          </button>
        </div>
      </div>

      {/* Modal to View Official Menu Flyer Image */}
      {showFlyerModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowFlyerModal(false)}
        >
          <div
            className="modal-sheet"
            style={{ maxInlineSize: '640px', textAlign: 'left' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.95rem 1.25rem',
                borderBottom: '1px solid var(--gold-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>
                  SINYORA GEE • Official Service &amp; Price Flyer
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {STUDIO_INFO.location} • {STUDIO_INFO.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFlyerModal(false)}
                className="btn-outline"
                style={{ padding: '0.35rem 0.55rem' }}
                aria-label="Close flyer preview"
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="scrollable-drawer-body"
              style={{ padding: '1rem', textAlign: 'center' }}
            >
              <img
                src="/sinyora-gee-menu-flyer.jpg"
                alt="SINYORA GEE Official Menu and Prices"
                style={{
                  borderRadius: '12px',
                  marginInline: 'auto',
                  border: '1px solid var(--gold-border)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
