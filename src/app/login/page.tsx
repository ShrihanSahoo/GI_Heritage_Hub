'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useAuth, useUser } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/account');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/account');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Google sign-in error', error);
        toast({
          variant: 'destructive',
          title: t('Sign-in Failed'),
          description: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/account');
    } catch (error: any) {
      console.error('Email sign-in error', error);
      if (error.code === 'auth/invalid-credential') {
        setError(t('Invalid email or password. Please try again.'));
      } else {
        toast({
          variant: 'destructive',
          title: t('Sign-in Failed'),
          description: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-headline text-xl">{t('Verifying your credentials...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620140036708-455ed5c0426a?q=80&w=2070')] bg-cover bg-center opacity-30 brightness-[0.4]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/50" />

      {/* Decorative Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L60 30 M30 30 L30 60' stroke='white' fill='none'/%3E%3C/svg%3E")` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="mb-8 text-center">
          <Link href="/mission" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back to Mission')}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground mb-2 drop-shadow-md">
            {t('Join the Revolution')}
          </h1>
          <p className="text-primary-foreground/60 font-light italic">
            {t('Enter the hub to discover authentic, verified heritage.')}
          </p>
        </div>

        <Card className="border-white/10 bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-headline text-center">{t('Welcome Back')}</CardTitle>
            <CardDescription className="text-center">
              {t("Secure access to your verified artisan account.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold opacity-70">{t('Email Address')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@heritage.com"
                  required
                  className="bg-background/50 border-white/10 focus:border-primary transition-all py-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold opacity-70">{t('Password')}</Label>
                  <Link
                    href="#"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    {t('Forgot?')}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-background/50 border-white/10 focus:border-primary transition-all py-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                />
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold text-destructive mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <Button type="submit" className="w-full py-6 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all rounded-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {t('Verifying...')}
                  </div>
                ) : t('Access Hub')}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                <span className="bg-background/90 px-3 text-muted-foreground">
                  {t('Verified Provider')}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full py-6 rounded-full border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
              onClick={handleGoogleSignIn}
              type="button"
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin mr-3" />
              ) : (
                <Icons.google className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              )}
              {t('Continue with Google')}
            </Button>

            <div className="mt-8 text-center text-sm font-medium">
              <span className="text-muted-foreground">{t("New to the Revolution?")}</span>{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline transition-all">
                {t('Join the Hub')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
