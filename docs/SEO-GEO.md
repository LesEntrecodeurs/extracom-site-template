# SEO & GEO — référence complète

> Référence **détaillée** du référencement classique (SEO) et de l'optimisation
> pour moteurs génératifs (GEO) de ce template. Version courte et « à faire à
> chaque édition » : `TOOLBOX.md` (sections SEO / GEO / Audits). Règles dures :
> `AGENTS.md` §3 (règle 8) et §8. Ce fichier consolide **tout** et sert de
> checklist de fond.
>
> Le SEO/GEO ne peut jamais être sacrifié par une décision visuelle ou technique
> (`docs/PRINCIPES.md` §4). Il n'enfreint jamais les **règles dures** kit d'`AGENTS.md`.

**Éditabilité (vérifiée)** : tous les fichiers de référencement sont dans la surface
éditable (`AGENTS.md` §2) — `app/robots.ts`, `app/sitemap.ts`,
`app/opengraph-image.tsx`/`twitter-image.tsx`, `app/llms.txt/route.ts`, les
`generateMetadata` de chaque page, et `lib/seo.ts`. Tu peux et dois les modifier.
Seul `next.config.mjs` (hosts d'images, `redirects`/`headers`) reste verrouillé : si
un besoin SEO l'exige, **demander à l'utilisateur**.

---

## 0. État actuel du repo (et lacunes à combler)

| Élément | Fichier | État | À faire |
|---|---|---|---|
| Metadata par défaut | `app/layout.tsx` | ✅ title template `%s · {nom}`, OG/Twitter, `metadataBase` | par page : `generateMetadata` propre |
| Image OG | `app/opengraph-image.tsx` | ✅ next/og | surcharger par route si visuel dédié (blog…) |
| robots | `app/robots.ts` | ✅ **crawlers IA autorisés explicitement** + disallow privé | — |
| sitemap | `app/sitemap.ts` | ✅ `/`, `/catalogue`, `/contact`, `/mentions-legales`, produits | **ajouter chaque nouvelle page indexable** (blog, glossaire, à-propos, légales…) |
| llms.txt | `app/llms.txt/route.ts` | ✅ nom, catalogue, catégories | enrichir (contact, conditions) au besoin |
| Helpers URL + JSON-LD | `lib/seo.ts` | ✅ `siteUrl`, `absoluteUrl` + fabriques JSON-LD (`organizationLd`, `breadcrumbLd`, `faqLd`, `productLd`, `articleLd`, `definedTermLd`…) | les **utiliser** sur chaque page |
| JSON-LD Organization | `app/layout.tsx` | ✅ inline (peut basculer sur `organizationLd()`) | optionnel |

> Correctifs appliqués au template (2026-07-03) : `robots.ts` (crawlers IA),
> `sitemap.ts` (pages indexables existantes), `lib/seo.ts` (helpers JSON-LD).
> **Reste au fil de l'eau** : ajouter chaque nouvelle page indexable au sitemap et
> appeler les helpers JSON-LD sur les pages.

---

## 1. SEO technique

### Metadata (chaque page indexable exporte `generateMetadata`)

| Élément | Règle |
|---|---|
| **Meta title** | 50-60 caractères, mot-clé au début. **Jamais le nom de marque** : le layout applique le template `%s · {nom}`. Seule la home met un title absolu (`{ absolute: "…" }`). Vaut aussi pour les `metaTitle` dans les data (`data/blog/*`, etc.). |
| **Meta description** | 150-160 caractères : mot-clé + proposition de valeur + CTA implicite. |
| **Canonical** | `alternates.canonical` en URL absolue auto-référente (`absoluteUrl(...)`). |
| **Open Graph** | title, description, type (`website`/`article`), url, siteName. Image via la convention fichier `opengraph-image.tsx` — **ne pas** remettre `images` à la main. |
| **Twitter** | `summary_large_image`, title, description. |
| **URL slug** | minuscules, tirets, 3-5 mots, contient le mot-clé. |

### Rendu & sémantique
- **Rendu serveur** des pages publiques (accueil, catalogue, produit, éditoriales) —
  ne pas basculer en pur client (contenu invisible aux crawlers).
- Un seul `<h1>` par page ; hiérarchie `h2→h6` sans saut.
- Balises sémantiques : `<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`,
  `<header>`, `<footer>`, `<address>` (coordonnées), `<time datetime>` (dates).
- Le **header et le footer ne portent aucun `<h1>`-`<h6>`** (pollue la hiérarchie).
- Images : `next/image` partout (jamais `<img>` brut), `alt` descriptifs.
- Perf / Core Web Vitals : pas de layout shift, pas de JS bloquant inutile.

### robots (`app/robots.ts`)
- `disallow` : `/compte`, `/panier`, `/commande`, `/connexion`, `/inscription`, `/paiement` (déjà en place — zone privée/tunnel).
- **Recommandé (GEO)** : autoriser explicitement les crawlers IA (cf. §4).

### sitemap (`app/sitemap.ts`)
- Inclure **toute** page indexable. Aujourd'hui : `/`, `/catalogue`, produits.
- **À ajouter dès leur création** : `/contact`, `/mentions-legales`, `/cgv`,
  `/politique-confidentialite`, `/politique-cookies`, `/a-propos`, `/faq`,
  `/blog` + chaque `/blog/[slug]`, `/glossaire` + chaque `/glossaire/[slug]`.
- Ne jamais inclure les routes `noindex`.

### Placement du mot-clé principal
Le mot-clé de la page apparaît dans : `<h1>` (au début), les 100 premiers mots,
2-3 `<h2>`, le meta title, la meta description, le slug d'URL.

### Maillage interne
- Ancres descriptives et variées (jamais « cliquez ici » / « en savoir plus » seul).
- Chaque page reliée depuis au moins une autre (nav incluse).
- Liens en contexte, pas un bloc de liens en pied de page.
- Cohérent avec la section « Maillage interne » de la fiche de la page.

---

## 2. Matrice JSON-LD

Voir la table complète dans `TOOLBOX.md` › « Matrice JSON-LD par type de page ».
Points clés :
- Injecter via `<JsonLd data={…} />` (jamais de `dangerouslySetInnerHTML` manuel).
- `Product` : `sku`, et `price`/`availability` **uniquement si un prix est exposé**
  (sinon les omettre — cf. `price` nullable, `AGENTS.md`).
- `BreadcrumbList` sur toutes les pages sauf l'accueil, **cohérent** avec le fil
  d'Ariane visuel.
- Toute page avec un **bloc FAQ** ajoute `FAQPage`.

---

## 3. Helpers JSON-LD centralisés (en place)

`lib/seo.ts` fournit les fabriques : `organizationLd(name, logo?)`,
`webSiteLd(name)`, `webPageLd(name, path, description?)`, `breadcrumbLd(items)`,
`faqLd(qas)`, `productLd({...})` (émet `offers` **seulement si `price != null`**),
`articleLd({...})`, `definedTermLd({...})`. Chaque page appelle le helper et passe le
résultat à `<JsonLd data={…} />`. **Ne pas** reconstruire du JSON-LD inline à la main.

---

## 4. GEO — Generative Engine Optimization

Objectif : que ChatGPT, Claude, Perplexity, Gemini, AI Overviews **comprennent et
citent** la boutique. Étend le SEO, ne le remplace pas.

### Écriture answer-first
- Chaque section `H2` commence par une **réponse directe de 40-60 mots**, puis développe.
- Sections auto-contenues : un moteur IA peut extraire un bloc `H2` seul et répondre.
- Pas d'intro générique avant la réponse concrète.

### Structure pour extraction IA
- `H2` formulés en questions quand pertinent.
- Listes à puces pour les énumérations (format privilégié des AI Overviews).
- Tableaux `<table>` pour les comparaisons.
- Paragraphes courts (2-4 phrases).

### Optimisation des entités
- Nommer la boutique par son **nom** (`useShopContext().data.branding.name`) dans
  le H1, le 1er paragraphe, la meta description — pas seulement « nous ».
- Lier le nom à son contexte (secteur, territoire). 2-3 mentions dans le contenu.
- Voix hybride (cf. `docs/PRINCIPES.md` §7) : ancrage entité en 1re phrase de chaque
  bloc FAQ / content block, puis « nous ».

### Densité de données
- Au moins 1 donnée chiffrée par section significative (`<strong>`).
- Témoignages avec attribution complète : `<blockquote>` + `<cite>`.
- Chaque promesse étayée par une preuve (chiffre, exemple, témoignage).

### Contenu factuel en texte
- Specs produit, descriptions, à-propos, FAQ **en texte** — pas enfermés dans une
  image (les LLM lisent le texte).

### Accessibilité crawlers IA (`app/robots.ts`)
Le `userAgent: '*'` autorise déjà tout le monde, mais pour un signal **explicite**,
ajouter des règles par agent : `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`,
`Google-Extended`, `Googlebot`, `Bingbot` — chacun `allow: '/'` avec le même
`disallow` que le tunnel privé. Exemple de forme (à adapter) :

```ts
rules: [
  { userAgent: '*', allow: '/', disallow: [...private] },
  { userAgent: ['GPTBot','ChatGPT-User','PerplexityBot','ClaudeBot','Google-Extended'],
    allow: '/', disallow: [...private] },
]
```

### `llms.txt` (`app/llms.txt/route.ts`)
Fiche d'identité lisible du site pour les LLM (déjà en place : nom, catalogue,
catégories, conditions d'accès). **Tenir à jour** : nom du shop, catégories, ce qui
nécessite une connexion, et — à leur création — l'existence du blog / glossaire /
pages clés. **Sans donnée sensible** (pas de prix client ni stock).

---

## 5. Spécificités e-commerce Extracom

- **Prix `null`** : ne pas exposer `price`/`availability` en JSON-LD tant qu'aucun
  prix n'est affiché ; côté contenu, gérer « Connectez-vous pour voir le tarif »
  sans masquer le produit.
- **Routes privées** en `noindex` (robots + pas de sitemap) : compte, panier,
  commande, auth, paiement.
- **Contenu commerce = kit** : le SEO/GEO se fait sur le **rendu** (metadata,
  sémantique, JSON-LD, texte), jamais en dupliquant/inventant des données commerce.

---

## 6. Checklist d'audit (par lot, pas à chaque PR)

Déclencheur : « la structure ou le contenu indexable a-t-il bougé significativement ? »

- [ ] `title` / `description` / `canonical` présents et **uniques** par page.
- [ ] Un seul `<h1>` par page, hiérarchie correcte, sémantique HTML.
- [ ] `sitemap.ts` couvre les nouvelles pages ; privé toujours `noindex`.
- [ ] JSON-LD valide (Google Rich Results Test) et cohérent avec le contenu.
- [ ] `robots.ts` : privé bloqué, IA autorisées.
- [ ] `llms.txt` à jour (nom, catégories, nouvelles rubriques, accès).
- [ ] Image OG (`opengraph-image`) correcte, favicon présent.
- [ ] Pages `editorial` : answer-first, entité nommée, ≥ 1 donnée/section, FAQ + `FAQPage`.
- [ ] `next/image` partout, `alt` descriptifs, pas de lien cassé.
- [ ] Lighthouse SEO / Perf / A11y au vert.

Proposer à l'utilisateur de **planifier** ces audits périodiquement.
