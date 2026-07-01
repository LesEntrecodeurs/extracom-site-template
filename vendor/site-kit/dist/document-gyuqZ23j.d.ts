/**
 * Types catalogue publics du SDK vitrine.
 *
 * Façade neutre du catalogue `/v2` (namespace `storefront/*`, prix client
 * résolu). Les noms Sage internes (`AR_*`, `F_*`) ne fuitent jamais ici.
 */
/** Image d'article (URL absolue déjà résolue côté API). */
interface ArticleImage {
    /** URL absolue, "" si non configurée. */
    url: string;
    mimeType: string;
    /** Légende éventuelle. */
    caption: string;
}
/** Déclinaison (variante) d'un axe de gamme. */
interface GammeItem {
    id: number;
    /** Libellé de la variante (ex. "Bleu"). */
    label: string;
    /** Prix de la variante, résolu serveur ; `null` si masqué. */
    price: number | null;
    ean: string;
}
/** Promotion applicable à un article (résolue serveur). */
interface Promotion {
    id: number;
    discountPercent: number;
}
/** Axe de gamme (ex. "Couleur") et ses déclinaisons. */
interface Gamme {
    id: number;
    label: string;
    items: GammeItem[];
}
interface Family {
    code: string;
    label: string;
}
interface Glossaire {
    text: string;
}
interface CustomField {
    name: string;
    value: string;
}
interface ArticleDocument {
    name: string;
    url: string;
    mimeType: string;
    comment: string;
}
/** Nœud du fil d'ariane catalogue (niveau 1 → 4). */
interface CatalogPathNode {
    id: number;
    label: string;
    level: number;
}
/** Nœud de l'arborescence catalogue (`catalog.getCatalogTree`). */
interface CatalogNode {
    id: number;
    label: string;
    level: number;
    children?: CatalogNode[];
}
/** Composant d'un article composé (kit / nomenclature). */
interface ArticleComponent {
    reference: string;
    label: string;
    quantity: number;
}
/**
 * Article catalogue, **prix embarqué et résolu côté serveur**.
 *
 * Le `price` est :
 * - le **prix client** (catégorie tarifaire, centrale, remises) si le visiteur
 *   est connecté ;
 * - le **prix de base** si anonyme et que le shop l'autorise ;
 * - **`null`** si le shop masque les prix anonymes (réglage `/settings`).
 *
 * ⚠️ `price` PEUT ÊTRE `null` : le front DOIT gérer ce cas (ex. afficher
 * « connectez-vous pour voir votre tarif ») et NE JAMAIS supposer un nombre ni
 * recalculer un prix. Pour l'affichage, utiliser le `formatPrice()` du kit.
 */
/**
 * Optionalité : seuls `reference`, `title`, `price`, `unit` sont garantis. Les
 * autres champs sont **remplis selon disponibilité** ; ceux non encore fournis
 * par `/v2` (galerie, fil d'ariane, famille objet, customFields, documents,
 * langues, composants) seront enrichis côté backend **sans changer ce contrat**.
 * Le front doit traiter chaque champ optionnel comme potentiellement absent.
 */
