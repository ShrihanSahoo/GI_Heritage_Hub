'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight, Package, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/data';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const regions = [
  {
    name: 'Rajasthan',
    imageId: 'region-rajasthan',
    crafts: ['Blue Pottery', 'Meenakari', 'Thewa', 'Molela Clay Work', 'Woodcraft'],
  },
  {
    name: 'Gujarat',
    imageId: 'region-gujarat',
    crafts: ['Bandhani', 'Patola', 'Kutchi Embroidery', 'Beadwork'],
  },
  {
    name: 'Kashmir',
    imageId: 'region-kashmir',
    crafts: ['Pashmina Shawls', 'Walnut Wood Carving', 'Sozni Embroidery', 'Papier-mâché'],
  },
  {
    name: 'Bihar',
    imageId: 'region-bihar',
    crafts: ['Madhubani Painting', 'Sikki Grass Work', 'Bhagalpuri Silk'],
  },
  {
    name: 'Odisha',
    imageId: 'region-odisha',
    crafts: ['Pattachitra', 'Silver Filigree (Tarakasi)', 'Appliqué (Pipli)', 'Stone Carving'],
  },
  {
    name: 'West Bengal',
    imageId: 'region-bengal',
    crafts: ['Kantha Embroidery', 'Jamdani Weaving', 'Terracotta Crafts', 'Sholapith'],
  },
  {
    name: 'Tamil Nadu',
    imageId: 'region-tamilnadu',
    crafts: ['Kanchipuram Silk', 'Tanjore Painting', 'Bronze Icons', 'Wood Carving'],
  },
    {
    name: 'Karnataka',
    imageId: 'region-karnataka',
    crafts: ['Mysore Paintings', 'Channapatna Toys', 'Bidriware', 'Sandalwood Carving'],
  },
    {
    name: 'Maharashtra',
    imageId: 'region-maharashtra',
    crafts: ['Warli Painting', 'Paithani Sarees', 'Kolhapuri Chappals', 'Bidriware'],
  },
];

interface DiscoverRegionsProps {
  products?: Product[];
}

export default function DiscoverRegions({ products = [] }: DiscoverRegionsProps) {
  const { t } = useTranslation();

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {regions.map((region, index) => {
          const image = PlaceHolderImages.find((img) => img.id === region.imageId);
          const regionalProducts = products.filter(p => t(p.region).includes(region.name)).slice(0, 3);
          
          return (
          <CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-1/4"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Card className="overflow-hidden group cursor-pointer border-0 shadow-lg relative">
                  <CardContent className="p-0 relative">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={t(region.name)}
                        width={400}
                        height={500}
                        className="object-cover aspect-[4/5] w-full h-full transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                      <Badge className="bg-primary/80 border-0 mb-3 backdrop-blur-sm text-[10px] font-black tracking-widest uppercase">
                        {regionalProducts.length} {t('Legacy Items')}
                      </Badge>
                      <h3 className="text-4xl font-bold font-headline mb-2 leading-none">
                        {t(region.name)}
                      </h3>
                      <p className="text-xs opacity-70 font-medium uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {t('Explore Heritage')} <ChevronRight className="h-3 w-3" />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 rounded-3xl overflow-hidden border-primary/10 shadow-2xl">
                 <div className="p-6 bg-primary text-white">
                    <h4 className="font-bold font-headline text-2xl mb-1">{t(region.name)} {t('Collection')}</h4>
                    <p className="text-[10px] uppercase tracking-widest opacity-80 font-black">{t('Direct from rural master clusters')}</p>
                 </div>
                 <div className="p-4 space-y-4 bg-background">
                    {regionalProducts.length > 0 ? (
                        <div className="space-y-3">
                            {regionalProducts.map(product => {
                                const prodImage = PlaceHolderImages.find(img => img.id === product.imageId);
                                return (
                                    <Link 
                                        key={product.id} 
                                        href={`/products/${product.slug}`}
                                        className="flex items-center gap-3 p-2 rounded-2xl hover:bg-primary/5 transition-colors group/item"
                                    >
                                        <div className="relative h-14 w-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                            {prodImage && <Image src={prodImage.imageUrl} alt={t(product.name)} fill className="object-cover" />}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-sm truncate group-hover/item:text-primary transition-colors">{t(product.name)}</p>
                                            <p className="text-[10px] font-black text-primary/70 uppercase">₹{product.price.toLocaleString()}</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-1 transition-all" />
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                            <p className="text-xs text-muted-foreground italic">{t('No live items for this region yet.')}</p>
                        </div>
                    )}
                    <Button asChild className="w-full rounded-2xl bg-muted text-foreground hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-widest py-6" variant="ghost">
                        <Link href="/products" className="flex items-center justify-center gap-2">
                            {t('View All Region Crafts')} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                 </div>
              </PopoverContent>
            </Popover>
          </CarouselItem>
        )})}
      </CarouselContent>
      <CarouselPrevious className="ml-14 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-12 w-12" />
      <CarouselNext className="mr-14 bg-white/80 backdrop-blur-sm border-0 shadow-lg h-12 w-12" />
    </Carousel>
  );
}
