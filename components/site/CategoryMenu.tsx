import Link from 'next/link';
import type { CatalogNode } from '@extracom/site-kit';

/** Lien catalogue d'un nœud (porte l'id + le niveau → colonne CL_No<niveau>). */
function catHref(node: CatalogNode): string {
  return `/catalogue?catalog=${node.id}&clevel=${node.level}`;
}

function ChevronDown() {
  return (
    <svg
      className="h-3 w-3 text-neutral-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-neutral-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Entrée de catalogue imbriquée (niveau ≥ 2). Au survol, déploie ses enfants en
 * **flyout vers la droite**, récursivement à profondeur arbitraire. 100% CSS via
 * `group/cat` : chaque nœud rouvre uniquement SES enfants (les groupes nommés
 * Tailwind résolvent au plus proche ancêtre), donc les ancêtres restent ouverts
 * tant qu'on survole la cascade.
 */
function CatalogBranch({ node }: { node: CatalogNode }) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <div className="group/cat relative">
      <Link
        href={catHref(node)}
        className="flex items-center justify-between gap-3 rounded px-3 py-1.5 text-sm text-neutral-700 group-hover/cat:bg-neutral-100 hover:bg-neutral-100 hover:text-[var(--brand-dark)]"
      >
        <span className="truncate">{node.label}</span>
        {hasChildren && <ChevronRight />}
      </Link>

      {hasChildren && (
        <div className="absolute top-0 left-full z-40 hidden min-w-[220px] pl-1 group-hover/cat:block">
          <div className="rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
            <Link
              href={catHref(node)}
              className="block rounded px-3 py-1.5 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
            >
              Tout « {node.label} »
            </Link>
            <div className="my-1 border-t border-neutral-100" />
            {children.map((sub) => (
              <CatalogBranch key={sub.id} node={sub} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Menu catalogue de la navbar. Le niveau 1 est affiché en ligne ; au survol
 * d'une entrée, son panneau d'enfants se déploie **vers le bas**, et chaque
 * sous-entrée déploie ensuite ses propres enfants **vers la droite** en cascade
 * (cf. {@link CatalogBranch}). 100% CSS — pas d'état, fonctionne au hover.
 */
export function CategoryMenu({ categories }: { categories: CatalogNode[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="border-t border-neutral-100">
      <div className="container-x flex flex-wrap items-center gap-x-1 gap-y-1 py-1 text-sm text-neutral-600">
        <Link
          href="/catalogue"
          className="rounded px-2 py-1.5 font-medium hover:bg-neutral-100 hover:text-[var(--brand-dark)]"
        >
          Tout le catalogue
        </Link>

        {categories.map((cat) => {
          const children = cat.children ?? [];
          const hasChildren = children.length > 0;

          return (
            <div key={cat.id} className="group/top relative">
              <Link
                href={catHref(cat)}
                className="flex items-center gap-1 rounded px-2 py-1.5 group-hover/top:text-[var(--brand-dark)] hover:bg-neutral-100 hover:text-[var(--brand-dark)]"
              >
                {cat.label}
                {hasChildren && <ChevronDown />}
              </Link>

              {hasChildren && (
                <div className="absolute top-full left-0 z-30 hidden min-w-[240px] pt-1 group-hover/top:block">
                  <div className="rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
                    <Link
                      href={catHref(cat)}
                      className="block rounded px-3 py-1.5 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
                    >
                      Tout « {cat.label} »
                    </Link>
                    <div className="my-1 border-t border-neutral-100" />
                    {children.map((sub) => (
                      <CatalogBranch key={sub.id} node={sub} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
