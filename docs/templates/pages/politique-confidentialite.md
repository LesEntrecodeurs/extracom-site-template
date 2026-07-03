# Politique de confidentialité (RGPD)

> Hérite de `_base-page.md`. Type **legal**, indexable minimal. Route à créer `app/politique-confidentialite/page.tsx`.
> Même gabarit que `mentions-legales.md`. Obligation RGPD.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Politique de confidentialité |
| **Route** | `app/politique-confidentialite/page.tsx` (à créer) |
| **Slug URL** | `/politique-confidentialite` |
| **Type de page** | `legal` |
| **Indexation** | `index` |
| **Priorité** | Haute (conformité) |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectif principal
Informer sur la collecte et le traitement des données personnelles (compte client, commandes, support) et les droits RGPD.

---

## Structure (sections H2 types)
1. Responsable du traitement
2. Données collectées (compte, commandes, navigation)
3. Finalités et bases légales
4. Destinataires et sous-traitants (dont Extracom/Sage100 pour le commerce)
5. Durée de conservation
6. Cookies (renvoi vers la Politique de cookies)
7. Droits des personnes (accès, rectification, effacement…) et contact DPO

---

## Wireframe ASCII

> Générer : breadcrumb + article structuré `<section>`/`<h2>`. Simple, lisible.

---

## Composants fonctionnels

| Composant | Source | Obligatoire |
|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Oui |
| JsonLd | `components/site/JsonLd` | Oui |

---

## Contenu éditorial (minimal)
- **H1** : Politique de confidentialité
- Ton neutre, factuel. Pas de FAQ ni de seuil 1000 mots.
- **Stub à personnaliser** — mentionner que le commerce transite par la plateforme Extracom/Sage100 (sous-traitant), sans exposer de détails techniques sensibles.

---

## Maillage interne
- **Footer** : lien « Politique de confidentialité »
- **Liens** : Mentions légales, Politique de cookies, Contact
- Référencée depuis le `CookieConsent` et le formulaire d'inscription

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | Politique de confidentialité |
| **Meta description** | {{traitement des données de {{marque}}}} |
| **Canonical** | `/politique-confidentialite` |
| **JSON-LD** | `WebPage`, `BreadcrumbList` |

---

## Notes
- Cohérence avec le bandeau `CookieConsent` (composant existant) et la Politique de cookies.
- Contenu à valider par le marchand ; ne pas inventer d'engagements RGPD.
