'use client';

import React, { useState } from 'react';
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
  onClose: () => void;
  onSuccessAdminLogin: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccessAdminLogin,
}: AuthModalProps) {
  const { login, registerClient } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('Royal Hostel');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const res = login(phone, password);
    if (!res.ok) {
      setFeedback({ type: 'error', text: res.message });
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
        style={{ maxInlineSize: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.1rem 1.35rem',
            borderBottom: '1px solid var(--gold-border)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--brand-color)',
              }}
            >
              Client &amp; Management Access
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>
              {mode === 'signin'
                ? 'Sign In to Sinyora Gee'
                : 'Create Student Account'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '0.4rem 0.6rem' }}
            aria-label="Close sign in dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            padding: '0.75rem 1.35rem 0',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setFeedback(null);
            }}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border:
                mode === 'signin'
                  ? '1.5px solid var(--brand-color)'
                  : '1px solid var(--gold-border)',
              background:
                mode === 'signin' ? 'var(--brand-color)' : 'var(--bg-surface)',
              color: mode === 'signin' ? '#fff' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <UserCheck size={15} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setFeedback(null);
            }}
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-sm)',
              border:
                mode === 'signup'
                  ? '1.5px solid var(--brand-color)'
                  : '1px solid var(--gold-border)',
              background:
                mode === 'signup' ? 'var(--brand-color)' : 'var(--bg-surface)',
              color: mode === 'signup' ? '#fff' : 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <UserPlus size={15} /> Student Sign Up
          </button>
        </div>

        {/* Body */}
        <div
          className="scrollable-drawer-body"
          style={{ padding: '1.2rem 1.35rem 1.4rem' }}
        >
          {feedback && (
            <div
              style={{
                padding: '0.7rem 0.95rem',
                borderRadius: 'var(--radius-sm)',
                marginBlockEnd: '1rem',
                background:
                  feedback.type === 'error'
                    ? 'var(--danger-bg)'
                    : 'var(--success-bg)',
                color:
                  feedback.type === 'error'
                    ? 'var(--danger)'
                    : 'var(--success)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {feedback.text}
            </div>
          )}

          {mode === 'signin' ? (
            /* Sign-In Form following modern-web-guidance autofill-sign-in-form */
            <form
              onSubmit={handleSignIn}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div className="form-field">
                <label className="form-label" htmlFor="signin-phone">
                  Phone Number *
                </label>
                <input
                  id="signin-phone"
                  name="username"
                  type="tel"
                  inputMode="tel"
                  autoComplete="username"
                  enterKeyHint="next"
                  required
                  placeholder="e.g. 0616806679"
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingInlineEnd: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      display: 'grid',
                      placeContent: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ inlineSize: '100%', marginTop: '0.25rem' }}
              >
                <UserCheck size={17} />
                <span>Sign In</span>
              </button>

              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <ShieldCheck
                  size={16}
                  color="var(--brand-color)"
                  style={{ flexShrink: 0, marginTop: '0.1rem' }}
                />
                <div>
                  <strong>Management Members:</strong> Log in with your
                  registered admin phone number (<code>0616806679</code> or{' '}
                  <code>0612509403</code>) and password to open the Admin SaaS
                  Dashboard.
                </div>
              </div>
            </form>
          ) : (
            /* Student Self-Registration Form */
            <form
              onSubmit={handleSignUp}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.95rem',
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
                  Hostel or Campus Residence
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
                    style={{ paddingInlineEnd: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      display: 'grid',
                      placeContent: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ inlineSize: '100%', marginTop: '0.25rem' }}
              >
                <Sparkles size={17} />
                <span>Create Student Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

