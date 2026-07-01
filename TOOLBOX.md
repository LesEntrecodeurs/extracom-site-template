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
