import { S as ShopContext, A as ArticleListQuery, a as ArticleListResponse, b as Article, C as CatalogNode, F as Family, c as Cart, d as AddItemInput, U as UpdateCartLineInput, e as SetCartDeliveryInput, O as OrderResult, L as LoginInput, f as LoginResult, g as User, R as RegisterInput, h as RequestPasswordResetInput, V as VerifyResetCodeInput, i as ChangePasswordInput, j as UpdateProfileInput, T as TermsDocument, D as DeliveryOptions, k as AddDeliveryAddressInput, l as DeliveryAddress, m as UpdateDeliveryAddressInput, n as StartPaymentInput, P as PaymentSession, o as DocumentListQuery, p as DocumentListResponse, q as DocumentDetail } from './document-gyuqZ23j.js';
export { E as AnonymousPricing, y as ArticleComponent, w as ArticleDocument, r as ArticleImage, B as ArticleSort, W as CartIssue, M as CartLine, N as CartShipping, K as CartStatus, Q as CartTotals, X as CartValidation, x as CatalogPathNode, v as CustomField, _ as DeliveryOption, a2 as DocumentLine, a3 as DocumentSummary, a1 as DocumentType, t as Gamme, G as GammeItem, u as Glossaire, Z as Membership, Y as MembershipCapabilities, z as Pagination, $ as PaymentStatus, a0 as PaymentStatusResult, s as Promotion, J as ShopBranding, I as ShopCapabilities, H as ShopDisplaySettings } from './document-gyuqZ23j.js';
import { C as CreateTicketInput } from './support-CaV6KASU.js';

/**
 * Configuration et transport du client API du kit — **server-side uniquement**.
 *
 * Cette config (URL de l'API, shop ambiant) est lue depuis l'environnement
 * serveur de la vitrine (ex. `EXTRACOM_API_URL`, `EXTRACOM_SHOP`). Elle NE DOIT
 * JAMAIS être exposée au bundle client (pas de `NEXT_PUBLIC_`). Les hooks
 * clients passent par des server actions ; ils ne connaissent ni URL, ni shop,
 * ni session.
 *
 * Le transport HTTP est injectable (`FetchLike`) pour rester testable et
 * indépendant du runtime ; par défaut `globalThis.fetch`.
 */
/** Init de requête minimale (sous-ensemble de RequestInit). */
interface KitRequestInit {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}
/** Réponse minimale (sous-ensemble de Response). */
interface KitResponse {
    ok: boolean;
    status: number;
    headers: {
        get(name: string): string | null;
        /** Cookies `Set-Cookie` (undici expose `getSetCookie()`). */
        getSetCookie?(): string[];
    };
    text(): Promise<string>;
    /** Corps binaire (téléchargement PDF). */
    arrayBuffer?(): Promise<ArrayBuffer>;
}
type FetchLike = (url: string, init?: KitRequestInit) => Promise<KitResponse>;
interface SiteServerConfig {
    /** Base URL de l'API Extracom (server-only). Sans slash final. */
    apiUrl: string;
    /** Shop ambiant : une vitrine = un shop. Jamais passé par l'agent. */
    shopName: string;
    /** Transport HTTP ; par défaut `globalThis.fetch`. */
    fetch?: FetchLike;
}
/** Erreur normalisée des appels API du kit. */
declare class SiteApiError extends Error {
    readonly status: number;
    readonly body: string;
    constructor(status: number, body: string, message?: string);
}
/** Levée quand l'API signale la maintenance (`x-maintenance`). */
declare class SiteMaintenanceError extends SiteApiError {
    constructor();
}

