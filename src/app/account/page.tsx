'use client';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFirebase, useMemoFirebase, useCollection } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { ArrowRight, User, ShoppingBag, Heart, Settings, ShieldCheck, ScrollText, Package, Clock, CheckCircle2 } from 'lucide-react';
import { BusinessInsights } from '@/components/BusinessInsights';
import { BusinessAssistant } from '@/components/BusinessAssistant';
import { motion } from 'framer-motion';

export default function AccountPage() {
  const { user, isUserLoading, firestore, auth } = useFirebase();
  const router = useRouter();
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('');
  const { toast } = useToast();
  const { t } = useTranslation();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );

  const artisanProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'artisan_profiles', user.uid) : null),
    [user, firestore]
  );

  // Fetch pending orders for artisans
  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user || userType !== 'seller') return null;
    return query(
      collection(firestore, 'custom_order_requests'),
      where('artisanId', '==', user.uid),
      where('status', '==', 'pending')
    );
  }, [firestore, user, userType]);

  const { data: pendingOrders } = useCollection(ordersQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (userDocRef) {
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(`${data.firstName} ${data.lastName}`);
          setUserType(data.userType);
        }
      });
    }
  }, [userDocRef]);

  const handleSaveChanges = () => {
    if (!userDocRef) return;

    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const userData = {
        firstName,
        lastName,
    };

    setDoc(userDocRef, userData, { merge: true })
      .then(() => {
        toast({
          title: t('Profile Updated'),
          description: t('Your personal credentials have been updated.'),
        });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-32 text-center">
        <p className="text-primary font-headline text-2xl animate-pulse">{t('Accessing Secure Vault...')}</p>
      </div>
    );
  }

  const isBuyer = userType === 'buyer';

  return (
    <div className="bg-muted/10 min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div className="space-y-1">
                <h1 className="text-5xl font-bold font-headline leading-tight">{t('Welcome, {name}').replace('{name}', name.split(' ')[0])}</h1>
                <div className="flex items-center gap-2">
                    <Badge className={isBuyer ? "bg-primary text-white" : "bg-accent text-accent-foreground"}>
                        {isBuyer ? t('HERITAGE COLLECTOR') : t('MASTER ARTISAN')}
                    </Badge>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> {t('Verified Profile')}
                    </span>
                </div>
            </div>
             <Button variant="outline" asChild className="rounded-full border-primary/20 text-primary">
                <Link href="/mission">
                    <ScrollText className="mr-2 h-4 w-4" /> {t('Return to Mission')}
                </Link>
            </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                {/* Role Specific Actions */}
                {isBuyer ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                         <motion.div whileHover={{ y: -5 }}>
                            <Card className="h-full border-primary/10 shadow-xl rounded-3xl overflow-hidden bg-primary text-primary-foreground border-0">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="font-headline text-3xl">{t('Marketplace')}</CardTitle>
                                    <CardDescription className="text-primary-foreground/60">{t('Continue your journey through Indias heritage clusters.')}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild className="w-full bg-white text-primary hover:bg-white/90 rounded-2xl py-6 font-bold">
                                        <Link href="/products">{t('Start Shopping')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                         <motion.div whileHover={{ y: -5 }}>
                            <Card className="h-full border-muted shadow-xl rounded-3xl overflow-hidden">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4">
                                        <Heart className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="font-headline text-3xl">{t('Wishlist')}</CardTitle>
                                    <CardDescription>{t('View the legacy pieces you have saved for your future collection.')}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild variant="outline" className="w-full rounded-2xl py-6 border-muted text-muted-foreground">
                                        <Link href="/wishlist">{t('View Saved Items')}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                ) : (
                    <div className="space-y-12">
                         <div className="grid sm:grid-cols-2 gap-6">
                            <Card className="border-accent/20 bg-accent text-accent-foreground rounded-3xl group hover:shadow-2xl transition-all">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="font-headline text-3xl">{t('List Heritage')}</CardTitle>
                                    <CardDescription className="text-accent-foreground/60">{t('Showcase a new masterpiece to the global audience.')}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                     <Button asChild className="w-full bg-white text-accent hover:bg-white/90 rounded-2xl py-6 font-bold">
                                        <Link href="/products/new">{t('Start Listing')} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card className="border-muted shadow-xl rounded-3xl">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-4">
                                        <User className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="font-headline text-3xl">{t('Profile Legacy')}</CardTitle>
                                    <CardDescription>{t('Update your story and regional heritage details.')}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild variant="outline" className="w-full rounded-2xl py-6">
                                        <Link href="/account/my-profile">{t('Edit Artisan Page')}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                         </div>

                         {/* Premium AI Strategist Integrated Here */}
                         <BusinessAssistant />

                         <BusinessInsights />
                    </div>
                )}
                
                {/* Identity Settings */}
                <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] bg-card/80 backdrop-blur-sm">
                    <CardHeader className="px-10 pt-10">
                        <div className="flex items-center gap-3 text-primary mb-2">
                            <Settings className="h-5 w-5" />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">{t('Account Security')}</span>
                        </div>
                        <CardTitle className="font-headline text-4xl leading-none">{t('Personal Identity')}</CardTitle>
                        <CardDescription className="text-lg">
                            {t('Manage your verified credentials for secure heritage transactions.')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 py-8 space-y-6">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Full Name')}</Label>
                                <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Verified Email')}</Label>
                                <Input id="email" type="email" value={user.email || ''} disabled className="rounded-2xl py-7 bg-muted/30 border-muted opacity-80 text-lg" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="px-10 pb-10 flex justify-between gap-4">
                        <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90 text-white px-10 py-7 rounded-2xl text-lg shadow-xl shadow-primary/20">
                            {t('Save Credentials')}
                        </Button>
                        <Button variant="ghost" onClick={() => firestore && auth.signOut()} className="text-destructive hover:bg-destructive/5 font-black uppercase tracking-widest text-xs">
                            {t('Logout Securely')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Sidebar Context */}
            <div className="space-y-8">
                {!isBuyer && (
                    <Card className="border-0 bg-accent text-accent-foreground rounded-[2.5rem] p-8 shadow-xl shadow-accent/10">
                        <div className="flex items-center justify-between mb-6">
                            <Clock className="h-8 w-8 opacity-70" />
                            <Badge className="bg-white/20 text-white border-0">{t('Active')}</Badge>
                        </div>
                        <h3 className="font-bold font-headline text-2xl mb-2">{t('Pending Requests')}</h3>
                        <p className="opacity-80 text-sm mb-6 leading-relaxed">
                            {t('Collectors are inquiring about your masterpieces. Respond soon to maintain your Master status.')}
                        </p>
                        <div className="text-4xl font-bold font-headline mb-6">
                            {pendingOrders?.length || 0} <span className="text-lg font-normal opacity-60">{t('Orders')}</span>
                        </div>
                        <Button asChild className="w-full bg-white text-accent hover:bg-white/90 rounded-2xl font-bold py-6">
                            <Link href="#">{t('Manage Inbox')}</Link>
                        </Button>
                    </Card>
                )}

                <Card className="border-0 bg-primary/5 rounded-[2.5rem] p-8">
                    <User className="h-10 w-10 text-primary mb-6" />
                    <h3 className="font-bold font-headline text-2xl mb-2">{t('Trust Verification')}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        {t('Your identity is securely managed and cross-referenced with regional heritage registries to ensure the highest standard of authenticity on our platform.')}
                    </p>
                    <div className="p-4 bg-white rounded-2xl border border-primary/10 flex items-center gap-3">
                        <ShieldCheck className="h-6 w-6 text-green-600" />
                        <span className="font-bold text-xs uppercase tracking-widest">{t('Encryption Active')}</span>
                    </div>
                </Card>
                
                <div className="p-10 bg-accent/10 rounded-[2.5rem] border border-accent/20">
                    <h4 className="text-xl font-bold font-headline mb-4 text-accent-foreground">{t('Need Assistance?')}</h4>
                    <p className="text-sm text-accent-foreground/70 mb-6">{t('Our master heritage support team is available to help with orders, verifications, or custom craft inquiries.')}</p>
                    <Button variant="link" className="p-0 h-auto font-black uppercase tracking-widest text-xs text-accent-foreground">
                        {t('Contact Support')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
