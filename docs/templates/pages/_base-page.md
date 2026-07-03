# {{NOM_PAGE}}

> Template de base — toutes les fiches pages héritent de cette structure.
> Supprimer ce bloc de citation dans les fiches remplies (`docs/fiches/`).
>
> **À quoi sert une fiche page ici ?** Tu édites un template déjà câblé au kit
> Extracom (tu ne génères pas un site from scratch). La fiche est le **cadre**
> qui empêche de partir en roue libre au fil des prompts : elle fige la
> structure, le maillage, le SEO et — spécifique à ce projet — **les données du
> kit consommées** et **les réglages shop qui conditionnent l'affichage**.
> Quand tu édites une page réelle, tu tiens à jour sa fiche dans `docs/fiches/`
> (cf. `docs/PRINCIPES.md`, règle de synchronisation).

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | {{nom_page}} |
| **Route** | `app/{{chemin}}/page.tsx` |
| **Slug URL** | `/{{slug}}` |
| **Type de page** | {{`editorial` / `transactionnel` / `legal`}} |
| **Indexation** | {{`index` / `noindex`}} |
| **Priorité** | {{haute / moyenne / basse}} |
| **Statut** | {{à rédiger / en cours / validé}} |

> **Le `Type de page` pilote les sections applicables** :
>
> | Section | `editorial` | `transactionnel` | `legal` |
> |---|:-:|:-:|:-:|
> | Structure / Wireframe / Composants | ✅ | ✅ | ✅ |
> | Données kit consommées | ✅ (si dynamique) | ✅ | — |
> | Réglages shop & droits conditionnels | ✅ | ✅ | — |
> | Contenu éditorial + seuil 1000 mots | ✅ | — | minimal |
> | Bloc FAQ obligatoire | ✅ | — | — |
> | Tooltips glossaire | ✅ | — | — |
> | Maillage interne | ✅ | ✅ (nav) | ✅ (nav) |
> | SEO complet | ✅ | `noindex` | ✅ |
> | JSON-LD | selon matrice | `WebPage` seul | `WebPage` + `BreadcrumbList` |

---

## Objectifs de la page

### Objectif principal
{{Quel est le but premier de cette page ?}}

### Objectifs secondaires
- {{objectif 2}}
- {{objectif 3}}

### KPIs associés
- {{indicateur mesurable 1}}
- {{indicateur mesurable 2}}

---

## Structure de la page

> Description fonctionnelle zone par zone, de haut en bas.

### Zone 1 — {{Nom de la zone}}
- **Fonction** : {{rôle de cette zone}}
- **Contenu** : {{description du contenu attendu}}
- **Comportement** : {{interactions ou logique particulière}}

### Zone 2 — {{Nom de la zone}}
- **Fonction** : {{rôle de cette zone}}
- **Contenu** : {{description du contenu attendu}}
- **Comportement** : {{interactions ou logique particulière}}

> Ajouter autant de zones que nécessaire.

---

## Wireframe ASCII

> Générer un wireframe ASCII sur mesure pour cette page. Règles :
> - Chaque zone décrite dans « Structure de la page » apparaît comme un bloc distinct
> - Inclure `[HEADER]` en haut et `[FOOTER]` en bas
> - Montrer la disposition mobile-first (empilé en 375px) puis desktop
> - Marquer les éléments conditionnels : `[si !user]`, `[si canOrder]`, `[si price != null]`
> - Utiliser des cadres `+---+`, des crochets `[ ]` pour les boutons

---

## Composants fonctionnels

> Réutiliser en priorité les composants existants de `components/site/` et
> `components/ui/` (cf. `TOOLBOX.md`). Ne réinvente pas un composant qui existe.

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| {{nom_composant}} | {{`components/site/X` / `components/ui/Y` / nouveau}} | {{description}} | {{oui/non}} |

---

## Données kit consommées

> **Spécifique Extracom.** Toute donnée commerce vient du kit `@extracom/site-kit`
> — jamais de `fetch`. Lister ici les hooks / server actions utilisés et l'état à
> gérer. Référence : `vendor/site-kit/AGENT-MANUAL.md`.

| Donnée | Hook / action kit | Notes |
|---|---|---|
| {{ex: liste articles}} | {{`useArticles(query)`}} | {{`price` peut être `null` (anonyme + prix masqué)}} |

