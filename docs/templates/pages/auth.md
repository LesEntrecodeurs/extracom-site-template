# Authentification (connexion / inscription / mot de passe)

> Hérite de `_base-page.md`. Type **transactionnel**, **noindex**.
> Routes `app/connexion/`, `app/inscription/`, `app/mot-de-passe-oublie/`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Authentification |
| **Routes** | `app/connexion/page.tsx`, `app/inscription/page.tsx`, `app/mot-de-passe-oublie/page.tsx` |
| **Slug URL** | `/connexion`, `/inscription`, `/mot-de-passe-oublie` |
| **Type de page** | `transactionnel` |
| **Indexation** | `noindex` |
| **Priorité** | Haute (fonctionnel) |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Authentifier le client (connexion), permettre l'inscription d'un prospect, et gérer la récupération de mot de passe.

### Objectifs secondaires
- Convertir l'anonyme en compte pour accéder aux tarifs
- Réduire la friction du formulaire

---

## Structure de la page

### Zone 1 — Connexion
- **Fonction** : ouvrir une session
- **Contenu** : formulaire email/mot de passe, lien « mot de passe oublié », lien inscription
- **Comportement** : `login` (`useAuth`) → redirection ; toast `sonner`

### Zone 2 — Inscription `[si registrationOpen]`
- **Fonction** : créer un compte prospect
- **Contenu** : `RegisterForm` (+ acceptation CGV)
- **Comportement** : `register` (`useAccount`) ; `[si !registrationOpen]` → masquer l'entrée

### Zone 3 — Mot de passe oublié
- **Fonction** : réinitialiser
- **Contenu** : demande de code → vérification → nouveau mot de passe (`input-otp`)
- **Comportement** : `requestPasswordReset` → `verifyResetCode` → `changePassword`

---

## Wireframe ASCII

> Générer : carte centrée (formulaire), liens secondaires dessous. Flux mot de passe
> oublié en 3 étapes (code OTP). Empilé/centré en mobile.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| RegisterForm | `components/site/RegisterForm` | Inscription + CGV | Oui |
| form / input / input-otp | `components/ui/*` | Champs + code | Oui |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Connexion / déconnexion | `useAuth()` → `login`, `logout` | `user` null si anonyme |
| Inscription | `useAccount()` → `register` | acceptation CGV |
| Réinitialisation mdp | `useAccount()` → `requestPasswordReset`, `verifyResetCode`, `changePassword` | flux en 3 étapes |
| CGV / contexte | `useShopContext()` | `terms`, `capabilities.registrationOpen` |

**États à gérer** : envoi (`isLoading`), `error` (identifiants invalides), succès (toast + redirection), `!registrationOpen`.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Entrée « Créer un compte » | `capabilities.registrationOpen` | `useShopContext().data.capabilities` |
| Texte / lien CGV | `terms` | `useShopContext().data` |

---

## Maillage interne

- **Nav (header)** : « Se connecter » `[si !user]`
- **Liens croisés** : Connexion ↔ Inscription ↔ Mot de passe oublié
- **Après login** : redirection vers la page d'origine ou Compte

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Conversion | Catalogue / Produit (`!user`) | Inscription | Compte / retour catalogue |
| Retour client | Accueil | Connexion | Compte / Panier |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `noindex` |
| **JSON-LD** | `WebPage` seul |

---

## Notes et remarques

- Masquer l'inscription si `!registrationOpen` (déjà câblé sur `app/connexion`).
- Auth 100 % via le kit ; aucune gestion de session maison.
