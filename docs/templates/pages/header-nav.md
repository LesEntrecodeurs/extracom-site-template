# Header / Navigation

> Élément **structurel** (pas une page). Rendu dans `app/layout.tsx` via le composant
> `components/site/Nav`. Présent sur toutes les pages. Type **structurel** — pas de
> H1, pas de FAQ, pas d'indexation propre.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Élément** | Header / barre de navigation |
| **Fichiers** | `app/layout.tsx` (montage) + `components/site/Nav.tsx` |
| **Type** | structurel (transversal) |
| **Présence** | toutes les pages |

---

## Fonction

Orienter le visiteur, refléter l'état connecté/anonyme, donner accès au catalogue,
à la recherche, au panier et au compte. Reçoit `context` (shop) et `user` résolus
**côté serveur** dans le layout → pas de flash « Connexion ».

---

## Structure

| Zone | Contenu | Comportement |
|---|---|---|
| Logo / nom | `branding.name` (ou `shopName`) → lien `/` | toujours |
| Navigation catalogue | lien « Catalogue », `CategoryMenu` (récursif) | menu déroulant / `sheet` en mobile |
| Recherche | champ de recherche produits | pousse vers `/catalogue?search=…` |
| Panier | `CartLink` (compteur) | `[si canOrder]` |
| Compte | « Se connecter » `[si !user]` / « Mon compte » `[si user]` | dérive de `useAuth` / `user` |

---

## Données & réglages conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Nom / logo | `branding` | `useShopContext()` / `context` (layout) |
| Entrée « Créer un compte » | `capabilities.registrationOpen` | `context.capabilities` |
| Lien panier | `canOrder` | `membership.capabilities` |
| État connecté | `user != null` | `meAction()` (layout) / `useAuth()` |
| Arbre catégories | `catalogTree` / `families` | `useShopContext()` |

---

## Composants fonctionnels

| Composant | Source | Obligatoire |
|---|---|---|
| Nav | `components/site/Nav` | Oui |
| CategoryMenu | `components/site/CategoryMenu` | Oui |
| CartLink | `components/site/CartLink` | Oui |
| CompanySwitcher | `components/site/CompanySwitcher` | Non (multi-société) |

---

## Maillage transversal

Liens présents sur **toutes** les pages : logo → `/`, Catalogue, Panier, Compte /
Connexion. Ce sont les liens entrants « navigation » référencés par chaque fiche page.

---

## Accessibilité & SEO

- `<header>` + `<nav aria-label="…">` sémantiques.
- Le header ne porte **aucun** `<h1>`-`<h6>` (n'altère pas la hiérarchie des pages).
- État actif accessible (`aria-current="page"`), focus visible, cible tactile ≥ 44px (mobile-first).
- Menu mobile via `sheet`/`drawer` (`components/ui/*`).

---

## Notes

- Toute nouvelle page importante doit être **ajoutée à la nav** (règle de propagation).
- Ne pas dupliquer `Nav` : c'est le point unique de navigation haute.
