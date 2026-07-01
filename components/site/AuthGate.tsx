'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@extracom/site-kit/react';
import { PageLoader } from '@/components/site/Loader';

/**
 * Réserve l'accès aux clients connectés. Tant que l'utilisateur n'est pas
 * authentifié, `children` n'est PAS monté — donc les hooks data (panier,
 * livraison…) qu'il contient ne s'exécutent pas (pas d'appel 403 inutile).
 * Après connexion, l'utilisateur est renvoyé sur la page d'origine.
 */
export function AuthGate({
  children,
  message = 'Connectez-vous pour continuer.'
}: {
  children: ReactNode;
  message?: string;
}) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return <PageLoader />;

  if (!user)
    return (
      <div className="card p-10 text-center">
        <p className="text-neutral-600">{message}</p>
        <Link
          href={`/connexion?redirect=${encodeURIComponent(pathname)}`}
          className="btn-primary mt-4 inline-block"
        >
          Se connecter
        </Link>
      </div>
    );

  return <>{children}</>;
}
