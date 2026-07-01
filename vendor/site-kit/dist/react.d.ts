import { A as ArticleListQuery, a as ArticleListResponse, b as Article, S as ShopContext, c as Cart, d as AddItemInput, U as UpdateCartLineInput, e as SetCartDeliveryInput, p as DocumentListResponse, q as DocumentDetail, g as User, L as LoginInput, f as LoginResult, Z as Membership, O as OrderResult, n as StartPaymentInput, P as PaymentSession, D as DeliveryOptions, k as AddDeliveryAddressInput, l as DeliveryAddress, m as UpdateDeliveryAddressInput, R as RegisterInput } from './document-gyuqZ23j.js';
import * as actions from '@extracom/site-kit/server';

interface QueryState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}
/**
 * Liste paginée d'articles (recherche, filtres famille/catalogue/prix, tri).
 * Re-fetch quand `query` change. Le prix de chaque article peut être `null`
 * (anonyme + shop en prix masqué). Renvoie `{ data, isLoading, error, reload }`.
 */
declare function useArticles(query?: ArticleListQuery): QueryState<ArticleListResponse> & {
    reload: () => void;
};
/**
 * Détail complet d'un article (prix/stock/promo, déclinaisons, glossaires,
 * fiches techniques) par sa référence. `data.price` peut être `null` (masqué).
 * Renvoie `{ data, isLoading, error, reload }`.
 */
declare function useArticle(reference: string): QueryState<Article> & {
    reload: () => void;
};
/**
 * Contexte ambiant du shop (branding, arbre catalogue, familles, CGV, réglages
 * d'affichage `display`/`anonymousPricing`, capacités). Charge une fois.
 * Renvoie `{ data, isLoading, error, reload }`.
 */
declare function useShopContext(): QueryState<ShopContext> & {
    reload: () => void;
};
/**
 * Panier courant + opérations (ajout/maj/suppression de ligne, adresse de
 * livraison, commentaire, « recommander »). Chaque écriture renvoie le `Cart`
 * à jour. Réservé à l'utilisateur connecté. Renvoie `{ cart, isLoading, error,
 * reload, addItem, updateLine, removeItem, setDelivery, setComment, reorder }`.
 */
declare function useCart(): {
    cart: Cart | null;
    isLoading: boolean;
    error: Error | null;
    reload: () => void;
    addItem: (input: AddItemInput) => Promise<Cart>;
    updateLine: (lineId: string, input: UpdateCartLineInput) => Promise<Cart>;
    removeItem: (lineId: string) => Promise<Cart>;
    setDelivery: (input: SetCartDeliveryInput) => Promise<Cart>;
    setComment: (comment: string) => Promise<Cart>;
    reorder: (orderReference: string) => Promise<Cart>;
};
/**
 * Historique des documents du client (commandes, factures, BL, devis…), filtrable
 * par type, ville/CP de livraison et recherche. Réservé au connecté. La
 * `reference` exposée est le **numéro de pièce** Sage. Renvoie `{ data, isLoading,
 * error, reload }`.
 */
declare function useDocuments(filters?: {
    type?: number;
    deliveryCity?: string;
    deliveryPostalCode?: string;
    search?: string;
}): QueryState<DocumentListResponse> & {
    reload: () => void;
};
/**
 * Détail d'un document (lignes, totaux, adresse de livraison). `type` (code Sage)
 * est requis pour récupérer les lignes. Renvoie `{ data, isLoading, error, reload }`.
 */
declare function useDocument(id: string, type?: number | string): QueryState<DocumentDetail> & {
    reload: () => void;
};
/** Ajout au panier léger (sans charger le panier) — pour les cartes produit. */
declare function useAddToCart(): {
    isLoading: boolean;
    error: Error | null;
    addItem: (input: AddItemInput) => Promise<Cart>;
};
/**
 * Authentification : utilisateur courant (résolu côté serveur via le cookie de
 * session), `login` et `logout`. `user` est `null` si anonyme. Renvoie
 * `{ user, isLoading, error, login, logout }`.
 */
