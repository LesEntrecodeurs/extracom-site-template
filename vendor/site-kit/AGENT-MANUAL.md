# Manuel d'agent — `@extracom/site-kit`

> **Généré automatiquement** depuis les types du kit (`scripts/generate-agent-manual.mjs`).
> Ne pas éditer à la main. Régénéré à chaque build → toujours en phase avec la
> version épinglée du kit. La guidance et les règles vivent dans le `TOOLBOX.md`
> du template ; ce fichier est la **référence des fonctions** disponibles.

Toutes les données commerce passent par ces fonctions — l'agent ne fait jamais
de `fetch` vers une URL. Le prix peut être `null` (masqué). Voir les types
dans `@extracom/site-kit`.

## Hooks (composants client — `@extracom/site-kit/react`)

### `useAccount`

Compte : inscription (prospect, avec acceptation CGV) et flux de réinitialisation de mot de passe (demande de code, vérification, changement). Renvoie `{ isLoading, error, register, requestPasswordReset, verifyResetCode, changePassword }`.

```ts
useAccount: () => { isLoading: boolean; error: Error; register: (input: RegisterInput) => Promise<void>; requestPasswordReset: (email: string) => Promise<void>; verifyResetCode: (email: string, code: string) => Promise<void>; changePassword: (input: Parameters<typeof actions.changePasswordAction>[0]) => Promise<void>; updateProfile: (input: Parameters<typeof actions.updateProfileAction>[0]) => Promise<void>; }
```

### `useAddToCart`

Ajout au panier léger (sans charger le panier) — pour les cartes produit.

```ts
useAddToCart: () => { isLoading: boolean; error: Error; addItem: (input: AddItemInput) => Promise<Cart>; }
```

### `useArticle`

Détail complet d'un article (prix/stock/promo, déclinaisons, glossaires, fiches techniques) par sa référence. `data.price` peut être `null` (masqué). Renvoie `{ data, isLoading, error, reload }`.

```ts
useArticle: (reference: string) => QueryState<Article> & { reload: () => void; }
```

### `useArticles`

Liste paginée d'articles (recherche, filtres famille/catalogue/prix, tri). Re-fetch quand `query` change. Le prix de chaque article peut être `null` (anonyme + shop en prix masqué). Renvoie `{ data, isLoading, error, reload }`.

```ts
useArticles: (query?: ArticleListQuery) => QueryState<ArticleListResponse> & { reload: () => void; }
```

### `useAuth`

Authentification : utilisateur courant (résolu côté serveur via le cookie de session), `login` et `logout`. `user` est `null` si anonyme. Renvoie `{ user, isLoading, error, login, logout }`.

```ts
useAuth: () => { user: User; isLoading: boolean; error: Error; reload: () => Promise<void>; login: (input: LoginInput) => Promise<LoginResult>; logout: () => Promise<void>; }
```

### `useCart`

Panier courant + opérations (ajout/maj/suppression de ligne, adresse de livraison, commentaire, « recommander »). Chaque écriture renvoie le `Cart` à jour. Réservé à l'utilisateur connecté. Renvoie `{ cart, isLoading, error, reload, addItem, updateLine, removeItem, setDelivery, setComment, reorder }`.

```ts
useCart: () => { cart: Cart; isLoading: boolean; error: Error; reload: () => void; addItem: (input: AddItemInput) => Promise<Cart>; updateLine: (lineId: string, input: UpdateCartLineInput) => Promise<Cart>; removeItem: (lineId: string) => Promise<Cart>; setDelivery: (input: SetCartDeliveryInput) => Promise<Cart>; setComment: (comment: string) => Promise<Cart>; reorder: (orderReference: string) => Promise<Cart>; }
```

### `useCheckout`

Finalisation de commande. `createOrder` soumet le panier pour validation commerciale ; `validateWithoutPayment` crée directement le document Sage (commande ou devis selon `documentType`). Les deux sont **anti-double-clic** (un seul en vol). Renvoie `{ isLoading, error, createOrder, validateWithoutPayment }`.

```ts
useCheckout: () => { isLoading: boolean; error: Error; createOrder: () => Promise<OrderResult>; validateWithoutPayment: (input?: { documentType?: string; reference?: string; }) => Promise<OrderResult>; }
```

### `useCompany`

Société (compte client) active. Pour un utilisateur rattaché à plusieurs sociétés : liste les memberships, expose l'active et permet d'en changer (re-scelle la session → prix/panier/commandes suivent la nouvelle société).

```ts
useCompany: () => { companies: Membership[]; activeId: string; isSwitching: boolean; switchTo: (customerId: string) => Promise<void>; }
```

### `useDelivery`

Adresses & options de livraison du client : liste des adresses, ajout d'une adresse. Réservé au connecté. Renvoie `{ options, isLoading, error, reload, addAddress }`.

```ts
useDelivery: () => { options: DeliveryOptions; isLoading: boolean; error: Error; reload: () => void; addAddress: (input: AddDeliveryAddressInput) => Promise<DeliveryAddress>; updateAddress: (input: UpdateDeliveryAddressInput) => Promise<DeliveryAddress>; }
```

### `useDocument`

Détail d'un document (lignes, totaux, adresse de livraison). `type` (code Sage) est requis pour récupérer les lignes. Renvoie `{ data, isLoading, error, reload }`.

```ts
useDocument: (id: string, type?: number | string) => QueryState<DocumentDetail> & { reload: () => void; }
```

### `useDocuments`

Historique des documents du client (commandes, factures, BL, devis…), filtrable par type, ville/CP de livraison et recherche. Réservé au connecté. La `reference` exposée est le **numéro de pièce** Sage. Renvoie `{ data, isLoading, error, reload }`.

