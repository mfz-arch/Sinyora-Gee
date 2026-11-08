'use client';

import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { STUDIO_INFO } from '@/data/initialData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
}

export default function Footer({ onOpenBooking, onOpenAuth }: FooterProps) {
  return (
    <footer
      id="studio-location"
      style={{
        background: 'var(--dark-surface)',
        color: '#fffdf9',
        paddingBlock: '3.5rem 6rem',
        borderTop: '3px solid var(--gold-primary)',
      }}
    >
      <div className="page-shell">
        {/* Top Highlight Banner matching Flyer Footer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            background:
              'linear-gradient(135deg, var(--dark-surface-2) 0%, #2d1422 100%)',
            border: '1.5px solid var(--gold-primary)',
            marginBlockEnd: '3rem',
          }}
        >
          <div>
            <div
              style={{
                color: 'var(--brand-border)',
                fontStyle: 'italic',
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '1.05rem',
              }}
            >
              Tupigie Sasa • Book Your Glow Today
            </div>
            <div
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.04em',
              }}
            >
              {STUDIO_INFO.phone}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
            }}
          >
            <MapPin size={24} color="#d4af37" />
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#f5e6b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                }}
              >
                Location &amp; Home Service
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {STUDIO_INFO.location} • Domicile Available
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onOpenBooking}
              className="btn-gold"
            >
              <Calendar size={17} />
              <span>Book Appointment</span>
            </button>

            <a
              href={`https://wa.me/${STUDIO_INFO.whatsappInternational}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={17} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '2rem',
            paddingBlockEnd: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.45rem',
                color: '#f5e6b8',
                letterSpacing: '0.06em',
                marginBlockEnd: '0.3rem',
              }}
            >
              SINYORA GEE
            </h3>
            <div
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: 'var(--brand-border)',
                fontWeight: 700,
                marginBlockEnd: '0.85rem',
              }}
            >
              Luxury Facial, Cosmetics &amp; Spa
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cfc4ca' }}>
              Premium machine facials, Korean Glass Skin, therapeutic body
              massages, bridal &amp; event glam, and authentic skincare
              products—at {STUDIO_INFO.location} or at your domicile.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: '#f5e6b8',
                marginBlockEnd: '0.85rem',
              }}
            >
              Service Departments
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'grid',
                gap: '0.45rem',
                fontSize: '0.88rem',
                color: '#dfd6db',
              }}
            >
              <li>
                <a
                  href="#section-facial"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  • Facial Services (From FREE Consult to Tsh 35,000)
                </a>
              </li>
              <li>
                <a
                  href="#section-massage"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  • Massage &amp; Body Services (Tsh 20,000 – 35,000)
                </a>
              </li>
              <li>
                <a
                  href="#section-makeup"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  • Makeup Services (Simple, Soft, Full &amp; Bridal)
                </a>
              </li>
              <li>
                <a
                  href="#bridal"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  • Bridal &amp; Event Packages (Tsh 150,000 – 250,000)
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  • Skincare Shop (Oils, Masks, Shampoos, Serums)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: '#f5e6b8',
                marginBlockEnd: '0.85rem',
              }}
            >
              Location &amp; Payments
            </h4>
            <div
              style={{
                display: 'grid',
                gap: '0.55rem',
                fontSize: '0.88rem',
                color: '#dfd6db',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color="#d4af37" />
                <span>{STUDIO_INFO.location} (Home / Domicile Available)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={15} color="#d4af37" />
                <span>{STUDIO_INFO.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={15} color="#d4af37" />
                <span>{STUDIO_INFO.hours}</span>
              </div>
              <div
                style={{
                  marginTop: '0.4rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  fontSize: '0.78rem',
                  color: '#f5e6b8',
                }}
              >
                Accepted Payments: <strong>M-Pesa</strong> •{' '}
                <strong>Tigo Pesa</strong> • <strong>Airtel Money</strong> •{' '}
                <strong>HaloPesa</strong> • <strong>Cash</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Management Access */}
        <div
          style={{
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#a89ba2',
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>SINYORA GEE</strong> Luxury
            Facial, Cosmetics &amp; Spa.{' '}
            <span style={{ color: '#f5e6b8' }}>
              Your Beauty, Our Priority ♥
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenAuth}
            style={{
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#f5e6b8',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.76rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={13} /> Management Portal Login
          </button>
        </div>
      </div>
    </footer>
  );
}

