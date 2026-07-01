"use client";
'use strict';

var react = require('react');
var actions = require('@extracom/site-kit/server');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var actions__namespace = /*#__PURE__*/_interopNamespace(actions);

function useSingleFlight() {
  const inFlight = react.useRef(null);
  return react.useCallback((fn) => {
    if (inFlight.current) return inFlight.current;
    const p = fn().finally(() => {
      inFlight.current = null;
    });
    inFlight.current = p;
    return p;
  }, []);
}
function useQuery(fn, deps) {
  const [state, setState] = react.useState({
    data: null,
    isLoading: true,
    error: null
  });
  const run = react.useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    fn().then((data) => setState({ data, isLoading: false, error: null })).catch((error) => setState({ data: null, isLoading: false, error }));
  }, deps);
  react.useEffect(() => run(), [run]);
  return { ...state, reload: run };
}
function useArticles(query) {
  return useQuery(
    () => actions__namespace.getArticlesAction(query),
    [JSON.stringify(query)]
  );
}
function useArticle(reference) {
  return useQuery(
    () => actions__namespace.getArticleAction(reference),
    [reference]
  );
}
function useShopContext() {
  return useQuery(() => actions__namespace.getContextAction(), []);
}
function useCart() {
  const [cart, setCart] = react.useState(null);
  const [isLoading, setIsLoading] = react.useState(true);
  const [error, setError] = react.useState(null);
  const load = react.useCallback(() => {
    setIsLoading(true);
    actions__namespace.getCartAction().then((c) => setCart(c)).catch((e) => setError(e)).finally(() => setIsLoading(false));
  }, []);
  react.useEffect(() => load(), [load]);
  const run = async (p) => {
    setError(null);
    try {
      const c = await p;
      setCart(c);
      return c;
    } catch (e) {
      setError(e);
      throw e;
    }
  };
  return {
    cart,
    isLoading,
    error,
    reload: load,
    addItem: (input) => run(actions__namespace.addItemAction(input)),
    updateLine: (lineId, input) => run(actions__namespace.updateLineAction(lineId, input)),
    removeItem: (lineId) => run(actions__namespace.removeItemAction(lineId)),
    setDelivery: (input) => run(actions__namespace.setCartDeliveryAction(input)),
    setComment: (comment) => run(actions__namespace.setCartCommentAction(comment)),
    reorder: (orderReference) => run(actions__namespace.reorderAction(orderReference))
  };
}
function useDocuments(filters) {
  return useQuery(
    () => actions__namespace.getDocumentsAction(filters),
    [JSON.stringify(filters ?? {})]
  );
}
function useDocument(id, type) {
  return useQuery(
    () => actions__namespace.getDocumentAction(id, type),
    [id, type]
  );
}
function useAddToCart() {
  const [isLoading, setIsLoading] = react.useState(false);
  const [error, setError] = react.useState(null);
  const single = useSingleFlight();
  return {
    isLoading,
    error,
    // Anti-double-clic : un seul ajout en vol (évite +2 sur double-clic rapide).
    addItem: (input) => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions__namespace.addItemAction(input);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    })
  };
}
function useAuth() {
  const [user, setUser] = react.useState(null);
  const [isLoading, setIsLoading] = react.useState(true);
  const [error, setError] = react.useState(null);
  const reload = react.useCallback(async () => {
    setError(null);
    try {
      setUser(await actions__namespace.meAction());
    } catch (e) {
      setError(e);
    }
  }, []);
  react.useEffect(() => {
    actions__namespace.meAction().then((u) => setUser(u)).catch((e) => setError(e)).finally(() => setIsLoading(false));
  }, []);
  return {
    user,
    isLoading,
    error,
    reload,
    login: async (input) => {
      setError(null);
      const result = await actions__namespace.loginAction(input);
      if ("user" in result) setUser(result.user);
      return result;
    },
    logout: async () => {
      await actions__namespace.logoutAction();
      setUser(null);
    }
  };
}
function useCompany() {
  const { user } = useAuth();
  const [activeId, setActiveId] = react.useState(null);
  const [isSwitching, setIsSwitching] = react.useState(false);
  react.useEffect(() => {
    actions__namespace.getActiveCompanyAction().then(setActiveId).catch(() => setActiveId(null));
  }, []);
  return {
    companies: (user == null ? void 0 : user.memberships) ?? [],
    activeId,
    isSwitching,
    switchTo: async (customerId) => {
      var _a;
      if (customerId === activeId) return;
      setIsSwitching(true);
      try {
        await actions__namespace.setActiveCompanyAction(customerId);
        setActiveId(customerId);
        (_a = globalThis.location) == null ? void 0 : _a.reload();
      } finally {
        setIsSwitching(false);
      }
    }
  };
}
function useCheckout() {
  const [isLoading, setIsLoading] = react.useState(false);
  const [error, setError] = react.useState(null);
  const single = useSingleFlight();
  return {
    isLoading,
    error,
    /** Soumet le panier pour validation commerciale (status PENDING). */
    createOrder: () => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions__namespace.createOrderAction();
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }),
    /** Valide sans payer : crée le document Sage (visible dans l'historique). */
    validateWithoutPayment: (input) => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions__namespace.createDocumentAction(input);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    })
  };
}
function usePayment() {
  const [isLoading, setIsLoading] = react.useState(false);
  const [error, setError] = react.useState(null);
  const single = useSingleFlight();
  return {
    isLoading,
    error,
    // Anti-double : un seul démarrage de paiement en vol (évite deux sessions).
    start: (input = {}) => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions__namespace.startPaymentAction(input);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    })
  };
}
function useDelivery() {
  const q = useQuery(
    () => actions__namespace.getDeliveryOptionsAction(),
    []
  );
  return {
    options: q.data,
    isLoading: q.isLoading,
    error: q.error,
    reload: q.reload,
    addAddress: async (input) => {
      const addr = await actions__namespace.addDeliveryAddressAction(input);
      q.reload();
      return addr;
    },
    updateAddress: async (input) => {
      const addr = await actions__namespace.updateDeliveryAddressAction(input);
      q.reload();
      return addr;
    }
  };
}
function useAccount() {
  const [isLoading, setIsLoading] = react.useState(false);
  const [error, setError] = react.useState(null);
  const wrap = async (p) => {
    setIsLoading(true);
    setError(null);
    try {
      return await p;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    isLoading,
    error,
    register: (input) => wrap(actions__namespace.registerAction(input)),
    requestPasswordReset: (email) => wrap(actions__namespace.requestPasswordResetAction({ email })),
    verifyResetCode: (email, code) => wrap(actions__namespace.verifyResetCodeAction({ email, code })),
    changePassword: (input) => wrap(actions__namespace.changePasswordAction(input)),
    /** Met à jour nom/email du compte connecté ; pense à `useAuth().reload()`
     *  ensuite pour rafraîchir l'utilisateur affiché (nav, page compte). */
    updateProfile: (input) => wrap(actions__namespace.updateProfileAction(input))
  };
}
function useSupport() {
  const [isLoading, setIsLoading] = react.useState(false);
  const [error, setError] = react.useState(null);
  return {
    isLoading,
    error,
    createTicket: async (input) => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions__namespace.createTicketAction(input);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }
  };
}

exports.useAccount = useAccount;
exports.useAddToCart = useAddToCart;
exports.useArticle = useArticle;
exports.useArticles = useArticles;
exports.useAuth = useAuth;
exports.useCart = useCart;
exports.useCheckout = useCheckout;
exports.useCompany = useCompany;
exports.useDelivery = useDelivery;
exports.useDocument = useDocument;
exports.useDocuments = useDocuments;
exports.usePayment = usePayment;
exports.useShopContext = useShopContext;
exports.useSupport = useSupport;
