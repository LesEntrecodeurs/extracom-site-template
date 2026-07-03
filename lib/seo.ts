/** URL publique du site (pour metadataBase, OG, sitemap, JSON-LD). */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
}

/** URL absolue d'un chemin du site. */
export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
}

// Fabriques JSON-LD centralisées — passer le résultat à <JsonLd data={…} />.
// SEO + GEO : les moteurs génératifs lisent ces données structurées.
type Ld = Record<string, unknown>;
const ctx = 'https://schema.org';

export function organizationLd(name: string, logoUrl?: string): Ld {
  return {
    '@context': ctx,
    '@type': 'Organization',
    name,
    url: siteUrl(),
    ...(logoUrl ? { logo: absoluteUrl(logoUrl) } : {})
  };
}

export function webSiteLd(name: string): Ld {
  return {
    '@context': ctx,
    '@type': 'WebSite',
    name,
    url: siteUrl()
  };
}

export function webPageLd(name: string, path: string, description?: string): Ld {
  return {
    '@context': ctx,
    '@type': 'WebPage',
    name,
    url: absoluteUrl(path),
    ...(description ? { description } : {})
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Ld {
  return {
    '@context': ctx,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function faqLd(qas: { question: string; answer: string }[]): Ld {
  return {
    '@context': ctx,
    '@type': 'FAQPage',
    mainEntity: qas.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer }
    }))
  };
}

// `price`/`availability` uniquement si un prix est exposé (price peut être null).
export function productLd(p: {
  name: string;
  sku: string;
  path: string;
  description?: string;
  image?: string;
  price?: number | null;
  priceCurrency?: string;
  availability?: string;
}): Ld {
  const offers =
    p.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: p.priceCurrency ?? 'EUR',
            ...(p.availability ? { availability: p.availability } : {}),
            url: absoluteUrl(p.path)
          }
        }
      : {};
  return {
    '@context': ctx,
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    ...(p.description ? { description: p.description } : {}),
    ...(p.image ? { image: p.image } : {}),
    ...offers
  };
}

export function articleLd(a: {
  headline: string;
  path: string;
  datePublished: string;
  author: string;
  dateModified?: string;
  image?: string;
}): Ld {
  return {
    '@context': ctx,
    '@type': 'Article',
    headline: a.headline,
    url: absoluteUrl(a.path),
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: { '@type': 'Organization', name: a.author },
    ...(a.image ? { image: absoluteUrl(a.image) } : {})
  };
}

export function definedTermLd(t: {
  name: string;
  description: string;
  path: string;
}): Ld {
  return {
    '@context': ctx,
    '@type': 'DefinedTerm',
    name: t.name,
    description: t.description,
    url: absoluteUrl(t.path)
  };
}
