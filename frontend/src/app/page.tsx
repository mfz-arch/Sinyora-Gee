'use client';

import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import AuthModal from '@/components/AuthModal';
import ClientPortalModal from '@/components/ClientPortalModal';
import AdminDashboard from '@/components/AdminDashboard';
import WelcomeLoader from '@/components/WelcomeLoader';
import QrCodeModal from '@/components/QrCodeModal';
import { useStore } from '@/context/StoreContext';

export default function HomePage() {
  const { currentUser } = useStore();

  const [activeView, setActiveView] = useState<'storefront' | 'admin'>(
    'storefront'
  );
  const [adminInitialTab, setAdminInitialTab] = useState<
    'bookings' | 'products' | 'services' | 'orders' | 'clients'
  >('bookings');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<
    'signin' | 'signup' | 'admin'
  >('signin');
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleOpenAdminProducts = () => {
    setAdminInitialTab('products');
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openClientAuth = () => {
    setAuthInitialMode('signin');
    setIsAuthOpen(true);
  };

  const openAdminAuth = () => {
    setAuthInitialMode('admin');
    setIsAuthOpen(true);
  };

  return (
    <div
      style={{
        minBlockSize: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Opening Welcome Screen: Welcome to SINYORA GEE / luxury facials and spa */}
      <WelcomeLoader />

      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenClientAuth={openClientAuth}
        onOpenAdminAuth={openAdminAuth}
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {activeView === 'admin' && currentUser?.role === 'admin' ? (
          <AdminDashboard
            initialTab={adminInitialTab}
            onBackToStorefront={() => setActiveView('storefront')}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        ) : (
          <>
            <HeroSection onOpenBooking={() => setIsBookingOpen(true)} />
            <ServicesSection onOpenBooking={() => setIsBookingOpen(true)} />
            <ProductsSection
              onOpenAdminProducts={handleOpenAdminProducts}
              onOpenClientPortal={() => setIsClientPortalOpen(true)}
              onOpenAuth={openAdminAuth}
              onOpenQrModal={() => setIsQrModalOpen(true)}
            />
          </>
        )}
      </main>

      <Footer
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={openAdminAuth}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      {/* Floating Quick QR Code Button (Above Mobile Bottom Dock) */}
      <button
        type="button"
        onClick={() => setIsQrModalOpen(true)}
        aria-label="Open SINYORA GEE QR Code"
        title="Scan or Download SINYORA GEE QR Code"
        style={{
          position: 'fixed',
          right: '1rem',
          bottom: '5.1rem',
          zIndex: 45,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.55rem 0.9rem',
          borderRadius: '999px',
          background: 'rgba(22, 9, 16, 0.92)',
          color: '#f5e6b8',
          border: '1.5px solid var(--gold-primary)',
          boxShadow: '0 10px 26px rgba(0, 0, 0, 0.38)',
          fontSize: '0.76rem',
          fontWeight: 700,
          backdropFilter: 'blur(10px)',
        }}
      >
        <QrCode size={16} color="#d4af37" />
        <span>QR Code</span>
      </button>

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccessAdminLogin={() => {
          setAdminInitialTab('bookings');
          setActiveView('admin');
        }}
      />

      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        onOpenAuth={openClientAuth}
        onOpenAdmin={() => {
          setAdminInitialTab('bookings');
          setActiveView('admin');
        }}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
