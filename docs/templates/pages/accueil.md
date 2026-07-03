# Accueil

> Hérite de `_base-page.md`. Type **editorial**, indexable. Route `app/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Accueil |
| **Route** | `app/page.tsx` |
| **Slug URL** | `/` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Haute |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Présenter la boutique B2B, orienter le visiteur vers le catalogue et déclencher l'inscription/connexion pour accéder aux tarifs négociés.

### Objectifs secondaires
- Expliquer en 5 secondes ce que vend la boutique et pour qui
- Rassurer le visiteur professionnel (conditions d'accès, tarifs client, devis)
- Guider l'anonyme vers l'inscription (parcours « comment ça marche »)

### KPIs associés
- Taux de clic vers le catalogue
- Taux d'inscription / connexion
- Taux de rebond

---

## Structure de la page

### Zone 1 — Hero
- **Fonction** : Capter l'attention, poser la proposition de valeur
- **Contenu** : accroche (nom de la boutique via `branding.name`), sous-accroche, CTA principal « Voir le catalogue », visuel
- **Comportement** : above the fold, rendu serveur

### Zone 2 — Onboarding visiteur `[si !user]`
- **Fonction** : expliquer le fonctionnement B2B (parcourir → s'inscrire → tarifs → commander)
- **Contenu** : « comment ça marche » en 3 étapes (`InfoBanner` / pattern existant)
- **Comportement** : visible uniquement pour les anonymes (`!user`)

### Zone 3 — Sélection produits / mise en avant
- **Fonction** : donner à voir le catalogue
- **Contenu** : `FeaturedCarousel` ou grille d'`ArticleCard` (prix/stock conditionnels)
- **Comportement** : liens vers fiches produit ; `price` peut être `null`

### Zone 4 — Catégories
- **Fonction** : entrée par famille de produits
- **Contenu** : `CategoryMenu` / blocs catégories issus de `catalogTree`
- **Comportement** : liens vers `/catalogue?famille=…`

### Zone 5 — Réassurance + CTA final
- **Fonction** : convertir
- **Contenu** : arguments de confiance (chiffrés), CTA « Créer un compte » `[si registrationOpen]`
- **Comportement** : CTA conditionné à `capabilities.registrationOpen`

---

## Wireframe ASCII

> Générer à partir des zones ci-dessus : hero + accroche + CTA, bandeau onboarding
> `[si !user]`, carrousel/grille produits, grille catégories, CTA final. Mobile-first.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| Hero | nouveau / `app/page.tsx` | Accroche + CTA catalogue | Oui |
| InfoBanner (onboarding) | `components/site/InfoBanner` | 3 étapes B2B, `[si !user]` | Oui |
| FeaturedCarousel | `components/site/FeaturedCarousel` | Mise en avant produits | Non |
| CategoryMenu | `components/site/CategoryMenu` | Catégories du catalogue | Oui |
| ArticleCard | `components/site/ArticleCard` | Carte produit | Non |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Contexte shop (branding, catalogTree, capabilities) | `useShopContext()` | pilote hero + onboarding + CTA |
| Utilisateur courant | `useAuth()` | `user === null` → onboarding anonyme |
| Produits mis en avant | `useArticles(query)` | `price` peut être `null` |

**États à gérer** : skeleton au chargement, `price === null`, anonyme vs connecté.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Onboarding « comment ça marche » | `!user` | `useAuth()` |
| CTA « Créer un compte » | `capabilities.registrationOpen` | `useShopContext().data.capabilities` |
| Prix sur les cartes | `price != null` sinon « Connectez-vous » | article |

---

## Contenu éditorial

### Titre principal (H1)
{{Accroche intégrant l'activité + `branding.name` — ex. « {{Marque}}, fournisseur {{secteur}} pour les professionnels »}}

### Sous-titres (H2)
1. {{H2 — ce que propose la boutique}}
2. {{H2 — comment commander (parcours B2B)}}
3. {{H2 — pourquoi choisir {{marque}}}}

### Messages clés
- {{proposition de valeur}}
- {{tarifs négociés / conditions B2B}}
- {{réassurance}}

### Ton et style
Voix hybride : hero et CTA en 1re personne (« nous »), contenu factuel answer-first.

### Volume de contenu
- Cible ~1000 mots. Sous le seuil → signaler et proposer d'enrichir (réassurance, chiffres, FAQ).

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | Comment accéder aux tarifs de {{marque}} ? | {{Les tarifs négociés s'affichent après connexion…}} | [Créer un compte](/inscription) |
| 2 | Qui peut commander sur {{marque}} ? | {{réponse}} | [Le catalogue](/catalogue) |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Voir le catalogue | /catalogue | Haute | toujours |
| Secondaire | Créer un compte | /inscription | Moyenne | `registrationOpen` |
| Tertiaire | Se connecter | /connexion | Basse | `!user` |

---

## Maillage interne

### Liens sortants

| Page cible | Ancre | Type |
|---|---|---|
| Catalogue | Voir le catalogue | CTA principal |
| Inscription | Créer un compte | CTA |
| Contact | Nous contacter | contextuel |

### Liens transversaux
- **Nav (header)** : logo → Accueil
- **Footer** : logo + liens principaux

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Prospect anonyme | Entrée (Google/direct) | Accueil | Catalogue → Inscription |
| Client connecté | Entrée (direct) | Accueil | Catalogue → Panier |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{`{ absolute: "..." }` — seul cas où le nom de marque est dans le title}} |
| **Meta description** | {{150-160 car., valeur + secteur + B2B}} |
| **Canonical** | `/` |
| **Mot-clé principal** | {{ex: fournisseur {{secteur}} professionnels}} |
| **JSON-LD** | `WebSite`, `Organization`, `LocalBusiness` (si adresse physique) |

---

## Notes et remarques

- Rendu serveur obligatoire (contenu visible aux crawlers).
- L'onboarding anonyme est un pattern existant — le réutiliser, ne pas le réimplémenter.
