'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';

/**
 * Bannière de consentement cookies (RGPD). La vitrine n'utilise que des cookies
 * **nécessaires** (session brokerée, panier) — exemptés de consentement — donc
 * c'est une bannière **informative** : on informe + on garde la trace de
 * l'acceptation (localStorage) pour ne plus la réafficher. Si l'agent ajoute des
 * cookies non essentiels (analytics, marketing), il faudra un vrai opt-in
 * (refus + catégories) avant de les poser.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* localStorage indisponible (mode privé strict) → on n'affiche pas */
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur"
    >
      <div className="container-x flex flex-col items-start gap-3 py-4 text-sm text-neutral-600 sm:flex-row sm:items-center">
        <p className="flex-1">
          Ce site utilise uniquement des cookies nécessaires à son
          fonctionnement (session, panier). En poursuivant votre navigation,
          vous les acceptez.{' '}
          <Link
            href="/mentions-legales"
            className="text-[var(--brand-dark)] underline"
          >
            En savoir plus
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="btn-primary shrink-0 !py-2"
        >
          J'accepte
        </button>
      </div>
    </div>
  );
}
