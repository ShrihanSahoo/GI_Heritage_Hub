'use client';

import type { Product, Artisan } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';

export function FeaturedProducts({
  products,
  artisans,
}: {
  products: Product[];
  artisans: Artisan[];
}) {
  const featuredProducts = products.slice(0, 4);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {featuredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          artisans={artisans}
        />
      ))}
    </div>
  );
}
