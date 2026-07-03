# Boîte à outils de la vitrine — inventaire

> Commence par **`AGENTS.md`** (rôle, frontières, règles dures, environnement,
> comment vérifier ton travail). Ce fichier-ci est l'**inventaire détaillé** :
> tout ce dont tu disposes. Utilise-le — ne réinvente pas un composant qui existe
> déjà, n'installe rien hors de la liste.
>
> Rappel de contexte : tu édites dans **Mantly** (éditeur + agent + preview +
> publish + git + hébergement). Le propriétaire édite par prompt et **publie
> lui-même** depuis Mantly ; toi tu livres un code qui build. Le commerce passe
> exclusivement par le kit verrouillé `@extracom/site-kit` (API
> Extracom/Sage100).

## Règles

1. **Données & commerce → uniquement les hooks du kit** `@extracom/site-kit/react`
   (`useArticles`, `useArticle`, `useShopContext`, `useCart`, `useAddToCart`,
   `useAuth`, `useCheckout`, `usePayment`, `useDelivery`, `useDocuments`,
   `useAccount`, `useCompany`, `useSupport`…).
   Jamais de `fetch`/axios vers une URL : tu n'as pas les URLs, et c'est interdit.
   Référence complète des fonctions (signatures + doc, **générée** depuis le kit
   vendored) : `vendor/site-kit/AGENT-MANUAL.md`.
2. **UI → composants shadcn pré-bakés dans `components/ui/`.** Compose-les.
   Ne lance JAMAIS `npx shadcn add` toi-même : tout est déjà là.
3. **Dépendances → uniquement celles déjà dans `package.json`.** `package.json`,
   le lockfile et `vendor/` (kit) sont **verrouillés**. Si un besoin sort de la
   liste, **dis-le à l'utilisateur** (« il faut ajouter la lib X »), ne l'installe
   pas et ne contourne pas.
4. **Feedback utilisateur → `sonner`** (`toast.success`, `toast.error`,
   `toast.promise`). C'est la convention du produit.
5. **Réglages du shop → `useShopContext()`.** Trois familles à distinguer :
   - **`display` / `anonymousPricing`** → affichage (stock, remises, prix barré,
     prix des visiteurs anonymes `'BASE' | 'HIDDEN'`).
   - **`capabilities`** (capacités du SHOP : `paymentEnabled`, `registrationOpen`,
     `deliveryEnabled`) → **pilotent l'affichage de la vitrine** : masque le
     paiement si `!paymentEnabled`, les entrées « Créer un compte » si
     `!registrationOpen`, la livraison si `!deliveryEnabled` (déjà câblé dans
     `app/commande`, `app/connexion`, `app/page`, `app/layout`). Dérivées côté
     serveur — tu t'y adaptes.
   - **`branding`** (`name`, `primaryColor?`, `logoUrl?`) → **indicateur NON
     contraignant** : un point de départ, tu restes libre de restyler (l'identité
     se règle dans `app/globals.css`, cf. « Thème »).
   Si une demande contredit un réglage, préviens l'utilisateur — c'est lui qui le
   change.
6. **Droits UTILISATEUR → `membership.capabilities`** (booléens PAR utilisateur :
   `canOrder`, `canQuote`, `canCheckoutWithoutPayment`, `canViewDocuments`),
   dérivés du rôle côté serveur. Conditionne l'UI dessus (ex. bouton « Demander
   un devis » si `canQuote`). Tu n'as **pas** accès aux permissions brutes, et
   c'est voulu. **Ne pas confondre** avec `useShopContext().capabilities`
   (capacités du SHOP, règle 5). L'API revérifie tout.
7. **Prix → `formatPrice` du kit ; `price` peut être `null`.** Un article ou une
   ligne peut avoir `price: null` (visiteur anonyme + shop en prix masqué).
   **Toujours** gérer ce cas (état « Connectez-vous pour voir le tarif »), sans
   masquer le produit. Ne **jamais** calculer, recomposer ou deviner un prix —
   au plus `formatPrice()` pour l'afficher (cf. `ArticleCard` / fiche produit).

