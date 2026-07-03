# extracom-site-template

Template de **site e-commerce Extracom** (Next.js 15, App Router, TypeScript,
Tailwind 4). Ce dépôt est un **boilerplate Mantly** : il n'est pas déployé
tel quel, il sert de **seed** que Mantly clone dans un nouveau dépôt à chaque
fois qu'un commerçant crée son site.

## Contexte : Extracom100, Sage100, et ce dépôt

**Extracom100** est une plateforme B2B qui permet à des commerçants équipés de
**Sage100** de laisser leurs clients passer commande directement en ligne, sans
ressaisie manuelle par un commercial. Le cœur de la plateforme (auth, catalogue,
prix par client, panier, commandes → Sage100, paiement) vit dans un **monorepo
séparé** (`extracom`, NestJS + Postgres + Prisma), qui n'est **pas** ce dépôt.

Ce dépôt est la **vitrine publique** d'un commerçant Extracom : une partie
« marketing/catalogue » que les visiteurs et clients voient, personnalisable
site par site (thème, contenu, mise en page), mais dont **toute la logique
commerce vient de l'API Extracom** — jamais réimplémentée ici.

```
Visiteur (navigateur, domaine du commerçant)
   │
   ▼
CE DÉPÔT (Next.js) — cloné 1x par commerçant, personnalisé par un agent Mantly
   ├─ app/, components/site/           surface ÉDITABLE (design, contenu)
   ├─ vendor/site-kit/  (@extracom/site-kit, pré-buildé)   CŒUR VERROUILLÉ
   │     façade headless : catalog / cart / orders / session / payment…
   │     server-to-server, jamais d'URL API exposée au navigateur
   ▼
API Extracom (monorepo séparé)  /v2  (auth, articles/prix, carts, payments → Sage100)
   └─ module storefront : routes publiques …/storefront/*, mint du token éditeur
```

**Pourquoi un kit verrouillé plutôt qu'un simple appel API ?** Ce site est
public et **édité par un agent IA** (voir plus bas) : ni le code généré ni
l'agent ne sont une frontière de confiance fiable. En isolant tout le commerce
dans `@extracom/site-kit` — une façade headless sans URL, sans logique de prix
— on garantit que la personnalisation (design/contenu) ne peut jamais toucher
aux domaines sensibles (**pricing**, **commandes**). La vraie frontière de
confiance reste **l'API elle-même**, qui retire côté serveur toute donnée
qu'un visiteur anonyme ne doit pas voir (prix, stock, remises) selon les
réglages du shop.

## Où vivent les sources du kit

`vendor/site-kit` contient un **artefact pré-buildé** (dist + types +
`AGENT-MANUAL.md`) — **pas les sources**. Les sources du kit vivent dans le
monorepo `extracom`, package `packages/site-kit` (`@extracom/site-kit`). Ce
dépôt le consomme en dépendance `file:./vendor/site-kit`, pas via un registry
privé : le conteneur qui installe et fait tourner ce site (voir Mantly
ci-dessous) n'a besoin d'aucun token/auth pour résoudre la dépendance.

Pour **mettre à jour** le kit vendored après un changement dans le monorepo :

```bash
# depuis le monorepo extracom
cd packages/site-kit && yarn build
# recopier dist/ + AGENT-MANUAL.md dans vendor/site-kit/ de CE dépôt, puis
npm install
```

## Comment ce dépôt est utilisé : Mantly

**Mantly** est la plateforme externe qui héberge, pour chaque commerçant :
l'**agent IA d'édition**, l'**éditeur** (chat + preview), le **git**, la
**publication** et l'**hébergement**. Le commerçant n'a ni repo ni build à
gérer : il décrit ce qu'il veut par prompt, l'agent édite les fichiers de
`app/` et `components/site/`, Mantly déploie une preview, le commerçant la
relit puis publie lui-même.

Ce dépôt est déclaré côté Mantly comme **boilerplate** (registre de
boilerplates) : quand un nouveau commerçant crée son site, Mantly **provisionne**
un nouveau dépôt GitHub seedé depuis celui-ci (historique git non repris), puis
l'enregistre comme projet Mantly. Sur le projet résultant, les `ProjectSettings`
suivants pilotent l'agent et la preview :

