'use client';

import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Home,
  HeartHandshake,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { STUDIO_INFO } from '@/data/initialData';
import SinyoraLogo from './SinyoraLogo';

interface NavbarProps {
  activeView: 'storefront' | 'admin';
  setActiveView: (view: 'storefront' | 'admin') => void;
  onOpenBooking: () => void;
  onOpenClientAuth: () => void;
  onOpenAdminAuth: () => void;
  onOpenClientPortal: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  onOpenBooking,
  onOpenClientAuth,
  onOpenAdminAuth,
  onOpenClientPortal,
}: NavbarProps) {
  const {
    currentUser,
    logout,
    selectedServicesForBooking,
    cart,
  } = useStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedCount = selectedServicesForBooking.length;

  const announcementItems = [
    {
      icon: <Phone size={13} color="#f7df8b" />,
      text: `Tupigie sasa : ${STUDIO_INFO.phone}`,
    },
    {
      icon: <Sparkles size={13} color="#f3a6b8" />,
      text: 'Skin consultation is FREE',
    },
    {
      icon: <MapPin size={13} color="#f7df8b" />,
      text: STUDIO_INFO.location,
    },
  ];

  const renderMarqueeGroup = (keyPrefix: string) => (
    <div className="announcement-segment" key={keyPrefix}>
      {[0, 1, 2, 3].map((rep) => (
        <React.Fragment key={`${keyPrefix}-${rep}`}>
          {announcementItems.map((item, idx) => (
            <span
              key={`${keyPrefix}-${rep}-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {item.icon}
              <span>{item.text}</span>
              <span
                style={{
                  color: '#d4af37',
                  marginInlineStart: '1.25rem',
                  opacity: 0.75,
                }}
              >
                •
              </span>
            </span>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      {/* 1. Top Moving Announcement Bar (Moves Left to Right continuously) */}
      <div
        className="announcement-bar"
        aria-label="Studio announcement banner"
      >
        <div className="announcement-track">
          {renderMarqueeGroup('seg-a')}
          {renderMarqueeGroup('seg-b')}
        </div>
      </div>

      {/* 2. Main Header blending smoothly into the skincare background */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background:
            'linear-gradient(180deg, rgba(18, 10, 14, 0.82) 0%, rgba(24, 13, 19, 0.52) 68%, rgba(24, 13, 19, 0.05) 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderBottom: 'none',
        }}
      >
        <div className="page-shell header-inner">
          {/* Left: Uploaded Logo (Background Removed & Matched Directly) */}
          <a
            href="#top"
            onClick={() => setActiveView('storefront')}
            className="header-logo-area"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <SinyoraLogo size="md" />
          </a>

          {/* Center Navigation Links: Services & price | Cosmetics shop | Contact us */}
          <nav className="header-nav-area" style={{ color: '#fce8ee' }}>
            <a
              href="#services"
              onClick={() => setActiveView('storefront')}
              style={{
                color: '#fce8ee',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Services &amp; Price
            </a>
            <a
              href="#products"
              onClick={() => setActiveView('storefront')}
              style={{
                color: '#fce8ee',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Cosmetics Shop
            </a>
            <a
              href="#studio-location"
              onClick={() => setActiveView('storefront')}
              style={{
                color: '#fce8ee',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Contact Us
            </a>
          </nav>

          {/* Right: Dedicated [Management] button for Admins + [Signup/Signin] for Clients */}
          <div className="header-actions-area">
            {totalCartItems > 0 && (
              <button
                type="button"
                onClick={onOpenClientPortal}
                className="nav-box-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(243, 166, 184, 0.45)',
                  color: '#fce8ee',
                }}
                aria-label="Open bag"
              >
                <ShoppingBag size={14} />
                <span>{totalCartItems}</span>
              </button>
            )}

            {/* Dedicated Management Button for Admins */}
            <button
              type="button"
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  setActiveView(
                    activeView === 'admin' ? 'storefront' : 'admin'
                  );
                } else {
                  onOpenAdminAuth();
                }
              }}
              className="nav-box-btn"
              style={{
                background:
                  currentUser?.role === 'admin'
                    ? 'linear-gradient(135deg, #f3d27a 0%, #d4af37 100%)'
                    : 'rgba(212, 175, 55, 0.14)',
                border: '1px solid #d4af37',
                color:
                  currentUser?.role === 'admin' ? '#181014' : '#f7df8b',
              }}
            >
              <ShieldCheck size={14} />
              <span>
                {currentUser?.role === 'admin'
                  ? activeView === 'admin'
                    ? 'Storefront'
                    : 'Management'
                  : 'Management'}
              </span>
            </button>

            {/* Dedicated Signup/Signin (or Sign Out) Button for Clients */}
            {currentUser ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <button
                  type="button"
                  onClick={onOpenClientPortal}
                  className="nav-box-btn"
                  style={{
                    background: 'rgba(243, 166, 184, 0.16)',
                    border: '1px solid #f3a6b8',
                    color: '#fce8ee',
                  }}
                >
                  <User size={14} />
                  <span>{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setActiveView('storefront');
                  }}
                  className="nav-box-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fce8ee',
                    paddingInline: '0.65rem',
                  }}
                  title="Sign Out"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenClientAuth}
                className="nav-box-btn"
                style={{
                  background: 'var(--brand-color)',
                  border: '1px solid #f3a6b8',
                  color: '#ffffff',
                }}
              >
                <User size={14} />
                <span>Signup / Signin</span>
              </button>
            )}
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
          background: 'rgba(22, 13, 18, 0.96)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.4)',
          paddingBlock: '0.45rem 0.55rem',
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
            gap: '0.15rem',
            color: activeView === 'storefront' ? '#f7df8b' : '#b8adb3',
            textDecoration: 'none',
            fontSize: '0.66rem',
            fontWeight: 600,
          }}
        >
          <Home size={17} />
          <span>Home</span>
        </a>

        <a
          href="#services"
          onClick={() => setActiveView('storefront')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            color: '#fce8ee',
            textDecoration: 'none',
            fontSize: '0.66rem',
            fontWeight: 600,
          }}
        >
          <HeartHandshake size={17} />
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
            gap: '0.1rem',
            background:
              'linear-gradient(135deg, var(--brand-color) 0%, #d4af37 100%)',
            color: '#ffffff',
            border: '1.5px solid #f7df8b',
            borderRadius: '999px',
            padding: '0.38rem 0.95rem',
            marginTop: '-0.85rem',
            boxShadow: '0 4px 16px rgba(184, 29, 91, 0.45)',
            fontSize: '0.68rem',
            fontWeight: 700,
          }}
        >
          <Sparkles size={15} />
          <span>Book {selectedCount > 0 ? `(${selectedCount})` : 'Now'}</span>
        </button>

        <a
          href="#products"
          onClick={() => setActiveView('storefront')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            color: '#fce8ee',
            textDecoration: 'none',
            fontSize: '0.66rem',
            fontWeight: 600,
          }}
        >
          <ShoppingBag size={17} />
          <span>Shop</span>
        </a>

        <button
          type="button"
          onClick={() =>
            currentUser ? onOpenClientPortal() : onOpenClientAuth()
          }
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            background: 'transparent',
            border: 'none',
            color: '#fce8ee',
            fontSize: '0.66rem',
            fontWeight: 600,
          }}
        >
          <User size={17} />
          <span>{currentUser ? 'Account' : 'Signin'}</span>
        </button>
      </nav>
    </>
  );
}
