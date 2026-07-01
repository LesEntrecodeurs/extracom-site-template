import Link from 'next/link';
import type { ShopContext, User } from '@extracom/site-kit';
import { CartLink } from './CartLink';
import { CategoryMenu } from './CategoryMenu';

export function Nav({
  context,
  user
}: {
  context: ShopContext | null;
  user?: User | null;
}) {
  const title = context?.branding?.name ?? context?.shopName ?? 'Boutique';
  const categories = context?.catalogTree?.slice(0, 8) ?? [];
  const firstName = user?.name?.split(' ')[0];

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="bg-[var(--brand-dark)] text-center text-xs text-white">
        <div className="container-x py-1.5">
          Livraison rapide · Tarifs négociés pour les professionnels
        </div>
      </div>

      <div className="border-b border-neutral-200">
        <div className="container-x flex h-16 items-center gap-6">
          <Link
            href="/"
            className="shrink-0 text-lg font-semibold tracking-tight"
          >
            {title}
          </Link>

          <form action="/catalogue" className="hidden flex-1 md:block">
            <div className="relative max-w-md">
              <SearchIcon className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
              <input
                name="q"
                placeholder="Rechercher un article…"
                aria-label="Rechercher un article"
                className="field pl-9"
              />
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-5 text-sm">
            <Link
              href="/catalogue"
              className="hidden font-medium text-neutral-700 hover:text-[var(--brand-dark)] sm:inline"
            >
              Catalogue
            </Link>

            {user ? (
              <CartLink />
            ) : (
              <Link
                href="/panier"
                className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900"
              >
                <CartIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Panier</span>
              </Link>
            )}

            {user ? (
              <Link
                href="/compte"
                className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900"
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {firstName ? `Bonjour, ${firstName}` : 'Mon compte'}
                </span>
              </Link>
            ) : (
              <Link href="/connexion" className="btn-primary !px-4 !py-2">
                Connexion
              </Link>
            )}
          </nav>
        </div>

        <CategoryMenu categories={categories} />
      </div>
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  );
}
function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path
        d="M2 3h3l2.4 12.4a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
