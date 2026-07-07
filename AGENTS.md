# AGENTS.md — Vitrine e-commerce (à lire EN PREMIER)

> Ce fichier s'adresse à **tout agent IA** qui édite ce projet (peu importe
> l'outil). Il décrit où tu es, ce que tu as le droit de faire, les **règles
> dures** à ne jamais enfreindre, et comment vérifier ton travail. Lis-le en
> entier avant toute modification.

## 1. Où tu es

Tu édites une **vitrine e-commerce B2B** (Next.js, App Router, TypeScript,
Tailwind 4) générée pour un commerçant professionnel. Elle est branchée sur la
plateforme **Extracom / Sage100** : catalogue, prix par client, panier,
commande, devis, paiement viennent d'une API métier existante, **via un SDK
verrouillé** (`@extracom/site-kit`). Ton rôle : **personnaliser la
présentation** (design, contenu, mise en page) à la demande de l'utilisateur.
Tu ne réimplémentes **jamais** la logique commerce.

**Contexte clé** : c'est une vitrine **publique** (visiteurs anonymes ou clients
connectés, B2B). Les prix peuvent être masqués pour les anonymes ; un prix peut
valoir `null`. Le client doit pouvoir : parcourir → s'inscrire/se connecter →
voir ses tarifs négociés → commander ou demander un devis.

**Où tout ça tourne — Mantly.** Tu édites ce projet **dans Mantly**, la
plateforme externe qui héberge l'éditeur, l'agent (toi), la **preview**, la
**publication**, le **git** et le **déploiement**. Le commerçant propriétaire
n'a **ni repo, ni git, ni build** à gérer : il décrit ce qu'il veut **par
prompt**, tu édites les fichiers, Mantly déploie une **preview** qu'il relit,
puis il **publie**. Concrètement pour toi :

- Tu **n'exécutes pas** git / deploy / « mise en prod » : Mantly s'en charge.
  Ton job s'arrête à un code qui build et respecte les règles ci-dessous.
- La preview et la prod sont des **déploiements du même code** que tu édites :
  écris donc un code de prod propre, pas des hacks « ça marche en local ».
- Le côté commerce (catalogue, prix, panier, commande, paiement, auth) reste
  servi par l'API Extracom/Sage100 **via le kit verrouillé** — Mantly ne change
  rien à cette frontière (cf. §2-3).

## 2. Ce que tu PEUX éditer vs ce qui est VERROUILLÉ

| ✅ Éditable (ta surface)                                    | ⛔ Verrouillé (ne pas toucher)                                  |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| `app/` — pages, layouts, routes                             | `@extracom/site-kit` (dans `node_modules`, lecture seule) |
| **Référencement** : `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`/`twitter-image.tsx`, `app/llms.txt/route.ts`, `generateMetadata` de chaque page | `next.config.mjs`, le câblage BFF/auth |
| `lib/seo.ts` — helpers SEO/GEO (metadata, URL, JSON-LD)     | `package.json`, lockfile, `vendor/` (kit vendored)              |
| `components/site/` — composants de site (dont `JsonLd`)     | `.env`, secrets, tokens                                         |
| `app/globals.css` — thème (`--brand`, `--brand-dark`, `--brand-light`, `--font-display`, `--font-body`) | Tout ce qui crée une URL réseau directe |
| `public/` — images, favicon · Contenu, textes, structure visuelle | — |

La frontière est **physique** : la logique commerce vit dans le kit installé en
`node_module` — tu ne peux pas l'ouvrir ni la redéfinir, seulement **appeler**
ses fonctions/hooks. Un gate de build refuse toute édition hors de ta surface.

**Référencement (SEO/GEO) — entièrement éditable.** Tous les fichiers ci-dessus
liés au référencement font partie de ta surface : tu **dois** pouvoir les modifier
(métadonnées, `robots.ts`, `sitemap.ts`, `llms.txt`, images OG, helpers `lib/seo.ts`,
JSON-LD). Détail : `docs/SEO-GEO.md`. Seule exception verrouillée : `next.config.mjs`
(hosts d'images, `redirects`/`headers`) — si un besoin SEO l'exige (ex. redirection
301), **demande à l'utilisateur**, ne l'édite pas toi-même.

## 3. Règles dures (à ne JAMAIS enfreindre)

1. **Commerce = uniquement le kit.** Toute donnée (catalogue, prix, panier,
   commande, paiement, auth, documents) passe par les **fonctions serveur**
   (`@extracom/site-kit/server`) ou les **hooks** (`@extracom/site-kit/react`).
   **Jamais** de `fetch`/`axios`/`XMLHttpRequest` vers une URL — tu n'as pas les
   URLs et c'est **interdit mécaniquement** : `npm run lint` (Biome,
   `noRestrictedGlobals`/`noRestrictedImports` dans `biome.json`) échoue si ce
   code apparaît hors de `vendor/site-kit`. Référence des fonctions :
   **`node_modules/@extracom/site-kit/AGENT-MANUAL.md`** (généré, à jour).
