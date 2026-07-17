'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * A persistent floating navigation cluster for demo purposes.
 * Provides a "Back" button to return to the last page and a "Home" shortcut.
 */
export function FloatingNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  // Hide the navigation cluster on the home page as there's nowhere to go back to.
  if (pathname === '/') return null;

  return (
    <div className="fixed top-24 left-6 z-[45] print:hidden">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-3"
      >
        {/* Primary Back Button */}
        <div className="group flex items-center gap-3">
          <Button
            size="icon"
            onClick={() => router.back()}
            className="h-12 w-12 rounded-full shadow-2xl bg-background/90 backdrop-blur-xl border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95 shadow-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">{t('Back')}</span>
          </Button>
          
          <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl">
            {t('Go Back')}
          </div>
        </div>

        {/* Secondary Home Shortcut */}
        <div className="group flex items-center gap-3 ml-1">
          <Button
            size="icon"
            variant="outline"
            asChild
            className="h-10 w-10 rounded-full shadow-lg bg-background/50 backdrop-blur-md border border-primary/10 text-primary/60 hover:text-primary transition-all duration-300 hover:scale-110"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">{t('Home')}</span>
            </Link>
          </Button>
          
          <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-md text-primary/60 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md border border-primary/10">
            {t('Home')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
