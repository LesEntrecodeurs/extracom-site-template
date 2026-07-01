'use client';

import Link from 'next/link';
import { useCart } from '@extracom/site-kit/react';

/** Lien panier avec compteur d'articles (somme des quantités). Connecté seul. */
export function CartLink() {
  const { cart } = useCart();
  const count =
    cart?.lines?.reduce((n, l) => n + (l.quantity ?? 0), 0) ?? 0;

  return (
    <Link
      href="/panier"
      className="relative flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900"
    >
      <span className="relative">
        <CartIcon className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--brand)] px-1 text-[10px] font-semibold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">Panier</span>
    </Link>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
