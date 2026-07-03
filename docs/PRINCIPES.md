# Principes transversaux — cadrage d'édition

> Ces principes cadrent **toute édition** du template (pages, sections, contenu).
> Ils complètent `AGENTS.md` (rôle, frontières verrouillées, règles dures kit) et
> `TOOLBOX.md` (inventaire). But : que l'agent d'édition ne parte pas « en roue
> libre » d'un prompt à l'autre — il suit un cadre stable.
>
> **Ordre de lecture** : `AGENTS.md` → `TOOLBOX.md` → ce fichier → la fiche de la
> page concernée (`docs/templates/pages/…`) → l'état réel (`docs/fiches/…`).

---

## 0. Ce qui prime toujours

Les **règles dures** d'`AGENTS.md` (surface verrouillée, commerce = kit uniquement,
`price` nullable, dépendances figées, UI = shadcn pré-bakés, sécurité du rendu)
priment sur tout ce qui suit. Aucun principe éditorial ne peut les enfreindre.

---

## 1. Langue & accents

Tout texte français (contenu, labels, `aria-label`, `alt`, meta, placeholders,
messages d'erreur) porte les **accents corrects** : « Découvrez nos réalisations »,
jamais « Decouvrez nos realisations ».

## 2. Discipline de fiche page (le cœur du cadrage)

- Chaque type de page a une **fiche gabarit** dans `docs/templates/pages/`
  (structure, wireframe, données kit, réglages conditionnels, SEO, JSON-LD).
- Le champ **`Type de page`** (`editorial` / `transactionnel` / `legal`) décide des
  sections applicables (cf. tableau dans `_base-page.md`).
- Quand tu édites une page réelle, tu tiens à jour sa **fiche d'état** dans
  `docs/fiches/` (cf. §9, règle de synchronisation).

## 3. Mobile-first systématique

- Classes de base = mobile (375px), breakpoints progressifs `sm: → md: → lg: → xl:`.
- Grilles empilées en mobile (`grid-cols-1`), déployées ensuite (`md:grid-cols-3`).
- Marges/paddings en progression (`py-12 md:py-20`). Tester en 375px.

## 4. SEO & GEO prioritaires (détail dans TOOLBOX)

- H1 unique, hiérarchie `h2→h6` sans saut ; `generateMetadata` complet (title
  **sans nom de marque** sauf accueil, description, canonical) sur chaque page
  indexable ; rendu **serveur** des pages publiques.
- Mot-clé principal placé : H1, 100 premiers mots, 2-3 H2, meta title/description, slug.
- Maillage interne dense, ancres descriptives (jamais « cliquez ici »).
- GEO : answer-first, entité nommée (`branding.name`), listes/tableaux, données
  chiffrées, `llms.txt` à jour, JSON-LD propre.
- **Référence complète** : `docs/SEO-GEO.md` (checklists, matrice, helpers, robots/sitemap/llms.txt).

## 5. Matrice JSON-LD obligatoire (détail dans TOOLBOX)

Chaque page porte les schémas de son type, via le composant `JsonLd` (jamais de
`dangerouslySetInnerHTML` manuel). Voir la matrice dans `TOOLBOX.md`.

## 6. FAQ obligatoire sur les pages `editorial` indexables

- Bloc de 3 à 6 questions contextuelles (hors pages `transactionnel`/`legal`).
- **Questions** en 3e personne + nom de marque (GEO). **Réponses** answer-first
  (40-60 mots) puis détail. Si un sujet est traité ailleurs → lien interne avec
  ancre descriptive. JSON-LD `FAQPage`.

## 7. Voix hybride (GEO + CRO)

| Zone | Voix | Exemple |
|---|---|---|
| FAQ — questions | 3e pers. + marque | « Comment {{marque}} livre-t-elle les professionnels ? » |
| FAQ — réponses | 1re phrase = marque en sujet, puis « nous/notre » | « {{marque}} livre en 48h. Nous expédions depuis… » |
| Hero, CTA, labels UI, nav | 1re personne | « Nous contacter », « Voir le catalogue » |
| Récit (à propos) | 3e personne acceptable pour les origines | « Fondée en… l'entreprise… » |
| Meta title/description | nom de marque (SEO/GEO) | « Fournisseur {{secteur}} — {{marque}} » |

Le nom de marque vient de `useShopContext().data.branding.name`. Un ancrage par bloc suffit.

## 8. Contenu — seuil ~1000 mots (non bloquant)

Sur les pages `editorial`, viser ~1000 mots de contenu visible. Sous le seuil :
**le signaler à l'utilisateur** et proposer d'enrichir (FAQ, chiffres, cas d'usage,
réassurance) — **ne jamais inventer** de faits (règle « ne rien inventer »).

## 9. Règle de synchronisation & propagation

Quand une édition touche le site, mettre à jour **tout ce qui est impacté**, en
même temps que le code :

- **Contenu / structure** → fiche d'état dans `docs/fiches/`.
- **Nouvelle / suppression de page** → route + nav (`Nav`, footer) + `sitemap.ts` +
  JSON-LD `BreadcrumbList` + `app/llms.txt` + maillage des pages liées.
- **Design (couleurs, typo)** → `app/globals.css` (zone éditable) — source de vérité.
- **Chiffres clés / services / contact** → `app/llms.txt`.

Ne jamais créer une page sans l'exposer dans la navigation. Ne jamais supprimer une
page sans nettoyer les liens entrants. **En cas de doute, mettre à jour.**

## 10. Qualité de code (détail dans TOOLBOX)

- **Composants réutilisables** : tout pattern présent sur 2 pages ou plus → composant
  partagé dans `components/site/` ; données dans `data/*.ts`, pas hardcodées.
- **Fichiers < 200 lignes** (cible ; data pure exceptée) → découper au-delà.
- **Pas de commentaires** (code auto-documenté ; exceptions : hack externe,
  invariant métier subtil). Pas de commentaires paraphrase / section / TODO.

## 11. Diversité & anti-générique

Chaque boutique doit avoir une signature visuelle propre (via `app/globals.css`).
Éviter les esthétiques IA génériques (cf. skill `frontend-design` de référence) :
pas de « moderne épuré » par défaut, varier heros/layouts/palettes entre marchands.
Le `branding` du shop est un **point de départ non contraignant**.

## 12. Créer de nouvelles pages (autorisé)

L'utilisateur **peut demander de créer de nouvelles pages** — c'est permis : `app/`
est la surface éditable (seuls le kit, `package.json` et `vendor/` sont verrouillés).
Au-delà des pages livrées et des fiches `conditionnelles/`, toute page sur mesure
(service, guide, landing, rubrique métier…) est possible.

Marche à suivre :

1. Partir du gabarit le plus proche dans `docs/templates/pages/` ; à défaut,
   **`conditionnelles/page-generique.md`**. Choisir le **`Type de page`**.
2. Créer la route `app/<slug>/page.tsx` (rendu **serveur** si indexable) +
   `generateMetadata` (title sans marque, description, canonical).
3. Commerce éventuel → **kit uniquement** (jamais de `fetch`).
4. **Propager** (§9) : nav (`Nav`/footer), `sitemap.ts` (si indexable), JSON-LD
   `BreadcrumbList`, `app/llms.txt` (si importante), maillage des pages liées.
5. Si `editorial` indexable : FAQ, voix hybride, ~1000 mots, JSON-LD de la matrice.
6. Créer la fiche d'état `docs/fiches/<slug>.md`.

Contraintes : ne jamais laisser une page **hors navigation** ; réutiliser les
composants existants (`components/site/*`) plutôt que dupliquer ; une lib absente de
l'allowlist → **le signaler à l'utilisateur**, ne pas l'installer.

---

## Cartographie des fiches

| Fiche gabarit | Route(s) | Type |
|---|---|---|
| `templates/pages/accueil.md` | `app/page.tsx` | editorial |
| `templates/pages/catalogue.md` | `app/catalogue/` | editorial |
| `templates/pages/produit.md` | `app/produit/[reference]/` | editorial |
| `templates/pages/contact.md` | `app/contact/` | editorial |
| `templates/pages/compte.md` | `app/compte/**` | transactionnel (noindex) |
| `templates/pages/panier-commande.md` | `app/panier/`, `app/commande/` | transactionnel (noindex) |
| `templates/pages/auth.md` | `app/connexion/`, `inscription/`, `mot-de-passe-oublie/` | transactionnel (noindex) |
| `templates/pages/mentions-legales.md` | `app/mentions-legales/` | legal |
| `templates/pages/conditionnelles/a-propos.md` | à créer | editorial |
| `templates/pages/conditionnelles/blog-liste.md` | à créer | editorial |
| `templates/pages/conditionnelles/blog-article.md` | à créer | editorial |
| `templates/pages/conditionnelles/blog-SPEC.md` | — (spec technique blog) | référence |
| `templates/pages/conditionnelles/glossaire.md` | à créer | editorial |
| `templates/pages/conditionnelles/faq.md` | à créer | editorial |
| `templates/pages/conditionnelles/page-generique.md` | à créer (toute page sur mesure) | au choix |
