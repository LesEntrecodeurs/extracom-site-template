# Catalogue

> Hérite de `_base-page.md`. Type **editorial**, indexable. Route `app/catalogue/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Catalogue |
| **Route** | `app/catalogue/page.tsx` (+ `loading.tsx`) |
| **Slug URL** | `/catalogue` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Haute |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Permettre au visiteur de parcourir et filtrer l'offre, puis d'accéder aux fiches produit.

### Objectifs secondaires
- Guider l'anonyme vers la connexion pour voir ses tarifs (bandeau)
- Faciliter la recherche (filtres famille, prix, tri)

### KPIs associés
- Taux de clic vers les fiches produit
- Usage des filtres
- Taux de connexion depuis le bandeau tarifs

---

## Structure de la page

### Zone 1 — En-tête catalogue + fil d'Ariane
- **Fonction** : situer, titrer
- **Contenu** : H1, `breadcrumb`, nombre de résultats
- **Comportement** : statique

### Zone 2 — Bandeau tarifs `[si !user]`
- **Fonction** : inciter à la connexion
- **Contenu** : `InfoBanner` « Connectez-vous pour voir vos tarifs »
- **Comportement** : anonyme uniquement

### Zone 3 — Filtres
- **Fonction** : affiner la liste
- **Contenu** : `CatalogueFilters` (famille + tri + fourchette de prix + puce catégorie active)
- **Comportement** : met à jour la `query` de `useArticles`

### Zone 4 — Grille de produits
- **Fonction** : présenter l'offre
- **Contenu** : `ArticleCard` (image, désignation, prix/stock/promo conditionnels)
- **Comportement** : pagination ; `price` peut être `null` ; `EmptyState` si vide

---

## Wireframe ASCII

> Générer : header + breadcrumb, bandeau `[si !user]`, colonne filtres (drawer en
> mobile) + grille cards (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), pagination.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| CatalogueFilters | `components/site/CatalogueFilters` | Famille + tri + prix | Oui |
| ArticleCard | `components/site/ArticleCard` | Carte produit | Oui |
| InfoBanner | `components/site/InfoBanner` | Bandeau tarifs `[si !user]` | Oui |
| EmptyState | `components/site/EmptyState` | Aucun résultat | Oui |
| Pagination | `components/ui/pagination` | Navigation pages | Oui |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Liste paginée d'articles | `useArticles(query)` | re-fetch au changement de `query` ; `price` nullable |
| Familles / arbre catalogue | `useShopContext()` | alimente les filtres |
| Utilisateur | `useAuth()` | bandeau tarifs si `!user` |

**États à gérer** : `loading.tsx` (skeleton grille), `error` (retry), `EmptyState`, `price === null`.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Bandeau tarifs | `!user` | `useAuth()` |
| Prix / stock / promo sur cards | `display.stock`, `display.showDiscounts`, `anonymousPricing` | `useShopContext().data` |

---

## Contenu éditorial

### Titre principal (H1)
{{Ex. « Catalogue {{secteur}} — {{marque}} »}}

### Sous-titres (H2)
1. {{H2 — présentation de l'offre par familles}}
2. {{H2 — comment sont calculés vos tarifs}}

### Ton et style
Factuel. Un court paragraphe d'intro answer-first sous le H1 (SEO/GEO), le reste est la grille.

### Volume de contenu
- Cible ~1000 mots difficile sur une liste : compenser par un paragraphe d'intro riche + FAQ + descriptions de familles. Signaler si trop court.

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | Comment voir les prix sur {{marque}} ? | {{Les prix négociés s'affichent après connexion…}} | [Se connecter](/connexion) |
| 2 | {{Comment {{marque}} organise-t-elle son catalogue ?}} | {{…}} | — |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Voir le produit | /produit/[reference] | Haute | par card |
| Secondaire | Se connecter pour vos tarifs | /connexion | Moyenne | `!user` |

---

## Maillage interne

### Liens entrants

| Page source | Ancre | Type |
|---|---|---|
| Accueil | Voir le catalogue | CTA / nav |
| Fiches produit | Retour au catalogue | breadcrumb |

### Liens sortants

| Page cible | Ancre | Type |
|---|---|---|
| Produit | Désignation article | contextuel (card) |
| Connexion | Se connecter pour vos tarifs | CTA `[si !user]` |

### Liens transversaux
- **Nav (header)** : lien « Catalogue » actif ; `CategoryMenu` récursif

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Découverte | Accueil | Catalogue | Produit → Panier |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{« Catalogue {{secteur}} … » — sans nom de marque (template `%s`)}} |
| **Meta description** | {{familles principales + accès tarifs pro}} |
| **Canonical** | `/catalogue` |
| **Mot-clé principal** | {{catalogue {{secteur}} professionnels}} |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `ItemList` (ou `OfferCatalog`) |

---

## Notes et remarques

- Rendu serveur des pages publiques : ne pas basculer la liste en pur client.
- Filtres = pattern existant `CatalogueFilters`, ne pas réinventer.
