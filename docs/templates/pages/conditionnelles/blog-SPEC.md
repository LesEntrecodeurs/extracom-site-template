# Blog — spécification technique complète

> Tout ce qu'il faut pour construire le blog du template Extracom : modèle de
> données, arborescence, routes, composants, **filtres, tri, pagination**, SEO/GEO
> et workflow d'édition par prompt.
>
> **Principe fondateur** : le blog est **100 % dans le code, sans base de données**.
> Chaque article = **un fichier TypeScript** dans `data/blog/`. Ajouter ou éditer
> un article = créer/modifier **un seul fichier** → conçu pour l'édition par prompt
> dans Mantly. Aucune donnée blog ne vient du kit Extracom (le kit = commerce
> uniquement). **Aucune nouvelle dépendance** : `package.json` est verrouillé (donc
> pas de MDX, pas de CMS, pas de lib de markdown).

---

## 1. Contraintes du template (rappel)

- ⛔ Pas de nouvelle dépendance → pas de `@next/mdx`, `gray-matter`, `contentlayer`…
- ⛔ Pas de `fetch` réseau, pas de DB → contenu importé statiquement depuis `data/`.
- ⛔ Pas de `dangerouslySetInnerHTML` sur du contenu non fiable → le corps d'article
  est modélisé en **blocs typés**, rendus par un composant (échappement par défaut).
- ✅ UI = `components/ui/*` (shadcn déjà présents) + nouveaux `components/site/*`.
- ✅ Images via `next/image` (`public/` pour les visuels d'articles).
- ✅ Rendu **serveur** (SSG) : `generateStaticParams` + `generateMetadata`.

---

## 2. Arborescence des fichiers à créer

```
data/
└── blog/
    ├── index.ts                     # agrège + trie + expose les helpers (liste, bySlug, catégories, tags)
    ├── types.ts                     # types BlogPost, BlogBlock, BlogCategory, BlogSort, BlogQuery
    └── posts/
        ├── optimiser-ses-commandes.ts   # 1 fichier = 1 article
        └── nouveautes-catalogue-2026.ts

app/
└── blog/
    ├── page.tsx                     # liste (filtres + tri + pagination)
    ├── [slug]/
    │   └── page.tsx                 # article (generateStaticParams + generateMetadata)
    └── categorie/
        └── [category]/
            └── page.tsx             # (option) liste filtrée par catégorie, URL indexable

components/site/
├── BlogCard.tsx                     # carte article (liste) — < 200 lignes
├── BlogFilters.tsx                  # recherche + catégorie + tri (client component)
├── BlogPagination.tsx              # ré-emploi de components/ui/pagination
├── BlogArticleBody.tsx             # rend les blocs typés d'un article
└── BlogRelated.tsx                 # articles liés

lib/
└── blog.ts                          # logique pure : filterPosts, sortPosts, paginate (testable, sans React)
```

> Respecter la règle **< 200 lignes / fichier** (data exclue) et **composants
> réutilisables**. `lib/blog.ts` isole la logique filtre/tri du rendu.

---

## 3. Modèle de données (`data/blog/types.ts`)

```ts
export type BlogCategory = {
  slug: string
  label: string
}

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "cta"; label: string; href: string }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string            // ISO "2026-07-03" — le blog est trié dessus
  updated?: string        // ISO, pour <time> et Article.dateModified
  author: string
  cover: { src: string; alt: string }  // /public/blog/...
  category: string        // slug d'une BlogCategory
  tags: string[]
  readingMinutes?: number // sinon calculé depuis le contenu
  content: BlogBlock[]    // corps modélisé en blocs typés (pas de HTML brut)
  related?: string[]      // slugs d'autres articles
  featured?: boolean      // mis en avant dans la liste
  draft?: boolean         // exclu de la liste + du sitemap si true
  seo: {
    metaTitle: string     // sans nom de marque (template %s)
    metaDescription: string
    keywords?: string[]
  }
}

export type BlogSort = "date-desc" | "date-asc" | "title-asc"

export type BlogQuery = {
  search?: string         // texte libre (titre + extrait + tags)
  category?: string       // slug de catégorie
  tag?: string
  sort?: BlogSort         // défaut "date-desc"
  page?: number           // défaut 1
  perPage?: number        // défaut 9
}
```

### Exemple d'article (`data/blog/posts/optimiser-ses-commandes.ts`)

```ts
import type { BlogPost } from "../types"

export const post: BlogPost = {
  slug: "optimiser-ses-commandes",
  title: "Optimiser ses commandes récurrentes en B2B",
  excerpt: "Trois leviers concrets pour gagner du temps sur vos réassorts.",
  date: "2026-06-18",
  author: "L'équipe {{marque}}",
  cover: { src: "/blog/commandes-recurrentes.jpg", alt: "Entrepôt de réassort" },
  category: "conseils",
  tags: ["commande", "réassort", "productivité"],
  content: [
    { type: "paragraph", text: "{{marque}} accompagne les professionnels…" },
    { type: "heading", level: 2, text: "Pourquoi automatiser ses réassorts ?" },
    { type: "list", items: ["Gain de temps", "Moins d'erreurs", "Tarifs négociés"] },
    { type: "cta", label: "Voir le catalogue", href: "/catalogue" },
  ],
  related: ["nouveautes-catalogue-2026"],
  seo: {
    metaTitle: "Optimiser ses commandes récurrentes en B2B",
    metaDescription: "Trois leviers concrets pour gagner du temps sur vos réassorts professionnels.",
  },
}
```

### Agrégateur (`data/blog/index.ts`)

```ts
import type { BlogCategory, BlogPost } from "./types"
import { post as optimiserCommandes } from "./posts/optimiser-ses-commandes"
import { post as nouveautes2026 } from "./posts/nouveautes-catalogue-2026"

export const CATEGORIES: BlogCategory[] = [
  { slug: "conseils", label: "Conseils" },
  { slug: "actualites", label: "Actualités" },
]

const ALL: BlogPost[] = [optimiserCommandes, nouveautes2026]

export const posts = ALL.filter((p) => !p.draft)      // publiés uniquement
export const allSlugs = posts.map((p) => p.slug)
export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug) ?? null
export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug) ?? null
export const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
```

> **Ajouter un article par prompt** = 1) créer `data/blog/posts/<slug>.ts`, 2)
> l'importer + l'ajouter au tableau `ALL` dans `index.ts`. Rien d'autre.