2. **`price` peut être `null`** (visiteur anonyme + shop en prix masqué). Gère
   **toujours** ce cas (« Connectez-vous pour voir le tarif »), ne masque pas le
   produit, et ne **calcule/recompose/devine JAMAIS** un prix — au plus
   `formatPrice()` pour l'afficher.
3. **Dépendances = uniquement celles déjà dans `package.json`.** N'en installe pas
   de nouvelle : `package.json`, le lockfile et `vendor/` (kit) sont **verrouillés**
   (l'éditeur Mantly refuse toute édition dessus). Besoin d'une lib absente →
   **dis-le à l'utilisateur**, ne l'installe pas et ne contourne pas.
4. **UI = composants shadcn pré-bakés** dans `components/ui/` (déjà là, ne lance
   pas `shadcn add`). Compose-les.
5. **Droits UTILISATEUR = `membership.capabilities`** (booléens PAR utilisateur :
   `canOrder`, `canQuote`, `canCheckoutWithoutPayment`, `canViewDocuments`),
   dérivés de son rôle. Tu n'as **pas** les permissions brutes (volontaire).
   Conditionne l'UI dessus. L'API revérifie tout. **Ne pas confondre** avec les
   capacités du SHOP (règle 6).
6. **Réglages du shop = `useShopContext()`.** Le contexte expose, en plus de
   `catalogTree`/`families`/`terms` :
   - **`display`** (`stock`, `showDiscounts`, `showBasePrice`, `showVat`) +
     **`anonymousPricing`** (`'BASE' | 'HIDDEN'`) → adapte l'affichage (stock,
     remises, prix barré, prix des visiteurs anonymes).
   - **`capabilities`** (capacités du SHOP : `paymentEnabled`, `registrationOpen`,
     `deliveryEnabled`) → **pilotent l'affichage de la vitrine**. Masque le
     paiement en ligne si `!paymentEnabled`, les entrées « Créer un compte » si
     `!registrationOpen`, la sélection de livraison si `!deliveryEnabled`
     (exemples déjà câblés : `app/commande`, `app/connexion`, `app/page`,
     `app/layout`). Valeurs **dérivées côté serveur** : tu t'y adaptes, tu ne les
     changes pas.
   - **`branding`** (`name`, `primaryColor?`, `logoUrl?`) → **indicateur NON
     contraignant** fourni par le shop (point de départ). Tu peux t'en inspirer
     mais tu restes **libre de restyler** ; la vraie identité visuelle se règle
     dans `app/globals.css` (cf. §4 et TOOLBOX « Thème »).
   Si une demande contredit un réglage, **préviens l'utilisateur** (c'est lui qui
   change le réglage, pas toi).
7. **Sécurité du rendu** : jamais de `dangerouslySetInnerHTML` ni de `<script>`
   inline (contenu Sage = potentiellement non fiable → échappé par défaut).
   Données structurées via le composant `JsonLd`, pas à la main. Règle
   **interdite mécaniquement** par `npm run lint` (`security.noDangerouslySetInnerHtml`
   dans `biome.json`) partout **sauf** `components/site/JsonLd.tsx` (seule exception
   documentée : y sérialise du JSON contrôlé, pas du HTML utilisateur).
8. **SEO ET GEO — deux cibles, à préserver** (détail + checklists : TOOLBOX) :
   - **SEO** (Google/Bing) : `generateMetadata` (title unique + description +
     canonical) sur chaque page indexable, **rendu serveur** des pages publiques
     (accueil/catalogue/produit), `sitemap.ts`/`robots.ts` à jour, HTML sémantique
     (un seul `<h1>`, `alt`), perf (next/image). Compte/panier en `noindex` (fait).
   - **GEO** (ChatGPT, Claude, Perplexity, AI Overviews) : que les assistants
     **comprennent et citent** la boutique. Tiens `app/llms.txt` à jour, garde un
     **JSON-LD** propre (`Product`/`Organization` via `<JsonLd>`), et un contenu
     **factuel en texte** (specs/descriptions lisibles, pas enfermées dans des
     images) — les LLM lisent le texte.
   - **Audits réguliers, pas à chaque PR** : après un **lot** de changements de
     structure/contenu/metadata, lance (ou propose de planifier) un audit SEO/GEO
     — inutile de bloquer chaque édition. Checklist dans TOOLBOX.