interface Article {
    reference: string;
    /** Intitulé court (nom principal). */
    title: string;
    /** Description longue. */
    description?: string;
    /** Description localisée, slot 1. */
    langue1?: string;
    /** Description localisée, slot 2. */
    langue2?: string;
    /** Code-barres / EAN. */
    barcode?: string;
    /** Prix à afficher. `null` si masqué. */
    price: number | null;
    /** Prix de base avant tarif/remise ; `null` si masqué. */
    basePrice?: number | null;
    /** Taux de TVA en pourcentage (ex. 20). */
    vatRate?: number;
    /** Devise ISO (défaut EUR). */
    currency?: string;
    /** Promotion en cours, le cas échéant. */
    promotion?: Promotion;
    /** Stock disponible si exposé par le shop. */
    stockQuantity?: number;
    /** `false` si la commande de l'article est interdite. */
    orderable?: boolean;
    /** Unité de vente. */
    unit: string;
    /** Quantité par conditionnement (vente par multiple). */
    packagingQuantity?: number;
    /** URL de l'image principale ("" si non configurée). */
    imageUrl?: string;
    /** Galerie d'images additionnelles (enrichissement backend à venir). */
    images?: ArticleImage[];
    /** Fiches techniques (URLs). */
    specSheets?: string[];
    /** Poids net (kg). */
    weightNet?: number;
    /** Poids brut (kg). */
    weightGross?: number;
    /** Délai de livraison indicatif (jours). */
    deliveryDelay?: number;
    /** Garantie / DLV (valeur brute pour affichage). */
    warranty?: string;
    /** Date limite de consommation (format "dd-MM-yyyy"), si applicable. */
    expirationDate?: string;
    gammes?: Gamme[];
    catalogId1?: number;
    catalogId2?: number;
    catalogId3?: number;
    catalogId4?: number;
    /** Fil d'ariane catalogue. */
    catalogPath?: CatalogPathNode[];
    family?: Family | null;
    glossaires?: Glossaire[];
    customFields?: CustomField[];
    documents?: ArticleDocument[];
    /** `true` si article composé/kit. */
    isComposite?: boolean;
    /** Composants si article composé. */
    components?: ArticleComponent[];
}
interface Pagination {
    page: number;
    limit: number;
    total: number;
}
interface ArticleListResponse {
    data: Article[];
    pagination: Pagination;
}
/**
 * Tri du catalogue. Le prix n'est pas triable (résolu en TS, hors requête SQL) :
 * seuls le nom (intitulé) et la référence le sont, côté serveur.
 */
type ArticleSort = 'name_asc' | 'name_desc' | 'ref_asc' | 'ref_desc';
/** Critères de listing catalogue (filtre / tri / pagination). */
interface ArticleListQuery {
    page?: number;
    limit?: number;
    search?: string;
    familyCode?: string;
    /** Id du nœud catalogue sélectionné (CL_No Sage). */
    catalogId?: number;
    /**
     * Niveau (1..4) du nœud catalogue → mappe sur la colonne `CL_No<niveau>`.
     * Requis avec `catalogId` pour filtrer au bon niveau de hiérarchie.
     */
    catalogLevel?: number;
    /** Tri (défaut serveur : nom A→Z). */
    sort?: ArticleSort;
    /**
     * Filtre prix mini (HT). Porte sur le **tarif client** (prix client →
     * catégorie → base) ; pour un visiteur anonyme, c'est le prix de base.
     */
    minPrice?: number;
    /** Filtre prix maxi (HT), même base que `minPrice`. */
    maxPrice?: number;
}

/**
 * Types auth & compte du SDK vitrine.
 *
 * L'auth réutilise l'API Extracom via le broker serveur : le cookie de session
 * reste côté serveur, la vitrine pose son propre cookie first-party. Le
 * navigateur n'appelle jamais l'API directement. Vocabulaire métier clair :
 * le jargon backend (`sageId`, `connections`, `superAdmin`) n'est pas exposé.
 */
/**
 * Capacités métier d'un utilisateur sur une société, **dérivées de son rôle**
 * côté serveur. Le kit n'expose JAMAIS les permissions brutes (jargon backend) :
 * la vitrine et l'agent raisonnent uniquement sur ces booléens d'intention.
 */
