'use client';

import { useMemo, useState } from 'react';
import { collection } from 'firebase/firestore';
import { ProductCard } from '@/components/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { products as mockProducts, artisans as mockArtisans, type Artisan, type Product } from '@/lib/data';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, MapPin, Sparkles, ScrollText, ArrowRight, Zap, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { DiscoverRegionsSkeleton } from '@/components/skeletons/DiscoverRegionsSkeleton';
import { CraftOfTheWeekSkeleton } from '@/components/skeletons/CraftOfTheWeekSkeleton';
import { motion } from 'framer-motion';

const DiscoverRegions = dynamic(
  () => import('@/components/DiscoverRegions'),
  { loading: () => <DiscoverRegionsSkeleton />, ssr: false }
);

const CraftOfTheWeek = dynamic(
  () => import('@/components/CraftOfTheWeek'),
  { loading: () => <CraftOfTheWeekSkeleton />, ssr: false }
);

const craftCategories = [
  'Pottery', 'Textiles', 'Painting', 'Woodcraft', 'Leatherwork', 'Metalwork', 'Jewelry'
];

export default function ProductsPage() {
    const { t } = useTranslation();
    const { firestore } = useFirebase();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // --- Live Data Fetching ---
    const productsRef = useMemoFirebase(
        () => collection(firestore, 'products'),
        [firestore]
    );
    const { data: liveProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsRef);

    const artisansRef = useMemoFirebase(
        () => collection(firestore, 'artisan_profiles'),
        [firestore]
    );
    const { data: liveArtisans, isLoading: isLoadingArtisans } = useCollection< Artisan>(artisansRef);

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
    
    const filteredProducts = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return allProducts.filter(p => {
            const matchesSearch = t(p.name).toLowerCase().includes(query) || 
                                t(p.craft).toLowerCase().includes(query) ||
                                t(p.region).toLowerCase().includes(query);
            const matchesCategory = !selectedCategory || t(p.craft) === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [allProducts, searchQuery, selectedCategory, t]);

    const flashDeals = useMemo(() => {
        if (allProducts.length < 3) return allProducts;
        return allProducts.slice(2, 5);
    }, [allProducts]);

    const craftOfTheDay = useMemo(() => {
        return allProducts.length > 1 ? allProducts[1] : allProducts[0];
    }, [allProducts]);

    const isLoading = isLoadingProducts || isLoadingArtisans;

    return (
        <div className="min-h-screen bg-background">
            {/* Shop Hero */}
            <div className="bg-primary/5 border-b py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                            {t('Authentic Heritage Marketplace')}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
                            {t('Discover Verified GI Treasures')}
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            {t('Direct access to Indias most prestigious craft clusters, protected by global intellectual property standards.')}
                        </p>
                        
                        <div className="relative max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder={t('Search by craft, product or region...')}
                                className="pl-12 py-7 text-lg bg-background shadow-xl border-primary/10 rounded-2xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature: Craft of the Week */}
            <section className="bg-white border-b">
                 <CraftOfTheWeek products={allProducts} artisans={allArtisans} />
            </section>

            {/* Feature: Craft of the Day & Offers */}
            {allProducts.length > 0 && (
            <section className="py-16 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Craft of the Day */}
                        <div className="lg:col-span-1">
                            <div className="bg-accent text-accent-foreground p-8 rounded-3xl h-full flex flex-col justify-between shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Clock className="h-48 w-48 -mr-12 -mt-12 rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-md">
                                        <Zap className="h-3 w-3 mr-1 fill-current" /> {t('Craft of the Day')}
                                    </Badge>
                                    <h2 className="text-4xl font-bold font-headline mb-4 leading-tight">{t('24-Hour Heritage Flash')}</h2>
                                    <p className="text-accent-foreground/80 mb-6 italic">{t('Limited quantities, direct from the master workshop.')}</p>
                                    {craftOfTheDay && (
                                        <div className="bg-white/10 rounded-2xl p-4 border border-white/10 mb-6">
                                            <h3 className="font-bold text-xl mb-1">{t(craftOfTheDay.name)}</h3>
                                            <p className="text-sm opacity-90">{t(craftOfTheDay.region)}</p>
                                            <div className="flex items-center gap-2 mt-4">
                                                <span className="text-2xl font-bold">₹{(craftOfTheDay.price * 0.8).toFixed(0)}</span>
                                                <span className="line-through text-sm opacity-60">₹{craftOfTheDay.price}</span>
                                                <Badge className="bg-green-500 text-white border-0">20% {t('Off')}</Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button asChild className="w-full bg-white text-accent hover:bg-white/90 py-7 text-lg rounded-2xl relative z-10 shadow-lg">
                                    <Link href={`/products/${craftOfTheDay?.slug || '#'}`}>
                                        {t('Claim Daily Deal')}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Special Offers Grid */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold font-headline flex items-center gap-2">
                                    <Gift className="h-6 w-6 text-primary" />
                                    {t('Collector Offers')}
                                </h2>
                                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{t('Limited Time Only')}</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {flashDeals.map((product, idx) => (
                                    <motion.div 
                                        key={product.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="relative"
                                    >
                                        <div className="absolute -top-2 -left-2 z-10 bg-primary text-white text-[10px] font-black tracking-tighter px-3 py-1 rounded-full shadow-lg">
                                            {idx % 2 === 0 ? t('LEGACY DEAL') : t('MASTER OFFER')}
                                        </div>
                                        <ProductCard product={product} artisans={allArtisans} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Regional Specialties Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <MapPin className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold font-headline">{t('Explore Regional Specialties')}</h2>
                    </div>
                    <DiscoverRegions products={allProducts} />
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold font-headline text-xl">{t('Craft Categories')}</h3>
                                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex flex-wrap md:flex-col gap-2">
                                <Button 
                                    variant={selectedCategory === null ? 'default' : 'ghost'} 
                                    className="justify-start rounded-full" 
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    {t('All Crafts')}
                                </Button>
                                {craftCategories.map(cat => (
                                    <Button 
                                        key={cat}
                                        variant={selectedCategory === cat ? 'default' : 'ghost'} 
                                        className="justify-start rounded-full"
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {t(cat)}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-accent/5 rounded-3xl border border-accent/10 shadow-inner">
                            <Sparkles className="h-8 w-8 text-accent-foreground mb-4" />
                            <h4 className="font-bold text-lg mb-2">{t('GI Verification')}</h4>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                {t('Every product with a GI badge is legally verified for its origin, materials, and quality by master craft councils.')}
                            </p>
                            <Button variant="outline" className="w-full border-accent/20 text-accent-foreground font-bold rounded-xl">
                                {t('Learn More')} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-grow">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-4xl font-bold font-headline">
                                {selectedCategory || t('Global Collection')}
                                <span className="ml-4 text-sm font-normal text-muted-foreground tracking-widest uppercase">({filteredProducts.length} {t('items found')})</span>
                            </h2>
                        </div>

                        {isLoading && filteredProducts.length === 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-card rounded-lg p-4 space-y-4">
                                        <div className="bg-muted animate-pulse h-64 w-full rounded-md"></div>
                                        <div className="space-y-2">
                                            <div className="bg-muted animate-pulse h-6 w-3/4 rounded-md"></div>
                                            <div className="bg-muted animate-pulse h-4 w-1/2 rounded-md"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} artisans={allArtisans} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 border-2 border-dashed rounded-3xl bg-muted/10">
                                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <h3 className="text-2xl font-bold">{t('No crafts match your filter')}</h3>
                                <p className="text-muted-foreground mt-2">{t('Try adjusting your search or category selection.')}</p>
                                <Button variant="outline" className="mt-8 rounded-full px-8" onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                                    {t('Reset All Filters')}
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
