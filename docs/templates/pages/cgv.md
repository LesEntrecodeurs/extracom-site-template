# Conditions générales de vente (CGV)

> Hérite de `_base-page.md`. Type **legal**, indexable minimal. Route à créer `app/cgv/page.tsx`.
> Page **essentielle en e-commerce**. Même gabarit que `mentions-legales.md`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Conditions générales de vente |
| **Route** | `app/cgv/page.tsx` (à créer) |
| **Slug URL** | `/cgv` |
| **Type de page** | `legal` |
| **Indexation** | `index` |
| **Priorité** | Haute (conformité) |
| **Statut** | {{à rédiger / en cours / validé}} |

> **Lien avec le kit** : les CGV acceptées à l'inscription proviennent de
> `useShopContext().data.terms` (`RegisterForm` fait accepter les CGV). La page `/cgv`
> **présente** ces conditions de façon lisible et pérenne. Garder les deux cohérents.

---

## Objectif principal
Exposer les conditions contractuelles de vente B2B (commande, prix, paiement, livraison, retours, garanties) — obligation légale e-commerce.

---

## Structure (sections H2 types)
1. Objet et champ d'application
2. Commandes et devis
3. Prix et conditions tarifaires (tarifs négociés B2B)
4. Paiement
5. Livraison et délais
6. Retours, réclamations et garanties
7. Responsabilité, données et litiges

---

## Wireframe ASCII

> Générer : breadcrumb + article structuré en `<section>`/`<h2>`, sommaire ancré optionnel. Lisible.

---

## Composants fonctionnels

| Composant | Source | Obligatoire |
|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Oui |
| JsonLd | `components/site/JsonLd` | Oui |

---

## Contenu éditorial (minimal)
- **H1** : Conditions générales de vente
- Ton neutre, juridique. Pas de FAQ ni de seuil 1000 mots.
- **Stub à personnaliser** avec les conditions réelles du marchand (ne rien inventer sur le plan juridique).

---

## Maillage interne
- **Footer** : lien « CGV »
- **Liens** : Mentions légales, Politique de confidentialité, Contact
- Référencée depuis le tunnel de commande / inscription (acceptation)

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | Conditions générales de vente |
| **Meta description** | {{conditions de vente de {{marque}}}} |
| **Canonical** | `/cgv` |
| **JSON-LD** | `WebPage`, `BreadcrumbList` |

---

## Notes
- Contenu juridique = à valider par le marchand ; l'agent met en forme, n'invente pas de clauses.
- Ajouter le lien au footer (colonne Aide) à la création.
