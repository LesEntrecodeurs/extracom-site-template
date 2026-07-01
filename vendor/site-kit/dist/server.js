"use server";
'use strict';

var headers = require('next/headers');
var crypto = require('crypto');

// src/client/config.ts
var SiteApiError = class extends Error {
  status;
  body;
  constructor(status, body, message) {
    super(message ?? `Site API error ${status}`);
    this.name = "SiteApiError";
    this.status = status;
    this.body = body;
  }
};
var SiteMaintenanceError = class extends SiteApiError {
  constructor() {
    super(503, "", "Extracom API en maintenance");
    this.name = "SiteMaintenanceError";
  }
};
function serverConfigFromEnv(env = readProcessEnv()) {
  const apiUrl = env.EXTRACOM_API_URL;
  const shopName = env.EXTRACOM_SHOP;
  if (!apiUrl || !shopName) {
    throw new Error(
      "[site-kit] EXTRACOM_API_URL et EXTRACOM_SHOP sont requis (env serveur)."
    );
  }
  return { apiUrl: apiUrl.replace(/\/$/, ""), shopName };
}
function resolveFetch(config) {
  const fromGlobal = globalThis.fetch;
  const impl = config.fetch ?? fromGlobal;
  if (!impl) {
    throw new Error(
      "[site-kit] Aucun transport fetch disponible : fournissez `config.fetch`."
    );
  }
  return impl;
}
function readProcessEnv() {
  const proc = globalThis.process;
  return (proc == null ? void 0 : proc.env) ?? {};
}