## Composants `components/ui/` (shadcn, pré-bakés)

Mise en page & contenu : `card`, `separator`, `aspect-ratio`, `scroll-area`,
`accordion`, `collapsible`, `tabs`, `table`, `badge`, `avatar`, `skeleton`,
`empty`, `item`, `kbd`, `progress`, `spinner`, `breadcrumb`, `pagination`.

Navigation & overlays : `navigation-menu`, `dropdown-menu`, `dialog`, `sheet`,
`drawer` (mobile), `popover`, `hover-card`, `tooltip`, `command` (recherche).

Formulaires : `form`, `field`, `input`, `input-group`, `input-otp`, `textarea`,
`label`, `checkbox`, `radio-group`, `switch`, `select`, `slider`, `toggle`,
`toggle-group`, `button`, `button-group`, `calendar` (dates de livraison),
`alert`, `alert-dialog`.

## Librairies disponibles (allowlist, versions épinglées)

| Besoin                             | Lib                                                  |
| ---------------------------------- | ---------------------------------------------------- |
| Icônes                             | `lucide-react`                                       |
| Toasts                             | `sonner`                                             |
| Formulaires + validation           | `react-hook-form`, `@hookform/resolvers`, `zod`      |
| Carrousels produit                 | `embla-carousel-react` (+ `embla-carousel-autoplay`) |
| Animations / transitions           | `framer-motion`                                      |
| Tableaux avancés (tri, pagination) | `@tanstack/react-table`                              |
| Dates                              | `date-fns`, `react-day-picker`                       |
| Drawers mobile                     | `vaul`                                               |
| Recherche / palette                | `cmdk`                                               |
| Saisie code (OTP)                  | `input-otp`                                          |
| Thème clair/sombre                 | `next-themes`                                        |
| Classes conditionnelles            | `clsx`, `tailwind-merge` (via `cn` de `@/lib/utils`) |

## Images

- **Photos produit** : déjà dans `article.imageUrl` (résolu par le kit). Affiche
  avec `next/image` (cf. `ArticleCard`). Le host est autorisé via
  `EXTRACOM_MEDIA_HOST` (next.config) — ne pas utiliser `<img>` brut.
- **Images statiques du site** (hero, bannières, à-propos) : dépose-les dans
  `public/` et référence `/mon-image.jpg` avec `next/image`. Fallback :
  `/placeholder.svg`.
- **Favicon** : `app/icon.svg`. **Image OG** : générée dynamiquement par
  `app/opengraph-image.tsx` (next/og).

## SEO — référencement classique (Google/Bing)

À préserver à chaque édition (le gate de publication le vérifie) :

- **Metadata** : chaque page indexable exporte `generateMetadata` — `title`
  **unique**, `description` ≤ ~160 caractères, `alternates.canonical`. Le layout
  pose le `title` template + OpenGraph/Twitter ; `app/opengraph-image.tsx` génère
  l'image OG (next/og). En place : `catalogue`, `produit/[reference]`, `contact`,
  `mentions-legales`, `layout`.
- **Rendu serveur des pages publiques** (accueil, catalogue, fiche produit) — ne
  les bascule **pas** en composant purement client (sinon contenu invisible aux
  crawlers).
- **`sitemap.ts` / `robots.ts`** à jour : ajoute toute nouvelle section indexable
  au sitemap ; garde compte/panier/checkout en `noindex` (déjà fait).
- **HTML sémantique** : un seul `<h1>` par page, hiérarchie `h2/h3` cohérente,
  `alt` sur les images, libellés de liens explicites (pas « cliquez ici »).
- **Perf / Core Web Vitals** (comptent pour le SEO) : `next/image` partout
  (jamais `<img>` brut), pas de layout shift, pas de JS bloquant inutile.

## GEO — Generative Engine Optimization (ChatGPT, Claude, Perplexity, AI Overviews)

Objectif : que les **assistants génératifs** comprennent la boutique et la
**citent correctement**. Distinct du SEO classique — la cible n'est pas un crawler
mais un LLM qui lit le contenu.

