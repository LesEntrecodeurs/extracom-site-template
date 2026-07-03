# Compte (espace client)

> Hérite de `_base-page.md`. Type **transactionnel**, **noindex**. Routes `app/compte/**`.
> Pas de FAQ, pas de seuil 1000 mots, pas de tooltips glossaire : c'est une zone applicative privée.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Espace compte |
| **Routes** | `app/compte/page.tsx`, `compte/commandes/`, `compte/commandes/[id]/`, `compte/adresses/`, `compte/profil/` (+ `compte/layout.tsx`) |
| **Slug URL** | `/compte`, `/compte/commandes`, `/compte/adresses`, `/compte/profil` |
| **Type de page** | `transactionnel` |
| **Indexation** | `noindex` |
| **Priorité** | Haute (fonctionnel) |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Donner au client connecté l'accès à son historique de documents, ses adresses et son profil.

### Objectifs secondaires
- Permettre de recommander depuis une commande passée
- Gérer les adresses de livraison
- Basculer entre établissements (multi-société)

---

## Structure de la page

### Zone 1 — Layout compte
- **Fonction** : navigation interne de l'espace client + garde d'authentification
- **Contenu** : menu latéral (commandes / adresses / profil), `CompanySwitcher` si multi-société
- **Comportement** : `[si !user]` → redirection connexion (`AuthGate`)

### Zone 2 — Commandes / documents
- **Fonction** : consulter l'historique
- **Contenu** : liste filtrable (`useDocuments`), détail (`useDocument`), téléchargement PDF
- **Comportement** : `reorder` (« recommander ») → panier

### Zone 3 — Adresses
- **Fonction** : gérer les adresses de livraison
- **Contenu** : liste + `AddressForm` (`useDelivery`)

### Zone 4 — Profil
- **Fonction** : éditer les infos du compte
- **Contenu** : formulaire profil (`updateProfile`), changement de mot de passe

---

## Wireframe ASCII

> Générer : layout 2 colonnes (menu compte à gauche, contenu à droite ; drawer en
> mobile), tableau documents, formulaires adresses/profil. Marquer `[si !user] → connexion`.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| AuthGate | `components/site/AuthGate` | Garde connexion | Oui |
| CompanySwitcher | `components/site/CompanySwitcher` | Multi-établissement | Non |
| AddressForm | `components/site/AddressForm` | Adresse de livraison | Oui |
| Table | `components/ui/table` | Historique documents | Oui |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Documents (commandes, factures, BL, devis) | `useDocuments(filters)` | `reference` = n° de pièce Sage |
| Détail document | `useDocument(id, type)` | `type` requis pour les lignes |
| PDF document | `getDocumentPdfAction(id, type)` | base64 |
| Adresses / livraison | `useDelivery()` | `addAddress`, `updateAddress` |
| Profil / mot de passe | `useAccount()` | `updateProfile`, `changePassword` |
| Société active | `useCompany()` | `switchTo` re-scelle la session |
| Recommander | `useCart().reorder(orderReference)` | depuis une commande passée |

**États à gérer** : `!user` → connexion, chargement, `error`, listes vides (`EmptyState`), droits (`canViewDocuments`).

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Accès aux documents | `canViewDocuments` | `membership.capabilities` |
| `CompanySwitcher` | plusieurs memberships | `useCompany().companies` |

---

## Maillage interne

- **Nav (header)** : entrée « Mon compte » `[si user]`
- **Liens sortants** : Commande → recommander → Panier ; Documents → PDF

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Suivi commande | Connexion | Compte > Commandes | Détail → PDF |
| Recommander | Compte > Commandes | Détail commande | Panier |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `noindex` (zone privée — déjà en place) |
| **JSON-LD** | `WebPage` seul (non prioritaire, page privée) |

---

## Notes et remarques

- Zone privée : garder `noindex`. Ne pas exposer de données client aux crawlers.
- Tout passe par le kit ; jamais de `fetch`. Le changement de société re-scelle la session (prix/panier/commandes suivent).
