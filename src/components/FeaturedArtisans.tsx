'use client';

import type { Artisan } from '@/lib/data';
import { ArtisanCard } from '@/components/ArtisanCard';

export function FeaturedArtisans({ artisans }: { artisans: Artisan[] }) {
  const featuredArtisans = artisans.slice(0, 3);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredArtisans.map((artisan) => (
        <ArtisanCard key={artisan.id} artisan={artisan} />
      ))}
    </div>
  );
}
