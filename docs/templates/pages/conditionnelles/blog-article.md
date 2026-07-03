# Blog — article

> Page conditionnelle vitrine — à créer à la demande. Hérite de `_base-page.md`.
> Type **editorial**, indexable. Route à créer `app/blog/[slug]/page.tsx` (`generateStaticParams`).

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Article de blog |
| **Route** | `app/blog/[slug]/page.tsx` (à créer) |
| **Slug URL** | `/blog/[slug]` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Traiter un sujet en profondeur pour capter du trafic informationnel et mailler vers le catalogue.

### Objectifs secondaires
- Démontrer l'expertise (autorité E-E-A-T / GEO)
- Convertir en fin d'article (CTA catalogue/contact)

---

## Structure de la page

### Zone 1 — Fil d'Ariane + en-tête article
- **Contenu** : breadcrumb (Accueil > Blog > Titre), H1, date (`<time datetime>`), auteur, temps de lecture
### Zone 2 — Corps de l'article
- **Contenu** : contenu structuré (`<h2>`/`<h3>`, listes, tableaux, `<blockquote>`+`<cite>`)
- **Comportement** : answer-first par section ; tooltips glossaire sur le jargon
### Zone 3 — CTA contextuel + produits liés
### Zone 4 — Articles liés

---

## Wireframe ASCII

> Générer : breadcrumb, en-tête article (titre, meta, image), colonne de lecture
> (`max-w-prose`), CTA milieu + fin, produits/articles liés. Mobile-first.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Fil d'Ariane | Oui |
| JsonLd | `components/site/JsonLd` | `Article` | Oui |
| ArticleCard (produit) | `components/site/ArticleCard` | Cross-sell éventuel | Non |

---

## Données consommées

| Donnée | Source | Notes |
|---|---|---|
| Article | `data/blog/[slug].ts` (un fichier TS par article, **pas de DB**) | `generateStaticParams` sur les slugs de `data/blog/index.ts` |
| Produits liés (option) | `useArticles`/`getArticlesAction` | si cross-sell voulu |

> Détail complet du modèle, des filtres, du tri et du rendu : **`docs/templates/pages/conditionnelles/blog-SPEC.md`**.

---

## Contenu éditorial

### Titre principal (H1)
{{Titre de l'article — mot-clé au début}}

### Sous-titres (H2)
1. {{Question / sous-thème 1}}
2. {{Question / sous-thème 2}}
3. {{Question / sous-thème 3}}

### Ton et style
Expert, answer-first, paragraphes courts. Nommer la marque 2-3 fois. Au moins 1 donnée chiffrée par section significative.

### Volume de contenu
- Cible ~1000 mots (souvent plus pour un article). Cœur de la valeur SEO/GEO.

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | {{Question liée au sujet}} | {{…}} | [Produit concerné](/produit/[ref]) |
| 2 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Voir les produits {{thème}} | /catalogue?famille=… | Haute | toujours |
| Secondaire | Nous contacter | /contact | Moyenne | — |

---

## Maillage interne

- **Liens entrants** : Blog (liste), articles liés
- **Liens sortants** : catalogue, produits, articles liés — ancres descriptives, en contexte (pas un bloc de liens en pied)

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Informationnel | Google / Blog | Article | Catalogue / Produit |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{Titre article — sans nom de marque}} |
| **Meta description** | {{résumé + promesse de l'article}} |
| **Canonical** | `/blog/[slug]` |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `Article` (`headline`, `datePublished`, `author`, `image`), `FAQPage` si FAQ |

---

## Notes et remarques

- Peut surcharger `opengraph-image.tsx` dans son dossier de route pour un visuel dédié.
- Maillage interne dense et contextuel : c'est le rôle premier du blog.