---

## 4. Logique filtres / tri / pagination (`lib/blog.ts`)

> Fonctions **pures** (sans React) → réutilisables côté serveur (liste SSG) et
> client (filtres interactifs), et faciles à raisonner.

```ts
import type { BlogPost, BlogQuery, BlogSort } from "@/data/blog/types"

export function filterPosts(posts: BlogPost[], q: BlogQuery): BlogPost[] {
  const search = q.search?.trim().toLowerCase()
  return posts.filter((p) => {
    if (q.category && p.category !== q.category) return false
    if (q.tag && !p.tags.includes(q.tag)) return false
    if (search) {
      const haystack = [p.title, p.excerpt, ...p.tags].join(" ").toLowerCase()
      if (!haystack.includes(search)) return false
    }
    return true
  })
}

export function sortPosts(posts: BlogPost[], sort: BlogSort = "date-desc"): BlogPost[] {
  const copy = [...posts]
  switch (sort) {
    case "date-asc":  return copy.sort((a, b) => a.date.localeCompare(b.date))
    case "title-asc": return copy.sort((a, b) => a.title.localeCompare(b.title, "fr"))
    case "date-desc":
    default:          return copy.sort((a, b) => b.date.localeCompare(a.date))
  }
}

export function paginate<T>(items: T[], page = 1, perPage = 9) {
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * perPage
  return { items: items.slice(start, start + perPage), page: current, pageCount, total }
}

export function queryPosts(posts: BlogPost[], q: BlogQuery) {
  return paginate(sortPosts(filterPosts(posts, q), q.sort), q.page, q.perPage ?? 9)
}
```

---

## 5. Filtres & tri — comportement UI

### Dimensions de filtrage
| Filtre | Valeurs | Contrôle UI | Source |
|---|---|---|---|
| **Recherche** | texte libre (titre + extrait + tags) | `input` + icône `lucide` | saisie |
| **Catégorie** | `CATEGORIES` | `select` ou puces (`badge`/`toggle-group`) | `data/blog/index.ts` |
| **Tag** (option) | `allTags` | puces cliquables | `data/blog/index.ts` |
| **Tri** | `date-desc` (défaut), `date-asc`, `title-asc` | `select` | statique |

### Deux implémentations possibles (choisir selon le besoin)

**A. Filtres via URL (`searchParams`) — recommandé pour le SEO**
- La liste lit `searchParams` (`?categorie=conseils&tri=date-asc&page=2`) côté serveur.
- Chaque état est une **URL indexable et partageable**, rendue en SSR.
- `BlogFilters` est un petit client component qui pousse les changements dans l'URL
  (`useRouter().push`), la page serveur re-rend avec `queryPosts`.
- Catégories → préférer une **route dédiée** `app/blog/categorie/[category]/page.tsx`
  (`generateStaticParams` sur `CATEGORIES`) pour des URLs propres et indexables.

**B. Filtres 100 % client (état local)**
- La page charge tous les `posts` (import statique) et `BlogFilters` filtre en
  mémoire (`useState`) — plus simple, mais états non partageables ni indexables.
- Acceptable si le volume d'articles est faible et le SEO des filtres secondaire.

> Défaut conseillé : **A** pour la catégorie (URL indexable) + recherche/tri en
> client sur la page. Garder le rendu serveur de la liste par défaut.

