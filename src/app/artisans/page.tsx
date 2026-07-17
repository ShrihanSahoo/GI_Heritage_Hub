'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { ArtisanCard } from '@/components/ArtisanCard';
import { useTranslation } from '@/hooks/useTranslation';
import { artisans as mockArtisans } from '@/lib/data';
import type { Artisan } from '@/lib/data';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';

export default function ArtisansPage() {
    const { t } = useTranslation();
    const { firestore } = useFirebase();

    const artisanProfilesRef = useMemoFirebase(
        () => collection(firestore, 'artisan_profiles'),
        [firestore]
    );

    const { data: liveArtisans, isLoading } = useCollection<Artisan>(artisanProfilesRef);

    const allArtisans = useMemo(() => {
        const artisanMap = new Map<string, Artisan>();

        // First, add all the mock artisans to the map.
        mockArtisans.forEach(artisan => {
            artisanMap.set(artisan.id, artisan);
        });

        // Then, add or overwrite with the live artisans from Firestore.
        liveArtisans?.forEach(artisan => {
            artisanMap.set(artisan.id, artisan);
        });
        
        return Array.from(artisanMap.values());
    }, [liveArtisans]);


    if (isLoading && (!allArtisans || allArtisans.length === 0)) {
        return (
             <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold font-headline mb-8">{t('All Artisans')}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Skeleton loaders */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-card rounded-lg p-4 space-y-4">
                            <div className="bg-muted animate-pulse h-48 w-full rounded-md"></div>
                            <div className="space-y-2">
                                <div className="bg-muted animate-pulse h-6 w-3/4 rounded-md"></div>
                                <div className="bg-muted animate-pulse h-4 w-1/2 rounded-md"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12">
             <h1 className="text-4xl font-bold font-headline mb-8">{t('All Artisans')}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allArtisans?.map((artisan) => (
                      <ArtisanCard key={artisan.id} artisan={artisan} />
                  ))}
              </div>
        </div>
    )
}