9. **Feedback utilisateur = `sonner`** (`toast.success/error`).

## 4. Environnement (sain et prêt)

Tu démarres dans un environnement **déjà configuré** — n'essaie pas de le
re-bootstrapper :

- Dépendances **installées** ; le kit `@extracom/site-kit` est **vendored**
  (pré-buildé) dans `vendor/site-kit`, installé dans `node_modules` via une
  dépendance `file:`.
- **shadcn/ui pré-baké** (~50 composants) dans `components/ui/` (style new-york,
  Tailwind 4) + `components.json` + `lib/utils.ts` (`cn`).
- **Tokens de thème** dans `app/globals.css` (zone « THÈME DE LA VITRINE — ZONE
  ÉDITABLE ») : `--brand`, `--brand-dark`, `--brand-light`, `--font-display`,
  `--font-body`.
- **Fonts** : pile système par défaut. Pour une vraie identité, **toutes les Google
  Fonts sont permises via `next/font/google`** (intégré à Next, **aucune dépendance
  à ajouter**) : Next télécharge et **auto-héberge** la police au build → zéro
  requête runtime, RGPD-safe. Wiring : importer la font dans `app/layout.tsx`,
  exposer sa CSS variable et la brancher sur `--font-display` / `--font-body`
  (`app/globals.css`).
  **Interdits** : `<link>`/`@import` vers `fonts.googleapis.com` (réseau runtime) et
  le **téléchargement manuel** de fichiers de police (`.woff2` dans `public/fonts` +
  `@font-face`). Toujours passer par `next/font`.
  Le build Mantly a accès réseau, donc `next/font/google` (fetch au build) fonctionne.
  **Fallback** : toujours déclarer une pile système de secours dans `--font-display` /
  `--font-body` (ex. `var(--font-xxx), ui-sans-serif, system-ui, sans-serif`) pour que
  le rendu tienne même si le fetch de police échoue au build.
- Connexion à l'API : gérée par le kit (server-to-server), **invisible** pour toi.

### Commandes (vérifie ton travail)

```bash
npm run dev         # serveur de dev (HMR) — port 3001, bind 0.0.0.0
npm run build       # build de prod (= ce que le gate vérifie : tsc + next build)
npm run typecheck   # tsc --noEmit
npm run lint        # Biome — bloque fetch/axios/XHR direct + dangerouslySetInnerHTML (règles dures §3.1/§3.7)
```

Avant de considérer une tâche finie : `npm run build` **et** `npm run lint`
doivent passer. `lint` porte sur `app/`, `components/site/`, `lib/` (ta surface
éditable) — `components/ui/` (pré-baké) et `vendor/` en sont exclus, ne les modifie
pas pour « corriger » un lint. La **publication est déclenchée par le propriétaire
depuis Mantly** (pas par toi) ; son pipeline rejoue le build. Les contrôles
SEO/GEO/perf/a11y/fuites côté Mantly ne sont pas garantis exhaustifs ni
systématiques selon la configuration du projet — **ne t'y substitue pas** :
applique toi-même les règles SEO/GEO/a11y de ce document et de `TOOLBOX.md`
avant de livrer. Un build cassé **bloque le publish**.

## 5. Ce que tu as sous la main

- **`TOOLBOX.md`** (ce dossier) — inventaire complet : composants `ui/`,
  librairies allowlistées, gestion des images, SEO, thème, composants d'exemple
  `components/site/` (ArticleCard, BuyBox, CategoryMenu, InfoBanner, EmptyState…).
  **Lis-le** pour ne pas réinventer ce qui existe.
- **`docs/`** — cadrage d'édition : `docs/PRINCIPES.md` (règles éditoriales
  transversales, cf. §7 ci-dessous), `docs/templates/pages/` (fiche gabarit par
  type de page : structure, données kit, réglages conditionnels, SEO, JSON-LD),
  `docs/fiches/` (état réel des pages, tenu à jour à chaque édition). **Avant
  d'éditer une page, lis sa fiche gabarit** — elle t'évite de partir en roue libre.
