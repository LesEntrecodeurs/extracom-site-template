/**
 * Loaders & skeletons réutilisables, alignés sur le design system du template
 * (cartes, couleurs de marque). Préférer les skeletons (qui épousent la forme
 * du contenu) au simple spinner pour les écrans de liste/détail.
 */

/** Spinner circulaire (hérite de la couleur courante via `currentColor`). */
export function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

/** Spinner centré + libellé, pour un état de chargement plein écran/section. */
export function PageLoader({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-neutral-400"
    >
      <Spinner className="h-7 w-7 text-[var(--brand)]" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Bloc gris animé (brique de base des skeletons). */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-neutral-200/80 ${className}`} />
  );
}

/** Liste façon « carte » avec lignes fantômes (commandes, adresses…). */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-neutral-100" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Grille de cartes produit (catalogue). */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

/** Détail produit : image + colonne d'infos. */
export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2" aria-hidden="true">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        <Skeleton className="h-10 w-full max-w-xs rounded-md" />
      </div>
    </div>
  );
}

/** Récap panier / commande : lignes + total. */
export function CartSkeleton() {
  return (
    <div className="card p-5" aria-hidden="true">
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
}
