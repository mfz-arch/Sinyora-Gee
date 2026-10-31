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
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);

  const handleOpenAdminProducts = () => {
    setAdminInitialTab('products');
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minBlockSize: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenClientPortal={() => setIsClientPortalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {activeView === 'admin' && currentUser?.role === 'admin' ? (
          <AdminDashboard
            initialTab={adminInitialTab}
            onBackToStorefront={() => setActiveView('storefront')}
          />
        ) : (
          <>
            <HeroSection onOpenBooking={() => setIsBookingOpen(true)} />
            <ServicesSection onOpenBooking={() => setIsBookingOpen(true)} />
            <ProductsSection
              onOpenAdminProducts={handleOpenAdminProducts}
              onOpenClientPortal={() => setIsClientPortalOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          </>
        )}
      </main>

      <Footer
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessAdminLogin={() => {
          setAdminInitialTab('bookings');
          setActiveView('admin');
        }}
      />

      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => {
          setAdminInitialTab('bookings');
          setActiveView('admin');
        }}
      />
    </div>
  );
}

