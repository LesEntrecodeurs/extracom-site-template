import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type Article } from '@extracom/site-kit';
import { AddToCart } from './AddToCart';

export function ArticleCard({ article }: { article: Article }) {
  const href = `/produit/${encodeURIComponent(article.reference)}`;
  const hasVariants = (article.gammes ?? []).some((g) => g.items.length > 0);
  const hasPromo =
    article.promotion != null &&
    article.basePrice != null &&
    article.price != null &&
    article.basePrice > article.price;

  return (
    <div className="group card flex flex-col overflow-hidden">
      <Link href={href} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          <Image
            src={article.imageUrl || '/placeholder.svg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          {hasPromo && (
            <span className="absolute top-2 left-2 rounded-full bg-[var(--brand)] px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
              Promo
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={href}>
          <h3 className="line-clamp-2 text-sm leading-snug font-medium hover:text-[var(--brand-dark)]">
            {article.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          {article.price == null ? (
            <span className="text-xs text-neutral-500">
              Connectez-vous pour voir le prix
            </span>
          ) : (
            <>
              <span className="font-semibold text-[var(--brand-dark)]">
                {formatPrice(article.price)}
              </span>
              {hasPromo && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(article.basePrice)}
                </span>
              )}
              {article.unit && (
                <span className="text-xs text-neutral-400">
                  / {article.unit}
                </span>
              )}
            </>
          )}
        </div>

        {hasVariants && (
          <p className="mt-1 text-xs text-neutral-500">
            {article.gammes!.map((g) => g.label).join(', ')} ·{' '}
            {article.gammes!.reduce((n, g) => n + g.items.length, 0)}{' '}
            déclinaisons
          </p>
        )}

        {/* Stock : la donnée est déjà façonnée par les settings côté serveur
            (absente / disponibilité / quantité exacte). On l'affiche telle quelle. */}
        {article.stockQuantity != null && (
          <p
            className={`mt-1 text-xs font-medium ${
              article.stockQuantity > 0
                ? 'text-[var(--brand-dark)]'
                : 'text-red-500'
            }`}
          >
            {article.stockQuantity > 0
              ? `En stock${article.stockQuantity > 1 ? ` (${article.stockQuantity})` : ''}`
              : 'Épuisé'}
          </p>
        )}

        <div className="mt-auto pt-3">
          {hasVariants ? (
            // Article à déclinaisons : on ne peut pas l'ajouter sans choisir
            // → renvoi vers la fiche pour sélectionner la déclinaison.
            <Link
              href={href}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
            >
              Choisir une déclinaison
            </Link>
          ) : (
            <AddToCart
              reference={article.reference}
              disabled={article.price == null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