### Pagination
- `perPage = 9` par défaut. `BlogPagination` réutilise `components/ui/pagination`.
- En mode URL : `?page=N`. Toujours exposer un `rel="prev/next"` implicite via les liens.
- Ne jamais masquer silencieusement des articles : si un filtre vide la liste →
  `EmptyState` (« Aucun article ne correspond »).

---

## 6. Composants (API cible)

```ts
// BlogCard.tsx — carte de liste
type BlogCardProps = { post: BlogPost; featured?: boolean }

// BlogFilters.tsx — client component (recherche + catégorie + tri)
type BlogFiltersProps = {
  categories: BlogCategory[]
  value: BlogQuery
  onChange: (next: BlogQuery) => void   // ou push URL en mode A
}

// BlogArticleBody.tsx — rend les blocs typés
type BlogArticleBodyProps = { blocks: BlogBlock[] }  // switch sur block.type

// BlogRelated.tsx
type BlogRelatedProps = { slugs: string[] }
```

- `BlogArticleBody` fait un `switch` sur `block.type` et rend le JSX correspondant
  (jamais de HTML brut injecté). Applique `linkifyGlossaryTerms()` sur les
  `paragraph` si le glossaire existe.
- Tout composant garde < 200 lignes ; données hors JSX (dans `data/`).

---

## 7. Routes & rendu

### `app/blog/page.tsx` (liste)
- `generateMetadata` : title/description/canonical (+ pagination-aware si mode URL).
- Lit `searchParams`, appelle `queryPosts(posts, q)`, rend `BlogFilters` + grille
  `BlogCard` (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) + `BlogPagination`.
- JSON-LD `ItemList` des articles de la page.

### `app/blog/[slug]/page.tsx` (article)
- `generateStaticParams` : `allSlugs`.
- `generateMetadata` : depuis `post.seo` (+ `openGraph type: "article"`, `publishedTime`).
- Rend en-tête (titre, `<time datetime>`, auteur, lecture), `BlogArticleBody`,
  `BlogRelated`, bloc FAQ (option), CTA.
- JSON-LD `WebPage` + `BreadcrumbList` + `Article` (`headline`, `datePublished`,
  `dateModified`, `author`, `image`).
- Peut surcharger `opengraph-image.tsx` dans son dossier.

### `app/blog/categorie/[category]/page.tsx` (option, mode A)
- `generateStaticParams` sur `CATEGORIES`.
- Filtre par catégorie, même rendu que la liste. Canonical propre `/blog/categorie/<slug>`.

---

## 8. SEO / GEO

- **Sitemap** (`app/sitemap.ts`) : ajouter `/blog`, chaque `/blog/[slug]`, et les
  `/blog/categorie/[category]`. Exclure les `draft`.
- **JSON-LD** : liste → `ItemList` ; article → `Article` ; via `<JsonLd>`.
- **`app/llms.txt`** : mentionner l'existence du blog et ses thématiques.
- **GEO** : contenu factuel en **texte** (blocs `paragraph`/`list`), answer-first,
  nom de marque dans le 1er paragraphe et 2-3 fois dans l'article, ≥ 1 donnée
  chiffrée par section significative, `quote` + `cite` pour les témoignages.
- **Temps de lecture** : calculé depuis le nombre de mots des blocs (≈ 200 mots/min).

---

## 9. Workflow d'édition par prompt (Mantly)

| Demande utilisateur | Action agent |
|---|---|
| « Ajoute un article sur X » | Créer `data/blog/posts/<slug>.ts` + l'ajouter à `ALL` dans `index.ts` |
| « Change le titre / le contenu de l'article Y » | Éditer le seul fichier `data/blog/posts/<slug>.ts` |
| « Mets tel article en avant » | `featured: true` sur l'article |
| « Masque cet article » | `draft: true` (retiré liste + sitemap) |
| « Ajoute une catégorie » | Ajouter à `CATEGORIES` dans `index.ts` |
| « Change l'ordre / le tri par défaut » | Ajuster le `sort` par défaut de la liste |

**Checklist après toute modif blog** : article importé dans `index.ts` · route
existante · lien nav/footer si nouvelle rubrique · `sitemap.ts` à jour · `llms.txt`
à jour · fiche `docs/fiches/blog-*.md` synchronisée (cf. `docs/PRINCIPES.md`).

---

## 10. Ce qu'il ne faut PAS faire

- ❌ Stocker les articles en base ou les charger via `fetch`/kit.
- ❌ Ajouter une dépendance (MDX, CMS headless, markdown parser).
- ❌ Injecter du HTML d'article via `dangerouslySetInnerHTML`.
- ❌ Mélanger contenu blog et données commerce (kit).
- ❌ Dépasser 200 lignes dans un composant : découper (`BlogCard`, `BlogFilters`, `BlogArticleBody`).
