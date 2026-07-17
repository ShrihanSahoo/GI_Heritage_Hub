'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Briefcase, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-12">
      {/* Background Decor */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590001158193-790179980530?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"
        aria-hidden="true"
      />
      
      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <div className="mb-12 text-center">
          <Link href="/mission" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back to Mission')}
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight">
            {t('Join the Hub')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
            {t('Choose your path in the heritage revolution. Are you here to discover or to create?')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyer Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card className="h-full border-primary/10 hover:border-primary/40 transition-all shadow-xl hover:shadow-primary/5 flex flex-col">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-headline">{t("I'm a Buyer")}</CardTitle>
                <CardDescription className="text-base">
                  {t('Discover authentic GI-tagged crafts and support rural masters.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center p-8">
                <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" /> {t('Verified Authenticity')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" /> {t('Direct Artisan Chat')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" /> {t('Global Shipping')}
                  </li>
                </ul>
                <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 rounded-full py-7 text-lg shadow-lg">
                  <Link href="/signup/buyer">
                    {t('Sign up to Shop')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Artisan Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card className="h-full border-accent/10 hover:border-accent/40 transition-all shadow-xl hover:shadow-accent/5 flex flex-col">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-3xl font-headline">{t("I'm an Artisan")}</CardTitle>
                <CardDescription className="text-base">
                  {t('Showcase your legacy and connect with global collectors.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center p-8">
                <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" /> {t('GI Certification Badge')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" /> {t('AI Translation Hub')}
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" /> {t('Direct-to-Consumer')}
                  </li>
                </ul>
                <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full py-7 text-lg shadow-lg">
                  <Link href="/artisans/apply">
                    {t('Apply to Sell')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          {t('Already have an account?')}{' '}
          <Link href="/login" className="text-primary font-bold hover:underline">
            {t('Login here')}
          </Link>
        </div>
      </div>
    </div>
  );
}