interface MembershipCapabilities {
    /** Peut créer un bon de commande (commande directe). */
    canOrder: boolean;
    /** Peut créer un devis. */
    canQuote: boolean;
    /** Peut finaliser sans passer par la page de paiement. */
    canCheckoutWithoutPayment: boolean;
    /** Peut consulter ses documents (historique). */
    canViewDocuments: boolean;
}
/** Rattachement d'un utilisateur à un shop (un user peut en avoir plusieurs). */
interface Membership {
    shopName: string;
    /** Identifiant du compte client (masque le `sageId` backend). */
    customerId: string;
    /** Nom de la société / du client (pour le sélecteur d'entreprise). */
    companyName?: string;
    /** Connexion marquée active par défaut côté API. */
    isActive?: boolean;
    /** Capacités métier dérivées du rôle (pas de permissions brutes exposées). */
    capabilities: MembershipCapabilities;
    /** Comptes clients gérés (centrale, sous-comptes…). */
    managedCustomerIds?: string[];
}
/** Utilisateur connecté. */
interface User {
    id: string;
    email: string;
    name: string;
    memberships: Membership[];
}
/** Connexion. */
interface LoginInput {
    email: string;
    password: string;
}
/**
 * Résultat de connexion :
 * - succès → `{ user }`
 * - changement de mot de passe imposé → `{ mustChangePassword: true, email }`
 */
type LoginResult = {
    user: User;
    mustChangePassword?: false;
} | {
    mustChangePassword: true;
    email: string;
};
/**
 * Inscription d'un prospect sur le shop courant (shop ambiant). Le `shopName`
 * est injecté côté serveur. Champs grounded sur `CreateClientRequestDto` :
 * tous ceux marqués requis sont @IsNotEmpty côté API.
 */
interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    /** Raison sociale. */
    companyName: string;
    address: string;
    zipCode: string;
    city: string;
    /** SIRET. */
    siret: string;
    /** N° de TVA intracommunautaire. */
    taxId: string;
    /** Civilité. */
    gender?: string;
    /** Secteur d'activité. */
    activity?: string;
    otherActivity?: string;
    /** Nom commercial / enseigne (distinct de la raison sociale). */
    company?: string;
    /** Acceptation des CGV/confidentialité. */
    acceptTerms: boolean;
    /** Identifiants des versions de documents acceptées. */
    termsDocumentIds?: string[];
    /** Injecté côté serveur (shop ambiant) ; inutile côté formulaire. */
    shopName?: string;
}
/** Demande de réinitialisation de mot de passe (englobe le renvoi de code). */
interface RequestPasswordResetInput {
    email: string;
}
/** Vérification du code de réinitialisation. */
interface VerifyResetCodeInput {
    email: string;
    code: string;
}
/** Changement de mot de passe (avec code de reset, ou en session). */
interface ChangePasswordInput {
    email: string;
    code?: string;
    newPassword: string;
}
/**
 * Édition du profil self-service (nom / email du compte connecté). Les deux
 * champs sont optionnels : on n'envoie que ce qui change. Opère toujours sur le
 * compte de la session côté serveur — jamais sur un autre compte.
 */
interface UpdateProfileInput {
    name?: string;
    email?: string;
}
/** Document légal (CGV / confidentialité) en vigueur. */
interface TermsDocument {
    id: string;
    type: string;
    version: string;
    url?: string;
}

/**
 * Contexte ambiant du shop (`shop.getContext`) — lecture **agrégée**.
 *
 * Un seul appel qui fournit tout ce dont le layout/nav a besoin : branding,
 * réglages (prix anonymes), capacités, arbre catalogue + familles, liens CGV.
 * Résolu côté serveur à partir du paramétrage Extracom. Réduit N appels à 1.
 *
 * NOTE(grounding) : champs exacts à confirmer au câblage (settings shop,
 * capacités réellement exposées).
 */

/** Mode d'affichage des prix pour les visiteurs anonymes. */
type AnonymousPricing = 'BASE' | 'HIDDEN';
/**
 * Réglages d'affichage du shop (façade neutre des settings Extracom).
 * Pilotent le rendu PAR DÉFAUT du template ; l'agent reste libre de restyler.
 */
