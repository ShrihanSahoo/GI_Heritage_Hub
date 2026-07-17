'use client';

import Link from 'next/link';
import { Logo } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const aboutLinks = [
    { title: 'Our Story', href: '#' },
    { title: 'Careers', href: '#' },
    { title: 'Press', href: '#' },
];

const helpLinks = [
    { title: 'Help Center', href: '#' },
    { title: 'Shipping & Returns', href: '#' },
    { title: 'Track Order', href: '#' },
]

const legalLinks = [
    { title: 'Terms of Service', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Sitemap', href: '#' },
]

export function Footer() {
    const { t } = useTranslation();
  return (
    <footer className="bg-card border-t">
        <div className="bg-primary/5">
            <div className="container mx-auto px-4 py-16 text-center">
                <Quote className="h-12 w-12 text-primary mx-auto mb-4" />
                <blockquote className="text-2xl md:text-3xl font-headline max-w-3xl mx-auto">
                    "{t('A Geographical Indication (GI) is a name or sign used on products which corresponds to a specific geographical location or origin... a certification that the product possesses certain qualities, is made according to traditional methods, or enjoys a certain reputation, due to its geographical origin.')}"
                </blockquote>
                 <p className="text-sm text-muted-foreground mt-4 uppercase tracking-widest font-bold">- {t('World Intellectual Property Organization (UN)')}</p>
            </div>
        </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
                 <Link href="/" className="flex items-center space-x-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="font-bold text-lg font-headline">
                    {t('GI Heritage Hub')}
                    </span>
                </Link>
                <p className="text-muted-foreground text-sm mt-2">{t("India's Authentic Craft Marketplace.")}</p>
            </div>
            <div>
                <h3 className="font-semibold font-headline mb-4">{t('About')}</h3>
                <ul className="space-y-2">
                    {aboutLinks.map(link => (
                        <li key={link.title}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">{t(link.title)}</Link></li>
                    ))}
                </ul>
            </div>
             <div>
                <h3 className="font-semibold font-headline mb-4">{t('Sell')}</h3>
                <ul className="space-y-2">
                    <li><Link href="/artisans/apply" className="text-sm text-muted-foreground hover:text-primary">{t('Sell on Platform')}</Link></li>
                    <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">{t('Artisan Hub')}</Link></li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold font-headline mb-4">{t('Help')}</h3>
                <ul className="space-y-2">
                    {helpLinks.map(link => (
                        <li key={link.title}><Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">{t(link.title)}</Link></li>
                    ))}
                </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
                <h3 className="font-semibold font-headline mb-4">{t('Subscribe to our newsletter')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('Get updates on new artisans and exclusive offers.')}</p>
                <form className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder={t('Email')} className="bg-background" />
                    <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">{t('Subscribe')}</Button>
                </form>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {t('GI Heritage Hub. All Rights Reserved.')}</p>
             <div className="flex space-x-4 mt-4 md:mt-0">
                {legalLinks.map(link => (
                    <Link key={link.title} href={link.href} className="hover:text-primary">{t(link.title)}</Link>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
}
