# À propos

> Page conditionnelle vitrine — n'existe pas par défaut, à créer à la demande.
> Hérite de `_base-page.md`. Type **editorial**, indexable. Route à créer `app/a-propos/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | À propos |
| **Route** | `app/a-propos/page.tsx` (à créer) |
| **Slug URL** | `/a-propos` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | {{à rédiger / en cours / validé}} |

> **Propagation** (cf. `docs/PRINCIPES.md`) : créer la route, l'ajouter à la nav
> (`Nav` / footer), au `sitemap.ts`, et mettre à jour `app/llms.txt`.

---

## Objectifs de la page

### Objectif principal
Raconter l'entreprise (histoire, valeurs, expertise) pour construire la confiance B2B.

### Objectifs secondaires
- Appuyer l'autorité (ancienneté, chiffres, certifications)
- Nourrir le GEO (entité nommée + contexte géographique/sectoriel)

---

## Structure de la page

### Zone 1 — Hero éditorial
- **Fonction** : accroche de marque
- **Contenu** : H1 + phrase de mission
### Zone 2 — Histoire / storytelling
- **Fonction** : récit des origines (3e personne acceptable ici)
### Zone 3 — Valeurs / expertise
- **Fonction** : différenciation
### Zone 4 — Chiffres clés / preuves
- **Fonction** : autorité (données chiffrées, `<strong>`)
### Zone 5 — CTA
- **Fonction** : orienter vers Catalogue / Contact

---

## Wireframe ASCII

> Générer : hero éditorial, sections alternées histoire/valeurs, bande de chiffres,
> CTA final, FAQ. Mobile-first.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Breadcrumb | `components/ui/breadcrumb` | Fil d'Ariane | Oui |
| JsonLd | `components/site/JsonLd` | `WebPage` + `BreadcrumbList` | Oui |

---

## Contenu éditorial

### Titre principal (H1)
{{« À propos de {{marque}} » ou accroche de mission}}

### Sous-titres (H2)
1. {{Notre histoire}}
2. {{Nos valeurs / notre expertise}}
3. {{{{marque}} en chiffres}}

### Ton et style
Storytelling en 3e personne pour les origines ; 1re personne pour le présent. Nommer la marque, ancrer au territoire/secteur (GEO).

### Volume de contenu
- Cible ~1000 mots. Bon candidat pour l'atteindre. Signaler si trop court.

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | {{Depuis quand {{marque}} existe-t-elle ?}} | {{…}} | — |
| 2 | {{Quels secteurs {{marque}} sert-elle ?}} | {{…}} | [Catalogue](/catalogue) |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Découvrir le catalogue | /catalogue | Haute | toujours |
| Secondaire | Nous contacter | /contact | Moyenne | — |

---

## Maillage interne

- **Footer / Nav** : lien « À propos »
- **Liens sortants** : Catalogue, Contact
- **Liens entrants** : Accueil (« Notre histoire »), FAQ d'autres pages

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Réassurance | Accueil | À propos | Catalogue / Contact |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{« À propos — {{secteur}} … » sans nom de marque}} |
| **Meta description** | {{histoire + expertise + territoire}} |
| **Canonical** | `/a-propos` |
| **JSON-LD** | `WebPage`, `BreadcrumbList` |

---

## Notes et remarques

- Page 100 % éditoriale (aucune donnée kit). Idéale pour le GEO (entité nommée).
