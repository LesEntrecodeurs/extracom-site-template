# Paiement & retour de paiement

> Hérite de `_base-page.md`. Type **transactionnel**, **noindex**.
> Le paiement s'ouvre chez un **prestataire externe** (redirection via le kit) ;
> le site gère le **retour** dans `app/paiement/retour/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Paiement / Retour de paiement |
| **Routes** | `app/paiement/retour/page.tsx` (retour prestataire) |
| **Slug URL** | `/paiement/retour` |
| **Type de page** | `transactionnel` |
| **Indexation** | `noindex` |
| **Priorité** | Haute (fonctionnel) |
| **Statut** | {{à rédiger / en cours / validé}} |

> Le **démarrage** du paiement n'est pas une page : c'est l'action `start` de
> `usePayment()` déclenchée depuis la finalisation de commande (cf. fiche
> `panier-commande.md`), qui **redirige** vers l'URL du prestataire.

---

## Objectifs de la page

### Objectif principal
Informer le client du résultat du paiement au retour du prestataire et l'orienter (compte si succès, panier si échec).

### Objectifs secondaires
- Rassurer en cas de succès (commande enregistrée)
- Proposer une reprise claire en cas d'échec/annulation

---

## Structure de la page (retour)

### Zone 1 — État du paiement
- **Fonction** : afficher succès / échec
- **Contenu** : titre + message selon `searchParams.paymentStatus` (`success` vs autre)
- **Comportement** : `dynamic = 'force-dynamic'`, lecture de `searchParams`

### Zone 2 — CTA de suite
- **Fonction** : orienter
- **Contenu** : succès → « Voir mon compte » (`/compte`) ; échec → « Retour au panier » (`/panier`)

---

## Wireframe ASCII

> Générer : bloc centré (icône état, titre, message, CTA unique). Sobre. Mobile-first.

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Démarrage paiement (amont) | `usePayment().start` | renvoie l'URL de redirection (anti-double) ; **piloté par `capabilities.paymentEnabled`** |
| Statut retour | `searchParams.paymentStatus` | fourni par le prestataire à la redirection retour |

**États à gérer** : `success` vs échec/annulation. Ne rien recalculer côté client — l'API/kit fait foi.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Existence du paiement en ligne | `capabilities.paymentEnabled` | `useShopContext().data.capabilities` |

> Si `!paymentEnabled`, il n'y a pas de bouton « Payer » en amont (la commande passe
> par `validateWithoutPayment`). Le retour de paiement n'est alors jamais atteint.

---

## Maillage interne

- **Liens sortants** : `/compte` (succès), `/panier` (échec)
- **Amont** : Commande → redirection prestataire → retour ici

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Paiement réussi | Commande → prestataire | Retour (succès) | Compte > Commandes |
| Paiement échoué | Commande → prestataire | Retour (échec) | Panier |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `noindex` |
| **JSON-LD** | `WebPage` seul |

---

## Notes et remarques

- Page purement fonctionnelle : ni FAQ, ni contenu SEO.
- Utiliser la variable de marque `var(--brand)` pour le CTA (déjà le cas dans le code).
- La logique de paiement reste 100 % côté kit/prestataire — le site n'affiche qu'un état.
