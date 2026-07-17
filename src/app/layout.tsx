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

export const metadata: Metadata = {
  title: 'GI Heritage Hub | India\'s Authentic Craft Marketplace',
  description: 'A verified marketplace for authentic Indian handcrafted goods protected by Geographical Indication (GI) tags.',
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
                </WishlistProvider>
            </CartProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