- **`app/llms.txt`** (route, déjà en place) : résumé lisible du site (nom,
  catalogue, grandes catégories, conditions d'accès), **sans donnée sensible**
  (pas de prix client/stock). **Tiens-le à jour** : nom du shop, catégories,
  ce qui nécessite une connexion.
- **Données structurées JSON-LD** = la matière première des moteurs génératifs.
  `JsonLd` (`components/site/JsonLd`) — `Product` sur la fiche (avec `sku`,
  `price`/`availability` **uniquement si un prix est exposé**), `Organization`
  au global. Ne pas écrire `dangerouslySetInnerHTML` à la main → `<JsonLd data={…} />`.
- **Contenu factuel et autoportant** : descriptions produit claires, specs en
  **texte** (pas seulement dans une image), pages « à propos »/FAQ en texte
  lisible. Les LLM extraient le **texte** — n'enferme pas l'info dans des images,
  canvas ou pseudo-tableaux visuels.
- **Cohérence des faits** entre `llms.txt`, le JSON-LD et le contenu visible
  (nom, catégories, conditions). Pas de contenu trompeur ou masqué.

## Audits SEO / GEO — réguliers, pas à chaque PR

Inutile de gater chaque petite édition. **Quand un LOT de changements touche la
structure, le contenu indexable ou les metadata** (nouvelle page, refonte de la
nav/hero, gros ajout de contenu produit, changement de `llms.txt`/sitemap),
**lance un audit**. Repère simple : « la structure ou le contenu indexable a-t-il
bougé significativement depuis le dernier audit ? » → si oui, audite.

Checklist d'audit :

- Metadata : `title`/`description`/`canonical` présents et **uniques** par page.
- `sitemap.ts` couvre les nouvelles pages ; compte/panier toujours `noindex`.
- JSON-LD **valide** (Google Rich Results Test) et cohérent avec le contenu.
- `llms.txt` à jour (nom, catégories, accès) et exact.
- Image OG correcte (`opengraph-image`), favicon en place.
- Lighthouse : SEO, Performance, Accessibilité au vert ; pas de lien cassé ;
  un seul `<h1>` par page.

Suggère à l'utilisateur de planifier ces audits **périodiquement** (au rythme des
modifs), plutôt que de bloquer chaque PR.

## Thème (identité visuelle)

Les couleurs de marque sont 3 variables CSS dans `app/globals.css` (bloc
« THÈME DE LA VITRINE — ZONE ÉDITABLE ») : `--brand`, `--brand-dark`,
`--brand-light`. **Édite-les là** pour changer l'identité du site ; tout le
template en dérive (boutons `.btn-primary`, liens actifs, puces, accents). Ne
disperse pas de couleurs en dur dans les composants — réfère ces variables
(`text-[var(--brand-dark)]`, `bg-[var(--brand-light)]`…). Pour un thème
clair/sombre, `next-themes` est dans l'allowlist.

**Typographie** : les tokens `--font-display` / `--font-body` (mêmes bloc éditable
de `globals.css`) partent sur des piles système. Pour une identité forte, **toute
Google Font** est permise via `next/font/google` (intégré à Next, **aucune dépendance
à installer**) : importe-la dans `app/layout.tsx`, expose sa CSS variable et branche-la
sur ces tokens — Next l'**auto-héberge au build** (zéro requête runtime, RGPD-safe).
**Pas** de `<link>`/`@import` vers `fonts.googleapis.com` ni de `.woff2` téléchargé
à la main (cf. `AGENTS.md` §4).

## Composants & sections d'exemple (à réutiliser / s'inspirer)

`components/site/` contient des patterns prêts — réutilise-les plutôt que de
repartir de zéro :

- **Catalogue / produit** : `ArticleCard` (carte produit, prix/stock/promo
  conditionnels + variantes), `BuyBox` (sélection de déclinaison/gamme + ajout
  panier sur la fiche), `CatalogueFilters` (famille + tri + fourchette de prix +
  puce catégorie active), `AddToCart` (bouton + toast sonner), `FeaturedCarousel`
  (embla via shadcn).