**États à gérer** : `isLoading` (skeleton), `error` (message + retry), vide (`EmptyState`), `price === null` (« Connectez-vous pour voir le tarif »).

---

## Réglages shop & droits conditionnant l'affichage

> **Spécifique Extracom.** L'UI s'adapte à `useShopContext()` (réglages du SHOP)
> et à `membership.capabilities` (droits de L'UTILISATEUR). On ne change pas ces
> valeurs — on s'y adapte. Si une demande les contredit, prévenir l'utilisateur.

| Élément d'UI | Condition | Source |
|---|---|---|
| {{ex: bouton Payer}} | {{`capabilities.paymentEnabled`}} | `useShopContext().data.capabilities` |
| {{ex: bouton Demander un devis}} | {{`canQuote`}} | `membership.capabilities` |
| {{ex: prix barré / remise}} | {{`display.showDiscounts`}} | `useShopContext().data.display` |
| {{ex: prix visiteur anonyme}} | {{`anonymousPricing === 'BASE'`}} | `useShopContext().data` |

---

## Contenu éditorial
<!-- Type `editorial` uniquement -->

### Titre principal (H1)
{{H1 intégrant le mot-clé principal ; nommer la marque (`branding.name`) quand pertinent}}

### Sous-titres (H2)
1. {{H2 — section 1}}
2. {{H2 — section 2}}
3. {{H2 — section 3}}

### Messages clés
- {{message 1 — ce que le visiteur doit retenir}}
- {{message 2}}

### Ton et style
{{Voix hybride GEO/CRO — cf. `docs/PRINCIPES.md`. Hero/CTA en 1re personne
(« nous »). Contenu factuel, answer-first, paragraphes courts.}}

### Volume de contenu
- **Cible SEO** : ~1000 mots de contenu visible (non bloquant). Si en dessous, le
  signaler à l'utilisateur et proposer d'enrichir — ne jamais inventer de faits.

---

## Bloc FAQ
<!-- Type `editorial` uniquement — OBLIGATOIRE -->

> 3 à 6 questions contextuelles à la page. Questions en 3e personne + nom de
> marque (`branding.name`) pour le GEO. Réponses answer-first (40-60 mots), puis
> détail. Maillage interne via ancres descriptives. JSON-LD `FAQPage` obligatoire
> (composant `JsonLd`).

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | {{Comment {{marque}} … ?}} | {{réponse directe 40-60 mots}} | {{[ancre](/cible) ou —}} |
| 2 | {{…}} | {{…}} | {{…}} |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | {{texte actionnable + bénéfice}} | {{page ou action}} | Haute | {{ex: toujours / si canOrder}} |
| Secondaire | {{texte}} | {{page ou action}} | Moyenne | {{—}} |

---

## Maillage interne

### Liens entrants

| Page source | Ancre | Type |
|---|---|---|
| {{page_source}} | {{texte du lien}} | {{CTA / contextuel / navigation}} |

### Liens sortants

| Page cible | Ancre | Type |
|---|---|---|
| {{page_cible}} | {{texte du lien}} | {{CTA / contextuel / navigation}} |

### Liens transversaux
- **Nav (header)** : {{présence dans `Nav` / `CategoryMenu`}}
- **Footer** : {{présence dans le footer du `layout.tsx`}}

### Parcours utilisateurs passant par cette page

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| {{nom du parcours}} | {{page précédente}} | {{Nom_page}} | {{page suivante}} |

---

## SEO
<!-- `noindex` pour les pages transactionnelles : renseigner uniquement le statut -->

| Champ | Valeur |
|---|---|
| **Indexation** | {{`index` / `noindex`}} |
| **Meta title** | {{50-60 car. — mot-clé au début ; PAS le nom de marque (ajouté par le template `%s`)}} |
| **Meta description** | {{150-160 car. — mot-clé + valeur + CTA implicite}} |
| **Canonical** | {{URL auto-référente}} |
| **Mot-clé principal** | {{mot-clé}} |
| **Mots-clés secondaires** | {{mot-clé 2, mot-clé 3}} |
| **Intention de recherche** | {{informationnelle / navigationnelle / transactionnelle}} |
| **JSON-LD** | {{schémas selon la matrice — cf. `TOOLBOX.md`}} |

---

## Notes et remarques

- {{Point d'attention spécifique à cette page}}
- {{Élément à valider avec l'utilisateur}}
