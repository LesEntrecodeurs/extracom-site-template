import { S as ShopContext, A as ArticleListQuery, a as ArticleListResponse, b as Article, L as LoginInput, f as LoginResult, g as User, R as RegisterInput, h as RequestPasswordResetInput, V as VerifyResetCodeInput, i as ChangePasswordInput, j as UpdateProfileInput, c as Cart, d as AddItemInput, U as UpdateCartLineInput, e as SetCartDeliveryInput, O as OrderResult, o as DocumentListQuery, p as DocumentListResponse, q as DocumentDetail, D as DeliveryOptions, k as AddDeliveryAddressInput, l as DeliveryAddress, m as UpdateDeliveryAddressInput, n as StartPaymentInput, P as PaymentSession } from './document-gyuqZ23j.js';
import { C as CreateTicketInput } from './support-CaV6KASU.js';

declare function getContextAction(): Promise<ShopContext>;
declare function getArticlesAction(query?: ArticleListQuery): Promise<ArticleListResponse>;
declare function getArticleAction(reference: string): Promise<Article>;
declare function getAnonymousArticlesAction(query?: ArticleListQuery): Promise<ArticleListResponse>;
declare function getAnonymousArticleAction(reference: string): Promise<Article>;
declare function getAnonymousContextAction(): Promise<ShopContext>;
/** `true` si une session brokerée est présente (→ ne PAS servir le cache). */
declare function isAuthenticatedAction(): Promise<boolean>;
declare function loginAction(input: LoginInput): Promise<LoginResult>;
declare function logoutAction(): Promise<void>;
declare function meAction(): Promise<User | null>;
/** Société (compte client) active = `customerId` du broker. */
declare function getActiveCompanyAction(): Promise<string | null>;
/**
 * Change la société active (re-scelle la session avec un autre `customerId`).
 * Sécurité : le `customerId` doit appartenir aux memberships de l'utilisateur.
 */
declare function setActiveCompanyAction(customerId: string): Promise<void>;
declare function registerAction(input: RegisterInput): Promise<void>;
declare function requestPasswordResetAction(input: RequestPasswordResetInput): Promise<void>;
declare function verifyResetCodeAction(input: VerifyResetCodeInput): Promise<void>;
declare function changePasswordAction(input: ChangePasswordInput): Promise<void>;
declare function updateProfileAction(input: UpdateProfileInput): Promise<void>;
declare function createTicketAction(input: CreateTicketInput): Promise<void>;
declare function getCartAction(): Promise<Cart>;
declare function addItemAction(input: AddItemInput): Promise<Cart>;
declare function updateLineAction(lineId: string, input: UpdateCartLineInput): Promise<Cart>;
declare function removeItemAction(lineId: string): Promise<Cart>;
declare function setCartDeliveryAction(input: SetCartDeliveryInput): Promise<Cart>;
declare function setCartCommentAction(comment: string): Promise<Cart>;
declare function createOrderAction(): Promise<OrderResult>;
/** Valider sans payer : crée directement le document Sage (commande). */
declare function createDocumentAction(input?: {
    documentType?: string;
    reference?: string;
}): Promise<OrderResult>;
declare function reorderAction(orderReference: string): Promise<Cart>;
declare function getDocumentsAction(query?: DocumentListQuery): Promise<DocumentListResponse>;
declare function getDocumentAction(id: string, type?: number | string): Promise<DocumentDetail>;
declare function getDocumentPdfAction(documentId: string, type: string): Promise<{
    base64: string;
    contentType: string;
}>;
declare function getDeliveryOptionsAction(): Promise<DeliveryOptions>;
declare function addDeliveryAddressAction(input: AddDeliveryAddressInput): Promise<DeliveryAddress>;
declare function updateDeliveryAddressAction(input: UpdateDeliveryAddressInput): Promise<DeliveryAddress>;
declare function startPaymentAction(input: StartPaymentInput): Promise<PaymentSession>;

export { addDeliveryAddressAction, addItemAction, changePasswordAction, createDocumentAction, createOrderAction, createTicketAction, getActiveCompanyAction, getAnonymousArticleAction, getAnonymousArticlesAction, getAnonymousContextAction, getArticleAction, getArticlesAction, getCartAction, getContextAction, getDeliveryOptionsAction, getDocumentAction, getDocumentPdfAction, getDocumentsAction, isAuthenticatedAction, loginAction, logoutAction, meAction, registerAction, removeItemAction, reorderAction, requestPasswordResetAction, setActiveCompanyAction, setCartCommentAction, setCartDeliveryAction, startPaymentAction, updateDeliveryAddressAction, updateLineAction, updateProfileAction, verifyResetCodeAction };