| Réglage | Valeur suggérée |
| --- | --- |
| `editor_enabled` | `true` |
| `editor_install_command` | `npm install` |
| `editor_dev_command` | `next dev -H 0.0.0.0 -p 3001` |
| `editor_dev_port` | `3001` |
| `editor_healthcheck_path` | `/` |
| `editor_env` | variables non-secrètes du tableau ci-dessous |

Le conteneur de preview tourne sur `node:26-slim` (1 CPU / 1 Go RAM). Le dev
server **doit** binder `0.0.0.0` (déjà le cas via `-H 0.0.0.0`) et répondre en
HTTP sous 3 minutes. L'agent d'édition ne lit aucun manifeste dans ce dépôt : il
détecte automatiquement Next.js via `package.json` et s'oriente via la structure
App Router standard (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`…). Les
seules garde-fous sont **par chemin** (jamais `.git/**`, `.env*`, lockfiles,
`Dockerfile*`, jamais de push sur `main`) — **pas** de gate de dépendances npm :
`package.json`, le lockfile et `vendor/` sont simplement en dehors de la surface
éditable (voir [`AGENTS.md`](./AGENTS.md)).

Règles complètes pour l'agent (rôle, frontières, règles dures) :
[`AGENTS.md`](./AGENTS.md). Inventaire détaillé (composants, librairies, SEO/GEO,
patterns réutilisables) : [`TOOLBOX.md`](./TOOLBOX.md). Cadrage d'édition des pages
(règles éditoriales transversales, fiche gabarit par type de page, référence SEO/GEO
complète) : [`docs/`](./docs) — `PRINCIPES.md`, `SEO-GEO.md`, `templates/pages/`,
`fiches/` (état réel des pages). Référence des fonctions du kit :
[`vendor/site-kit/AGENT-MANUAL.md`](./vendor/site-kit/AGENT-MANUAL.md)
(générée depuis les types du kit).

## Développement local

```bash
npm install          # installe les deps + le kit vendored (file:./vendor/site-kit)
npm run dev          # dev server (HMR) sur http://localhost:3001, bind 0.0.0.0
npm run build        # build de prod (tsc + next build) — le gate de publication
npm run typecheck    # tsc --noEmit
```

Copier `.env.example` → `.env` et renseigner les variables (voir ci-dessous).
En local, ce site attend une API Extracom accessible (par défaut
`http://localhost:3000`, cf. monorepo `extracom`, `apps/api`).

## Variables d'environnement (server-only)

| Variable | Rôle |
| --- | --- |
| `EXTRACOM_API_URL` | Base URL de l'API Extracom (NestJS). |
| `EXTRACOM_SHOP` | Shop ambiant (un site = un shop), doit exister côté Sage. |
| `EXTRACOM_SESSION_SECRET` | Secret AES-256-GCM du cookie de session brokerée (`openssl rand -base64 32`). |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site (metadata, OG, sitemap, retour paiement). |
| `EXTRACOM_MEDIA_HOST` / `EXTRACOM_MEDIA_PROTOCOL` | Host + protocole des images produit — l'API les sert via son propre proxy public (`…/storefront/media/:filename`), donc c'est le **même host que `EXTRACOM_API_URL`** (sans protocole). |

Ce sont les seules variables server-only nécessaires ; aucune n'est préfixée
`NEXT_PUBLIC_` (sauf `NEXT_PUBLIC_SITE_URL`) — le navigateur ne connaît jamais
l'URL de l'API ni le shop. Détails et options (rotation de secret, durée de
session) : [`.env.example`](./.env.example).

## Repo layout

```
app/                pages, layouts, routes — surface ÉDITABLE (dont robots/sitemap/llms/OG)
components/site/    composants de site — surface ÉDITABLE
components/ui/      shadcn pré-baké (compose, ne réécris pas)
lib/                seo (URL + metadata + helpers JSON-LD), utils
docs/               cadrage d'édition : PRINCIPES.md, SEO-GEO.md, templates/pages/, fiches/
vendor/site-kit/     @extracom/site-kit pré-buildé (verrouillé)
AGENTS.md            règles pour l'agent d'édition (à lire en premier, côté agent)
TOOLBOX.md           inventaire détaillé (composants, libs, SEO/GEO, patterns)
```