- **Navigation** : `Nav` (barre + recherche + état connecté), `CategoryMenu`
  (menu catégories **récursif** en cascade au survol, profondeur arbitraire),
  `CartLink` (compteur panier).
- **Onboarding visiteur** : `InfoBanner` (indice contextuel + action — ex.
  « connectez-vous pour vos tarifs »). L'accueil affiche un « comment ça marche »
  en 3 étapes et le catalogue un bandeau tarifs, **uniquement pour les anonymes**
  (`!user`) — réutilise ce pattern pour guider le client B2B.
- **Compte / commande** : `RegisterForm` (inscription + acceptation CGV),
  `AddressForm` (adresse de livraison), `AuthGate` (garde « connecte-toi pour
  voir »), `CompanySwitcher` (multi-établissement), `ContactForm` (ticket support
  via `useSupport`, réservé au connecté), `Loader`.
- **SEO / conformité** : `JsonLd` (données structurées — ne pas écrire de
  `dangerouslySetInnerHTML` à la main), `CookieConsent` (bannière RGPD montée
  dans le layout — **garde-la** ; si tu ajoutes des cookies non essentiels
  (analytics…), il faut un vrai opt-in avant de les poser).

L'accueil (`app/page.tsx`) montre hero + value props (icônes lucide) + carrousel +
catégories + CTA. `app/contact` mêle coordonnées statiques (à personnaliser) et un
formulaire de ticket support (`ContactForm`, connecté) ; `app/mentions-legales`
est un **stub statique à personnaliser** (infos légales).

## Cadrage des pages (`docs/`)

