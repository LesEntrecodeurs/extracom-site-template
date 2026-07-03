# Mentions légales

> Hérite de `_base-page.md`. Type **legal**, indexable minimal. Route `app/mentions-legales/page.tsx`.
> Sert de gabarit pour les autres pages légales (politique de confidentialité, CGV, cookies).

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Mentions légales |
| **Route** | `app/mentions-legales/page.tsx` |
| **Slug URL** | `/mentions-legales` |
| **Type de page** | `legal` |
| **Indexation** | `index` |
| **Priorité** | Basse |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Fournir les informations légales obligatoires (éditeur, hébergeur, propriété, données).

### Objectifs secondaires
- Conformité RGPD / mentions e-commerce
- Servir de base aux pages politique de confidentialité et CGV

---

## Structure de la page

### Zone 1 — Contenu légal
- **Fonction** : informer
- **Contenu** : éditeur, hébergeur, propriété intellectuelle, données personnelles, cookies
- **Comportement** : statique — **stub à personnaliser** avec les vraies infos du marchand

---

## Wireframe ASCII

> Générer : breadcrumb + article texte structuré en `<section>`/`<h2>`. Simple, lisible.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Fil d'Ariane | Oui |
| JsonLd | `components/site/JsonLd` | `WebPage` + `BreadcrumbList` | Oui |

---

## Contenu éditorial (minimal)

### Titre principal (H1)
Mentions légales

### Sous-titres (H2)
1. Éditeur du site
2. Hébergement
3. Propriété intellectuelle
4. Données personnelles et cookies

### Ton et style
Neutre, factuel, juridique. Pas de FAQ ni de seuil 1000 mots.

---

## Maillage interne

- **Footer** : lien « Mentions légales »
- **Liens sortants** : Politique de confidentialité, Contact

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | Mentions légales |
| **Meta description** | {{informations légales de {{marque}}}} |
| **Canonical** | `/mentions-legales` |
| **JSON-LD** | `WebPage`, `BreadcrumbList` |

---

## Notes et remarques

- Contenu = stub à remplir avec les vraies infos (raison sociale, SIRET, hébergeur…).
- Dupliquer ce gabarit pour `politique-confidentialite` et `cgv` au besoin.
