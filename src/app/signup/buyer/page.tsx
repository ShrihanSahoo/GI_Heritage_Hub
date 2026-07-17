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
import { useAuth, useFirestore, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, ShoppingBag, CheckCircle2, ScrollText } from 'lucide-react';

export default function SignupBuyerPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/products'); // Drop buyers straight into the shop
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        userType: 'buyer',
        googleId: user.uid,
        createdAt: new Date().toISOString(),
      };

      setDoc(userRef, userData, { merge: true }).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push('/products');
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast({
          variant: 'destructive',
          title: t('Sign-up Failed'),
          description: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        userType: 'buyer',
        createdAt: new Date().toISOString(),
      };

      setDoc(userRef, userData).catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'create',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      router.push('/products');
    } catch (error: any) {
      console.error('Email sign-up error', error);
      let errorMessage = 'Could not create account.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please log in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
      }
      setError(t(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-primary font-headline text-xl">{t('Preparing your shopping hub...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-muted/30 -z-10" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="w-full max-w-xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-full flex justify-between mb-8">
            <Link href="/signup" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back')}
            </Link>
            <Link href="/mission" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-bold uppercase tracking-widest">
              <ScrollText className="mr-2 h-4 w-4" /> {t('Mission')}
            </Link>
          </div>
          <div className="p-4 rounded-full bg-primary/10 mb-4 shadow-inner">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-headline text-center">{t('The Collector\'s Account')}</h1>
          <p className="text-muted-foreground text-center mt-2 italic">
            {t('Join the revolution to discover and acquire verified heritage.')}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-2xl border-primary/5 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{t('Buyer Profile Details')}</CardTitle>
              <CardDescription>
                {t('Please provide your full details to enable secure checkout and direct artisan communication.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignUp} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">{t('First Name')}</Label>
                    <Input
                      id="first-name"
                      placeholder="e.g. Ananya"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">{t('Last Name')}</Label>
                    <Input
                      id="last-name"
                      placeholder="e.g. Sharma"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="py-6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('Email Address')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    className="py-6"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('Phone Number (Optional)')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('Create Password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                      className="py-6"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm font-bold text-destructive flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 rotate-45" /> {error}
                  </p>
                )}

                <Button type="submit" className="w-full py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      {t('Creating Hub...')}
                    </div>
                  ) : (
                    t('Enter the Hub')
                  )}
                </Button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                    <span className="bg-card px-4 text-muted-foreground">
                      {t('Or Quick Join')}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full py-7 rounded-full border-primary/10 hover:bg-primary/5 transition-all group"
                  onClick={handleGoogleSignIn}
                  type="button"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin mr-3" />
                  ) : (
                    <Icons.google className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  )}
                  {t('Join with Google')}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <span className="text-muted-foreground">{t("Changed your mind?")}</span>{' '}
                <Link href="/signup" className="text-primary font-bold hover:underline transition-all">
                  {t('View Artisan Path')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
