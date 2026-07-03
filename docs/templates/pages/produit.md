# Produit (fiche détail)

> Hérite de `_base-page.md`. Type **editorial**, indexable. Route `app/produit/[reference]/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Fiche produit |
| **Route** | `app/produit/[reference]/page.tsx` |
| **Slug URL** | `/produit/[reference]` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Haute |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Présenter un article (désignation, specs, déclinaisons, prix client) et permettre l'ajout au panier ou la demande de devis.

### Objectifs secondaires
- Rassurer (specs factuelles, disponibilité, fiches techniques)
- Inciter l'anonyme à se connecter pour voir le prix

### KPIs associés
- Taux d'ajout au panier
- Taux de connexion depuis la fiche
- Taux de rebond fiche produit

---

## Structure de la page

### Zone 1 — Fil d'Ariane
- **Fonction** : navigation hiérarchique
- **Contenu** : Accueil > Catalogue > {{Famille}} > {{Article}} (`breadcrumb`)

### Zone 2 — Galerie + BuyBox
- **Fonction** : visualiser + acheter
- **Contenu** : image(s) produit (`next/image`, `article.imageUrl`), `BuyBox` (déclinaisons/gamme + ajout panier)
- **Comportement** : prix conditionnel (`price` nullable), `AddToCart` avec toast `sonner`

### Zone 3 — Description & specs
- **Fonction** : informer (SEO/GEO)
- **Contenu** : description longue en **texte**, tableau de specs, fiches techniques
- **Comportement** : contenu server-rendered, extractible par les LLM

### Zone 4 — Produits liés
- **Fonction** : maillage / cross-sell
- **Contenu** : grille `ArticleCard` de la même famille
- **Comportement** : liens contextuels

---

## Wireframe ASCII

> Générer : breadcrumb, split galerie/BuyBox (empilé en mobile, 2 colonnes en `lg:`),
> bloc description + tableau specs, rangée produits liés, FAQ.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| BuyBox | `components/site/BuyBox` | Déclinaisons + ajout panier | Oui |
| AddToCart | `components/site/AddToCart` | Bouton + toast | Oui |
| ArticleCard | `components/site/ArticleCard` | Produits liés | Non |
| AuthGate | `components/site/AuthGate` | « Connectez-vous pour le tarif » | Non |
| JsonLd | `components/site/JsonLd` | Schéma `Product` | Oui |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Détail article | `useArticle(reference)` / `getArticleAction` | prix/stock/promo, déclinaisons, glossaires, fiches techniques ; `price` nullable |
| Ajout panier | `useAddToCart()` | version légère (sans charger le panier) |
| Droits utilisateur | `membership.capabilities` | `canOrder` / `canQuote` conditionnent les boutons |

**États à gérer** : chargement, `error` (404 référence inconnue), `price === null` (`AuthGate`), rupture de stock.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Bouton « Ajouter au panier » | `canOrder` | `membership.capabilities` |
| Bouton « Demander un devis » | `canQuote` | `membership.capabilities` |
| Prix / prix barré / remise | `display.showBasePrice`, `display.showDiscounts`, `anonymousPricing` | `useShopContext().data` |
| Stock affiché | `display.stock` | `useShopContext().data` |

---

## Contenu éditorial

### Titre principal (H1)
{{Désignation de l'article — mot-clé produit au début}}

### Sous-titres (H2)
1. {{Caractéristiques de {{produit}}}}
2. {{À quoi sert {{produit}} — usages}}
3. {{Livraison et disponibilité}}

### Ton et style
Factuel, answer-first. Specs en texte (jamais uniquement en image → GEO). Nommer la marque dans le 1er paragraphe.

### Volume de contenu
- Cible ~1000 mots souvent difficile par article : enrichir avec description longue + usages + FAQ. Non bloquant, signaler si trop court.

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | {{Comment commander {{produit}} chez {{marque}} ?}} | {{Ajoutez l'article au panier après connexion…}} | [Comment commander](/catalogue) |
| 2 | {{Quel est le délai de livraison de {{produit}} ?}} | {{…}} | [Livraison](/contact) |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Ajouter au panier | action panier | Haute | `canOrder` |
| Alternatif | Demander un devis | action devis | Haute | `canQuote` |
| Anonyme | Se connecter pour voir le tarif | /connexion | Moyenne | `price === null` |

---

## Maillage interne

### Liens entrants

| Page source | Ancre | Type |
|---|---|---|
| Catalogue | Désignation article | contextuel |
| Produits liés | Désignation article | contextuel |

### Liens sortants

| Page cible | Ancre | Type |
|---|---|---|
| Catalogue / Famille | Retour au catalogue | breadcrumb |
| Produits liés | Désignation | contextuel |
| Panier | Voir le panier (après ajout) | CTA |

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Achat | Catalogue | Produit | Panier → Commande |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{Désignation article — sans nom de marque}} |
| **Meta description** | {{specs clés + disponibilité}} |
| **Canonical** | `/produit/[reference]` |
| **Mot-clé principal** | {{désignation produit}} |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `Product` (`sku`, `price`/`availability` **uniquement si prix exposé**), `FAQPage` si bloc FAQ |

---

## Notes et remarques

- `price`/`availability` dans le JSON-LD `Product` **uniquement si un prix est exposé** — sinon les omettre.
- Ne jamais recomposer un prix : `formatPrice()` du kit seulement.
- Rendu serveur pour l'indexation.
