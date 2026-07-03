# Politique de cookies

> Hérite de `_base-page.md`. Type **legal**, indexable minimal. Route à créer `app/politique-cookies/page.tsx`.
> Même gabarit que `mentions-legales.md`. Complète le bandeau `CookieConsent`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Politique de cookies |
| **Route** | `app/politique-cookies/page.tsx` (à créer) |
| **Slug URL** | `/politique-cookies` |
| **Type de page** | `legal` |
| **Indexation** | `index` |
| **Priorité** | Moyenne (conformité) |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectif principal
Détailler les cookies utilisés (essentiels vs non essentiels), leur finalité, leur durée, et le moyen de gérer son consentement.

---

## Structure (sections H2 types)
1. Qu'est-ce qu'un cookie
2. Cookies essentiels (session, panier — nécessaires au fonctionnement)
3. Cookies non essentiels (mesure d'audience, etc.) — soumis à consentement
4. Gérer son consentement (via le bandeau `CookieConsent`)
5. Durées de conservation

---

## Wireframe ASCII

> Générer : breadcrumb + article `<section>`/`<h2>`, éventuellement un `<table>` des cookies (nom, finalité, durée).

---

## Composants fonctionnels

| Composant | Source | Obligatoire |
|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Oui |
| Table | `components/ui/table` | Non (liste des cookies) |
| JsonLd | `components/site/JsonLd` | Oui |

---

## Contenu éditorial (minimal)
- **H1** : Politique de cookies
- Ton neutre, factuel. Pas de FAQ ni de seuil 1000 mots.
- **Cohérence obligatoire avec `CookieConsent`** : si des cookies non essentiels
  (analytics…) sont ajoutés, ils exigent un **opt-in réel** avant dépôt (cf. `TOOLBOX.md`).

---

## Maillage interne
- **Footer** : lien « Politique de cookies »
- **Liens** : Politique de confidentialité, Mentions légales
- Référencée depuis le bandeau `CookieConsent`

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | Politique de cookies |
| **Meta description** | {{cookies utilisés par {{marque}}}} |
| **Canonical** | `/politique-cookies` |
| **JSON-LD** | `WebPage`, `BreadcrumbList` |

---

## Notes
- Le template ne pose par défaut que des cookies **essentiels** ; tout ajout non essentiel doit passer par un opt-in dans `CookieConsent`.
- Contenu à valider par le marchand.
