# Panier & Commande (checkout)

> Hérite de `_base-page.md`. Type **transactionnel**, **noindex**. Routes `app/panier/`, `app/commande/`.
> Pas de FAQ, pas de seuil 1000 mots : tunnel d'achat fonctionnel.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Panier & Commande |
| **Routes** | `app/panier/page.tsx`, `app/commande/page.tsx` |
| **Slug URL** | `/panier`, `/commande` |
| **Type de page** | `transactionnel` |
| **Indexation** | `noindex` |
| **Priorité** | Haute (fonctionnel) |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Permettre au client connecté de vérifier son panier puis de finaliser (commande, devis, ou paiement selon les capacités).

### Objectifs secondaires
- Minimiser la friction (récap clair, étapes lisibles)
- Adapter le tunnel aux capacités shop et droits utilisateur

---

## Structure de la page

### Zone 1 — Panier
- **Fonction** : consulter et ajuster
- **Contenu** : lignes (qté, prix, sous-total), commentaire, bouton vider/mettre à jour
- **Comportement** : `updateLine`, `removeItem`, `setComment` (`useCart`) ; `[si !user]` → connexion

### Zone 2 — Livraison `[si deliveryEnabled]`
- **Fonction** : choisir l'adresse / option
- **Contenu** : sélection d'adresse (`AddressForm`), options de livraison
- **Comportement** : `setDelivery`

### Zone 3 — Finalisation
- **Fonction** : valider
- **Contenu** : récap total, CTA selon capacités
- **Comportement** :
  - `createOrder` → validation commerciale
  - `validateWithoutPayment({documentType})` → commande/devis directs `[si canCheckoutWithoutPayment]`
  - `start` (paiement) → redirection prestataire `[si paymentEnabled]`

---

## Wireframe ASCII

> Générer : liste lignes panier (colonne principale) + récap total (colonne latérale
> sticky en desktop), bloc livraison `[si deliveryEnabled]`, CTA de finalisation
> conditionnels. Étapes lisibles. Empilé en mobile.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| AuthGate | `components/site/AuthGate` | Garde connexion | Oui |
| AddressForm | `components/site/AddressForm` | Adresse de livraison | Oui (si livraison) |
| CartLink | `components/site/CartLink` | Compteur panier (nav) | Oui |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Panier + opérations | `useCart()` | `updateLine`, `removeItem`, `setDelivery`, `setComment`, `reorder` — connecté uniquement |
| Options de livraison | `useDelivery()` | `options`, `addAddress` |
| Finalisation | `useCheckout()` | `createOrder`, `validateWithoutPayment` (anti-double-clic) |
| Paiement | `usePayment()` | `start` → URL de redirection (anti-double) |
| Droits utilisateur | `membership.capabilities` | `canOrder`, `canQuote`, `canCheckoutWithoutPayment` |

**États à gérer** : `!user` → connexion, panier vide (`EmptyState`), `price === null`, envoi en cours, `error`, toasts `sonner`.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Bloc livraison | `capabilities.deliveryEnabled` | `useShopContext().data.capabilities` |
| CTA « Payer en ligne » | `capabilities.paymentEnabled` | `useShopContext().data.capabilities` |
| CTA « Valider la commande » | `canOrder` | `membership.capabilities` |
| CTA « Demander un devis » | `canQuote` | `membership.capabilities` |
| Valider sans paiement | `canCheckoutWithoutPayment` | `membership.capabilities` |

---

## Maillage interne

- **Nav (header)** : `CartLink` avec compteur
- **Liens sortants** : Panier → Commande → Confirmation (Compte > Commandes) ; vide → Catalogue

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Achat | Produit | Panier | Commande → Confirmation |
| Devis | Produit | Panier | Devis → Compte > Documents |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `noindex` (déjà en place) |
| **JSON-LD** | `WebPage` seul |

---

## Notes et remarques

- Tunnel piloté par capacités shop **et** droits utilisateur — ne jamais afficher une action indisponible.
- `createOrder` / `validateWithoutPayment` / `start` sont anti-double-clic : ne pas ré-implémenter de garde manuelle par-dessus.
- Garder `noindex`.
