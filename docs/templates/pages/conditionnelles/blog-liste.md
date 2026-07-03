# Blog — liste

> Page conditionnelle vitrine — à créer à la demande. Hérite de `_base-page.md`.
> Type **editorial**, indexable. Route à créer `app/blog/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Blog (liste) |
| **Route** | `app/blog/page.tsx` (à créer) |
| **Slug URL** | `/blog` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | {{à rédiger / en cours / validé}} |

> **Source de contenu — décidé** : le kit Extracom ne fournit **pas** d'articles de
> blog. Tout le contenu est **stocké dans le code, sans base de données**, et
> **chaque article est éditable par prompt**. Convention :
> - **Un fichier TypeScript par article** dans `data/blog/` (ex.
>   `data/blog/optimiser-ses-commandes.ts`), exportant un objet `BlogPost` typé
>   (`slug`, `title`, `excerpt`, `date`, `author`, `cover`, `category`,
>   `content`, `related`, `seo`).
> - Un index `data/blog/index.ts` agrège tous les articles (liste + tri par date).
> - **Pas de MDX** : cela demanderait une dépendance (`@next/mdx`) or `package.json`
>   est verrouillé. Le corps d'article se modélise en blocs TS (paragraphes,
>   listes, titres, citations) rendus par un composant, ou en chaîne HTML **échappée
>   et contrôlée** (jamais de `dangerouslySetInnerHTML` sur du contenu externe).
> - Ajouter/éditer un article = créer/modifier **un seul fichier** → parfait pour
>   l'édition par prompt dans Mantly.
>
> **Propagation** : route liste + route article `[slug]`, nav/footer, `sitemap.ts`
> (liste + chaque article), `app/llms.txt`.

---

## Objectifs de la page

### Objectif principal
Lister les articles éditoriaux (conseils, actualités, guides métier) pour le SEO/GEO et l'autorité thématique.

### Objectifs secondaires
- Capter du trafic informationnel (longue traîne)
- Mailler vers le catalogue et les pages produit

---

## Structure de la page

### Zone 1 — En-tête blog + breadcrumb
### Zone 2 — Article mis en avant (dernier publié)
### Zone 3 — Grille d'articles
- **Contenu** : `ArticleCard` éditorial (à ne pas confondre avec la carte produit) — titre, extrait, date (`<time>`), image, catégorie
- **Comportement** : pagination
### Zone 4 — CTA vers catalogue

---

## Wireframe ASCII

> Générer : header + breadcrumb, article vedette pleine largeur, grille
> `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, pagination, CTA. Mobile-first.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Carte article éditorial | nouveau `components/site/` | Titre + extrait + date + image | Oui |
| Pagination | `components/ui/pagination` | Navigation | Oui |
| JsonLd | `components/site/JsonLd` | `ItemList` | Oui |

---

## Données consommées

| Donnée | Source | Notes |
|---|---|---|
| Liste d'articles | `data/blog/index.ts` (agrège `data/blog/*.ts`) | **pas** de kit, **pas** de DB — un fichier TS par article, éditable par prompt |

---

## Contenu éditorial

### Titre principal (H1)
{{« Blog {{marque}} — {{thématique}} »}}

### Sous-titres (H2)
1. {{Derniers articles}}
2. {{Par thématique}}

### Ton et style
Éditorial, expert, answer-first. Nommer la marque. Extraits accrocheurs.

### Volume de contenu
- La valeur SEO vient surtout des articles ; la liste porte un paragraphe d'intro riche + FAQ.

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | {{Sur quoi porte le blog de {{marque}} ?}} | {{…}} | — |
| 2 | {{…}} | {{…}} | [Catalogue](/catalogue) |

---

## Maillage interne

- **Footer / Nav** : lien « Blog »
- **Liens sortants** : articles (`/blog/[slug]`), catalogue
- **Liens entrants** : articles (fil d'Ariane), accueil

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Informationnel | Google | Blog | Article → Catalogue |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{« Blog {{thématique}} … » sans nom de marque}} |
| **Meta description** | {{thématiques couvertes}} |
| **Canonical** | `/blog` |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `ItemList` |

---

## Notes et remarques

- Le blog est optionnel : à ne créer que si le marchand veut du contenu éditorial.
- Contenu statique dans le repo — jamais de commerce ici.