// src/client/http.ts
var HttpClient = class {
  baseUrl;
  fetchImpl;
  constructor(config) {
    this.baseUrl = config.apiUrl.replace(/\/$/, "");
    this.fetchImpl = resolveFetch(config);
  }
  async request(path, options = {}) {
    const { data } = await this.requestWithMeta(path, options);
    return data;
  }
  /** Comme `request`, mais renvoie aussi les `Set-Cookie` (login/broker). */
  async requestWithMeta(path, options = {}) {
    var _a, _b;
    const headers = {
      Accept: "application/json",
      ...options.headers
    };
    if (options.body !== void 0) {
      headers["Content-Type"] = "application/json";
    }
    if (options.sessionId) {
      headers.Cookie = `x-session-id=${options.sessionId}`;
    }
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== void 0 ? JSON.stringify(options.body) : void 0
    });
    const maintenance = res.headers.get("x-maintenance");
    if (maintenance === "1" || maintenance === "true") {
      throw new SiteMaintenanceError();
    }
    const raw = await res.text();
    if (!res.ok) {
      throw new SiteApiError(res.status, raw);
    }
    const setCookies = ((_b = (_a = res.headers).getSetCookie) == null ? void 0 : _b.call(_a)) ?? [];
    return { data: parseJson(raw), setCookies };
  }
  get(path, options) {
    return this.request(path, { ...options, method: "GET" });
  }
  post(path, body, options) {
    return this.request(path, { ...options, method: "POST", body });
  }
  put(path, body, options) {
    return this.request(path, { ...options, method: "PUT", body });
  }
  patch(path, body, options) {
    return this.request(path, { ...options, method: "PATCH", body });
  }
  delete(path, options) {
    return this.request(path, { ...options, method: "DELETE" });
  }
  /** GET binaire (téléchargement PDF). */
  async getBinary(path, options = {}) {
    const headers = { ...options.headers };
    if (options.sessionId) headers.Cookie = `x-session-id=${options.sessionId}`;
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: "GET",
      headers
    });
    if (!res.ok) {
      throw new SiteApiError(res.status, await res.text());
    }
    if (!res.arrayBuffer) {
      throw new Error("[site-kit] transport sans support binaire (arrayBuffer)");
    }
    return {
      data: await res.arrayBuffer(),
      contentType: res.headers.get("content-type")
    };
  }
};
function parseJson(raw) {
  if (!raw) {
    return void 0;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
function readCookieValue(setCookies, name) {
  for (const cookie of setCookies) {
    const [pair] = cookie.split(";");
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    if (pair.slice(0, eq).trim() === name) {
      return pair.slice(eq + 1).trim();
    }
  }
  return void 0;
}

// src/client/routes.ts
var version = "/v2";
var enc = encodeURIComponent;
var apiRoutes = {
  auth: {
    login: `${version}/auth/login`,
    logout: `${version}/auth/logout`,
    currentUser: `${version}/auth/current-user`,
    register: `${version}/auth/register`,
    resetPassword: `${version}/auth/reset-password`,
    verifyResetPasswordCode: `${version}/auth/verify-reset-password-code`,
    resendPasswordCode: `${version}/auth/resend-password-code`,
    changePassword: `${version}/auth/change-password`
  },
  legal: {
    currentTerms: `${version}/legal/current-terms`,
    acceptances: `${version}/legal/acceptances`
  },
  support: {
    tickets: `${version}/support/tickets`
  },
  /** Routes scopées au shop (`/v2/s/:shopName/...`). */
  shop: (shopName) => {
    const s = `${version}/s/${enc(shopName)}`;
    return {
      // Lecture catalogue : namespace public `storefront/*` (auth optionnelle).
      articles: `${s}/storefront/articles`,
      articleByReference: (reference) => `${s}/storefront/articles/${enc(reference)}`,
      catalogs: `${s}/storefront/catalogs`,
      families: `${s}/storefront/families`,
      settings: `${s}/storefront/settings`,
      // Profil self-service (opère sur le compte de la session, sans permission).
      settingsProfile: `${s}/settings/profile`,
      siteAddresses: `${s}/storefront/addresses`,
      articlesPrices: `${s}/articles/prices`,
      carts: `${s}/carts`,
      cartById: (id) => `${s}/carts/${enc(id)}`,
      cartItems: `${s}/carts/items`,
      cartItemById: (id) => `${s}/carts/items/${enc(id)}`,
      cartSubmit: `${s}/carts/submit`,
      cartValidation: `${s}/carts/validation`,
      cartUpdate: `${s}/carts/update-cart`,
      cartComment: `${s}/carts/comment`,
      cartLoadPastOrder: `${s}/carts/load-past-order-to-cart`,
      deliveries: `${s}/deliveries`,
      // Liste/historique (lecture) vs création (POST cart → document Sage).
      documents: `${s}/documents/client`,
      documentsCreate: `${s}/documents`,
      documentById: (id) => `${s}/documents/${enc(id)}`,
      documentDownload: `${s}/documents/download`,
      paymentSession: `${s}/payments/session`,
      paymentStatus: `${s}/payments/status`
    };
  }
};

// src/modules/catalog.ts
var DEFAULT_LIMIT = 50;
function mapGamme(g) {
  return {
    id: g.id,
    label: g.label,
    items: (g.items ?? []).map((i) => ({
      id: i.id,
      label: i.label,
      price: i.price ?? null,
      ean: i.ean ?? ""
    }))
  };
}
function mapPromotion(w) {
  return w.promotionId != null ? { id: w.promotionId, discountPercent: w.promotionDiscountPercent ?? 0 } : void 0;
}
function mapGlossaires(w) {
  var _a;
  return (_a = w.glossaires) == null ? void 0 : _a.map((g) => ({ text: g.text }));
}
function toCatalogNode(c, level = 1) {
  var _a;
  return {
    id: c.id,
    label: c.name,
    level,
    children: (_a = c.children) == null ? void 0 : _a.map((child) => toCatalogNode(child, level + 1))
  };
}
function toArticle(w) {
  var _a, _b;
  return {
    reference: w.reference,
    title: w.title,
    description: (_b = (_a = w.glossaires) == null ? void 0 : _a.find((g) => g.longDescription)) == null ? void 0 : _b.longDescription,
    price: w.price ?? null,
    basePrice: w.basePrice ?? null,
    vatRate: w.tauxTva,
    promotion: mapPromotion(w),
    stockQuantity: w.stock,
    unit: w.unit,
    packagingQuantity: w.qteCondit,
    imageUrl: w.imageUrl ?? "",
    specSheets: w.specSheets,
    weightNet: w.weightNet,
    weightGross: w.weightGross,
    warranty: w.dlv_garantie,
    expirationDate: w.DLC,
    barcode: w.barcode,
    gammes: w.gamme ? [mapGamme(w.gamme)] : void 0,
    glossaires: mapGlossaires(w)
  };
}
function buildListQuery(query, ctx) {
  const limit = query.limit ?? DEFAULT_LIMIT;
  const page = query.page ?? 1;
  const params = new URLSearchParams();
  params.set("offset", String(Math.max(0, page - 1) * limit));
  params.set("limit", String(limit));
  if (query.search) params.set("search", query.search);
  if (ctx.customerId) params.set("sageId", ctx.customerId);
  const filters = [];
  if (query.familyCode)
    filters.push({ field: "familyCode", value: query.familyCode });
  if (query.catalogId != null)
    filters.push({
      field: `catalogId${query.catalogLevel ?? 1}`,
      value: query.catalogId
    });
  if (query.sort) {
    filters.push({
      field: "sortBy",
      value: query.sort.startsWith("ref") ? "reference" : "intitule"
    });
    filters.push({
      field: "sortOrder",
      value: query.sort.endsWith("desc") ? "desc" : "asc"
    });
  }
  if (query.minPrice != null)
    filters.push({ field: "priceMin", value: query.minPrice });
  if (query.maxPrice != null)
    filters.push({ field: "priceMax", value: query.maxPrice });
  if (filters.length > 0) params.set("filters", JSON.stringify(filters));
  return params.toString();
}
function createCatalog(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  return {
    /** Liste paginée d'articles (prix embarqués si connecté). */
    async getArticles(query = {}, ctx = {}) {
      const qs = buildListQuery(query, ctx);
      const res = await http.get(`${routes.articles}?${qs}`, {
        sessionId: ctx.sessionId
      });
      return {
        data: res.data.map(toArticle),
        pagination: {
          page: query.page ?? 1,
          limit: res.limit,
          total: res.count
        }
      };
    },
    /** Détail d'un article (page produit). */
    async getArticle(reference, ctx = {}) {
      const params = new URLSearchParams();
      if (ctx.customerId) params.set("clientErpId", ctx.customerId);
      const qs = params.toString();
      const path = qs ? `${routes.articleByReference(reference)}?${qs}` : routes.articleByReference(reference);
      const res = await http.get(path, {
        sessionId: ctx.sessionId
      });
      return toArticle(res);
    },
    /** Arborescence catalogue (filtrée selon le client si connecté). */
    async getCatalogTree(ctx = {}) {
      const qs = ctx.customerId ? `?sageId=${encodeURIComponent(ctx.customerId)}` : "";
      const res = await http.get(
        `${routes.catalogs}${qs}`,
        {
          sessionId: ctx.sessionId
        }
      );
      const list = Array.isArray(res) ? res : (res == null ? void 0 : res.catalog) ?? [];
      const isRoot = (c) => c.parentsId == null || `${c.parentsId}` === "0";
      const seen = /* @__PURE__ */ new Set();
      const uniqueRoots = list.filter((c) => {
        if (!isRoot(c) || seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
      return uniqueRoots.map((c) => toCatalogNode(c));
    },
    /** Familles `{ code, label }`. Map explicite : on ne laisse JAMAIS passer un
     *  champ que l'API ajouterait au runtime (les types TS n'effacent rien). */
    async getFamilies(ctx = {}) {
      const res = await http.get(routes.families, {
        sessionId: ctx.sessionId
      });
      return (res ?? []).map((f) => ({ code: f.code, label: f.label }));
    }
  };
}

// src/modules/cart.ts
function toCartLine(i) {
  var _a;
  const lineExcl = i.price * i.quantity;
  return {
    id: i.id,
    reference: i.articleRef,
    label: i.title,
    quantity: i.quantity,
    unit: i.unit,
    packagingQuantity: i.qteCondit,
    unitPrice: i.price,
    unitBasePrice: i.basePrice,
    vatRate: i.tauxTva,
    lineTotalExclVat: round2(lineExcl),
    lineTotalInclVat: round2(lineExcl * (1 + i.tauxTva / 100)),
    variantId: i.gammeId || void 0,
    variantLabel: ((_a = i.gammeLabel) == null ? void 0 : _a.trim()) || void 0,
    note: i.comment ?? void 0
  };
}
function computeTotals(items, shippingFee) {
  let excl = 0;
  let vat = 0;
  let itemCount = 0;
  for (const i of items) {
    const lineExcl = i.price * i.quantity;
    excl += lineExcl;
    vat += lineExcl * (i.tauxTva / 100);
    itemCount += i.quantity;
  }
  const incl = excl + vat;
  return {
    itemCount,
    lineCount: items.length,
    totalExclVat: round2(excl),
    totalVat: round2(vat),
    totalInclVat: round2(incl),
    totalWithShipping: shippingFee != null ? round2(incl + shippingFee) : void 0
  };
}
function toCart(w) {
  var _a;
  return {
    status: w.status,
    lines: (w.items ?? []).map(toCartLine),
    totals: computeTotals(w.items ?? [], (_a = w.shipping) == null ? void 0 : _a.fee),
    shipping: w.shipping ? { fee: w.shipping.fee, mode: w.shipping.modeLabel } : void 0,
    deliveryAddressId: w.deliveryAdressId ?? void 0,
    note: w.orderComment ?? void 0
  };
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function sageQuery(ctx) {
  const p = new URLSearchParams();
  if (ctx.customerId) p.set("sageId", ctx.customerId);
  return p.toString();
}
async function fetchRawCart(http, shopName, ctx) {
  const routes = apiRoutes.shop(shopName);
  return http.get(`${routes.carts}?${sageQuery(ctx)}`, {
    sessionId: ctx.sessionId
  });
}
function createCart(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  async function get(ctx) {
    try {
      return toCart(await fetchRawCart(http, shopName, ctx));
    } catch (e) {
      if (e instanceof SiteApiError && e.status === 404) {
        return { status: "ACTIVE", lines: [], totals: computeTotals([]) };
      }
      throw e;
    }
  }
  return {
    get,
    async addItem(input, ctx) {
      await http.post(
        routes.cartItems,
        {
          sageId: ctx.customerId,
          articleRef: input.reference,
          quantity: input.quantity,
          gammeId: input.variantId,
          comment: input.note
        },
        { sessionId: ctx.sessionId }
      );
      return get(ctx);
    },
    async updateLine(lineId, input, ctx) {
      const raw = await fetchRawCart(http, shopName, ctx);
      const line = raw.items.find((i) => i.id === lineId);
      if (!line) return toCart(raw);
      await http.patch(
        routes.cartItems,
        {
          sageId: ctx.customerId,
          articleRef: line.articleRef,
          itemId: lineId,
          quantity: input.quantity,
          comment: input.note
        },
        { sessionId: ctx.sessionId }
      );
      return get(ctx);
    },
    async removeItem(lineId, ctx) {
      const qs = sageQuery(ctx);
      const path = qs ? `${routes.cartItemById(lineId)}?${qs}` : routes.cartItemById(lineId);
      await http.delete(path, { sessionId: ctx.sessionId });
      return get(ctx);
    },
    /**
     * Définit l'adresse de livraison (prérequis au paiement). Compose : résout
     * le panier courant puis met à jour. NOTE(grounding) : l'API attend des ids
     * numériques (`deliveryId`/`invoiceId`).
     */
    async setDelivery(input, ctx) {
      const raw = await fetchRawCart(http, shopName, ctx);
      await http.post(
        routes.cartUpdate,
        {
          cartId: raw.id,
          deliveryId: Number(input.deliveryAddressId),
          invoiceId: input.invoiceAddressId != null ? Number(input.invoiceAddressId) : void 0,
          pickup: input.pickup
        },
        { sessionId: ctx.sessionId }
      );
      return get(ctx);
    },
    /** Définit le commentaire de commande (max 69 caractères côté API). */
    async setComment(comment, ctx) {
      const raw = await fetchRawCart(http, shopName, ctx);
      await http.put(
        routes.cartComment,
        { cartId: raw.id, orderComment: comment.slice(0, 69) },
        { sessionId: ctx.sessionId }
      );
      return get(ctx);
    },
    /** Recharge le panier à partir d'une commande passée (« recommander »). */
    async reorder(orderReference, ctx) {
      await http.post(
        routes.cartLoadPastOrder,
        { sageId: ctx.customerId, orderOriginReference: orderReference },
        { sessionId: ctx.sessionId }
      );
      return get(ctx);
    }
  };
}

// src/modules/orders.ts
function createOrders(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  return {
    /**
     * Soumet le panier pour **validation commerciale** (ACTIVE → PENDING).
     * Ne crée PAS de document Sage : il n'apparaît dans l'historique qu'une
     * fois validé par un commercial.
     */
    async create(ctx) {
      const cart = await fetchRawCart(http, shopName, ctx);
      await http.post(
        routes.cartSubmit,
        { accountId: ctx.accountId, cartId: cart.id, sageId: ctx.customerId },
        { sessionId: ctx.sessionId }
      );
      return { status: "SUBMITTED" };
    },
    /**
     * Crée directement le document Sage (commande par défaut, type `'1'`) à
     * partir du panier — c'est le « valider sans payer ». Le document apparaît
     * immédiatement dans l'historique. L'API exige les permissions adéquates
     * (création de document + bypass paiement) ; sinon → 403.
     */
    async createDocument(ctx, input = {}) {
      const cart = await fetchRawCart(http, shopName, ctx);
      const res = await http.post(
        routes.documentsCreate,
        {
          cartId: cart.id,
          documentType: input.documentType ?? "1",
          ...input.reference ? { reference: input.reference } : {}
        },
        { sessionId: ctx.sessionId }
      );
      const reference = typeof res === "string" ? res : (res == null ? void 0 : res.reference) ?? void 0;
      return { status: "CREATED", reference: reference || void 0 };
    }
  };
}

// src/modules/session.ts
var SESSION_COOKIE = "x-session-id";
var PERM = {
  ORDER: "document.create.bon_de_commande",
  QUOTE: "document.create.quote",
  BYPASS_PAYMENT: "cart.bypass_payment",
  VIEW_DOCUMENTS: "document.read"
};
function mapMembership(c) {
  const roles = c.roles ?? [];
  const permissions = new Set(
    roles.flatMap((r) => (r.permissions ?? []).map((p) => p.name))
  );
  return {
    shopName: c.shopName,
    customerId: c.sageId,
    companyName: c.intitule,
    isActive: c.active,
    capabilities: {
      canOrder: permissions.has(PERM.ORDER),
      canQuote: permissions.has(PERM.QUOTE),
      canCheckoutWithoutPayment: permissions.has(PERM.BYPASS_PAYMENT),
      canViewDocuments: permissions.has(PERM.VIEW_DOCUMENTS)
    },
    managedCustomerIds: (c.managedBy ?? []).map((m) => m.email)
  };
}
function mapUser(w) {
  return {
    id: w.id,
    email: w.email,
    name: w.name,
    memberships: (w.connections ?? []).map(mapMembership)
  };
}
function createSession(http) {
  return {
    /**
     * Connexion. Renvoie le résultat clean + le `sessionId` à stocker côté
     * serveur (le broker pose ensuite son propre cookie first-party).
     */
    async login(input) {
      const { data, setCookies } = await http.requestWithMeta(
        apiRoutes.auth.login,
        { method: "POST", body: input }
      );
      if (data.mustChangePassword) {
        return {
          result: { mustChangePassword: true, email: data.email ?? input.email }
        };
      }
      const sessionId = readCookieValue(setCookies, SESSION_COOKIE);
      return { result: { user: mapUser(data.user) }, sessionId };
    },
    /** Utilisateur courant, ou `null` si non connecté. */
    async me(sessionId) {
      if (!sessionId) return null;
      try {
        const w = await http.get(
          apiRoutes.auth.currentUser,
          { sessionId }
        );
        return w.user ? mapUser(w.user) : null;
      } catch (e) {
        if (e instanceof SiteApiError && e.status === 401) return null;
        throw e;
      }
    },
    /** Déconnexion. */
    async logout(sessionId) {
      await http.post(apiRoutes.auth.logout, void 0, { sessionId });
    }
  };
}

// src/modules/account.ts
function createAccount(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  return {
    /** Inscription d'un prospect (le `shopName` ambiant est injecté ici). */
    async register(input) {
      await http.post(apiRoutes.auth.register, {
        shopName,
        ...input
      });
    },
    /** Demande (ou renvoi) d'un code de réinitialisation. */
    async requestPasswordReset(input) {
      await http.post(apiRoutes.auth.resetPassword, input);
    },
    /** Vérifie le code de réinitialisation. */
    async verifyResetCode(input) {
      await http.post(apiRoutes.auth.verifyResetPasswordCode, input);
    },
    /** Change le mot de passe (avec code de reset, ou en session). */
    async changePassword(input) {
      await http.post(apiRoutes.auth.changePassword, input);
    },
    /**
     * Met à jour le profil (nom / email) du compte de la session. Le serveur
     * cible toujours `session.user.id` — le `sessionId` du ctx authentifie la
     * requête. La réponse de l'API (qui inclut des connexions internes) est
     * **ignorée** : on ne renvoie rien au-delà du succès, pas de fuite possible.
     */
    async updateProfile(input, ctx = {}) {
      await http.patch(routes.settingsProfile, input, {
        sessionId: ctx.sessionId
      });
    }
  };
}

// src/modules/terms.ts
function toDoc(type, e) {
  return { id: e.id, type, version: e.version, url: e.url };
}
function createTerms(http, shopName) {
  return {
    async getCurrent(ctx = {}) {
      const res = await http.get(
        `${apiRoutes.legal.currentTerms}?shopName=${encodeURIComponent(shopName)}`,
        { sessionId: ctx.sessionId }
      );
      const docs = [];
      if (res.cgv) docs.push(toDoc("CGV", res.cgv));
      if (res.privacy) docs.push(toDoc("PRIVACY", res.privacy));
      return docs;
    }
  };
}

// src/modules/delivery.ts
function toAddress(a) {
  return {
    id: String(a.deliveryId ?? ""),
    label: a.label,
    line1: a.adress ?? "",
    line2: a.extra,
    postalCode: a.postalCode ?? "",
    city: a.city ?? "",
    country: a.country ?? "",
    contactName: a.contact,
    phone: a.phone
  };
}
function createDelivery(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  const sageQ = (ctx) => ctx.customerId ? `?sageId=${encodeURIComponent(ctx.customerId)}` : "";
  return {
    async getOptions(ctx) {
      const res = await http.get(
        `${routes.siteAddresses}${sageQ(ctx)}`,
        { sessionId: ctx.sessionId }
      );
      const list = Array.isArray(res) ? res : [];
      return { modes: [], addresses: list.map(toAddress) };
    },
    async addAddress(input, ctx) {
      const res = await http.post(
        routes.deliveries,
        {
          sageId: ctx.customerId,
          label: input.label ?? input.city,
          contact: input.contactName,
          adress: input.line1,
          extra: input.line2,
          postalCode: input.postalCode,
          city: input.city,
          country: input.country,
          phone: input.phone
        },
        { sessionId: ctx.sessionId }
      );
      return toAddress(res);
    },
    async updateAddress(input, ctx) {
      const res = await http.patch(
        routes.deliveries,
        {
          deliveryId: Number(input.id),
          sageId: ctx.customerId,
          label: input.label ?? input.city,
          contact: input.contactName,
          adress: input.line1,
          extra: input.line2,
          postalCode: input.postalCode,
          city: input.city,
          country: input.country,
          phone: input.phone
        },
        { sessionId: ctx.sessionId }
      );
      return res && (res.deliveryId != null || res.adress != null) ? toAddress(res) : { ...input, line1: input.line1, line2: input.line2 };
    }
  };
}

// src/modules/payment.ts
function extractRedirectUrl(res) {
  if (typeof res === "string") return res;
  if (res && typeof res === "object") {
    const o = res;
    return o.redirectUrl ?? o.url ?? "";
  }
  return "";
}
function createPayment(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  return {
    async start(input, ctx) {
      const cart = await fetchRawCart(http, shopName, ctx);
      const res = await http.post(
        routes.paymentSession,
        {
          sageId: ctx.customerId,
          cartId: cart.id,
          currency: input.currency,
          returnUrl: input.returnUrl
        },
        { sessionId: ctx.sessionId }
      );
      return { redirectUrl: extractRedirectUrl(res) };
    }
  };
}

// src/modules/shop.ts
function toDisplay(w) {
  return {
    stock: (w == null ? void 0 : w.stock) ?? "hidden",
    showDiscounts: (w == null ? void 0 : w.showDiscounts) ?? true,
    showBasePrice: (w == null ? void 0 : w.showBasePrice) ?? false,
    showVat: (w == null ? void 0 : w.showVat) ?? true
  };
}
function toCapabilities(w) {
  return {
    paymentEnabled: (w == null ? void 0 : w.paymentEnabled) ?? false,
    registrationOpen: (w == null ? void 0 : w.registrationOpen) ?? false,
    deliveryEnabled: (w == null ? void 0 : w.deliveryEnabled) ?? false
  };
}
function createShop(http, shopName) {
  const catalog = createCatalog(http, shopName);
  const terms = createTerms(http, shopName);
  const routes = apiRoutes.shop(shopName);
  return {
    async getContext(ctx = {}) {
      var _a, _b, _c;
      const [catalogTree, families, currentTerms, settings] = await Promise.all([
        catalog.getCatalogTree(ctx),
        catalog.getFamilies(ctx),
        terms.getCurrent(ctx),
        http.get(routes.settings, { sessionId: ctx.sessionId }).catch(() => null)
      ]);
      return {
        shopName,
        catalogTree,
        families,
        terms: currentTerms,
        anonymousPricing: (settings == null ? void 0 : settings.anonymousPricing) ?? "HIDDEN",
        display: toDisplay(settings == null ? void 0 : settings.display),
        // Indicateur de marque (non contraignant) : nom + couleur primaire.
        branding: {
          name: ((_a = settings == null ? void 0 : settings.branding) == null ? void 0 : _a.name) ?? shopName,
          ...((_b = settings == null ? void 0 : settings.branding) == null ? void 0 : _b.logoUrl) ? { logoUrl: settings.branding.logoUrl } : {},
          ...((_c = settings == null ? void 0 : settings.branding) == null ? void 0 : _c.primaryColor) ? { primaryColor: settings.branding.primaryColor } : {}
        },
        // Capacités dérivées → pilotent l'affichage de la vitrine.
        capabilities: toCapabilities(settings == null ? void 0 : settings.capabilities)
      };
    }
  };
}

// src/modules/documents.ts
var TYPE_FR = {
  0: "Devis",
  1: "Commande",
  2: "Pr\xE9paration",
  3: "Bon de livraison",
  4: "Retour",
  5: "Avoir",
  6: "Facture",
  7: "Facture comptabilis\xE9e",
  8: "Archive"
};
function num(v) {
  if (v == null || v === "") return null;
  if (typeof v === "number") return Number.isNaN(v) ? null : v;
  let s = String(v).replace(/[^\d.,-]/g, "");
  if (s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n;
}
function toSummary(w) {
  const number = String(w.documentId ?? w.reference ?? "");
  return {
    id: number,
    reference: number,
    type: typeof w.type === "number" && TYPE_FR[w.type] || "Document",
    typeCode: typeof w.type === "number" ? w.type : void 0,
    date: w.createdAt ?? "",
    totalInclVat: w.totalTTC ?? w.total ?? null,
    orderReference: number
  };
}
function toItem(l) {
  return {
    reference: l.refArticle ?? "",
    label: l.description,
    quantity: num(l.quantity) ?? 0,
    unitPrice: num(l.unitPrice) ?? void 0,
    lineTotalInclVat: num(l.priceHT) ?? void 0
  };
}
function createDocuments(http, shopName) {
  const routes = apiRoutes.shop(shopName);
  return {
    async list(query = {}, ctx = {}) {
      const p = new URLSearchParams();
      if (ctx.customerId) p.set("sageId", ctx.customerId);
      p.set("page", String(query.page ?? 1));
      p.set("limit", String(query.limit ?? 50));
      if (query.search) p.set("search", query.search);
      p.set("from", query.from ?? "2000-01-01T00:00:00.000Z");
      p.set("to", query.to ?? "2100-01-01T00:00:00.000Z");
      const docFilters = [];
      if (query.type != null)
        docFilters.push({ field: "types", value: query.type });
      if (query.deliveryCity)
        docFilters.push({ field: "deliveryCity", value: query.deliveryCity });
      if (query.deliveryPostalCode)
        docFilters.push({
          field: "deliveryPostalCode",
          value: query.deliveryPostalCode
        });
      if (docFilters.length > 0) p.set("filters", JSON.stringify(docFilters));
      const res = await http.get(
        `${routes.documents}?${p.toString()}`,
        { sessionId: ctx.sessionId }
      );
      const list = Array.isArray(res) ? res : res.data ?? [];
      return {
        data: list.map(toSummary),
        pagination: !Array.isArray(res) && res.count != null ? {
          page: query.page ?? 1,
          limit: res.limit ?? list.length,
          total: res.count
        } : void 0
      };
    },
    /**
     * Détail d'un document. `type` (code numérique Sage) DOIT être fourni pour
     * que l'API renvoie les lignes (`documentLignesInfo` filtre sur
     * `typeDocument`). On le propage depuis la liste via l'URL.
     */
    async get(id, ctx = {}, type) {
      const p = new URLSearchParams();
      if (ctx.customerId) p.set("sageId", ctx.customerId);
      if (type != null && type !== "") p.set("type", String(type));
      const q = p.toString();
      const w = await http.get(
        `${routes.documentById(id)}${q ? `?${q}` : ""}`,
        { sessionId: ctx.sessionId }
      );
      const info = w.info ?? {};
      const d = w.delivery;
      const deliveryAddress = (d ? [d.adress, d.extra, d.postalCode, d.city, d.country] : [info.deliveryStreet, info.deliveryPostalCode, info.deliveryCity]).filter(Boolean).join(", ") || void 0;
      const totalTTC = num(info.totalTTC);
      const totalHT = num(info.total);
      const number = String(info.documentId ?? id);
      return {
        id: number,
        reference: number,
        type: typeof info.type === "number" && TYPE_FR[info.type] || "Document",
        typeCode: typeof info.type === "number" ? info.type : void 0,
        date: info.createdAt ?? "",
        totalInclVat: totalTTC,
        lines: (w.lignes ?? []).map(toItem),
        totalExclVat: totalHT,
        totalVat: totalTTC != null && totalHT != null ? Number((totalTTC - totalHT).toFixed(2)) : null,
        deliveryAddress
      };
    },
    /** Récupère le PDF d'un document (binaire). `type` = code numérique Sage. */
    async download(input, ctx = {}) {
      const p = new URLSearchParams();
      if (ctx.customerId) p.set("sageId", ctx.customerId);
      p.set("documentId", input.documentId);
      p.set("type", input.type);
      return http.getBinary(`${routes.documentDownload}?${p.toString()}`, {
        sessionId: ctx.sessionId
      });
    }
  };
}

// src/modules/support.ts
function createSupport(http) {
  return {
    /** Crée un ticket de support pour l'utilisateur connecté. */
    async createTicket(input, ctx = {}) {
      await http.post(apiRoutes.support.tickets, input, {
        sessionId: ctx.sessionId
      });
    }
  };
}

// src/kit.ts
function createSiteKit(config) {
  const cfg = serverConfigFromEnv();
  const http = new HttpClient(cfg);
  const { shopName } = cfg;
  return {
    shop: createShop(http, shopName),
    catalog: createCatalog(http, shopName),
    cart: createCart(http, shopName),
    orders: createOrders(http, shopName),
    session: createSession(http),
    account: createAccount(http, shopName),
    terms: createTerms(http, shopName),
    delivery: createDelivery(http, shopName),
    payment: createPayment(http, shopName),
    documents: createDocuments(http, shopName),
    support: createSupport(http)
  };
}
var SESSION_COOKIE_NAME = "sf_session";
function keyFromSecret(secret2) {
  return crypto.createHash("sha256").update(secret2).digest();
}
function sealSession(session, secret2) {
  const key = keyFromSecret(secret2);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(session), "utf8");
  const enc2 = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc2]).toString("base64url");
}
function openSessionRotating(token, secrets) {
  for (const secret2 of secrets) {
    if (!secret2) continue;
    const opened = openSession(token, secret2);
    if (opened) return opened;
  }
  return null;
}
function openSession(token, secret2) {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, "base64url");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const enc2 = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyFromSecret(secret2), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc2), decipher.final()]);
    return JSON.parse(dec.toString("utf8"));
  } catch {
    return null;
  }
}

