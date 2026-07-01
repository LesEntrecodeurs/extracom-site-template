import type { MetadataRoute } from 'next';
import { getArticlesAction } from '@extracom/site-kit/server';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/catalogue'), changeFrequency: 'daily', priority: 0.8 }
  ];

  let products: MetadataRoute.Sitemap = [];
  try {
    const res = await getArticlesAction({ limit: 200 });
    products = (res.data ?? []).map((a) => ({
      url: absoluteUrl(`/produit/${encodeURIComponent(a.reference)}`),
      changeFrequency: 'weekly',
      priority: 0.6
    }));
  } catch {
    /* dégrade : sitemap statique seul si l'API est indisponible au build */
  }

  return [...staticPages, ...products];
}
