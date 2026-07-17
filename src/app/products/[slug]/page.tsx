'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, ArrowRight, MessageSquare, Award, History, Info, CheckCircle2, Languages, Bot, Layers, Hammer, Timer, Heart } from 'lucide-react';
import React, { use, useMemo, useState } from 'react';
import { doc } from 'firebase/firestore';

import { products as mockProducts, artisans as mockArtisans, Artisan, Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { t } = useTranslation();
  const { firestore } = useFirebase();
  const [activeTab, setActiveTab] = useState('story');
  
  // --- Live Data Fetching ---
  const productRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'products', resolvedParams.slug) : null),
    [firestore, resolvedParams.slug]
  );
  const { data: liveProduct, isLoading: isLoadingProduct } = useDoc<Product>(productRef);

  const artisanRef = useMemoFirebase(
    () => (firestore && liveProduct ? doc(firestore, 'artisan_profiles', liveProduct.artisanId) : null),
    [firestore, liveProduct]
  );
  const { data: liveArtisan, isLoading: isLoadingArtisan } = useDoc<Artisan>(artisanRef);

  // --- Data Merging ---
  const product = useMemo(() => {
    if (liveProduct) return liveProduct;
    return mockProducts.find((p) => p.slug === resolvedParams.slug);
  }, [liveProduct, resolvedParams.slug]);

  const artisan = useMemo(() => {
    if (liveArtisan) return liveArtisan;
    if (!product) return undefined;
    return mockArtisans.find((a) => a.id === product.artisanId);
  }, [liveArtisan, product]);

  const isCollected = product ? isInWishlist(product.id) : false;

  if (isLoadingProduct || isLoadingArtisan) {
    return (
      <div className="container mx-auto py-32 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto" />
          <p className="text-primary font-headline text-2xl">{t('Curating Heritage Details...')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }
  
  const productImage = PlaceHolderImages.find((img) => img.id === product.imageId);
  const artisanImage = PlaceHolderImages.find((img) => img.id === artisan?.imageId);

  const handleAddToCart = () => {
    if (!artisan) return;
    const productForCart = { ...product, artisan: t(artisan.name) };
    addToCart(productForCart);
    toast({
      title: t("Acquisition Added"),
      description: t('{productName} has been added to your curated bag.').replace('{productName}', t(product.name)),
    });
  };

  const handleToggleCollection = () => {
    if (isCollected) {
      removeFromWishlist(product.id);
      toast({
        title: t("Removed from Gallery"),
        description: t('{productName} has been removed from your curated gallery.').replace('{productName}', t(product.name)),
      });
    } else {
      addToWishlist(product);
      toast({
        title: t("Heritage Saved"),
        description: t('{productName} is now part of your personal gallery.').replace('{productName}', t(product.name)),
      });
    }
  };

  const handleInitiateChat = () => {
    if (artisan) {
        router.push(`/chat?artisanId=${artisan.id}`);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation Context */}
      <div className="bg-primary/5 py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" /> {t('Global Collection')}
          </Link>
          <div className="flex gap-4">
            <span className="text-primary">{t(product.craft)}</span>
            <span>/</span>
            <span>{t(product.region)}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Visual Showcase */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white group"
            >
              {productImage && (
                <Image
                  src={productImage.imageUrl}
                  alt={t(product.name)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  data-ai-hint={productImage.imageHint}
                  priority
                />
              )}
              {product.gi_tag && (
                <div className="absolute top-6 left-6 z-10">
                   <Badge className="bg-accent text-accent-foreground px-4 py-2 text-sm font-black shadow-lg rounded-full flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    {t(product.gi_tag)} {t('VERIFIED')}
                  </Badge>
                </div>
              )}
            </motion.div>
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square relative rounded-2xl overflow-hidden border-2 border-muted hover:border-primary transition-colors cursor-pointer">
                   <Image
                    src={`https://picsum.photos/seed/${product.id}${i}/400/400`}
                    alt="Detail view"
                    fill
                    className="object-cover"
                    data-ai-hint={productImage?.imageHint}
                  />
                </div>
              ))}
              <div className="aspect-square bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-2 text-muted-foreground border-2 border-dashed">
                <Info className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold uppercase">{t('Craft Specs')}</span>
              </div>
            </div>
          </div>

          {/* Narrative & Conversion */}
          <div className="flex flex-col space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold">
                  {t('Authentic Indian Heritage')}
                </Badge>
                <div className="flex text-accent ml-auto">
                    {[1,2,3,4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    <Star className="w-4 h-4 fill-current/30" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-headline leading-tight">{t(product.name)}</h1>
              {artisan && (
                <Link href={`/artisans/${artisan.slug}`} className="flex items-center gap-3 text-xl text-muted-foreground hover:text-primary transition-colors group">
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                     {artisanImage ? <AvatarImage src={artisanImage.imageUrl} /> : <AvatarFallback>{t(artisan.name).charAt(0)}</AvatarFallback>}
                  </Avatar>
                  {t('Handcrafted by Master {artisan}').replace('{artisan}', t(artisan.name))}
                </Link>
              )}
            </div>

            <div className="flex items-baseline gap-4">
               <p className="text-5xl font-bold font-headline text-primary">₹{product.price.toLocaleString()}</p>
               <span className="text-muted-foreground line-through text-xl">₹{(product.price * 1.2).toFixed(0)}</span>
               <Badge className="bg-green-500 text-white border-0 py-1.5">{t('Direct Artisan Price')}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-muted/30 p-4 rounded-2xl border border-muted flex items-start gap-3">
                  <History className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">{t('Legacy Time')}</h4>
                    <p className="text-muted-foreground text-sm">{t('Approx 12-15 Days to Craft')}</p>
                  </div>
               </div>
               <div className="bg-muted/30 p-4 rounded-2xl border border-muted flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">{t('Safe Arrival')}</h4>
                    <p className="text-muted-foreground text-sm">{t('Insured Heritage Shipping')}</p>
                  </div>
               </div>
            </div>

            {/* Authenticity Passport Tabs */}
            <div className="space-y-6">
                <div className="flex border-b border-muted">
                    {['story', 'verification', 'artisan'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-6 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t(tab)}
                            {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
                        </button>
                    ))}
                </div>
                
                <div className="min-h-[120px] text-lg leading-relaxed font-light">
                    {activeTab === 'story' && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <p className="italic text-muted-foreground text-xl leading-relaxed">{t(product.description)}</p>
                            
                            <div className="grid sm:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs">
                                        <Layers className="h-4 w-4" /> {t('Material Composition')}
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium bg-muted/20 p-4 rounded-2xl border border-primary/5">
                                        {t('Utilizing region-specific {materials} found only in the {region} clusters.').replace('{materials}', t(product.materials || 'traditional components')).replace('{region}', t(product.region))}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] text-xs">
                                        <Hammer className="h-4 w-4" /> {t('Master Technique')}
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium bg-muted/20 p-4 rounded-2xl border border-primary/5">
                                        {t('Crafted using the {technique}, a heritage method protected by GI certification.').replace('{technique}', t(product.makingTechnique || 'traditional ancient method'))}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'verification' && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
                                <span className="font-bold text-sm text-accent-foreground uppercase tracking-wider">{t('Verified GI Registry Entry: #2024-H01')}</span>
                            </div>
                            <p className="text-base text-muted-foreground">
                                {t('This item is legally protected under the Geographical Indications of Goods Act. Every material used, from the natural pigments to the local soil, is audited for regional authenticity.')}
                            </p>
                            <div className="p-4 bg-muted/20 rounded-xl flex items-start gap-3">
                                <Info className="h-5 w-5 text-primary flex-shrink-0" />
                                <p className="text-xs text-muted-foreground">{t('Includes physical GI Seal and Digital QR passport for global trade tracking.')}</p>
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'artisan' && artisan && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl flex-shrink-0">
                                {artisanImage && <AvatarImage src={artisanImage.imageUrl} />}
                                <AvatarFallback>{t(artisan.name).charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <h4 className="font-bold text-xl font-headline mb-2">{t(artisan.name)}</h4>
                                <p className="text-base text-muted-foreground line-clamp-3 mb-4">{t(artisan.story)}</p>
                                <Button variant="link" asChild className="p-0 h-auto font-black text-primary uppercase text-xs tracking-widest">
                                    <Link href={`/artisans/${artisan.slug || artisan.id}`}>{t('View Master Portfolio')} <ArrowRight className="h-4 w-4 ml-2" /></Link>
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                variant="outline" 
                className={cn(
                  "flex-1 py-8 text-lg rounded-2xl border-primary/20 hover:bg-primary/5 group transition-all",
                  isCollected && "bg-primary/10 text-primary border-primary shadow-inner"
                )}
                onClick={handleToggleCollection}
              >
                {isCollected ? (
                  <Heart className="mr-2 h-5 w-5 text-primary fill-current" />
                ) : (
                  <Award className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                )}
                {isCollected ? t('In Collection') : t('Add to Collection')}
              </Button>
              <Button size="lg" className="flex-1 py-8 text-lg rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/20" onClick={() => { handleAddToCart(); router.push('/cart'); }}>
                {t('Acquire Now')}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-12 pt-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="text-muted-foreground hover:text-primary font-bold uppercase text-xs tracking-widest group">
                            <MessageSquare className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> {t('Ask the Maker (AI)')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-primary/10 shadow-2xl p-10">
                        <DialogHeader>
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <Bot className="h-8 w-8 text-primary" />
                        </div>
                        <DialogTitle className='font-headline text-3xl mb-2'>{t('Direct Bridge to {artisanName}').replace('{artisanName}', artisan ? t(artisan.name) : '')}</DialogTitle>
                        <DialogDescription className="text-lg">
                            {t('Ask our master artisan about the legacy, materials, or request a custom heritage variation of this piece.')}
                        </DialogDescription>
                        </DialogHeader>
                        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 my-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Badge className="bg-primary text-white px-3 py-1 font-black text-[10px] tracking-widest">{t('AI POWERED TRANSLATION')}</Badge>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('Translating instantly to artisan\'s local language')}</span>
                            </div>
                            <div className="grid w-full gap-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Languages className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">{t('Available in 10+ Indian Languages')}</span>
                                </div>
                                <Textarea placeholder={t('Tell me more about the pigments used in this piece...')} id="message" className="min-h-[150px] bg-background rounded-2xl border-primary/5 p-4 shadow-inner" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" onClick={handleInitiateChat} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-8 text-xl rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-[1.02]">
                                {t('Initiate Heritage Chat')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                <Link href="#" className="text-muted-foreground hover:text-primary font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                    <Info className="h-4 w-4" /> {t('GI Certification Details')}
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
