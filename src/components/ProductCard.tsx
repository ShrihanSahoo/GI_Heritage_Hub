'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Artisan } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  artisans?: Artisan[];
}

export function ProductCard({ product, artisans }: ProductCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { t } = useTranslation();

  const isFavorited = isInWishlist(product.id);

  const artisan = artisans?.find(a => a.id === product.artisanId);
  const artisanName = artisan ? t(artisan.name) : t(product.artisan);
  const slug = product.slug || product.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productForCart = { ...product, artisan: artisanName };
    addToCart(productForCart);
    toast({
      title: t("Acquisition Added"),
      description: t("{productName} is in your procurement bag.").replace('{productName}', t(product.name)),
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFromWishlist(product.id);
      toast({
        title: t("Removed from Wishlist"),
        description: t("{productName} has been removed from your saved heritage.").replace('{productName}', t(product.name)),
      });
    } else {
      addToWishlist(product);
      toast({
        title: t("Saved Heritage"),
        description: t("{productName} has been saved for future discovery.").replace('{productName}', t(product.name)),
      });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden h-full group relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-primary/5 bg-card/50 backdrop-blur-sm">
       <Link href={`/products/${slug}`} className="block overflow-hidden" passHref>
        <CardHeader className="p-0 relative">
          <div className="aspect-square relative">
            {image && (
              <Image
                src={image.imageUrl}
                alt={t(product.name)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={image.imageHint}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
             {product.gi_tag && (
               <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-black text-[10px] tracking-widest shadow-lg border-0 px-2 py-1">
                 {t(product.gi_tag)}
               </Badge>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
               <Button
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={cn(
                    "h-10 w-10 rounded-full shadow-xl transition-all",
                    isFavorited ? "bg-white text-primary hover:bg-white" : "bg-white/80 text-muted-foreground hover:bg-white hover:text-primary"
                  )}
                  aria-label={t('Save to Wishlist')}
                >
                  <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
                </Button>
               <Button
                  size="icon"
                  onClick={handleAddToCart}
                  className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-xl transition-all hover:scale-110"
                  aria-label={t('Add to Cart')}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 flex-grow flex flex-col">
            <div className="flex-grow">
                 <h3 className="font-bold font-headline text-xl leading-tight group-hover:text-primary transition-colors">
                    {t(product.name)}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-widest">
                  {t('Master Artisan')}: <span className="text-primary font-bold">{artisanName}</span>
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase font-black">{t(product.region)}</p>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-primary/5">
               <p className="font-bold text-2xl font-headline text-primary">₹{product.price.toLocaleString()}</p>
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                 {t('View Details')}
               </span>
            </div>
        </CardContent>
       </Link>
    </Card>
  );
}