interface ShopDisplaySettings {
    /**
     * Présentation du stock :
     * - `hidden` : on n'affiche pas le stock
     * - `quantity` : on affiche la quantité disponible
     * - `availability` : on affiche seulement « en stock / épuisé »
     */
    stock: 'hidden' | 'quantity' | 'availability';
    /** Afficher les remises / promotions. */
    showDiscounts: boolean;
    /** Afficher le prix de base barré à côté du prix net. */
    showBasePrice: boolean;
    /** Afficher la TVA (TTC) plutôt que le seul HT. */
    showVat: boolean;
}
/** Capacités/fonctionnalités activées pour le shop. */
interface ShopCapabilities {
    paymentEnabled: boolean;
    registrationOpen: boolean;
    deliveryEnabled: boolean;
}
/** Éléments de marque/thème par défaut fournis par le shop. */
interface ShopBranding {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
}
/**
 * Contexte ambiant agrégé du shop.
 *
 * `shopName`, `catalogTree`, `families`, `terms` sont fournis dès maintenant.
 * `branding`/`anonymousPricing`/`capabilities` proviennent des settings shop
 * (NOTE(grounding) : endpoint settings à câbler) — optionnels en attendant,
 * remplis ensuite **sans changer ce contrat**.
 */
interface ShopContext {
    shopName: string;
    catalogTree: CatalogNode[];
    families: Family[];
    terms: TermsDocument[];
    branding?: ShopBranding;
    anonymousPricing?: AnonymousPricing;
    display?: ShopDisplaySettings;
    capabilities?: ShopCapabilities;
}

/**
 * Types panier & commande du SDK vitrine.
 *
 * Domaine SENSIBLE. Le client connecté a **un seul panier courant** : après une
 * commande, le panier suivant est régénéré automatiquement. L'identité du panier
 * et du client (`cartId`, `sageId`, `accountId` côté backend) est dérivée de la
 * session et **jamais exposée** ici. L'idempotence définitive est assurée côté
 * API ; le kit ajoute un garde anti-double-soumission.
 */
/** Statut d'un panier (le visiteur ne manipule que son panier courant). */
type CartStatus = 'ACTIVE' | 'PENDING' | 'VALIDATED' | 'REJECTED';
/** Ajout d'un article au panier courant. */
interface AddItemInput {
    /** Référence d'article. */
    reference: string;
    quantity: number;
    /** Déclinaison de gamme (variante) éventuelle. */
    variantId?: number;
    note?: string;
}
/** Mise à jour d'une ligne du panier. */
interface UpdateCartLineInput {
    quantity?: number;
    note?: string;
}
/** Ligne du panier courant. */
interface CartLine {
    /** Identifiant de ligne (pour mettre à jour / retirer). */
    id: string;
    reference: string;
    label?: string;
    /** Image principale de l'article (pour l'affichage du panier). */
    imageUrl?: string;
    quantity: number;
    /** Unité de vente. */
    unit?: string;
    /** Quantité par conditionnement (vente par multiple). */
    packagingQuantity?: number;
    /** Prix unitaire HT (client connecté). */
    unitPrice: number;
    /** Prix unitaire de base avant remise, si pertinent. */
    unitBasePrice?: number;
    /** Taux de TVA en pourcentage (ex. 20). */
    vatRate: number;
    /** Total de la ligne HT (`unitPrice` × `quantity`). */
    lineTotalExclVat?: number;
    /** Total de la ligne TTC. */
    lineTotalInclVat?: number;
    variantId?: number;
    /** Libellé de la déclinaison de gamme choisie (ex. "Bleu"). */
    variantLabel?: string;
    note?: string;
}
/** Frais et mode de livraison associés au panier. */
interface CartShipping {
    fee: number;
    mode?: string;
}
/** Totaux du panier (calculés côté serveur). */
interface CartTotals {
    /** Nombre total d'articles (somme des quantités). */
    itemCount: number;
    /** Nombre de lignes distinctes. */
    lineCount: number;
    totalExclVat: number;
    totalVat: number;
    totalInclVat: number;
    /** Total TTC livraison comprise, si livraison définie. */
    totalWithShipping?: number;
}
/**
 * Panier courant.
 *
 * NOTE(grounding) : la réponse détaillée `/v2` est plus riche ; cette forme est
 * dérivée de l'usage réel et à confirmer au câblage du client (tâche 0.2).
 */
