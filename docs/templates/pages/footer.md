# Footer

> Élément **structurel** (pas une page). Rendu **inline** dans `app/layout.tsx`
> (`<footer>` + sous-composant `FooterCol`). Présent sur toutes les pages.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Élément** | Pied de page |
| **Fichier** | `app/layout.tsx` (`<footer>` + `FooterCol`) |
| **Type** | structurel (transversal) |
| **Présence** | toutes les pages |

---

## Fonction

Rappeler l'identité de la boutique, offrir des liens secondaires (boutique, compte,
aide, légal) et la mention de copyright. Complète la navigation haute.

---

## Structure (colonnes actuelles)

| Colonne | Liens | Condition |
|---|---|---|
| Identité | nom (`branding.name`) + baseline | toujours |
| Boutique | Catalogue, Mon panier | toujours |
| Compte | Connexion, Créer un compte, Mon compte | « Créer un compte » `[si registrationOpen]` |
| Aide | Nous contacter, Mentions légales | toujours |
| Bas de page | © {année} {nom} — Propulsé par Extracom | toujours |

> Ajouter ici les liens légaux e-commerce quand les pages existent : CGV, Politique
> de confidentialité, Politique de cookies (cf. fiches `legales`).

---

## Réglages conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Nom / baseline | `branding` | `context` (layout) |
| Lien « Créer un compte » | `capabilities.registrationOpen` | `context.capabilities` |

---

## Règles

- **Aucune balise de titre `<h1>`-`<h6>` dans le footer** : utiliser `<p>`/`<span>`
  stylés pour les titres de colonnes (les hX pollueraient la hiérarchie SEO de
  chaque page). Le `FooterCol` actuel utilise déjà `<p className="font-medium">`.
- `<footer>` sémantique ; liens à ancres explicites.
- Mobile-first : colonnes empilées (`grid-cols-2 md:grid-cols-4`).

---

## Maillage transversal

Liens sortants présents sur toutes les pages. Toute page importante ajoutée au site
doit être reliée depuis la nav et, si pertinent, depuis une colonne du footer
(règle de propagation).

---

## Notes

- Ajouter les colonnes/pages légales au fur et à mesure de leur création.
- `llms.txt` doit rester cohérent avec les infos affichées (nom, contact).
