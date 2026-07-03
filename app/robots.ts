import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

// Pages privées / tunnel : jamais indexées (ni moteurs classiques, ni IA).
const PRIVATE_PATHS = [
  '/compte',
  '/panier',
  '/commande',
  '/connexion',
  '/inscription',
  '/paiement'
];

// GEO : autorisation explicite des crawlers génératifs (ChatGPT, Claude,
// Perplexity, Gemini/AI Overviews, Apple) pour être compris et cités.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'Applebot-Extended'
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS }
    ],
    sitemap: `${siteUrl()}/sitemap.xml`
  };
}
