'use client';

import React from 'react';
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Palette,
  Home,
  HeartHandshake,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { STUDIO_INFO } from '@/data/initialData';
import { BrandTheme } from '@/types';

interface NavbarProps {
  activeView: 'storefront' | 'admin';
  setActiveView: (view: 'storefront' | 'admin') => void;
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenClientPortal: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  onOpenBooking,
  onOpenAuth,
  onOpenClientPortal,
}: NavbarProps) {
  const {
    theme,
    setTheme,
    currentUser,
    selectedServicesForBooking,
    cart,
  } = useStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCount = selectedServicesForBooking.length;

  const cycleTheme = () => {
    const order: BrandTheme[] = ['flyer-rose', 'clean-blush', 'botanical-gold'];
    const nextIndex = (order.indexOf(theme) + 1) % order.length;
    setTheme(order[nextIndex]);
  };

  const themeLabels: Record<BrandTheme, string> = {
    'flyer-rose': 'Rose & Gold (Flyer)',
    'clean-blush': 'Nude Blush & Gold',
    'botanical-gold': 'Botanical Sage & Gold',
  };

  return (
    <>
      {/* Top Announcement & Location Strip */}
      <div
        style={{
          background: 'var(--dark-surface)',
          color: '#fffdf9',
          fontSize: '0.78rem',
          paddingBlock: '0.45rem',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        }}
      >
        <div
          className="page-shell"
          style={{
            display: 'flex',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'safe center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'safe center',
                gap: '0.35rem',
                color: '#f5e6b8',
                fontWeight: 600,
              }}
            >
              <MapPin size={13} /> {STUDIO_INFO.location}
            </span>
            <a
              href={`tel:${STUDIO_INFO.phone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'safe center',
                gap: '0.35rem',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <Phone size={13} /> Tupigie Sasa: {STUDIO_INFO.phone}
            </a>
            <span className="desktop-only" style={{ color: '#d4af37' }}>
              • Skin Consultation is FREE for Students!
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'safe center',
              gap: '0.65rem',
              marginInlineStart: 'auto',
            }}
          >
            <button
              type="button"
              onClick={cycleTheme}
              title="Switch website color palette live"
              style={{
                display: 'inline-flex',
                alignItems: 'safe center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                color: '#f5e6b8',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <Palette size={12} />
              <span>Theme: {themeLabels[theme]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header (Fits PC & Phone) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--gold-border)',
        }}
      >
        <div
          className="page-shell"
          style={{
            display: 'flex',
            alignItems: 'safe center',
            justifyContent: 'space-between',
            paddingBlock: '0.85rem',
            gap: '1rem',
          }}
        >
          {/* Brand Logo Lockup */}
          <a
            href="#top"
            onClick={() => setActiveView('storefront')}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'safe center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                inlineSize: '42px',
                blockSize: '42px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--brand-color) 0%, var(--dark-surface) 100%)',
                border: '2px solid var(--gold-primary)',
                display: 'grid',
                placeContent: 'center',
                color: '#f5e6b8',
                fontWeight: 800,
                fontSize: '1.05rem',
                fontFamily: 'Playfair Display, Georgia, serif',
                flexShrink: 0,
              }}
            >
              SG
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                }}
              >
                SINYORA GEE
              </div>
              <div
                style={{
                  fontSize: '0.66rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--brand-color)',
                  fontWeight: 700,
                }}
              >
                Luxury Facial, Cosmetics &amp; Spa
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className="desktop-only"
            style={{
              alignItems: 'safe center',
              gap: '1.75rem',
              fontSize: '0.92rem',
              fontWeight: 600,
            }}
          >
            <a
              href="#services"
              onClick={() => setActiveView('storefront')}
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              Services &amp; Prices
            </a>
            <a
              href="#bridal"
              onClick={() => setActiveView('storefront')}
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              Bridal Packages
            </a>
            <a
              href="#products"
              onClick={() => setActiveView('storefront')}
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              Skincare Shop
            </a>
            <a
              href="#studio-location"
              onClick={() => setActiveView('storefront')}
              style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
            >
              Royal Hostel Studio
            </a>
          </nav>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'safe center',
              gap: '0.6rem',
            }}
          >
            {/* Admin Portal Toggle if Admin Logged In */}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() =>
                  setActiveView(
                    activeView === 'admin' ? 'storefront' : 'admin'
                  )
                }
                className="btn-gold"
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.82rem',
                }}
              >
                <ShieldCheck size={16} />
                <span>
                  {activeView === 'admin' ? 'View Website' : 'Admin Dashboard'}
                </span>
              </button>
            )}

            {/* Cart / Client Portal Button */}
            <button
              type="button"
              onClick={onOpenClientPortal}
              className="btn-outline"
              style={{
                padding: '0.55rem 0.95rem',
                fontSize: '0.84rem',
                position: 'relative',
              }}
              aria-label="Open shopping cart and my bookings"
            >
              <ShoppingBag size={16} />
              <span className="desktop-only">Cart &amp; Bookings</span>
              {totalCartItems > 0 && (
                <span
                  style={{
                    background: 'var(--brand-color)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.08rem 0.42rem',
                    borderRadius: '999px',
                  }}
                >
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Sign In / Account Button */}
            <button
              type="button"
              onClick={currentUser ? onOpenClientPortal : onOpenAuth}
              className="btn-outline"
              style={{
                padding: '0.55rem 0.95rem',
                fontSize: '0.84rem',
              }}
            >
              <User size={16} />
              <span>
                {currentUser
                  ? currentUser.name.split(' ')[0]
                  : 'Sign In'}
              </span>
            </button>

            {/* Book Appointment CTA (Desktop) */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="btn-primary desktop-only"
              style={{
                padding: '0.6rem 1.25rem',
                fontSize: '0.86rem',
              }}
            >
              <Calendar size={16} />
              <span>
                Book Now {selectedCount > 0 ? `(${selectedCount})` : ''}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile App Bottom Navigation Bar (Phone Interface Priority) */}
      <nav
        className="mobile-only"
        aria-label="Mobile quick navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          insetInline: 0,
          zIndex: 60,
          background: 'rgba(20, 17, 21, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.35)',
          paddingBlock: '0.5rem 0.65rem',
          paddingInline: '0.5rem',
          justifyContent: 'space-around',
          alignItems: 'center',
          color: '#fffdf9',
        }}
      >
        <a
          href="#top"
          onClick={() => setActiveView('storefront')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: activeView === 'storefront' ? '#f5e6b8' : '#b8adb3',
            textDecoration: 'none',
            fontSize: '0.68rem',
            fontWeight: 600,
          }}
        >
          <Home size={18} />
          <span>Home</span>
        </a>

        <a
          href="#services"
          onClick={() => setActiveView('storefront')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: '#fffdf9',
            textDecoration: 'none',
            fontSize: '0.68rem',
            fontWeight: 600,
          }}
        >
          <HeartHandshake size={18} />
          <span>Services</span>
        </a>

        <button
          type="button"
          onClick={onOpenBooking}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.15rem',
            background:
              'linear-gradient(135deg, var(--brand-color) 0%, #d4af37 100%)',
            color: '#ffffff',
            border: '2px solid #f5e6b8',
            borderRadius: '999px',
            padding: '0.45rem 1.05rem',
            marginTop: '-1.1rem',
            boxShadow: '0 6px 20px rgba(184, 29, 91, 0.45)',
            fontSize: '0.72rem',
            fontWeight: 800,
          }}
        >
          <Sparkles size={17} />
          <span>
            Book {selectedCount > 0 ? `(${selectedCount})` : 'Now'}
          </span>
        </button>

        <a
          href="#products"
          onClick={() => setActiveView('storefront')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: '#fffdf9',
            textDecoration: 'none',
            fontSize: '0.68rem',
            fontWeight: 600,
            position: 'relative',
          }}
        >
          <ShoppingBag size={18} />
          <span>Shop</span>
          {totalCartItems > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: 2,
                background: 'var(--brand-color)',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '0.05rem 0.35rem',
                borderRadius: '999px',
              }}
            >
              {totalCartItems}
            </span>
          )}
        </a>

        <button
          type="button"
          onClick={() => {
            if (currentUser?.role === 'admin') {
              setActiveView(activeView === 'admin' ? 'storefront' : 'admin');
            } else if (currentUser) {
              onOpenClientPortal();
            } else {
              onOpenAuth();
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            background: 'transparent',
            border: 'none',
            color: currentUser?.role === 'admin' ? '#f5e6b8' : '#fffdf9',
            fontSize: '0.68rem',
            fontWeight: 600,
          }}
        >
          {currentUser?.role === 'admin' ? (
            <>
              <ShieldCheck size={18} />
              <span>Admin</span>
            </>
          ) : (
            <>
              <User size={18} />
              <span>{currentUser ? 'Profile' : 'Sign In'}</span>
            </>
          )}
        </button>
      </nav>
    </>
  );
}

