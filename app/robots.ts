import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Pages privées / tunnel : pas d'indexation.
      disallow: [
        '/compte',
        '/panier',
        '/commande',
        '/connexion',
        '/inscription',
        '/paiement'
      ]
    },
    sitemap: `${siteUrl()}/sitemap.xml`
  };
}
