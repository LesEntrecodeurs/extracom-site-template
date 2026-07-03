# Page 404 (not-found)

> Hérite de `_base-page.md`. Type **structurel/utilitaire**, **noindex**.
> À créer : `app/not-found.tsx` (convention Next.js — **n'existe pas encore** dans le repo).

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Page introuvable (404) |
| **Route** | `app/not-found.tsx` (à créer) |
| **Slug URL** | — (servie pour toute URL inconnue) |
| **Type de page** | utilitaire |
| **Indexation** | `noindex` (statut HTTP 404) |
| **Priorité** | Moyenne |
| **Statut** | {{à créer}} |

---

## Objectif

Rattraper une URL inexistante : expliquer, rassurer, et ramener le visiteur vers le
catalogue ou l'accueil (limiter la perte de trafic).

---

## Structure

| Zone | Contenu | Comportement |
|---|---|---|
| Message | « Page introuvable » + explication brève | statique |
| Recherche / CTA | champ recherche ou boutons « Voir le catalogue » / « Accueil » | liens internes |
| Suggestions (option) | quelques catégories ou produits phares | via `useShopContext`/`useArticles` |

---

## Wireframe ASCII

> Générer : bloc centré (code 404 discret, titre, message, CTA vers `/catalogue` et `/`),
> éventuellement recherche. Mobile-first, sobre, cohérent avec le thème (`--brand`).

---

## Composants fonctionnels

| Composant | Source | Obligatoire |
|---|---|---|
| Bouton / lien | `components/ui/button` + `next/link` | Oui |
| EmptyState | `components/site/EmptyState` | Non |

---

## Maillage interne

- **Liens sortants** : Accueil (`/`), Catalogue (`/catalogue`), éventuellement Contact.

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `noindex` — Next.js sert un statut 404 automatiquement |
| **JSON-LD** | aucun |

---

## Notes et remarques

- Ne pas rediriger en dur (`redirect`) : laisser le 404 se servir pour ne pas masquer les liens cassés.
- Bon endroit pour un champ de recherche catalogue (récupérer le visiteur).
- Cohérence visuelle avec le reste du site (thème, `Nav`/footer hérités du layout).
