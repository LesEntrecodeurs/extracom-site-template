/**
 * Injecte des données structurées JSON-LD (schema.org). Levier SEO **et GEO**
 * (les moteurs génératifs/assistants IA lisent ce balisage). `data` est toujours
 * construit côté serveur à partir de données maîtrisées — jamais du contenu
 * libre d'un visiteur.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
