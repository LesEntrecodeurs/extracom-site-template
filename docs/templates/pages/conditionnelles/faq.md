# FAQ (page dédiée)

> Page conditionnelle vitrine — à créer à la demande. Hérite de `_base-page.md`.
> Type **editorial**, indexable. Route à créer `app/faq/page.tsx`.
>
> À distinguer du **bloc FAQ** présent en bas de chaque page `editorial` : ici
> c'est une page FAQ centralisée (questions transverses).

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | FAQ |
| **Route** | `app/faq/page.tsx` (à créer) |
| **Slug URL** | `/faq` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Répondre aux questions fréquentes des clients B2B (accès aux tarifs, commande, devis, livraison, paiement) et capter les requêtes conversationnelles (GEO).

### Objectifs secondaires
- Réduire la charge support
- Mailler vers les pages de détail (catalogue, contact, compte)

---

## Structure de la page

### Zone 1 — En-tête + breadcrumb
### Zone 2 — FAQ par catégories
- **Contenu** : `accordion` (`components/ui/accordion`) groupé par thème
- **Comportement** : answer-first, chaque réponse autosuffisante (GEO)
### Zone 3 — CTA contact

---

## Wireframe ASCII

> Générer : header + breadcrumb, groupes de questions en accordéons par thème,
> CTA « Nous contacter ». Mobile-first.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Accordion | `components/ui/accordion` | Questions/réponses | Oui |
| JsonLd | `components/site/JsonLd` | `FAQPage` | Oui |

---

## Données consommées

| Donnée | Source | Notes |
|---|---|---|
| Questions/réponses | `data/faq.ts` (statique) | contenu éditorial du repo |
| Réglages shop (pour contextualiser) | `useShopContext()` | ex: ne montrer les Q paiement que si `paymentEnabled` |

---

## Contenu éditorial

### Titre principal (H1)
{{« Questions fréquentes — {{marque}} »}}

### Sous-titres (H2) — par thème
1. {{Compte et tarifs}}
2. {{Commande et devis}}
3. {{Livraison et paiement}}

### Ton et style
Questions en 3e personne + nom de marque (GEO). Réponses answer-first (40-80 mots), puis détail. Maillage interne via ancres descriptives.

### Volume de contenu
- Cible ~1000 mots atteignable avec 8-12 Q/R détaillées.

---

## Bloc FAQ
La page **est** un bloc FAQ étendu → `FAQPage` JSON-LD couvrant toutes les Q/R.

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Une autre question ? Contactez-nous | /contact | Haute | toujours |

---

## Maillage interne

- **Footer / Nav** : lien « FAQ »
- **Liens sortants** : catalogue, contact, compte, inscription (réponses avec ancres)

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Levée d'objection | Catalogue / Google | FAQ | Inscription / Contact |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{« FAQ {{secteur}} … » sans nom de marque}} |
| **Meta description** | {{principales questions couvertes}} |
| **Canonical** | `/faq` |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `FAQPage` |

---

## Notes et remarques

- Ne pas dupliquer mot pour mot les blocs FAQ des autres pages : la page FAQ traite le transverse.
- Filtrer les questions selon les capacités shop (ex: masquer paiement si `!paymentEnabled`).
