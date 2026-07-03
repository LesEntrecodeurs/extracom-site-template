# Contact

> Hérite de `_base-page.md`. Type **editorial**, indexable. Route `app/contact/page.tsx`.

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Nom de la page** | Contact |
| **Route** | `app/contact/page.tsx` |
| **Slug URL** | `/contact` |
| **Type de page** | `editorial` |
| **Indexation** | `index` |
| **Priorité** | Moyenne |
| **Statut** | {{à rédiger / en cours / validé}} |

---

## Objectifs de la page

### Objectif principal
Fournir les coordonnées de la boutique et permettre au client connecté d'ouvrir un ticket de support.

### Objectifs secondaires
- Rassurer (adresse, horaires, moyens de contact)
- Orienter l'anonyme vers la connexion pour le formulaire

### KPIs associés
- Nombre de tickets créés
- Taux de complétion du formulaire

---

## Structure de la page

### Zone 1 — Coordonnées
- **Fonction** : informer
- **Contenu** : `<address>` (adresse, téléphone, email, horaires), carte si pertinent
- **Comportement** : statique, à personnaliser

### Zone 2 — Formulaire de ticket `[si user]`
- **Fonction** : ouvrir un support
- **Contenu** : `ContactForm` (via `useSupport`, réservé au connecté)
- **Comportement** : `[si !user]` → invite à se connecter (`AuthGate`)

### Zone 3 — FAQ contact
- **Fonction** : réponses aux questions fréquentes
- **Contenu** : bloc FAQ contextuel

---

## Wireframe ASCII

> Générer : coordonnées (`<address>`) à gauche, formulaire `ContactForm` à droite
> (`[si user]`) ou `AuthGate` `[si !user]`, FAQ en bas. Empilé en mobile.

---

## Composants fonctionnels

| Composant | Source | Description | Obligatoire |
|---|---|---|---|
| ContactForm | `components/site/ContactForm` | Ticket support (connecté) | Oui |
| AuthGate | `components/site/AuthGate` | Garde « connecte-toi » | Oui |
| JsonLd | `components/site/JsonLd` | `ContactPage` | Oui |

---

## Données kit consommées

| Donnée | Hook / action kit | Notes |
|---|---|---|
| Création de ticket | `useSupport()` → `createTicket` | réservé au connecté |
| Utilisateur | `useAuth()` | conditionne le formulaire |

**États à gérer** : `!user` (masquer le formulaire, inviter à se connecter), envoi (`isLoading`, toast `sonner`), `error`.

---

## Réglages shop & droits conditionnant l'affichage

| Élément d'UI | Condition | Source |
|---|---|---|
| Formulaire de ticket | `user != null` | `useAuth()` |

---

## Contenu éditorial

### Titre principal (H1)
{{« Contacter {{marque}} »}}

### Sous-titres (H2)
1. Nos coordonnées
2. {{Nous écrire / ouvrir un ticket}}

### Ton et style
1re personne (« nous »), chaleureux et clair. Coordonnées factuelles.

### Volume de contenu
- Page courte par nature. Cible 1000 mots non applicable strictement ; enrichir via FAQ. Signaler si vraiment trop mince.

---

## Bloc FAQ

| # | Question (3e pers. + marque) | Réponse (answer-first) | Lien interne |
|---|---|---|---|
| 1 | Comment contacter {{marque}} ? | {{Les clients connectés ouvrent un ticket ; sinon par téléphone/email…}} | — |
| 2 | Sous quel délai {{marque}} répond-elle ? | {{…}} | — |
| 3 | {{…}} | {{…}} | {{…}} |

---

## Appels à l'action (CTA)

| CTA | Texte | Destination | Priorité | Condition |
|---|---|---|---|---|
| Principal | Envoyer le message | action ticket | Haute | `user` |
| Anonyme | Se connecter | /connexion | Moyenne | `!user` |

---

## Maillage interne

### Liens entrants

| Page source | Ancre | Type |
|---|---|---|
| Footer | Contact | navigation |
| Accueil | Nous contacter | CTA |

### Liens sortants

| Page cible | Ancre | Type |
|---|---|---|
| Connexion | Se connecter | CTA `[si !user]` |

### Parcours utilisateurs

| Parcours | Étape précédente | Cette page | Étape suivante |
|---|---|---|---|
| Demande support | Compte / Accueil | Contact | Ticket créé |

---

## SEO

| Champ | Valeur |
|---|---|
| **Indexation** | `index` |
| **Meta title** | {{« Contact — {{secteur}} … » sans nom de marque}} |
| **Meta description** | {{coordonnées + moyens de contact}} |
| **Canonical** | `/contact` |
| **JSON-LD** | `WebPage`, `BreadcrumbList`, `ContactPage`, `FAQPage` |

---

## Notes et remarques

- Coordonnées = stub à personnaliser avec les vraies infos du marchand.
- Formulaire réservé au connecté (contrainte kit `useSupport`).
