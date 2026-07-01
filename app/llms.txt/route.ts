import { getContextAction } from '@extracom/site-kit/server';
import { siteUrl } from '@/lib/seo';

// GEO (Generative Engine Optimization) : fichier `llms.txt` lu par les
// assistants/moteurs génératifs pour comprendre le site. Décrit la boutique,
// l'URL du catalogue et les grandes catégories — sans donnée sensible.
export const dynamic = 'force-dynamic';

export async function GET() {
  let name = 'Boutique';
  let categories: string[] = [];
  try {
    const c = await getContextAction();
    name = c.branding?.name ?? c.shopName ?? name;
    categories = (c.catalogTree ?? []).slice(0, 20).map((n) => n.label);
  } catch {
    /* dégrade proprement */
  }

  const body = `# ${name}

> Boutique en ligne pour professionnels : catalogue produit, tarifs par client,
> commande en ligne et livraison. Commande réservée aux clients connectés.

- Site : ${siteUrl()}
- Catalogue : ${siteUrl()}/catalogue
${categories.length ? `\n## Catégories\n${categories.map((c) => `- ${c}`).join('\n')}\n` : ''}
## Notes
- Les prix par client et le stock peuvent nécessiter une connexion.
- Pour commander : créer un compte puis se connecter.
`;

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });
}