declare function createSiteKit(config?: SiteServerConfig): {
    shop: {
        getContext(ctx?: RequestCtx): Promise<ShopContext>;
    };
    catalog: {
        getArticles(query?: ArticleListQuery, ctx?: RequestCtx): Promise<ArticleListResponse>;
        getArticle(reference: string, ctx?: RequestCtx): Promise<Article>;
        getCatalogTree(ctx?: RequestCtx): Promise<CatalogNode[]>;
        getFamilies(ctx?: RequestCtx): Promise<Family[]>;
    };
    cart: {
        get: (ctx: RequestCtx) => Promise<Cart>;
        addItem(input: AddItemInput, ctx: RequestCtx): Promise<Cart>;
        updateLine(lineId: string, input: UpdateCartLineInput, ctx: RequestCtx): Promise<Cart>;
        removeItem(lineId: string, ctx: RequestCtx): Promise<Cart>;
        setDelivery(input: SetCartDeliveryInput, ctx: RequestCtx): Promise<Cart>;
        setComment(comment: string, ctx: RequestCtx): Promise<Cart>;
        reorder(orderReference: string, ctx: RequestCtx): Promise<Cart>;
    };
    orders: {
        create(ctx: RequestCtx): Promise<OrderResult>;
        createDocument(ctx: RequestCtx, input?: {
            documentType?: string;
            reference?: string;
        }): Promise<OrderResult>;
    };
    session: {
        login(input: LoginInput): Promise<{
            result: LoginResult;
            sessionId?: string;
        }>;
        me(sessionId?: string): Promise<User | null>;
        logout(sessionId?: string): Promise<void>;
    };
    account: {
        register(input: RegisterInput): Promise<void>;
        requestPasswordReset(input: RequestPasswordResetInput): Promise<void>;
        verifyResetCode(input: VerifyResetCodeInput): Promise<void>;
        changePassword(input: ChangePasswordInput): Promise<void>;
        updateProfile(input: UpdateProfileInput, ctx?: RequestCtx): Promise<void>;
    };
    terms: {
        getCurrent(ctx?: RequestCtx): Promise<TermsDocument[]>;
    };
    delivery: {
        getOptions(ctx: RequestCtx): Promise<DeliveryOptions>;
        addAddress(input: AddDeliveryAddressInput, ctx: RequestCtx): Promise<DeliveryAddress>;
        updateAddress(input: UpdateDeliveryAddressInput, ctx: RequestCtx): Promise<DeliveryAddress>;
    };
    payment: {
        start(input: StartPaymentInput, ctx: RequestCtx): Promise<PaymentSession>;
    };
    documents: {
        list(query?: DocumentListQuery, ctx?: RequestCtx): Promise<DocumentListResponse>;
        get(id: string, ctx?: RequestCtx, type?: number | string): Promise<DocumentDetail>;
        download(input: {
            documentId: string;
            type: string;
        }, ctx?: RequestCtx): Promise<{
            data: ArrayBuffer;
            contentType: string | null;
        }>;
    };
    support: {
        createTicket(input: CreateTicketInput, ctx?: RequestCtx): Promise<void>;
    };
};
type SiteKit = ReturnType<typeof createSiteKit>;

/**
 * Formatage d'affichage des montants. NE recalcule jamais un prix — gère
 * seulement la présentation et le cas `null` (prix masqué).
 */
declare function formatPrice(value: number | null | undefined, opts?: {
    currency?: string;
    locale?: string;
    whenHidden?: string;
}): string;
/**
 * Formatage d'affichage d'une date. Tolère ISO/Sage ; renvoie la valeur brute
 * si non parsable, et `''` si absente.
 */
declare function formatDate(value: string | null | undefined, opts?: {
    locale?: string;
}): string;

/**
 * Contexte d'appel résolu **côté serveur** (cookies/session) et passé aux
 * modules. Jamais fourni par l'agent : le binding Next le construit à partir de
 * la session brokerée.
 */
interface RequestCtx {
    /** Session Extracom (`x-session-id`) détenue par le serveur. */
    sessionId?: string;
    /** Identifiant client (sageId) pour prix/panier/commande. */
    customerId?: string;
    /** Compte qui agit (id de l'utilisateur de session). */
    accountId?: string;
}

/**
 * @extracom/site-kit
 *
 * Cœur verrouillé des vitrines : façade namespacée headless, seule voie d'accès
 * au métier Extracom (catalogue, prix embarqués, panier, commande, paiement)
 * depuis une vitrine. Le code éditable consomme cette façade ; il n'appelle
 * jamais l'API directement (aucune URL côté Next).
 *
 * Surface publique : `createSiteKit`, les types, le contexte d'appel et
 * les erreurs. Les couches internes (http, routes, config) restent privées.
 */
declare const KIT_VERSION: string;

export { AddDeliveryAddressInput, AddItemInput, Article, ArticleListQuery, ArticleListResponse, Cart, CatalogNode, ChangePasswordInput, CreateTicketInput, DeliveryAddress, DeliveryOptions, DocumentDetail, DocumentListQuery, DocumentListResponse, Family, KIT_VERSION, LoginInput, LoginResult, OrderResult, PaymentSession, RegisterInput, type RequestCtx, RequestPasswordResetInput, SetCartDeliveryInput, ShopContext, SiteApiError, type SiteKit, SiteMaintenanceError, StartPaymentInput, TermsDocument, UpdateCartLineInput, UpdateDeliveryAddressInput, UpdateProfileInput, User, VerifyResetCodeInput, createSiteKit, formatDate, formatPrice };
