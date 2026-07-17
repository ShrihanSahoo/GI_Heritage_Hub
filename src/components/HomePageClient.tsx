'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { collection, doc } from 'firebase/firestore';
import { ArrowRight, Globe, ShieldCheck, MessagesSquare } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirebase, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product, Artisan } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { products as mockProducts, artisans as mockArtisans } from '@/lib/data';
import { ArtisanCard } from '@/components/ArtisanCard';
import { ProductCard } from '@/components/ProductCard';


import { FeaturedProductsSkeleton } from './skeletons/FeaturedProductsSkeleton';
import { CraftOfTheWeekSkeleton } from './skeletons/CraftOfTheWeekSkeleton';
import { FeaturedArtisansSkeleton } from './skeletons/FeaturedArtisansSkeleton';
import { DiscoverRegionsSkeleton } from './skeletons/DiscoverRegionsSkeleton';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-pottery');
const bannerImage = PlaceHolderImages.find((img) => img.id === 'artisan-profile-banner');


const CraftOfTheWeek = dynamic(
  () => import('@/components/CraftOfTheWeek'),
  { loading: () => <CraftOfTheWeekSkeleton /> }
);

const DiscoverRegions = dynamic(
  () => import('@/components/DiscoverRegions'),
  { loading: () => <DiscoverRegionsSkeleton /> }
);


export default function HomePageClient() {
  const { t } = useTranslation();
  const { firestore, user, isUserLoading } = useFirebase();

  // --- Artisan Status Check ---
  const artisanDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'artisan_profiles', user.uid) : null),
    [user, firestore]
  );
  const { data: artisanProfile, isLoading: isArtisanLoading } = useDoc<Artisan>(artisanDocRef);
  const isArtisan = !!artisanProfile;
  const isLoadingAuth = isUserLoading || isArtisanLoading;


  // --- Live Data Fetching ---
  const productsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'products') : null),
    [firestore]
  );
  const { data: liveProducts } = useCollection<Product>(productsRef);
  
  const artisansRef = useMemoFirebase(
    () => collection(firestore, 'artisan_profiles'),
    [firestore]
  );
  const { data: liveArtisans } = useCollection<Artisan>(artisansRef);

  // --- Data Merging ---
  const allProducts = useMemo(() => {
    const productMap = new Map<string, Product>();
    mockProducts.forEach(p => productMap.set(p.id, p));
    liveProducts?.forEach(p => productMap.set(p.id, p));
    return Array.from(productMap.values());
  }, [liveProducts]);

  const allArtisans = useMemo(() => {
    const artisanMap = new Map<string, Artisan>();
    mockArtisans.forEach(a => artisanMap.set(a.id, a));
    liveArtisans?.forEach(a => artisanMap.set(a.id, a));
    return Array.from(artisanMap.values());
  }, [liveArtisans]);
  
  const featuredProducts = allProducts.slice(0, 8);
  const featuredArtisans = allArtisans.slice(0, 6);
  

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold !text-primary-foreground drop-shadow-md break-words">
            {t('Discover the Soul of Indian Craftsmanship')}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto !text-primary-foreground/90 drop-shadow break-words">
            {t('A curated marketplace for authentic, handcrafted goods with verified Geographical Indication (GI) tags.')}
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">
              {t('Explore Crafts')} <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {!isLoadingAuth && isArtisan && artisanProfile && (
        <section className="bg-primary/10 py-12">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-headline font-bold">
                    {t('Welcome back, {artisanName}!').replace('{artisanName}', t(artisanProfile.name))}
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">{t("Ready to showcase more of your amazing work?")}</p>
                <Button asChild size="lg" className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/products/new">
                        {t('List a New Craft')} <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
        </section>
      )}

      <section
        id="why-us"
        className="py-16 md:py-24 bg-background relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='hsl(var(--border))'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/90" />
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            {t('Why Choose Our Artisans?')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-left overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <ShieldCheck className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-headline font-semibold mb-2">
                        {t('GI Tag Verified')}
                        </CardTitle>
                        <CardDescription className="text-base">
                        {t('Shop with confidence knowing each product is verified for its authentic origin and quality through GI tags.')}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
             <Card className="text-left overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Globe className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-headline font-semibold mb-2">
                        {t('Direct from Artisans')}
                        </CardTitle>
                        <CardDescription className="text-base">
                        {t('Connect directly with the creators, learn their stories, and support their heritage.')}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
             <Card className="text-left overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <MessagesSquare className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-headline font-semibold mb-2">
                        {t('Seamless Communication')}
                        </CardTitle>
                        <CardDescription className="text-base">
                        {t('Our in-app chat with live translation removes language barriers for custom orders and queries.')}
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="featured-products" className="py-16 md:py-24 relative">
        {bannerImage && (
          <Image
            src={bannerImage.imageUrl}
            alt="Background of Indian textiles"
            fill
            className="object-cover"
            data-ai-hint={bannerImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              {t('Featured Products')}
            </h2>
            <Button variant="link" asChild>
              <Link href="/products">
                {t('View All')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1 h-full">
                     <ProductCard product={product} artisans={allArtisans} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
      </section>
      
      <CraftOfTheWeek products={allProducts} artisans={allArtisans} />

      <section id="featured-artisans" className="py-16 md:py-24 relative">
         {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Background of Indian textiles"
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              {t('Meet the Artisans')}
            </h2>
             <Button variant="link" asChild>
              <Link href="/artisans">
                {t('View All')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
           <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredArtisans.map((artisan) => (
                <CarouselItem key={artisan.id} className="sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
                   <div className="p-1 h-full">
                    <ArtisanCard artisan={artisan} />
                   </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-14" />
            <CarouselNext className="mr-14" />
          </Carousel>
        </div>
      </section>

      <section id="discover-regions" className="py-16 md:py-24 relative">
        {bannerImage && (
            <Image
                src={bannerImage.imageUrl}
                alt="Background of Indian textiles"
                fill
                className="object-cover"
                data-ai-hint={bannerImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">
              {t('Discover by Region')}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Explore the unique craft traditions from different parts of India.'
              )}
            </p>
             <Button variant="link" asChild className="mt-2">
              <Link href="#">
                {t('View All Regions')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <DiscoverRegions />
        </div>
      </section>

      {!isLoadingAuth && !isArtisan && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary/90 rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-primary-foreground">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-headline font-bold">{t('Are you an Artisan?')}</h2>
                <p className="mt-2 text-lg opacity-90 max-w-xl">
                  {t('Join our community to showcase your craft to a global audience and preserve your cultural heritage.')}
                </p>
              </div>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0">
                <Link href="/artisans/apply">
                  {t('Start Selling Today')} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
