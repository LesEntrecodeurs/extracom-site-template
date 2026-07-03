# docs/fiches/ — état réel des pages

Ce dossier contient les **fiches remplies** des pages telles qu'elles existent
**réellement** dans ce site, à un instant donné. À ne pas confondre avec
`docs/templates/pages/` (les **gabarits vierges**).

## Pourquoi ce dossier

L'agent **édite** ce template en place, prompt après prompt. Sans mémoire de
l'état des pages, il repart de zéro à chaque fois et diverge. Les fiches d'état
sont cette mémoire : elles décrivent la structure, le contenu, le maillage, les
données kit et le SEO **actuels** de chaque page.

## Règle de synchronisation

Quand tu édites une page réelle (`app/…`), mets à jour sa fiche ici **dans la même
intervention** (cf. `docs/PRINCIPES.md` §9) :

1. Copier le gabarit correspondant depuis `docs/templates/pages/` (retirer le bloc
   de citation d'en-tête).
2. Le remplir avec l'état réel (pas de `{{placeholder}}` restant).
3. Nom du fichier = slug de la page : `accueil.md`, `catalogue.md`,
   `blog-optimiser-ses-commandes.md`…
4. À la création/suppression/renommage d'une page, propager partout (route, nav,
   sitemap, JSON-LD, `llms.txt`, maillage) — cf. `docs/PRINCIPES.md` §9.

## État

_Aucune fiche d'état pour l'instant._ Elles se créent au fil des éditions.
