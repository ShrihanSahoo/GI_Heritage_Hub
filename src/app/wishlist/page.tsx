'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Heart, Trash2, ShoppingCart, ArrowRight, ScrollText, Sparkles, MoveRight, ShieldCheck, History } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleMoveToCart = (product: any) => {
    // Add to cart with quantity 1
    const cartProduct = { ...product, quantity: 1 };
    addToCart(cartProduct);
    removeFromWishlist(product.id);
    toast({
      title: t("Acquisition Ready"),
      description: t('{name} has been moved to your procurement bag.').replace('{name}', t(product.name)),
    });
  };

  return (
    <div className="bg-muted/10 min-h-screen pb-24">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-primary/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs">
              <Heart className="h-4 w-4 fill-current" /> {t('Saved Heritage Gallery')}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline leading-none">{t('Your Collection')}</h1>
            <p className="text-xl text-muted-foreground font-light">{t('Curating pieces of history for your future legacy.')}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild className="rounded-full text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs">
              <Link href="/mission">
                <ScrollText className="mr-2 h-4 w-4" /> {t('Mission')}
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full border-primary/10 font-bold uppercase tracking-widest text-xs">
              <Link href="/products">
                {t('Continue Discovery')}
              </Link>
            </Button>
          </div>
        </div>

        {wishlist.length > 0 ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="font-black uppercase tracking-widest text-xs text-primary/70">{t('Curated Items')} ({wishlist.length})</span>
              <Button variant="link" onClick={clearWishlist} className="text-xs font-bold text-muted-foreground hover:text-destructive p-0 h-auto uppercase tracking-widest">{t('Clear Gallery')}</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {wishlist.map((product) => {
                  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
                  const artisanName = typeof product.artisan === 'string' ? product.artisan : t(product.artisan);
                  
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="border-primary/5 shadow-xl rounded-[2rem] overflow-hidden bg-card group relative h-full flex flex-col">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          {image ? (
                            <Image
                              src={image.imageUrl}
                              alt={t(product.name)}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Heart className="h-12 w-12 text-primary/20" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-4 right-4">
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              className="rounded-full h-10 w-10 shadow-lg scale-0 group-hover:scale-100 transition-transform"
                              onClick={() => removeFromWishlist(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {product.gi_tag && (
                            <Badge className="absolute bottom-4 left-4 bg-accent text-accent-foreground font-black text-[10px] tracking-widest shadow-lg border-0">
                              {t(product.gi_tag)}
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-8 flex-grow flex flex-col">
                          <div className="flex justify-between items-start mb-2 gap-4">
                             <h3 className="font-bold font-headline text-2xl leading-tight group-hover:text-primary transition-colors flex-grow">
                                {t(product.name)}
                             </h3>
                             <p className="text-xl font-bold font-headline text-primary whitespace-nowrap">₹{product.price.toLocaleString()}</p>
                          </div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-6">
                            {t(product.craft)} • {t(product.region)}
                          </p>
                          
                          <div className="flex items-center gap-4 mb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-t pt-4 mt-auto">
                            <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> {t('Verified')}</span>
                            <span className="flex items-center gap-1"><History className="h-3 w-3 text-amber-600" /> {t('Legacy Piece')}</span>
                          </div>

                          <Button 
                            onClick={() => handleMoveToCart(product)} 
                            className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-bold shadow-lg shadow-primary/20 group/btn"
                          >
                            <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                            {t('Move to Bag')}
                            <MoveRight className="ml-2 h-4 w-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-primary/10 max-w-4xl mx-auto shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkles className="h-64 w-64 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h2 className="text-4xl font-bold font-headline mb-4">{t('Your gallery is awaiting curation')}</h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto">{t('Explore the subcontinent to find pieces that resonate with your soul.')}</p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-12 py-7 text-xl rounded-2xl shadow-xl shadow-primary/20">
                <Link href="/products">{t('Start Collecting')}</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Curation Tips */}
        {wishlist.length > 0 && (
          <div className="mt-24 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-accent/10 rounded-[2.5rem] border border-accent/20">
              <Sparkles className="h-8 w-8 text-accent-foreground mb-4" />
              <h4 className="text-xl font-bold font-headline mb-2 text-accent-foreground">{t('Collector\'s Tip')}</h4>
              <p className="text-sm text-accent-foreground/70 leading-relaxed">
                {t('Saved heritage pieces are regularly audited. If an artisan updates the price or listing details, your gallery will update instantly to reflect the latest verified information.')}
              </p>
            </div>
            <div className="p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary mb-4" />
              <h4 className="text-xl font-bold font-headline mb-2 text-primary">{t('Verification Guarantee')}</h4>
              <p className="text-sm text-primary/70 leading-relaxed">
                {t('Every item in your collection carries a Digital Passport. Once you move an item to your bag, you can view its full GI certification details during the procurement flow.')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
