'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, ArrowRight, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product, Artisan } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface CraftOfTheWeekProps {
  products: Product[];
  artisans: Artisan[];
}

export default function CraftOfTheWeek({ products, artisans }: CraftOfTheWeekProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const craftOfTheWeekProduct = products.find((p) => p.id === 'pattachitra-painting-1');
  const craftOfTheWeekArtisan = artisans.find((a) => a.id === 'shrihan-sahoo');
  
  const pattachitra_description = "Pattachitra is a traditional cloth-based scroll painting from Odisha, known for its intricate details and mythological narratives. This GI-tagged art form uses natural pigments and fine brushes to bring ancient stories to life with vibrant colors and bold lines."
  const bannerImage = PlaceHolderImages.find((img) => img.id === 'artisan-profile-banner');

  const handleAddToCart = () => {
    if (!craftOfTheWeekProduct || !craftOfTheWeekArtisan) return;
    const productForCart = { ...craftOfTheWeekProduct, artisan: t(craftOfTheWeekArtisan.name) };
    addToCart(productForCart);
    toast({
      title: t('Added to cart'),
      description: t('{productName} has been added to your cart.').replace('{productName}', t(craftOfTheWeekProduct.name)),
    });
  };

  if (!craftOfTheWeekProduct || !craftOfTheWeekArtisan) {
    // This will now only show if the specific product/artisan is not in the data, not during load
    return (
      <div className="container mx-auto px-4 text-center">
        <p>{t('The Craft of the Week is currently unavailable. Please check back later.')}</p>
      </div>
    );
  }

  const productImage = PlaceHolderImages.find((img) => img.id === craftOfTheWeekProduct.imageId);

  return (
    <div className="relative py-16 md:py-24">
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
            {t('Craft of the Week')}
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            {t('Each week, we celebrate one of the hundreds of unique craft forms from across India. This week, we feature the ancient art of Pattachitra.')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden group shadow-lg">
            {productImage && (
              <Image
                src={productImage.imageUrl}
                alt={t(craftOfTheWeekProduct.name)}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={productImage.imageHint}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            {craftOfTheWeekProduct.gi_tag && (
              <Badge variant="secondary" className="absolute top-3 left-3 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                {t('GI Verified')}: {t(craftOfTheWeekProduct.gi_tag)}
              </Badge>
            )}
          </div>
          <div className="space-y-4">
            <Badge variant="outline">{t('Weekly Spotlight')}</Badge>
            <h3 className="text-3xl font-bold font-headline">
              {t(craftOfTheWeekProduct.name)}
            </h3>
            <p className="text-lg font-medium">{t(craftOfTheWeekProduct.region)}</p>
            <p className="text-muted-foreground leading-relaxed">
              {t(pattachitra_description)}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div>
                <p className="text-sm text-muted-foreground">{t('by')}</p>
                <p className="font-semibold text-lg">{t(craftOfTheWeekArtisan.name)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <p className="text-2xl font-bold font-headline">
                ₹{craftOfTheWeekProduct.price.toFixed(2)}
              </p>
              <Button onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" /> {t('Add to Cart')}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/products/${craftOfTheWeekProduct.slug}`}>
                  {t('View Details')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
