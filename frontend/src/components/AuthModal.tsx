'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'admin';
  onClose: () => void;
  onSuccessAdminLogin: () => void;
}

export default function AuthModal({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccessAdminLogin,
}: AuthModalProps) {
  const { login, registerClient } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(initialMode);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('Royal Hostel');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFeedback(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = login(phone, password);
    if (!res.ok) {
      setFeedback({ type: 'error', text: res.message });
      return;
    }

    if (mode === 'admin' && res.user?.role !== 'admin') {
      setFeedback({
        type: 'error',
        text: 'This phone number is not a registered Management account.',
      });
      return;
    }

    setFeedback({ type: 'success', text: res.message });
    if (res.user?.role === 'admin') {
      onSuccessAdminLogin();
    }
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = registerClient({
      name,
      phone,
      password,
      hostel,
    });

    if (!res.ok) {
      setFeedback({ type: 'error', text: res.message });
      return;
    }

    setFeedback({ type: 'success', text: res.message });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-sheet"
        style={{ maxInlineSize: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--gold-border)',
            background:
              mode === 'admin' ? 'var(--dark-surface)' : 'var(--bg-secondary)',
            color: mode === 'admin' ? '#f7df8b' : 'var(--text-primary)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: mode === 'admin' ? '#f3a6b8' : 'var(--brand-color)',
              }}
            >
              {mode === 'admin'
                ? 'SINYORA GEE • Management Portal'
                : 'Client Account Access'}
            </div>
            <h3 style={{ fontSize: '1.15rem' }}>
              {mode === 'admin'
                ? 'Management Login'
                : mode === 'signin'
                  ? 'Client Sign In'
                  : 'Client Sign Up'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '0.35rem 0.55rem' }}
            aria-label="Close sign in dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode Switch Tabs (Only shown for Client Signin/Signup, or switchable) */}
        {mode !== 'admin' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              padding: '0.75rem 1.25rem 0',
              gap: '0.45rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setFeedback(null);
              }}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border:
                  mode === 'signin'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  mode === 'signin'
                    ? 'var(--brand-color)'
                    : 'var(--bg-surface)',
                color: mode === 'signin' ? '#fff' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <UserCheck size={14} /> Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setFeedback(null);
              }}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border:
                  mode === 'signup'
                    ? '1px solid var(--brand-color)'
                    : '1px solid var(--gold-border)',
                background:
                  mode === 'signup'
                    ? 'var(--brand-color)'
                    : 'var(--bg-surface)',
                color: mode === 'signup' ? '#fff' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <UserPlus size={14} /> Sign Up
            </button>
          </div>
        )}

        {/* Body */}
        <div
          className="scrollable-drawer-body"
          style={{ padding: '1.15rem 1.25rem 1.35rem' }}
        >
          {feedback && (
            <div
              style={{
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                marginBlockEnd: '0.9rem',
                background:
                  feedback.type === 'error'
                    ? 'var(--danger-bg)'
                    : 'var(--success-bg)',
                color:
                  feedback.type === 'error'
                    ? 'var(--danger)'
                    : 'var(--success)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              {feedback.text}
            </div>
          )}

          {mode === 'signin' || mode === 'admin' ? (
            /* Sign-In Form following modern-web-guidance autofill-sign-in-form */
            <form
              onSubmit={handleSignIn}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              <div className="form-field">
                <label className="form-label" htmlFor="signin-phone">
                  {mode === 'admin'
                    ? 'Management Phone Number *'
                    : 'Your Phone Number *'}
                </label>
                <input
                  id="signin-phone"
                  name="username"
                  type="tel"
                  inputMode="tel"
                  autoComplete="username"
                  enterKeyHint="next"
                  required
                  placeholder={
                    mode === 'admin' ? 'e.g. 0616806679' : 'e.g. 0712 345 678'
                  }
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="current-password">
                  Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="current-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    enterKeyHint="done"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingInlineEnd: '2.6rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '0.7rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      display: 'grid',
                      placeContent: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={mode === 'admin' ? 'btn-gold' : 'btn-primary'}
                style={{ inlineSize: '100%', marginTop: '0.2rem' }}
              >
                {mode === 'admin' ? (
                  <>
                    <ShieldCheck size={15} />
                    <span>Enter Management Portal</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={15} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Client Self-Registration Form */
            <form
              onSubmit={handleSignUp}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div className="form-field">
                <label className="form-label" htmlFor="signup-name">
                  Full Name *
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  required
                  placeholder="e.g. Neema Hassan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="signup-phone">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  id="signup-phone"
                  name="tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  required
                  placeholder="e.g. 0715 000 111"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="signup-hostel">
                  Hostel or Residence
                </label>
                <input
                  id="signup-hostel"
                  name="address-line1"
                  type="text"
                  autoComplete="address-line1"
                  enterKeyHint="next"
                  placeholder="e.g. Royal Hostel"
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="new-password">
                  Create Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    enterKeyHint="done"
                    required
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingInlineEnd: '2.6rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '0.7rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      display: 'grid',
                      placeContent: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ inlineSize: '100%', marginTop: '0.2rem' }}
              >
                <Sparkles size={15} />
                <span>Create Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
