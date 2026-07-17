'use client';

import Link from 'next/link';
import { User, Languages, Check, ScrollText, ShoppingCart, Heart, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { useTranslation } from '@/hooks/useTranslation';
import { languages } from '@/lib/language-data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Badge } from '@/components/ui/badge';
import { doc } from 'firebase/firestore';

export function Header() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { t, setLanguage, language } = useTranslation();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const pathname = usePathname();
  
  // Artisan status detection
  const artisanDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'artisan_profiles', user.uid) : null),
    [user, firestore]
  );
  const { data: artisanProfile } = useDoc(artisanDocRef);
  const isArtisan = !!artisanProfile;

  const isLoggedIn = !!user;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    auth.signOut();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid grid-cols-3 h-20 items-center">
        {/* Left: Logo */}
        <div className="flex justify-start items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold font-headline text-xl tracking-tight hidden lg:inline">
              {t('GI Heritage Hub')}
            </span>
          </Link>
          
          <Button variant="ghost" asChild className="hidden md:flex text-xs font-bold uppercase tracking-widest text-primary/70 hover:text-primary">
            <Link href="/mission">
              <ScrollText className="mr-2 h-4 w-4" />
              {t('Our Mission')}
            </Link>
          </Button>

          {isArtisan && (
            <Button variant="ghost" asChild className={cn(
              "hidden lg:flex text-xs font-black uppercase tracking-[0.2em] transition-all",
              pathname === '/premium' ? "text-accent border-b-2 border-accent rounded-none h-20" : "text-muted-foreground hover:text-accent"
            )}>
              <Link href="/premium" className="flex items-center gap-2">
                <Crown className="h-4 w-4 fill-accent text-accent" />
                {t('Premium Hub')}
              </Link>
            </Button>
          )}
        </div>

        {/* Center: Primary Actions (Auth) */}
        <div className="flex items-center justify-center">
          {isUserLoading ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-primary/20 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                  <User className="h-5 w-5 text-primary" />
                  <span className="sr-only">{t('User Profile')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuLabel className='font-headline text-lg'>{t('My Account')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">{t('Dashboard')}</Link>
                </DropdownMenuItem>
                {isArtisan && (
                  <DropdownMenuItem asChild>
                    <Link href="/premium" className="cursor-pointer font-bold text-accent">
                      <Crown className="mr-2 h-3 w-3 fill-accent" /> {t('Premium Hub')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account/my-profile" className="cursor-pointer">{t('Public Profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="cursor-pointer">{t('My Collection')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cart" className="cursor-pointer">{t('My Bag')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer font-bold">
                  {t('Log out')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                <Link href="/login">{t('Login')}</Link>
            </Button>
          )}
        </div>

        {/* Right: Utility (Language, Wishlist & Cart) */}
        <div className="flex justify-end items-center gap-2 md:gap-4">
           <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-xs font-bold uppercase tracking-widest">
            <Link href="/products">{t('Shop All')}</Link>
          </Button>

          {/* Wishlist Button */}
          <Button variant="ghost" size="icon" asChild className="relative rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[8px] bg-primary text-white border-2 border-background">
                  {wishlistCount}
                </Badge>
              )}
              <span className="sr-only">{t('Wishlist')}</span>
            </Link>
          </Button>

          {/* Cart Button */}
          <Button variant="ghost" size="icon" asChild className="relative rounded-full hover:bg-primary/10">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-accent text-accent-foreground border-2 border-background">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">{t('Shopping Cart')}</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <Languages className="h-5 w-5" />
                <span className="sr-only">{t('Change language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-96 overflow-y-auto w-56">
              <DropdownMenuLabel>{t('Select Language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.value}
                  onSelect={() => setLanguage(lang.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      language === lang.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
