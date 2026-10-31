import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

export const metadata: Metadata = {
  title: 'SINYORA GEE | Luxury Facial, Cosmetics & Spa — Royal Hostel',
  description:
    'Book clinical-grade machine facials, Korean Glass Skin treatments, soothing full-body massages, bridal makeup packages, and authentic skincare products (Oils, Masks, Shampoos) at Royal Hostel.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b81d5b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="flyer-rose">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

