'use client';

import React, { useEffect, useState } from 'react';
import { Download, Smartphone, CheckCircle2, X, Share } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALLED_STORAGE_KEY = 'sinyora_gee_app_installed_v1';

export default function DownloadAppSection() {
  const { currentUser } = useStore();
  const [isInstalled, setIsInstalled] = useState(true);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectInstallationState = async () => {
      // 1. Running inside the installed standalone app?
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as { standalone?: boolean }).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // 2. Browser supports getInstalledRelatedApps() (Chrome / Android / Edge)?
      const navWithRelated = navigator as Navigator & {
        getInstalledRelatedApps?: () => Promise<Array<{ id?: string; url?: string }>>;
      };

      if (typeof navWithRelated.getInstalledRelatedApps === 'function') {
        try {
          const related = await navWithRelated.getInstalledRelatedApps();
          if (related.length > 0) {
            setIsInstalled(true);
            return;
          }
        } catch {
          // Ignore if unsupported in current context
        }
      }

      // 3. Fallback check for iOS / browsers without getInstalledRelatedApps
      const storedFlag = localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true';
      setIsInstalled(storedFlag);
    };

    detectInstallationState();

    // If beforeinstallprompt fires, the browser confirms the app is NOT installed
    // (including when a user uninstalls the app — the section automatically reappears!)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      localStorage.removeItem(INSTALLED_STORAGE_KEY);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('focus', detectInstallationState);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('focus', detectInstallationState);
    };
  }, []);

  // Only logged-in users can see the Download App section, and it disappears once installed
  if (!currentUser || isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    // iOS Safari or desktop fallback: show quick Add-to-Home-Screen guide
    setShowIosGuide(true);
  };

  return (
    <section
      aria-label="Download SINYORA GEE App"
      style={{
        background:
          'linear-gradient(90deg, #1b0d14 0%, #2b1320 50%, #1b0d14 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.35)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
        paddingBlock: '0.85rem',
      }}
    >
      <div
        className="page-shell"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.9rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <img
            src="/icons/icon-192.png"
            alt="SINYORA GEE App Icon"
            style={{
              inlineSize: '46px',
              blockSize: '46px',
              borderRadius: '12px',
              border: '1px solid rgba(212, 175, 55, 0.55)',
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#f7df8b',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.09em',
              }}
            >
              <Smartphone size={13} />
              <span>Member Exclusive • Mobile &amp; Desktop App</span>
            </div>
            <div
              style={{
                color: '#fffdf9',
                fontSize: '0.94rem',
                fontWeight: 700,
              }}
            >
              Install the{' '}
              <span
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontStyle: 'italic',
                  color: '#f7df8b',
                }}
              >
                SINYORA GEE
              </span>{' '}
              App for instant 1-tap booking
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstallClick}
          className="btn-gold"
          style={{
            padding: '0.52rem 1.15rem',
            fontSize: '0.83rem',
          }}
        >
          <Download size={15} />
          <span>Download App</span>
        </button>
      </div>

      {/* Quick iOS / Manual Install Guide Modal */}
      {showIosGuide && (
        <div
          className="modal-backdrop"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            className="modal-sheet"
            style={{ maxInlineSize: '420px', padding: '1.25rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBlockEnd: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src="/icons/icon-192.png"
                  alt="SINYORA GEE"
                  style={{
                    inlineSize: '42px',
                    blockSize: '42px',
                    borderRadius: '10px',
                    border: '1px solid var(--gold-primary)',
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontFamily: "'Cinzel Decorative', serif",
                      fontStyle: 'italic',
                    }}
                  >
                    SINYORA GEE App
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Add to your Home Screen in 2 taps
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="btn-outline"
                style={{ padding: '0.35rem 0.55rem' }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '0.65rem',
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                marginBlockEnd: '1.1rem',
              }}
            >
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                }}
              >
                <Share size={16} color="var(--brand-color)" />
                <span>
                  1. Tap your browser&apos;s <strong>Share</strong> or{' '}
                  <strong>Menu (⋮)</strong> button.
                </span>
              </div>
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                }}
              >
                <CheckCircle2 size={16} color="var(--success)" />
                <span>
                  2. Select <strong>Add to Home Screen</strong> /{' '}
                  <strong>Install App</strong>.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
                setIsInstalled(true);
                setShowIosGuide(false);
              }}
              className="btn-primary"
              style={{ inlineSize: '100%' }}
            >
              Done, I Added It
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
