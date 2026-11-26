import Image from 'next/image';
import Link from 'next/link';
import type { Artisan } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from './ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';
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
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/artisans/${slug}`}>
              {t('View Profile')} <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button size="sm" variant="secondary" asChild className="gap-1.5">
            <Link href={`/chat?artisanId=${artisan.id}`}>
              <MessageSquare className="h-3.5 w-3.5" />
              {t('Chat')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
