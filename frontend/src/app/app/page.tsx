'use client';

import React, { useEffect, useState } from 'react';
import {
  Home,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  User,
  Sparkles,
  LogOut,
  Eye,
  EyeOff,
  Phone,
  Lock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Bell,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { STUDIO_INFO } from '@/data/initialData';
import { formatTsh } from '@/utils/format';
import { isPushSupported, subscribeUserToPush } from '@/utils/pushNotifications';
import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';
import BookingModal from '@/components/BookingModal';
import ClientPortalModal from '@/components/ClientPortalModal';
import MobileAdminView from '@/components/MobileAdminView';
import QrCodeModal from '@/components/QrCodeModal';

type AppTab = 'home' | 'shop' | 'bookings' | 'admin' | 'profile';

export default function SinyoraMobileAppPage() {
  const { currentUser, login, logout, bookings, orders, cart } = useStore();

  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Sign-In Only State (No Sign-Up in the app)
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [pushPermission, setPushPermission] =
    useState<NotificationPermission>('default');
  const [pushReady, setPushReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!currentUser || !isPushSupported()) return;
    setPushPermission(Notification.permission);
    if (Notification.permission === 'granted') {
      subscribeUserToPush(currentUser).then((res) => {
        if (res.ok) setPushReady(true);
      });
    }
  }, [currentUser]);

  const handleEnablePush = async () => {
    if (!currentUser) return;
    const res = await subscribeUserToPush(currentUser);
    setPushPermission(res.permission);
    if (res.ok) setPushReady(true);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = login(phone, password);
    if (!res.ok) {
      setAuthError(res.message);
      return;
    }
    setPhone('');
    setPassword('');
    setActiveTab('home');
  };

  // 1. Luxury App Welcome Screen (Always appears first on launch)
  if (showSplash) {
    return (
      <div
        style={{
          minBlockSize: '100dvh',
          inlineSize: '100%',
          background:
            'radial-gradient(circle at 50% 48%, #2e1522 0%, #150b10 70%, #0d0609 100%)',
          display: 'grid',
          placeContent: 'center',
          justifyItems: 'center',
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '0.88rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#f5cdd8',
            fontWeight: 700,
            marginBlockEnd: '0.75rem',
          }}
        >
          Welcome to
        </div>

        <h1
          className="hero-brand-title-gold"
          style={{
            fontSize: 'clamp(2.4rem, 9vw, 4.2rem)',
            marginBlockEnd: '0.6rem',
          }}
        >
          SINYORA GEE
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.95rem, 2.8vw, 1.25rem)',
            letterSpacing: '0.22em',
            fontFamily:
              "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#fce8ee',
            marginBlockEnd: '2rem',
          }}
        >
          luxury facials and spa
        </p>

        <div
          style={{
            inlineSize: 'min(220px, 65vw)',
            blockSize: '3px',
            background: 'rgba(255, 255, 255, 0.14)',
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
                'linear-gradient(90deg, transparent, #d4af37, #fff7d6, #d4af37, transparent)',
            }}
          />
        </div>
      </div>
    );
  }

  // 2. App Sign-In Screen (NO Sign Up option — account was created on the website before downloading)
  if (!currentUser) {
    return (
      <div
        style={{
          minBlockSize: '100dvh',
          background:
            'radial-gradient(circle at 50% 22%, #2e1522 0%, #150b10 68%, #0d0609 100%)',
          display: 'grid',
          placeContent: 'center',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            inlineSize: 'min(420px, 92vw)',
            background: 'rgba(255, 253, 249, 0.98)',
            borderRadius: '24px',
            border: '1.5px solid #d4af37',
            boxShadow: '0 24px 55px rgba(0, 0, 0, 0.55)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              background:
                'radial-gradient(circle at 50% 48%, #2e1522 0%, #150b10 100%)',
              padding: '1.75rem 1.35rem 1.35rem',
              textAlign: 'center',
              borderBottom: '1px solid rgba(212, 175, 55, 0.45)',
            }}
          >
            <img
              src="/icons/icon-192.png"
              alt="SINYORA GEE"
              style={{
                inlineSize: '72px',
                blockSize: '72px',
                borderRadius: '18px',
                border: '1.5px solid #d4af37',
                marginInline: 'auto',
                marginBlockEnd: '0.85rem',
              }}
            />
            <h1
              className="hero-brand-title-gold"
              style={{ fontSize: '1.65rem', marginBlockEnd: '0.25rem' }}
            >
              SINYORA GEE
            </h1>
            <p
              style={{
                fontSize: '0.76rem',
                color: '#f5cdd8',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Member Sign In
            </p>
          </div>

          <form
            onSubmit={handleSignIn}
            style={{
              padding: '1.5rem 1.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.95rem',
            }}
          >
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                lineHeight: 1.45,
              }}
            >
              Sign in with the phone number and password you registered on the
              website.
            </p>

            {authError && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(190, 18, 60, 0.1)',
                  border: '1px solid rgba(190, 18, 60, 0.35)',
                  color: 'var(--danger)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                {authError}
              </div>
            )}

            <div className="form-field">
              <label className="form-label" htmlFor="app-login-phone">
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={15}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  id="app-login-phone"
                  type="tel"
                  required
                  placeholder="e.g. 0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="app-login-password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  color="var(--text-muted)"
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
                <input
                  id="app-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ inlineSize: '100%', paddingBlock: '0.85rem' }}
            >
              Sign In to SINYORA GEE
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Authenticated Native-Feel App Shell
  const myBookings = bookings.filter(
    (b) =>
      b.clientId === currentUser.id ||
      b.clientPhone.replace(/\s+/g, '') ===
        currentUser.phone.replace(/\s+/g, '')
  );
  const myOrders = orders.filter(
    (o) =>
      o.clientId === currentUser.id ||
      o.clientPhone.replace(/\s+/g, '') ===
        currentUser.phone.replace(/\s+/g, '')
  );

  const isAdmin = currentUser.role === 'admin';

  return (
    <div
      style={{
        minBlockSize: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        paddingBottom: '78px',
      }}
    >
      {/* Top Native App Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background:
            'linear-gradient(180deg, #1b0d14 0%, #26121c 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.38)',
          padding: '0.75rem 1rem',
          boxShadow: '0 4px 16px rgba(15, 6, 11, 0.25)',
        }}
      >
        <div
          className="page-shell"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingInline: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src="/icons/icon-192.png"
              alt="SINYORA GEE"
              style={{
                inlineSize: '38px',
                blockSize: '38px',
                borderRadius: '10px',
                border: '1px solid #d4af37',
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontStyle: 'italic',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#f7df8b',
                  letterSpacing: '0.04em',
                }}
              >
                SINYORA GEE
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#f5cdd8',
                  fontWeight: 600,
                }}
              >
                Hi, {currentUser.name.split(' ')[0]} • Royal Hostel
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                color: '#f7df8b',
                borderRadius: '999px',
                padding: '0.4rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <ShoppingBag size={14} />
              <span>{totalCartItems}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="btn-gold"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              <Sparkles size={13} />
              <span>Book</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Area */}
      <main style={{ flex: 1 }}>
        {/* 1-Tap Background Push Notification Banner (when permission is not yet granted) */}
        {isPushSupported() && pushPermission === 'default' && !pushReady && (
          <div style={{ padding: '0.75rem 0.95rem 0' }}>
            <div
              className="page-shell"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                background: 'rgba(184, 29, 91, 0.08)',
                border: '1px solid rgba(184, 29, 91, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                <Bell size={16} color="var(--brand-color)" />
                <span>
                  {isAdmin
                    ? 'Enable instant alerts for new bookings & orders (even on WhatsApp).'
                    : 'Enable instant alerts when your booking is confirmed or new products drop!'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleEnablePush}
                className="btn-primary"
                style={{ padding: '0.38rem 0.85rem', fontSize: '0.76rem' }}
              >
                Enable Alerts
              </button>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <>
            {/* Warm, Welcoming Luxury App Hero Card */}
            <section
              style={{
                padding: '1rem 0.95rem 0.35rem',
                background: 'var(--bg-primary)',
              }}
            >
              <div
                className="page-shell"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '22px',
                  padding: '1.35rem 1.25rem',
                  background:
                    'linear-gradient(135deg, rgba(168, 22, 82, 0.92) 0%, rgba(74, 15, 42, 0.95) 55%, rgba(28, 10, 19, 0.98) 100%)',
                  border: '1.5px solid rgba(212, 175, 55, 0.65)',
                  boxShadow: '0 14px 32px rgba(138, 17, 67, 0.22)',
                  color: '#fffdf9',
                }}
              >
                {/* Soft Top-Right Decorative Glow */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    inlineSize: '150px',
                    blockSize: '150px',
                    borderRadius: '50%',
                    background:
                      'radial-gradient(circle, rgba(247, 223, 139, 0.28) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.26rem 0.72rem',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.14)',
                    border: '1px solid rgba(247, 223, 139, 0.45)',
                    color: '#f7df8b',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    marginBlockEnd: '0.7rem',
                  }}
                >
                  <MapPin size={12} />
                  <span>Royal Hostel • Domicile Service Available</span>
                </div>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.35rem, 4.5vw, 1.85rem)',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    marginBlockEnd: '0.4rem',
                  }}
                >
                  Welcome back,{' '}
                  <span style={{ color: '#f7df8b', fontStyle: 'italic' }}>
                    {currentUser.name.split(' ')[0]}
                  </span>{' '}
                  ✨
                </h2>

                <p
                  style={{
                    fontSize: '0.86rem',
                    color: '#fce8ee',
                    lineHeight: 1.5,
                    maxInlineSize: '46ch',
                    marginBlockEnd: '1rem',
                  }}
                >
                  Ready to glow today? Pick any treatment from our menu below or
                  browse skincare essentials—your profile is already saved.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.55rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="btn-gold"
                    style={{
                      padding: '0.52rem 1rem',
                      fontSize: '0.8rem',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Quick Book</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('shop')}
                    style={{
                      padding: '0.52rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.14)',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Cosmetics Shop</span>
                  </button>
                </div>
              </div>
            </section>

            <ServicesSection onOpenBooking={() => setIsBookingOpen(true)} />
          </>
        )}

        {activeTab === 'shop' && (
          <ProductsSection
            onOpenAdminProducts={() => setActiveTab('admin')}
            onOpenClientPortal={() => setIsBagOpen(true)}
            onOpenAuth={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'bookings' && (
          <section style={{ paddingBlock: '1.5rem' }}>
            <div
              className="page-shell"
              style={{ display: 'grid', gap: '1.25rem', maxInlineSize: '780px' }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontStyle: 'italic',
                    fontSize: '1.35rem',
                    marginBlockEnd: '0.25rem',
                  }}
                >
                  My Bookings ({myBookings.length})
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Live status synced with SINYORA GEE at Royal Hostel.
                </p>
              </div>

              {myBookings.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px dashed var(--gold-primary)',
                    textAlign: 'center',
                  }}
                >
                  <Calendar
                    size={32}
                    color="var(--brand-color)"
                    style={{ marginInline: 'auto', marginBlockEnd: '0.6rem' }}
                  />
                  <p style={{ fontWeight: 700, marginBlockEnd: '0.65rem' }}>
                    No appointments yet
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="btn-primary"
                  >
                    Browse Service Flyer
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {myBookings.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--gold-border)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBlockEnd: '0.4rem',
                        }}
                      >
                        <strong>
                          {b.id} • {b.appointmentDate} ({b.appointmentTime})
                        </strong>
                        <span className="rose-pill-badge">{b.status}</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--text-secondary)',
                          marginBlockEnd: '0.35rem',
                        }}
                      >
                        {b.services.map((s) => s.name).join(', ')}
                      </div>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: 'var(--brand-color)',
                        }}
                      >
                        {formatTsh(b.totalPrice)} • {b.paymentMethod} •{' '}
                        {b.hostelOrRoom}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <h3
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    fontStyle: 'italic',
                    fontSize: '1.15rem',
                    marginBlockEnd: '0.65rem',
                  }}
                >
                  My Product Orders ({myOrders.length})
                </h3>
                {myOrders.length === 0 ? (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    No product orders yet.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '0.7rem' }}>
                    {myOrders.map((o) => (
                      <div
                        key={o.id}
                        style={{
                          padding: '0.9rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--gold-border)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBlockEnd: '0.3rem',
                          }}
                        >
                          <strong>{o.id}</strong>
                          <span className="gold-shimmer-badge">{o.status}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem' }}>
                          {o.items
                            .map((i) => `${i.name} x${i.quantity}`)
                            .join(', ')}
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--brand-color)',
                            marginTop: '0.3rem',
                          }}
                        >
                          {formatTsh(o.totalPrice)} • {o.paymentMethod}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'admin' && isAdmin && (
          <MobileAdminView onOpenQrModal={() => setIsQrModalOpen(true)} />
        )}

        {activeTab === 'profile' && (
          <section style={{ paddingBlock: '1.5rem' }}>
            <div
              className="page-shell"
              style={{ maxInlineSize: '560px', display: 'grid', gap: '1rem' }}
            >
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--gold-primary)',
                  padding: '1.35rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <img
                    src="/icons/icon-192.png"
                    alt="SINYORA GEE"
                    style={{
                      inlineSize: '54px',
                      blockSize: '54px',
                      borderRadius: '14px',
                      border: '1px solid var(--gold-primary)',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--brand-color)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {isAdmin ? 'Management Account' : 'Client Member'}
                    </div>
                    <h2 style={{ fontSize: '1.2rem' }}>{currentUser.name}</h2>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: '0.6rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    paddingBlock: '0.85rem',
                    borderTop: '1px solid var(--gold-border)',
                    borderBottom: '1px solid var(--gold-border)',
                    marginBlockEnd: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={15} color="var(--brand-color)" />
                    <span>{currentUser.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} color="var(--brand-color)" />
                    <span>{currentUser.hostel || 'Royal Hostel'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="var(--success)" />
                    <span>Profile auto-fills all future bookings</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.65rem' }}>
                  <a
                    href={`https://wa.me/${STUDIO_INFO.whatsappInternational}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{ justifyContent: 'center' }}
                  >
                    <MessageCircle size={16} />
                    <span>Message SINYORA GEE on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={logout}
                    className="btn-outline"
                    style={{ justifyContent: 'center', color: 'var(--danger)' }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Fixed Native Bottom Tab Navigation Bar */}
      <nav
        aria-label="App bottom navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          insetInline: 0,
          zIndex: 60,
          background: 'rgba(22, 11, 16, 0.98)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.45)',
          paddingBlock: '0.5rem 0.65rem',
          paddingInline: '0.5rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {(
          [
            { id: 'home', label: 'Home', icon: Home },
            { id: 'shop', label: 'Shop', icon: ShoppingBag },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            ...(isAdmin
              ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck }]
              : []),
            { id: 'profile', label: 'Account', icon: User },
          ] as { id: AppTab; label: string; icon: React.ComponentType<{ size?: number }> }[]
        ).map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.18rem',
                color: active ? '#f7df8b' : '#b7a9b0',
                fontSize: '0.68rem',
                fontWeight: active ? 800 : 600,
                paddingInline: '0.55rem',
              }}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <ClientPortalModal
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenAuth={() => setActiveTab('profile')}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}