```ts
useDocuments: (filters?: { type?: number; deliveryCity?: string; deliveryPostalCode?: string; search?: string; }) => QueryState<DocumentListResponse> & { reload: () => void; }
```

### `usePayment`

Démarrage du paiement. `start` ouvre une session de paiement et renvoie l'URL de redirection vers le prestataire (anti-double : une seule session en vol). Renvoie `{ isLoading, error, start }`.

```ts
usePayment: () => { isLoading: boolean; error: Error; start: (input?: StartPaymentInput) => Promise<PaymentSession>; }
```

### `useShopContext`

Contexte ambiant du shop (branding, arbre catalogue, familles, CGV, réglages d'affichage `display`/`anonymousPricing`, capacités). Charge une fois. Renvoie `{ data, isLoading, error, reload }`.

```ts
useShopContext: () => QueryState<ShopContext> & { reload: () => void; }
```

### `useSupport`

Support : création d'un ticket de contact. **Réservé au connecté** (le serveur attache le ticket au compte de la session). Pour un visiteur anonyme, masque le formulaire et invite à se connecter. Renvoie `{ isLoading, error, createTicket }`.

```ts
useSupport: () => { isLoading: boolean; error: Error; createTicket: (input: Parameters<typeof actions.createTicketAction>[0]) => Promise<void>; }
```


## Fonctions serveur (server actions — `@extracom/site-kit/server`)

### `addDeliveryAddressAction`

```ts
addDeliveryAddressAction: (input: AddDeliveryAddressInput) => Promise<DeliveryAddress>
```

### `addItemAction`

```ts
addItemAction: (input: AddItemInput) => Promise<Cart>
```

### `changePasswordAction`

```ts
changePasswordAction: (input: ChangePasswordInput) => Promise<void>
```

### `createDocumentAction`

Valider sans payer : crée directement le document Sage (commande).

```ts
createDocumentAction: (input?: { documentType?: string; reference?: string; }) => Promise<OrderResult>
```

### `createOrderAction`

```ts
createOrderAction: () => Promise<OrderResult>
```

### `createTicketAction`

```ts
createTicketAction: (input: CreateTicketInput) => Promise<void>
```

### `getActiveCompanyAction`

Société (compte client) active = `customerId` du broker.

```ts
getActiveCompanyAction: () => Promise<string | null>
```

### `getAnonymousArticleAction`

```ts
getAnonymousArticleAction: (reference: string) => Promise<Article>
```

### `getAnonymousArticlesAction`

```ts
getAnonymousArticlesAction: (query?: ArticleListQuery) => Promise<ArticleListResponse>
```

### `getAnonymousContextAction`

```ts
getAnonymousContextAction: () => Promise<ShopContext>
```

### `getArticleAction`

```ts
getArticleAction: (reference: string) => Promise<Article>
```

### `getArticlesAction`

```ts
getArticlesAction: (query?: ArticleListQuery) => Promise<ArticleListResponse>
```

### `getCartAction`

```ts
getCartAction: () => Promise<Cart>
```

### `getContextAction`

```ts
getContextAction: () => Promise<ShopContext>
```

### `getDeliveryOptionsAction`

```ts
getDeliveryOptionsAction: () => Promise<DeliveryOptions>
```

### `getDocumentAction`

```ts
getDocumentAction: (id: string, type?: number | string) => Promise<DocumentDetail>
```

### `getDocumentPdfAction`

```ts
getDocumentPdfAction: (documentId: string, type: string) => Promise<{ base64: string; contentType: string; }>
```

### `getDocumentsAction`

```ts
getDocumentsAction: (query?: DocumentListQuery) => Promise<DocumentListResponse>
```

### `isAuthenticatedAction`

`true` si une session brokerée est présente (→ ne PAS servir le cache).

```ts
isAuthenticatedAction: () => Promise<boolean>
```

### `loginAction`

```ts
loginAction: (input: LoginInput) => Promise<LoginResult>
```

### `logoutAction`

```ts
logoutAction: () => Promise<void>
```

### `meAction`

```ts
meAction: () => Promise<User>
```

### `registerAction`

```ts
registerAction: (input: RegisterInput) => Promise<void>
```

### `removeItemAction`

```ts
removeItemAction: (lineId: string) => Promise<Cart>
```

### `reorderAction`

```ts
reorderAction: (orderReference: string) => Promise<Cart>
```

### `requestPasswordResetAction`

```ts
requestPasswordResetAction: (input: RequestPasswordResetInput) => Promise<void>
```

### `setActiveCompanyAction`

Change la société active (re-scelle la session avec un autre `customerId`). Sécurité : le `customerId` doit appartenir aux memberships de l'utilisateur.

```ts
setActiveCompanyAction: (customerId: string) => Promise<void>
```

### `setCartCommentAction`

```ts
setCartCommentAction: (comment: string) => Promise<Cart>
```

### `setCartDeliveryAction`

```ts
setCartDeliveryAction: (input: SetCartDeliveryInput) => Promise<Cart>
```

### `startPaymentAction`

```ts
startPaymentAction: (input: StartPaymentInput) => Promise<PaymentSession>
```

### `updateDeliveryAddressAction`

```ts
updateDeliveryAddressAction: (input: UpdateDeliveryAddressInput) => Promise<DeliveryAddress>
```

### `updateLineAction`

```ts
updateLineAction: (lineId: string, input: UpdateCartLineInput) => Promise<Cart>
```

### `updateProfileAction`

```ts
updateProfileAction: (input: UpdateProfileInput) => Promise<void>
```

### `verifyResetCodeAction`

```ts
verifyResetCodeAction: (input: VerifyResetCodeInput) => Promise<void>
```