// src/server/context.ts
function secret() {
  const s = process.env.EXTRACOM_SESSION_SECRET;
  if (!s) {
    throw new Error(
      "[site-kit] EXTRACOM_SESSION_SECRET requis (env serveur)."
    );
  }
  return s;
}
function decryptSecrets() {
  const prev = process.env.EXTRACOM_SESSION_SECRET_PREVIOUS;
  return prev ? [secret(), prev] : [secret()];
}
async function resolveCtx() {
  var _a;
  const store = await headers.cookies();
  const session = openSessionRotating(
    (_a = store.get(SESSION_COOKIE_NAME)) == null ? void 0 : _a.value,
    decryptSecrets()
  );
  if (!session) return {};
  return {
    sessionId: session.sessionId,
    customerId: session.customerId,
    accountId: session.accountId
  };
}
function sessionMaxAge() {
  const raw = Number(process.env.EXTRACOM_SESSION_MAX_AGE);
  return Number.isFinite(raw) && raw > 0 ? raw : 60 * 60 * 24 * 7;
}
async function setSession(session) {
  const store = await headers.cookies();
  store.set(SESSION_COOKIE_NAME, sealSession(session, secret()), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge()
  });
}
async function clearSession() {
  const store = await headers.cookies();
  store.delete(SESSION_COOKIE_NAME);
}