interface Cart {
    status: CartStatus;
    lines: CartLine[];
    /** Devise ISO (défaut EUR). */
    currency?: string;
    /** Totaux agrégés, prêts à afficher. */
    totals?: CartTotals;
    shipping?: CartShipping;
    /** Adresse de livraison sélectionnée (requise pour payer). */
    deliveryAddressId?: string;
    /** Commentaire global du panier. */
    note?: string;
}
/** Problème détecté lors de la validation du panier. */
interface CartIssue {
    reference?: string;
    code: string;
    message: string;
}
/** Résultat du pré-check de panier avant commande. */
interface CartValidation {
    ok: boolean;
    issues: CartIssue[];
}
/** Définit l'adresse de livraison (et facturation/retrait) du panier courant. */
interface SetCartDeliveryInput {
    deliveryAddressId: string;
    invoiceAddressId?: string;
    pickup?: boolean;
}
/** Résultat de la création de commande. */
interface OrderResult {
    /**
     * - `SUBMITTED` : panier soumis pour validation commerciale (pas encore de
     *   document Sage visible dans l'historique).
     * - `CREATED` : document Sage créé directement (visible dans l'historique).
     */
    status: 'SUBMITTED' | 'CREATED';
    /** Référence de commande si renvoyée par l'API. */
    reference?: string;
}

/**
 * Types livraison du SDK vitrine.
 *
 * Le client peut consulter ses options de livraison (modes + adresses) et
 * **ajouter une adresse**. Le `customerId`/session est dérivé côté serveur.
 *
 * NOTE(grounding) : l'ajout d'adresse nécessite un endpoint backend dédié
 * (le module delivery n'expose aujourd'hui qu'une lecture) — à créer (tâche 1.x).
 */
/** Mode de livraison proposé. */
interface DeliveryOption {
    id: string;
    label: string;
    /** Frais de port si applicable. */
    fee?: number;
}
/** Adresse de livraison. */
interface DeliveryAddress {
    id: string;
    label?: string;
    line1: string;
    line2?: string;
    postalCode: string;
    city: string;
    country: string;
    contactName?: string;
    phone?: string;
}
/** Options de livraison disponibles pour le client courant. */
interface DeliveryOptions {
    modes: DeliveryOption[];
    addresses: DeliveryAddress[];
}
/** Ajout d'une adresse de livraison. */
interface AddDeliveryAddressInput {
    label?: string;
    line1: string;
    line2?: string;
    postalCode: string;
    city: string;
    country: string;
    contactName?: string;
    phone?: string;
}
/** Modification d'une adresse existante (`id` = deliveryId Sage). */
interface UpdateDeliveryAddressInput extends AddDeliveryAddressInput {
    id: string;
}

/**
 * Types paiement du SDK vitrine — AGNOSTIQUES au prestataire.
 *
 * Le kit démarre le paiement du panier courant et reçoit une URL de redirection.
 * `cartId`/`customerId` sont dérivés de la session côté serveur (non exposés).
 * Les spécificités prestataire (Axepta : signature/MAC, chiffrement, callbacks
 * `URLNotify`/`URLSuccess`) restent dans l'adapter côté API. La finalisation de
 * commande repose sur une confirmation serveur authentifiée, jamais sur le
 * redirect utilisateur.
 */
/** Démarrage du paiement du panier courant. */
interface StartPaymentInput {
    /** Devise ISO ; défaut côté API = EUR. */
    currency?: string;
    /**
     * Page de retour de la vitrine (le prestataire y renvoie l'utilisateur).
     * Injectée par défaut depuis `NEXT_PUBLIC_SITE_URL` ; rarement à fournir.
     */
    returnUrl?: string;
}
/** Session de paiement : URL de redirection vers la page du prestataire. */
interface PaymentSession {
    redirectUrl: string;
}
/** Statut de paiement (générique, indépendant du prestataire). */
type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'FAILED' | 'CANCELLED';
interface PaymentStatusResult {
    status: PaymentStatus;
    /** Référence prestataire éventuelle (ex. PayID Axepta). */
    providerRef?: string;
}

