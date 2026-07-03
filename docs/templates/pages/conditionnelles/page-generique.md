# Page générique (nouvelle page à la demande)

> Gabarit **par défaut** pour toute page que l'utilisateur demande de créer et qui
> ne correspond à aucune fiche existante (page service, guide, landing, rubrique
> métier…). Hérite de `_base-page.md`. Choisir le `Type de page` adapté.
>
> **Créer une nouvelle page est autorisé** : `app/` est la surface éditable. Voir
> le workflow « Créer une nouvelle page » dans `TOOLBOX.md` et `docs/PRINCIPES.md` §12.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | {{nom_page}} |
| **Route** | `app/{{slug}}/page.tsx` (à créer) |
| **Slug URL** | `/{{slug}}` |
| **Type de page** | {{`editorial` (défaut) / `transactionnel` / `legal`}} |
| **Indexation** | {{`index` / `noindex`}} |
| **Priorité** | {{haute / moyenne / basse}} |
| **Statut** | {{à rédiger / en cours / validé}} |

> **Propagation obligatoire à la création** (cf. `docs/PRINCIPES.md` §9 & §12) :
> route + nav (`Nav`/footer) + `sitemap.ts` (si indexable) + JSON-LD
> `BreadcrumbList` + `app/llms.txt` (si importante) + maillage des pages liées +
> fiche d'état `docs/fiches/{{slug}}.md`.

---

## Objectifs de la page

### Objectif principal
{{But premier de la page}}

### Objectifs secondaires
- {{objectif 2}}
- {{objectif 3}}

### KPIs associés
- {{indicateur mesurable}}

---

## Structure de la page

### Zone 1 — {{Nom}}
- **Fonction** : {{rôle}}
- **Contenu** : {{contenu attendu}}
- **Comportement** : {{interactions}}

### Zone 2 — {{Nom}}
- **Fonction** : {{rôle}}
- **Contenu** : {{contenu attendu}}
- **Comportement** : {{interactions}}

> Autant de zones que nécessaire.

---

## Wireframe ASCII

> Générer un wireframe fidèle aux zones, mobile-first, avec `[HEADER]`/`[FOOTER]`
> et les éléments conditionnels (`[si !user]`, `[si canOrder]`, `[si price != null]`).

---

## Composants fonctionnels

> Réutiliser en priorité `components/site/*` et `components/ui/*` existants.

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| {{nom}} | {{`components/site/X` / nouveau}} | {{description}} | {{oui/non}} |

---

## Données kit consommées
<!-- Si la page affiche du commerce. Sinon retirer cette section. -->

| Donnée | Hook / action kit | Notes |
|---|---|---|
| {{donnée}} | {{`useX()`}} | {{`price` nullable ?}} |

**États à gérer** : chargement, `error`, vide (`EmptyState`), `price === null`.

---

## Réglages shop & droits conditionnant l'affichage
<!-- Si des éléments dépendent des capacités shop / droits utilisateur. -->

| Élément d'UI | Condition | Source |
|---|---|---|
| {{élément}} | {{condition}} | {{`useShopContext().data…` / `membership.capabilities`}} |

---

## Contenu éditorial
<!-- Type `editorial` uniquement -->

### Titre principal (H1)
{{H1 avec mot-clé ; nommer la marque si pertinent}}

### Sous-titres (H2)
1. {{H2}}
2. {{H2}}

### Ton et style
Voix hybride (cf. `docs/PRINCIPES.md` §7). Answer-first, factuel.

### Volume de contenu
- Cible ~1000 mots (non bloquant) — signaler si en dessous.

---

## Bloc FAQ
<!-- Type `editorial` indexable : OBLIGATOIRE -->

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | {{…}} | {{…}} | {{[ancre](/cible) ou —}} |
| 2 | {{…}} | {{…}} | {{…}} |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | {{texte}} | {{cible}} | Haute | {{—}} |
| Secondaire | {{texte}} | {{cible}} | Moyenne | {{—}} |

---

## Maillage interne

### Liens entrants
| Page source | Ancre | Type |
|---|---|---|
| {{source}} | {{ancre}} | {{type}} |

### Liens sortants
| Page cible | Ancre | Type |
|---|---|---|
| {{cible}} | {{ancre}} | {{type}} |

### Liens transversaux
- **Nav (header)** : {{présence}}
- **Footer** : {{présence}}

### Parcours utilisateurs
| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| {{parcours}} | {{avant}} | {{cette page}} | {{après}} |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | {{`index` / `noindex`}} |
| **Meta title** | {{50-60 car., sans nom de marque}} |
| **Meta description** | {{150-160 car.}} |
| **Canonical** | `/{{slug}}` |
| **Mot-clé principal** | {{mot-clé}} |
| **JSON-LD** | {{selon la matrice — cf. `TOOLBOX.md`}} |

---

## Notes et remarques

- {{Point d'attention}}
- Vérifier la propagation (nav, sitemap, llms.txt, maillage) avant de considérer la page terminée.
