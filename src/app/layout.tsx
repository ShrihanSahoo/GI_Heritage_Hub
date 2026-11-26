import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { FloatingAssistant } from '@/components/FloatingAssistant';
import { FloatingNavigation } from '@/components/FloatingNavigation';
import { Analytics } from '@vercel/analytics/react';
import { getSiteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "GI Heritage Hub | India's Authentic Craft Marketplace",
    template: '%s | GI Heritage Hub',
  },
  description:
    'A verified marketplace for authentic Indian handcrafted goods protected by Geographical Indication (GI) tags.',
  keywords: [
    'GI Heritage Hub',
    'Geographical Indication India',
    'Indian handicrafts',
    'authentic Indian crafts',
    'Indian artisans',
    'Madhubani painting',
    'Kashmiri Pashmina',
    'Jaipur Blue Pottery',
    'Pattachitra',
  ],
  openGraph: {
    type: 'website',
    siteName: 'GI Heritage Hub',
    title: "GI Heritage Hub | India's Authentic Craft Marketplace",
    description:
      'Discover and support master Indian artisans creating Geographical Indication (GI) certified crafts.',
    url: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'm4P3-V36Q3zCMrbXn85Mtlf8eyWugFNWdwDrcH-Hszs',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col'
        )}
      >
        <FirebaseClientProvider>
          <LanguageProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <FloatingNavigation />
                <FloatingAssistant />
                <Toaster />
                <Analytics />
              </WishlistProvider>
            </CartProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