/**
 * Types documents (commandes, factures, BL, devis) du SDK vitrine.
 *
 * NOTE(grounding) : les réponses `/v2/.../documents*` viennent de Sage et ne sont
 * pas figées dans les DTO backend (stubs). Ces formes sont à confirmer au câblage ;
 * les mappers du module `documents` sont défensifs.
 */

/** Nature du document (numéro, statut viennent de Sage). */
type DocumentType = 'ORDER' | 'INVOICE' | 'DELIVERY_NOTE' | 'QUOTE' | string;
interface DocumentLine {
    reference: string;
    label?: string;
    quantity: number;
    unitPrice?: number;
    lineTotalInclVat?: number;
}
/** Entrée de liste (historique). */
interface DocumentSummary {
    id: string;
    /** Numéro du document (ex. BC/FA…). */
    reference: string;
    type: DocumentType;
    /**
     * Code numérique Sage du type (0=Devis, 1=Commande…). Nécessaire pour
     * récupérer le détail (lignes) et télécharger le PDF.
     */
    typeCode?: number;
    /** Date (ISO ou format Sage). */
    date: string;
    status?: string;
    totalInclVat?: number | null;
    /** Référence d'origine, utilisée pour « recommander ». */
    orderReference?: string;
}
/** Détail d'un document. */
interface DocumentDetail extends DocumentSummary {
    lines: DocumentLine[];
    totalExclVat?: number | null;
    totalVat?: number | null;
    deliveryAddress?: string;
    /** URL de téléchargement du PDF si fournie par l'API. */
    downloadUrl?: string;
}
interface DocumentListResponse {
    data: DocumentSummary[];
    pagination?: Pagination;
}
/** Filtres de l'historique de documents. */
interface DocumentListQuery {
    page?: number;
    limit?: number;
    search?: string;
    from?: string;
    to?: string;
    /** Filtre serveur par type de document (code Sage : 0=Devis, 1=Commande…). */
    type?: number;
    /** Filtre par ville de livraison (sous-chaîne). */
    deliveryCity?: string;
    /** Filtre par code postal de livraison (sous-chaîne). */
    deliveryPostalCode?: string;
}

export type { PaymentStatus as $, ArticleListQuery as A, ArticleSort as B, CatalogNode as C, DeliveryOptions as D, AnonymousPricing as E, Family as F, GammeItem as G, ShopDisplaySettings as H, ShopCapabilities as I, ShopBranding as J, CartStatus as K, LoginInput as L, CartLine as M, CartShipping as N, OrderResult as O, PaymentSession as P, CartTotals as Q, RegisterInput as R, ShopContext as S, TermsDocument as T, UpdateCartLineInput as U, VerifyResetCodeInput as V, CartIssue as W, CartValidation as X, MembershipCapabilities as Y, Membership as Z, DeliveryOption as _, ArticleListResponse as a, PaymentStatusResult as a0, DocumentType as a1, DocumentLine as a2, DocumentSummary as a3, Article as b, Cart as c, AddItemInput as d, SetCartDeliveryInput as e, LoginResult as f, User as g, RequestPasswordResetInput as h, ChangePasswordInput as i, UpdateProfileInput as j, AddDeliveryAddressInput as k, DeliveryAddress as l, UpdateDeliveryAddressInput as m, StartPaymentInput as n, DocumentListQuery as o, DocumentListResponse as p, DocumentDetail as q, ArticleImage as r, Promotion as s, Gamme as t, Glossaire as u, CustomField as v, ArticleDocument as w, CatalogPathNode as x, ArticleComponent as y, Pagination as z };
