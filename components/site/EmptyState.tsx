import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * État vide réutilisable (catalogue sans résultat, panier vide, historique
 * vide…) : icône optionnelle + titre + description + action facultative.
 * Centré dans une `.card`. Réutilise-le pour des états vides cohérents.
 */
export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="card flex flex-col items-center gap-3 p-10 text-center">
      {icon && <span className="text-neutral-300">{icon}</span>}
      <p className="font-medium text-neutral-700">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && (
        <Link href={action.href} className="btn-primary mt-1">
          {action.label}
        </Link>
      )}
    </div>
  );
}