- **`vendor/site-kit/AGENT-MANUAL.md`** (ou `node_modules/@extracom/site-kit/AGENT-MANUAL.md`,
  identique) — référence générée des fonctions/hooks du kit (signatures + doc).
- **`components/site/`** — patterns prêts à réutiliser (catalogue, produit,
  panier, compte, onboarding visiteur). Inspire-toi-en plutôt que repartir de zéro.

## 6. Orientation rapide (carte des fichiers)

```
app/
  layout.tsx              shell (nav, footer, bannière cookies, fonts)
  page.tsx                accueil (hero + onboarding + sélection + catégories)
  catalogue/page.tsx      liste + filtres
  produit/[reference]/    fiche produit (BuyBox = déclinaisons + ajout panier)
  panier, commande/       panier & checkout (commande/devis selon capacités)
  compte/                 espace client (commandes, adresses, profil éditable)
  connexion, inscription, mot-de-passe-oublie/   auth (via le kit)
  contact/                coordonnées statiques + formulaire ticket (connecté)
  mentions-legales/       stub statique à personnaliser
  globals.css             thème (zone éditable)
components/site/          tes composants (éditable)
components/ui/            shadcn pré-baké (compose, ne réécris pas)
lib/                      seo, utils (cn)
```

## 7. Règles éditoriales transversales (pages indexables)

Au-delà du commerce et du SEO/GEO (§3, dont la règle dure 8), ces règles cadrent
**le contenu et la mise en page** pour rester cohérent d'un prompt à l'autre. Détail complet et
exemples : **`docs/PRINCIPES.md`**. Elles s'appliquent selon le **type de page**
(`editorial` / `transactionnel` / `legal` — voir `docs/templates/pages/_base-page.md`) :

1. **Fiche d'abord.** Avant d'éditer une page, ouvre sa fiche gabarit
   (`docs/templates/pages/…`) ; après l'édition, mets à jour son état dans
   `docs/fiches/` (règle de synchronisation, `docs/PRINCIPES.md` §9).
2. **Mobile-first** systématique (base = 375px, breakpoints `sm:→md:→lg:`).
3. **FAQ obligatoire** sur les pages `editorial` indexables : 3-6 Q/R
   contextuelles, questions en 3e personne + nom de marque, réponses answer-first
   (40-60 mots) + lien interne si le sujet est traité ailleurs → JSON-LD `FAQPage`.
   **Pas** de FAQ sur les pages transactionnelles (compte, panier, checkout, auth).
4. **Voix hybride** (GEO + CRO) : FAQ/blocs de contenu ancrés sur le nom de marque
   (`useShopContext().data.branding.name`) en 1re phrase, puis « nous » ; hero, CTA,
   nav en 1re personne. (Tableau détaillé dans `docs/PRINCIPES.md` §7.)
5. **Contenu ~1000 mots** (cible non bloquante) sur les pages `editorial` : sous le
   seuil, **le signaler** et proposer d'enrichir — ne **jamais inventer** de faits.
6. **Qualité de code** : composants réutilisables dans `components/site/` (données
   dans `data/*.ts`), fichiers **< 200 lignes** (data pure exceptée), **pas de
   commentaires** (sauf hack externe ou invariant métier subtil).
7. **Matrice JSON-LD par type de page** : voir `TOOLBOX.md`. Chaque page porte les
   schémas de son type, via le composant `JsonLd`.

Ces règles ne priment jamais sur les **règles dures** du §3 (surface verrouillée,
commerce = kit, `price` nullable, dépendances figées, sécurité du rendu).

## 8. En cas de doute

- Un besoin exige une dépendance absente ou contredit un réglage shop →
  **demande à l'utilisateur**, ne contourne pas.
- Tu ne trouves pas comment faire quelque chose côté commerce → c'est dans le kit
  (AGENT-MANUAL). Si ça n'y est pas, **dis-le** — ne fabrique pas d'appel réseau.
- Tu casses le build → corrige avant de continuer ; un build cassé n'est jamais publié.
- On te demande de « publier », « déployer », « pousser sur git » → **ce n'est
  pas ton rôle** : c'est Mantly, déclenché par le propriétaire après revue de la
  preview. Toi, tu livres un code qui build et respecte les règles.
