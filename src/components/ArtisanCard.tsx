import Image from 'next/image';
import Link from 'next/link';
import type { Artisan } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const { t } = useTranslation();
  const image = PlaceHolderImages.find((img) => img.id === artisan.imageId);
  // In a real app, the slug would likely be a field in the document.
  // Since we are using the doc ID as the slug, we use artisan.id
  const slug = artisan.slug || artisan.id;

  return (
    <Card className="overflow-hidden group text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/artisans/${slug}`} className="block overflow-hidden">
          <div className="aspect-square relative">
            {image && (
              <Image
                src={image.imageUrl}
                alt={t(artisan.name)}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image.imageHint}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="font-semibold font-headline text-2xl">
          <Link href={`/artisans/${slug}`}>{t(artisan.name)}</Link>
        </h3>
        <p className="text-sm text-primary font-medium mt-1">
          {t(artisan.craft)}
        </p>
        <p className="text-sm text-muted-foreground">{t(artisan.region)}</p>
        <Button variant="outline" size="sm" asChild className="mt-4">
            <Link href={`/artisans/${slug}`}>
                {t('View Profile')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