declare function useAuth(): {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    reload: () => Promise<void>;
    login: (input: LoginInput) => Promise<LoginResult>;
    logout: () => Promise<void>;
};
/**
 * Société (compte client) active. Pour un utilisateur rattaché à plusieurs
 * sociétés : liste les memberships, expose l'active et permet d'en changer
 * (re-scelle la session → prix/panier/commandes suivent la nouvelle société).
 */
declare function useCompany(): {
    companies: Membership[];
    activeId: string | null;
    isSwitching: boolean;
    switchTo: (customerId: string) => Promise<void>;
};
/**
 * Finalisation de commande. `createOrder` soumet le panier pour validation
 * commerciale ; `validateWithoutPayment` crée directement le document Sage
 * (commande ou devis selon `documentType`). Les deux sont **anti-double-clic**
 * (un seul en vol). Renvoie `{ isLoading, error, createOrder, validateWithoutPayment }`.
 */
declare function useCheckout(): {
    isLoading: boolean;
    error: Error | null;
    /** Soumet le panier pour validation commerciale (status PENDING). */
    createOrder: () => Promise<OrderResult>;
    /** Valide sans payer : crée le document Sage (visible dans l'historique). */
    validateWithoutPayment: (input?: {
        documentType?: string;
        reference?: string;
    }) => Promise<OrderResult>;
};
/**
 * Démarrage du paiement. `start` ouvre une session de paiement et renvoie l'URL
 * de redirection vers le prestataire (anti-double : une seule session en vol).
 * Renvoie `{ isLoading, error, start }`.
 */
declare function usePayment(): {
    isLoading: boolean;
    error: Error | null;
    start: (input?: StartPaymentInput) => Promise<PaymentSession>;
};
/**
 * Adresses & options de livraison du client : liste des adresses, ajout d'une
 * adresse. Réservé au connecté. Renvoie `{ options, isLoading, error, reload,
 * addAddress }`.
 */
declare function useDelivery(): {
    options: DeliveryOptions | null;
    isLoading: boolean;
    error: Error | null;
    reload: () => void;
    addAddress: (input: AddDeliveryAddressInput) => Promise<DeliveryAddress>;
    updateAddress: (input: UpdateDeliveryAddressInput) => Promise<DeliveryAddress>;
};
/**
 * Compte : inscription (prospect, avec acceptation CGV) et flux de réinitialisation
 * de mot de passe (demande de code, vérification, changement). Renvoie
 * `{ isLoading, error, register, requestPasswordReset, verifyResetCode, changePassword }`.
 */
declare function useAccount(): {
    isLoading: boolean;
    error: Error | null;
    register: (input: RegisterInput) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    verifyResetCode: (email: string, code: string) => Promise<void>;
    changePassword: (input: Parameters<typeof actions.changePasswordAction>[0]) => Promise<void>;
    /** Met à jour nom/email du compte connecté ; pense à `useAuth().reload()`
     *  ensuite pour rafraîchir l'utilisateur affiché (nav, page compte). */
    updateProfile: (input: Parameters<typeof actions.updateProfileAction>[0]) => Promise<void>;
};
/**
 * Support : création d'un ticket de contact. **Réservé au connecté** (le serveur
 * attache le ticket au compte de la session). Pour un visiteur anonyme, masque le
 * formulaire et invite à se connecter. Renvoie `{ isLoading, error, createTicket }`.
 */
declare function useSupport(): {
    isLoading: boolean;
    error: Error | null;
    createTicket: (input: Parameters<typeof actions.createTicketAction>[0]) => Promise<void>;
};

export { useAccount, useAddToCart, useArticle, useArticles, useAuth, useCart, useCheckout, useCompany, useDelivery, useDocument, useDocuments, usePayment, useShopContext, useSupport };
