import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account',
          '/account/',
          '/cart',
          '/wishlist',
          '/login',
          '/signup',
          '/signup/',
          '/products/new',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
