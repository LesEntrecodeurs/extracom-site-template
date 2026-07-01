"use client";
import { useState, useCallback, useEffect, useRef } from 'react';
import * as actions from '@extracom/site-kit/server';

function useSingleFlight() {
  const inFlight = useRef(null);
  return useCallback((fn) => {
    if (inFlight.current) return inFlight.current;
    const p = fn().finally(() => {
      inFlight.current = null;
    });
    inFlight.current = p;
    return p;
  }, []);
}
function useQuery(fn, deps) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null
  });
  const run = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    fn().then((data) => setState({ data, isLoading: false, error: null })).catch((error) => setState({ data: null, isLoading: false, error }));
  }, deps);
  useEffect(() => run(), [run]);
  return { ...state, reload: run };
}
function useArticles(query) {
  return useQuery(
    () => actions.getArticlesAction(query),
    [JSON.stringify(query)]
  );
}
function useArticle(reference) {
  return useQuery(
    () => actions.getArticleAction(reference),
    [reference]
  );
}
function useShopContext() {
  return useQuery(() => actions.getContextAction(), []);
}
function useCart() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = useCallback(() => {
    setIsLoading(true);
    actions.getCartAction().then((c) => setCart(c)).catch((e) => setError(e)).finally(() => setIsLoading(false));
  }, []);
  useEffect(() => load(), [load]);
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
    addItem: (input) => run(actions.addItemAction(input)),
    updateLine: (lineId, input) => run(actions.updateLineAction(lineId, input)),
    removeItem: (lineId) => run(actions.removeItemAction(lineId)),
    setDelivery: (input) => run(actions.setCartDeliveryAction(input)),
    setComment: (comment) => run(actions.setCartCommentAction(comment)),
    reorder: (orderReference) => run(actions.reorderAction(orderReference))
  };
}
function useDocuments(filters) {
  return useQuery(
    () => actions.getDocumentsAction(filters),
    [JSON.stringify(filters ?? {})]
  );
}
function useDocument(id, type) {
  return useQuery(
    () => actions.getDocumentAction(id, type),
    [id, type]
  );
}
function useAddToCart() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const single = useSingleFlight();
  return {
    isLoading,
    error,
    // Anti-double-clic : un seul ajout en vol (évite +2 sur double-clic rapide).
    addItem: (input) => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions.addItemAction(input);
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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const reload = useCallback(async () => {
    setError(null);
    try {
      setUser(await actions.meAction());
    } catch (e) {
      setError(e);
    }
  }, []);
  useEffect(() => {
    actions.meAction().then((u) => setUser(u)).catch((e) => setError(e)).finally(() => setIsLoading(false));
  }, []);
  return {
    user,
    isLoading,
    error,
    reload,
    login: async (input) => {
      setError(null);
      const result = await actions.loginAction(input);
      if ("user" in result) setUser(result.user);
      return result;
    },
    logout: async () => {
      await actions.logoutAction();
      setUser(null);
    }
  };
}
function useCompany() {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  useEffect(() => {
    actions.getActiveCompanyAction().then(setActiveId).catch(() => setActiveId(null));
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
        await actions.setActiveCompanyAction(customerId);
        setActiveId(customerId);
        (_a = globalThis.location) == null ? void 0 : _a.reload();
      } finally {
        setIsSwitching(false);
      }
    }
  };
}
function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const single = useSingleFlight();
  return {
    isLoading,
    error,
    /** Soumet le panier pour validation commerciale (status PENDING). */
    createOrder: () => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions.createOrderAction();
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
        return await actions.createDocumentAction(input);
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const single = useSingleFlight();
  return {
    isLoading,
    error,
    // Anti-double : un seul démarrage de paiement en vol (évite deux sessions).
    start: (input = {}) => single(async () => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions.startPaymentAction(input);
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
    () => actions.getDeliveryOptionsAction(),
    []
  );
  return {
    options: q.data,
    isLoading: q.isLoading,
    error: q.error,
    reload: q.reload,
    addAddress: async (input) => {
      const addr = await actions.addDeliveryAddressAction(input);
      q.reload();
      return addr;
    },
    updateAddress: async (input) => {
      const addr = await actions.updateDeliveryAddressAction(input);
      q.reload();
      return addr;
    }
  };
}
function useAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    register: (input) => wrap(actions.registerAction(input)),
    requestPasswordReset: (email) => wrap(actions.requestPasswordResetAction({ email })),
    verifyResetCode: (email, code) => wrap(actions.verifyResetCodeAction({ email, code })),
    changePassword: (input) => wrap(actions.changePasswordAction(input)),
    /** Met à jour nom/email du compte connecté ; pense à `useAuth().reload()`
     *  ensuite pour rafraîchir l'utilisateur affiché (nav, page compte). */
    updateProfile: (input) => wrap(actions.updateProfileAction(input))
  };
}
function useSupport() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  return {
    isLoading,
    error,
    createTicket: async (input) => {
      setIsLoading(true);
      setError(null);
      try {
        return await actions.createTicketAction(input);
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    }
  };
}

export { useAccount, useAddToCart, useArticle, useArticles, useAuth, useCart, useCheckout, useCompany, useDelivery, useDocument, useDocuments, usePayment, useShopContext, useSupport };