// src/server/actions.ts
var kit = () => createSiteKit();
async function getContextAction() {
  return kit().shop.getContext(await resolveCtx());
}
async function getArticlesAction(query) {
  return kit().catalog.getArticles(query, await resolveCtx());
}
async function getArticleAction(reference) {
  return kit().catalog.getArticle(reference, await resolveCtx());
}
async function getAnonymousArticlesAction(query) {
  return kit().catalog.getArticles(query, {});
}
async function getAnonymousArticleAction(reference) {
  return kit().catalog.getArticle(reference, {});
}
async function getAnonymousContextAction() {
  return kit().shop.getContext({});
}
async function isAuthenticatedAction() {
  return !!(await resolveCtx()).sessionId;
}
async function loginAction(input) {
  var _a;
  const { result, sessionId } = await kit().session.login(input);
  if ("user" in result && sessionId) {
    await setSession({
      sessionId,
      customerId: (_a = result.user.memberships[0]) == null ? void 0 : _a.customerId,
      accountId: result.user.id
    });
  }
  return result;
}
async function logoutAction() {
  const ctx = await resolveCtx();
  await kit().session.logout(ctx.sessionId);
  await clearSession();
}
async function meAction() {
  return kit().session.me((await resolveCtx()).sessionId);
}
async function getActiveCompanyAction() {
  return (await resolveCtx()).customerId ?? null;
}
async function setActiveCompanyAction(customerId) {
  const ctx = await resolveCtx();
  if (!ctx.sessionId) throw new Error("Non authentifi\xE9");
  const user = await kit().session.me(ctx.sessionId);
  const allowed = user == null ? void 0 : user.memberships.some((m) => m.customerId === customerId);
  if (!allowed) throw new Error("Soci\xE9t\xE9 non autoris\xE9e");
  await setSession({
    sessionId: ctx.sessionId,
    customerId,
    accountId: ctx.accountId
  });
}
async function registerAction(input) {
  return kit().account.register(input);
}
async function requestPasswordResetAction(input) {
  return kit().account.requestPasswordReset(input);
}
async function verifyResetCodeAction(input) {
  return kit().account.verifyResetCode(input);
}
async function changePasswordAction(input) {
  return kit().account.changePassword(input);
}
async function updateProfileAction(input) {
  return kit().account.updateProfile(input, await resolveCtx());
}
async function createTicketAction(input) {
  return kit().support.createTicket(input, await resolveCtx());
}
async function getCartAction() {
  return kit().cart.get(await resolveCtx());
}
async function addItemAction(input) {
  return kit().cart.addItem(input, await resolveCtx());
}
async function updateLineAction(lineId, input) {
  return kit().cart.updateLine(lineId, input, await resolveCtx());
}
async function removeItemAction(lineId) {
  return kit().cart.removeItem(lineId, await resolveCtx());
}
async function setCartDeliveryAction(input) {
  return kit().cart.setDelivery(input, await resolveCtx());
}
async function setCartCommentAction(comment) {
  return kit().cart.setComment(comment, await resolveCtx());
}
async function createOrderAction() {
  return kit().orders.create(await resolveCtx());
}
async function createDocumentAction(input) {
  return kit().orders.createDocument(await resolveCtx(), input ?? {});
}
async function reorderAction(orderReference) {
  return kit().cart.reorder(orderReference, await resolveCtx());
}
async function getDocumentsAction(query) {
  return kit().documents.list(query, await resolveCtx());
}
async function getDocumentAction(id, type) {
  return kit().documents.get(id, await resolveCtx(), type);
}
async function getDocumentPdfAction(documentId, type) {
  const { data, contentType } = await kit().documents.download(
    { documentId, type },
    await resolveCtx()
  );
  return {
    base64: Buffer.from(data).toString("base64"),
    contentType: contentType ?? "application/pdf"
  };
}
async function getDeliveryOptionsAction() {
  return kit().delivery.getOptions(await resolveCtx());
}
async function addDeliveryAddressAction(input) {
  return kit().delivery.addAddress(input, await resolveCtx());
}
async function updateDeliveryAddressAction(input) {
  return kit().delivery.updateAddress(input, await resolveCtx());
}
async function startPaymentAction(input) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const returnUrl = input.returnUrl ?? (siteUrl ? `${siteUrl}/paiement/retour` : void 0);
  return kit().payment.start({ ...input, returnUrl }, await resolveCtx());
}