Le dossier `docs/` porte le **cadrage éditorial** (complément d'`AGENTS.md` §7) :

- **`docs/PRINCIPES.md`** — règles transversales (mobile-first, FAQ, voix hybride,
  ~1000 mots, qualité de code, synchronisation/propagation).
- **`docs/templates/pages/`** — une **fiche gabarit par type de page** (structure,
  wireframe, **données kit consommées**, **réglages shop/droits conditionnels**,
  SEO, JSON-LD). `_base-page.md` = socle ; sous-dossier `conditionnelles/` = pages
  vitrine ajoutables (à-propos, blog, glossaire, FAQ, page générique).
- **`docs/fiches/`** — l'**état réel** de chaque page, tenu à jour à chaque édition.
- **`docs/SEO-GEO.md`** — référence complète SEO + GEO (metadata, matrice JSON-LD,
  helpers `lib/seo.ts`, robots/sitemap/llms.txt, GEO answer-first, checklist).
  Rappel : les fichiers de référencement (robots, sitemap, opengraph, llms.txt,
  `lib/seo.ts`, `generateMetadata`) sont **dans ta surface éditable** (cf. `AGENTS.md` §2).

**Réflexe** : avant d'éditer/créer une page, lis sa fiche gabarit ; après, mets à
jour `docs/fiches/`.

## Matrice JSON-LD par type de page

Chaque page porte les schémas de son type, injectés via `<JsonLd data={…} />`
(jamais de `dangerouslySetInnerHTML` manuel). `price`/`availability` sur `Product`
**uniquement si un prix est exposé**.

| Type de page | JSON-LD |
|---|---|
| Accueil | `WebSite`, `Organization`, `LocalBusiness` (si adresse physique) |
| Catalogue (liste) | `WebPage`, `BreadcrumbList`, `ItemList` (ou `OfferCatalog`) |
| Produit (détail) | `WebPage`, `BreadcrumbList`, `Product`, `FAQPage` si bloc FAQ |
| Contact | `WebPage`, `BreadcrumbList`, `ContactPage`, `FAQPage` |
| À propos | `WebPage`, `BreadcrumbList` |
| FAQ (page) | `WebPage`, `BreadcrumbList`, `FAQPage` |
| Blog (liste) | `WebPage`, `BreadcrumbList`, `ItemList` |
| Blog (article) | `WebPage`, `BreadcrumbList`, `Article` |
| Glossaire (liste) | `WebPage`, `BreadcrumbList` |
| Glossaire (terme) | `WebPage`, `BreadcrumbList`, `DefinedTerm` |
| Compte / Panier / Commande / Auth | `WebPage` (pages `noindex`) |
| Mentions légales / Confidentialité | `WebPage`, `BreadcrumbList` |

Toute page avec un **bloc FAQ** ajoute `FAQPage`. Helpers centralisés (ex. `lib/seo.ts`).

## Glossaire + tooltips (optionnel, recommandé en B2B)

Utile pour le jargon métier/technique. Système complet (cf.
`docs/templates/pages/conditionnelles/glossaire.md`) : données `data/glossary.ts`
(`GlossaryTerm`), page index `/glossaire` (recherche + A-Z), pages `/glossaire/[slug]`
(`generateStaticParams`, `DefinedTerm`), tooltips auto via `linkifyGlossaryTerms()`
(`lib/linkify.tsx`) + composant `GlossaryTooltip` dans `components/site/`. Appliquer
`linkifyGlossaryTerms` **aux paragraphes de contenu uniquement** (jamais titres,
boutons, labels UI, ni zones transactionnelles). Aliases dans `TERM_ALIASES`.

## Qualité de code (appliquée à toute édition)

- **Composants réutilisables** : tout pattern présent sur 2 pages ou plus →
  composant partagé dans `components/site/` ; les données (Q/R, copy, listes) dans
  `data/*.ts`, **pas** hardcodées dans le composant.
- **Fichiers < 200 lignes** (cible ; les fichiers de **données pures** comme
  `data/glossary.ts` ou `data/blog/*` peuvent dépasser). Au-delà → découper.
- **Pas de commentaires** : code auto-documenté (noms explicites). Exceptions rares :
  contrainte cachée (bug externe), invariant métier subtil. Pas de commentaires
  paraphrase / section / TODO / référence de ticket.
- Ne **pas** sur-découper : un fichier cohérent de 180 lignes vaut mieux que 3 de 60.

## Créer une nouvelle page (autorisé)

`app/` est ta **surface éditable** : tu **peux créer de nouvelles routes/pages** à la
demande (une page service, un guide, une landing, une rubrique…). Ce n'est pas
verrouillé — seuls le kit, `package.json` et `vendor/` le sont.

Marche à suivre :

1. Choisir le **type** (`editorial` / `transactionnel` / `legal`) et partir de la
   fiche gabarit la plus proche dans `docs/templates/pages/` — sinon
   `conditionnelles/page-generique.md`.
2. Créer la route `app/<slug>/page.tsx` (rendu **serveur** si indexable),
   `generateMetadata` (title sans nom de marque, description, canonical).
3. Commerce éventuel → **hooks/actions du kit** uniquement (jamais de `fetch`).
4. **Propager** (obligatoire, cf. `docs/PRINCIPES.md` §9) : ajouter à la navigation
   (`Nav`/footer), au `sitemap.ts` (si indexable), au JSON-LD `BreadcrumbList`, à
   `app/llms.txt` si la page est importante, et mailler depuis/vers les pages liées.
5. Appliquer les règles `editorial` si indexable (FAQ, voix hybride, ~1000 mots, JSON-LD).
6. Créer la fiche d'état dans `docs/fiches/<slug>.md`.

Ne jamais créer une page **sans l'exposer dans la navigation**, ni en dupliquant un
pattern qui existe déjà (réutilise `components/site/*`). Si la page exige une lib
absente de l'allowlist → **le dire à l'utilisateur**, ne pas l'installer.

---

## Setup

Les **composants shadcn sont déjà pré-bakés** dans `components/ui/` (style
new-york, Tailwind 4), avec `components.json`, `lib/utils.ts` (`cn`) et les tokens
CSS (`app/globals.css`). Le package unifié `radix-ui` est dans `package.json`.

Donc rien à générer — il suffit d'installer les dépendances :

```bash
npm install
```

> Pour **régénérer/mettre à jour** un composant depuis le registre officiel (rare,
> côté mainteneur) : `npx shadcn@latest add <nom> --overwrite`. L'agent d'édition,
> lui, ne lance jamais shadcn : il compose les composants déjà présents.
