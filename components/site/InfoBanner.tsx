import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Bandeau d'information contextuel (onboarding visiteur) : un indice + une action
 * facultative. Sert à guider le client B2B (« connectez-vous pour vos tarifs »,
 * « compte en attente de validation »…). Réutilisable par l'agent.
 *
 * `tone` : `brand` (mise en avant) ou `muted` (neutre, moins appuyé).
 */
export function InfoBanner({
  icon,
  children,
  action,
  tone = 'brand'
}: {
  icon?: ReactNode;
  children: ReactNode;
  action?: { label: string; href: string };
  tone?: 'brand' | 'muted';
}) {
  const styles =
    tone === 'brand'
      ? 'border-[var(--brand)]/25 bg-[var(--brand-light)] text-[var(--brand-dark)]'
      : 'border-neutral-200 bg-neutral-50 text-neutral-600';

  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-lg border px-4 py-3 text-sm sm:flex-row sm:items-center ${styles}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <p className="flex-1">{children}</p>
      {action && (
        <Link
          href={action.href}
          className="btn-primary shrink-0 !px-3 !py-1.5 text-xs"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