exports.addDeliveryAddressAction = addDeliveryAddressAction;
exports.addItemAction = addItemAction;
exports.changePasswordAction = changePasswordAction;
exports.createDocumentAction = createDocumentAction;
exports.createOrderAction = createOrderAction;
exports.createTicketAction = createTicketAction;
exports.getActiveCompanyAction = getActiveCompanyAction;
exports.getAnonymousArticleAction = getAnonymousArticleAction;
exports.getAnonymousArticlesAction = getAnonymousArticlesAction;
exports.getAnonymousContextAction = getAnonymousContextAction;
exports.getArticleAction = getArticleAction;
exports.getArticlesAction = getArticlesAction;
exports.getCartAction = getCartAction;
exports.getContextAction = getContextAction;
exports.getDeliveryOptionsAction = getDeliveryOptionsAction;
exports.getDocumentAction = getDocumentAction;
exports.getDocumentPdfAction = getDocumentPdfAction;
exports.getDocumentsAction = getDocumentsAction;
exports.isAuthenticatedAction = isAuthenticatedAction;
exports.loginAction = loginAction;
exports.logoutAction = logoutAction;
exports.meAction = meAction;
exports.registerAction = registerAction;
exports.removeItemAction = removeItemAction;
exports.reorderAction = reorderAction;
exports.requestPasswordResetAction = requestPasswordResetAction;
exports.setActiveCompanyAction = setActiveCompanyAction;
exports.setCartCommentAction = setCartCommentAction;
exports.setCartDeliveryAction = setCartDeliveryAction;
exports.startPaymentAction = startPaymentAction;
exports.updateDeliveryAddressAction = updateDeliveryAddressAction;
exports.updateLineAction = updateLineAction;
exports.updateProfileAction = updateProfileAction;
exports.verifyResetCodeAction = verifyResetCodeAction;
