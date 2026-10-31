'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  MapPin,
  Phone,
  CheckCircle2,
  Eye,
  X,
  Star,
  Crown,
} from 'lucide-react';
import { STUDIO_INFO } from '@/data/initialData';

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [showFlyerModal, setShowFlyerModal] = useState(false);

  const pillars = [
    { label: 'Facial', sub: 'Machine & Glow' },
    { label: 'Massage', sub: 'Body & Aroma' },
    { label: 'Beauty', sub: 'Brows & Lashes' },
    { label: 'Make Up', sub: 'Soft & Bridal' },
    { label: 'Skin Care', sub: 'Oils & Masks' },
  ];

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        paddingBlock: 'clamp(2rem, 5vw, 4.5rem)',
        background:
          'radial-gradient(circle at 85% 15%, var(--brand-soft) 0%, var(--bg-primary) 55%), linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        borderBottom: '1px solid var(--gold-border)',
        overflow: 'clip',
      }}
    >
      <div className="page-shell hero-grid">
        {/* Left Column: Brand Headline & Actions */}
        <div className="hero-fluid-container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'safe center',
              gap: '0.6rem',
              marginBlockEnd: '1.1rem',
            }}
          >
            <span className="gold-shimmer-badge">
              <Crown size={14} /> {STUDIO_INFO.slogan}
            </span>
            <span className="rose-pill-badge">
              <MapPin size={13} /> {STUDIO_INFO.location}
            </span>
          </div>

          {/* Main Business Title & Subtitle as requested */}
          <h1
            className="hero-brand-title"
            style={{
              color: 'var(--text-primary)',
              marginBlockEnd: '0.35rem',
            }}
          >
            SINYORA GEE
          </h1>

          <p
            className="hero-brand-subtitle"
            style={{
              color: 'var(--brand-color)',
              marginBlockEnd: '1.35rem',
            }}
          >
            Luxury Facial, Cosmetics &amp; Spa
          </p>

          <p
            style={{
              fontSize: 'clamp(0.98rem, 1.4vw, 1.12rem)',
              color: 'var(--text-secondary)',
              maxInlineSize: '60ch',
              marginBlockEnd: '1.75rem',
            }}
          >
            Experience clinical-grade facial machines, Korean Glass Skin
            treatments, soothing full-body massages, flawless glam makeup, and
            curated skincare essentials—crafted for students and beauty lovers
            at <strong>{STUDIO_INFO.location}</strong>.
          </p>

          {/* Primary CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              marginBlockEnd: '2rem',
            }}
          >
            <button
              type="button"
              onClick={onOpenBooking}
              className="btn-primary"
              style={{ flex: '1 1 210px' }}
            >
              <Calendar size={18} />
              <span>Book a Treatment</span>
            </button>

            <a
              href="#products"
              className="btn-outline"
              style={{ flex: '1 1 180px' }}
            >
              <ShoppingBag size={18} />
              <span>Shop Skincare</span>
            </a>

            <button
              type="button"
              onClick={() => setShowFlyerModal(true)}
              className="btn-gold"
              style={{ flex: '1 1 180px' }}
            >
              <Eye size={18} />
              <span>View Price Flyer</span>
            </button>
          </div>

          {/* Highlights Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--gold-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <CheckCircle2 size={18} color="var(--brand-color)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  FREE Skin Consult
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  1-on-1 Skin Analysis
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Sparkles size={18} color="var(--gold-primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  From Tsh 5,000
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Student-Friendly Luxury
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Phone size={18} color="var(--brand-color)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Mobile Money &amp; Cash
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  M-Pesa, Tigo, Airtel, Halo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Luxury Showcase Card */}
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gap: '1rem',
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'clip',
              border: '2px solid var(--gold-primary)',
              boxShadow: 'var(--shadow-lg)',
              aspectRatio: '4 / 4.4',
              background: 'var(--dark-surface)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85"
              alt="SINYORA GEE Luxury Facial Treatment"
              style={{
                inlineSize: '100%',
                blockSize: '100%',
                objectFit: 'cover',
                opacity: 0.92,
              }}
            />

            {/* Floating Top Badge */}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  background: 'rgba(20, 17, 21, 0.82)',
                  backdropFilter: 'blur(8px)',
                  color: '#f5e6b8',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Star size={13} fill="#d4af37" color="#d4af37" />
                High-Tech Facial Devices
              </span>

              <span
                style={{
                  background: 'var(--brand-color)',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                }}
              >
                Korean Glass Skin • Tsh 35,000
              </span>
            </div>

            {/* Bottom Overlay Card */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                background: 'rgba(20, 17, 21, 0.88)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.15rem',
                color: '#fffdf9',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#d4af37',
                  fontWeight: 700,
                  marginBlockEnd: '0.2rem',
                }}
              >
                Clear Skin + Healthy Skin + Happy You ♥
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    Not sure what your skin needs?
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#d8cfd4' }}>
                    Book a <strong>FREE Skin Consultation</strong> at{' '}
                    {STUDIO_INFO.location}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="btn-gold"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  Book Free Consult
                </button>
              </div>
            </div>
          </div>

          {/* 5 Core Pillars Bar from Flyer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.45rem',
              background: 'var(--dark-surface)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gold-primary)',
            }}
          >
            {pillars.map((p) => (
              <a
                key={p.label}
                href={p.label === 'Skin Care' ? '#products' : '#services'}
                style={{
                  textAlign: 'center',
                  textDecoration: 'none',
                  padding: '0.35rem 0.2rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                }}
              >
                <div
                  style={{
                    color: '#f5e6b8',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                  }}
                >
                  {p.label}
                </div>
                <div
                  className="desktop-only"
                  style={{
                    justifyContent: 'center',
                    color: '#bfb3b9',
                    fontSize: '0.64rem',
                  }}
                >
                  {p.sub}
                </div>
              </a>
            ))}
          </div>
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
            style={{ maxInlineSize: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--gold-border)',
                background: 'var(--bg-secondary)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>
                  SINYORA GEE — Official Service Menu
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {STUDIO_INFO.location} • {STUDIO_INFO.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFlyerModal(false)}
                className="btn-outline"
                style={{ padding: '0.4rem 0.6rem' }}
                aria-label="Close flyer preview"
              >
                <X size={18} />
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

