'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-center py-20 md:py-32">
        <Frown className="w-24 h-24 text-primary/50 mb-4" />
      <h1 className="text-5xl md:text-7xl font-bold font-headline mb-2">{t('404 - Page Not Found')}</h1>
      <p className="text-xl text-muted-foreground mb-8">
        {t("The page you're looking for doesn't exist or has been moved.")}
      </p>
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/">{t('Go back to Homepage')}</Link>
      </Button>
    </div>
  )
}
