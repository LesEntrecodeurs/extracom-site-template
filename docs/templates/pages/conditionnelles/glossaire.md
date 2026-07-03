# Glossaire

> Page conditionnelle vitrine — à créer à la demande. Hérite de `_base-page.md`.
> Type **editorial**, indexable. Routes à créer `app/glossaire/page.tsx` + `app/glossaire/[slug]/page.tsx`.
>
> **Pertinence B2B** : très utile pour le jargon métier / technique Sage-Extracom
> (références, déclinaisons, conditions tarifaires…). À proposer quand le secteur
> a un vocabulaire spécialisé.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Glossaire |
| **Routes** | `app/glossaire/page.tsx`, `app/glossaire/[slug]/page.tsx` (`generateStaticParams`) |
| **Slug URL** | `/glossaire`, `/glossaire/[slug]` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Basse-moyenne |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Définir le vocabulaire métier (SEO longue traîne + GEO) et alimenter les tooltips du site.

### Objectifs secondaires
- Renforcer l'autorité topique (cluster sémantique)
- Mailler chaque terme vers les pages qui l'exploitent

---

## Système complet à implémenter

> Reprend le système « glossaire + tooltips » (cf. `TOOLBOX.md` › Glossaire) :

1. **Données centralisées** : `data/glossary.ts`, type `GlossaryTerm` (`term`,
   `slug`, `definition`, `longDescription`, `example`, `relatedPage?`, `relatedTerms`).
2. **Page index** `/glossaire` : recherche client-side, index alphabétique, noms
   cliquables vers les pages individuelles.
3. **Pages individuelles** `/glossaire/[slug]` : `generateStaticParams`,
   `generateMetadata`, JSON-LD (`WebPage` + `BreadcrumbList` + `DefinedTerm`),
   description longue, exemple, termes liés.
4. **Tooltips automatiques** : `linkifyGlossaryTerms()` dans `lib/linkify.tsx`
   (détection auto, bordure pointillée + bulle au survol), composant
   `GlossaryTooltip` dans `components/site/`. Appliqué aux paragraphes de contenu
   (jamais aux titres, boutons ou labels UI). Aliases dans `TERM_ALIASES`.
5. **Sitemap** : inclure chaque `/glossaire/[slug]` (priorité ~0.5).

---

## Wireframe ASCII

> Index : header + recherche + index A-Z + liste de termes (nom cliquable + déf).
> Terme : breadcrumb, H1 = terme, définition, description longue, exemple, termes liés.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| GlossaryTooltip | nouveau `components/site/` | Bulle de définition au survol | Oui |
| linkifyGlossaryTerms | nouveau `lib/linkify.tsx` | Détection auto des termes | Oui |
| JsonLd | `components/site/JsonLd` | `DefinedTerm` (pages terme) | Oui |

---

## Contenu éditorial

### Titre principal (H1)
- Index : {{« Glossaire {{secteur}} »}}
- Terme : {{le terme lui-même}}

### Ton et style
Pédagogique, factuel, answer-first (1re phrase = définition directe). Vocabulaire du domaine.

---

## Maillage interne

- **Footer** : lien « Glossaire »
- **Liens sortants** : chaque terme → `relatedPage` (produit, catalogue, blog)
- **Liens entrants** : tooltips depuis tout le contenu du site

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title (index)** | {{« Glossaire {{secteur}} … » sans nom de marque}} |
| **Meta title (terme)** | {{le terme + précision}} |
| **JSON-LD (index)** | `WebPage`, `BreadcrumbList` |
| **JSON-LD (terme)** | `WebPage`, `BreadcrumbList`, `DefinedTerm` |

---

## Notes et remarques

- Les tooltips ne s'appliquent qu'au contenu éditorial (pages `editorial`), jamais aux zones transactionnelles.
- Bien alimenter `TERM_ALIASES` (pluriels, casses, abréviations).
