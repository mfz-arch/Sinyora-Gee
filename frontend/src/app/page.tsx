'use client';

import React, { useState } from 'react';
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
import DownloadAppSection from '@/components/DownloadAppSection';
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
  const [pendingBookingAfterAuth, setPendingBookingAfterAuth] = useState(false);

  const handleRequestBooking = () => {
    if (currentUser) {
      setIsBookingOpen(true);
    } else {
      setPendingBookingAfterAuth(true);
      setAuthInitialMode('signin');
      setIsAuthOpen(true);
    }
  };

  const handleOpenAdminProducts = () => {
    setAdminInitialTab('products');
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openClientAuth = () => {
    setPendingBookingAfterAuth(false);
    setAuthInitialMode('signin');
    setIsAuthOpen(true);
  };

  const openAdminAuth = () => {
    setPendingBookingAfterAuth(false);
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
        onOpenBooking={handleRequestBooking}
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
            <HeroSection onOpenBooking={handleRequestBooking} />
            <DownloadAppSection />
            <ServicesSection onOpenBooking={handleRequestBooking} />
            <ProductsSection
              onOpenAdminProducts={handleOpenAdminProducts}
              onOpenClientPortal={() => setIsClientPortalOpen(true)}
              onOpenAuth={openAdminAuth}
            />
          </>
        )}
      </main>

      {/* Footer is only shown on the client storefront, not on the admin management dashboard */}
      {activeView !== 'admin' && (
        <Footer
          onOpenBooking={handleRequestBooking}
          onOpenAuth={openAdminAuth}
        />
      )}

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onOpenAuth={openClientAuth}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        promptBanner={
          pendingBookingAfterAuth
            ? 'Please sign in or create an account to book. Your name, phone number, and location will be filled in automatically!'
            : undefined
        }
        onClose={() => {
          setIsAuthOpen(false);
        }}
        onSuccessAdminLogin={() => {
          setAdminInitialTab('bookings');
          setActiveView('admin');
        }}
        onSuccessAuth={() => {
          if (pendingBookingAfterAuth) {
            setPendingBookingAfterAuth(false);
            setIsBookingOpen(true);
          }
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
