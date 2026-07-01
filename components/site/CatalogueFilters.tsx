'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpDown, Layers, X } from 'lucide-react';
import type { ArticleSort, Family } from '@extracom/site-kit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Current {
  q?: string;
  family?: string;
  /** Catalogue actif (posé via le menu de la navbar). */
  catalog?: string;
  clevel?: string;
  sort?: string;
  /** Fourchette de prix (sur le prix de base). */
  pmin?: string;
  pmax?: string;
}

const ALL = 'all'; // Radix interdit les <SelectItem value="">.

const SORTS: { value: ArticleSort; label: string }[] = [
  { value: 'name_asc', label: 'Nom (A → Z)' },
  { value: 'name_desc', label: 'Nom (Z → A)' },
  { value: 'ref_asc', label: 'Référence (A → Z)' },
  { value: 'ref_desc', label: 'Référence (Z → A)' }
];

/**
 * Filtres catalogue : famille + tri. Le filtre par catalogue se fait désormais
 * via le menu de la navbar (depth 1 → depth 2 au survol), qui pose `?catalog`
 * dans l'URL — on le conserve simplement ici, et on l'inclut dans le bouton
 * « Réinitialiser ».
 */
export function CatalogueFilters({
  families,
  current,
  activeCatalogLabel
}: {
  families: Family[];
  current: Current;
  /** Libellé résolu du catalogue actif (posé via le menu navbar), si présent. */
  activeCatalogLabel?: string;
}) {
  const router = useRouter();
  const [pmin, setPmin] = useState(current.pmin ?? '');
  const [pmax, setPmax] = useState(current.pmax ?? '');

  const apply = (patch: Partial<Current>) => {
    const next = { ...current, ...patch };
    const p = new URLSearchParams();
    if (next.q) p.set('q', next.q);
    if (next.family) p.set('family', next.family);
    if (next.catalog) {
      p.set('catalog', next.catalog);
      if (next.clevel) p.set('clevel', next.clevel);
    }
    if (next.sort) p.set('sort', next.sort);
    if (next.pmin) p.set('pmin', next.pmin);
    if (next.pmax) p.set('pmax', next.pmax);
    const qs = p.toString();
    router.push(qs ? `/catalogue?${qs}` : '/catalogue');
  };

  const hasActiveFilter = !!(
    current.family ||
    current.catalog ||
    current.pmin ||
    current.pmax
  );

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2.5">
      {/* Catégorie active (posée via le menu navbar) — puce retirable dédiée,
          en plus du « Réinitialiser » global. */}
      {activeCatalogLabel && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-light)] py-1.5 pr-2 pl-3 text-sm font-medium text-[var(--brand-dark)]">
          {activeCatalogLabel}
          <button
            type="button"
            onClick={() => apply({ catalog: undefined, clevel: undefined })}
            aria-label="Retirer le filtre catégorie"
            className="rounded-full p-0.5 hover:bg-black/5"
          >
            <X className="size-3.5" />
          </button>
        </span>
      )}

      {families.length > 0 && (
        <Select
          value={current.family ?? ALL}
          onValueChange={(v) => apply({ family: v === ALL ? undefined : v })}
        >
          <SelectTrigger className="w-[190px]">
            <Layers className="size-4 text-neutral-400" />
            <SelectValue placeholder="Famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toutes les familles</SelectItem>
            {families.map((f) => (
              <SelectItem key={f.code} value={f.code}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Fourchette de prix (sur le prix de base) */}
      <form
        className="flex items-center gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ pmin: pmin || undefined, pmax: pmax || undefined });
        }}
      >
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={pmin}
          onChange={(e) => setPmin(e.target.value)}
          placeholder="Min €"
          className="field w-[90px]"
          aria-label="Prix minimum"
        />
        <span className="text-neutral-400">–</span>
        <input
          type="number"
          min={0}
          inputMode="decimal"
          value={pmax}
          onChange={(e) => setPmax(e.target.value)}
          placeholder="Max €"
          className="field w-[90px]"
          aria-label="Prix maximum"
        />
        <Button type="submit" variant="outline" size="sm">
          OK
        </Button>
      </form>

      {/* Tri — toujours disponible */}
      <Select
        value={current.sort ?? 'name_asc'}
        onValueChange={(v) => apply({ sort: v })}
      >
        <SelectTrigger className="ml-auto w-[185px]">
          <ArrowUpDown className="size-4 text-neutral-400" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORTS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-500"
          onClick={() => {
            setPmin('');
            setPmax('');
            apply({
              family: undefined,
              catalog: undefined,
              clevel: undefined,
              pmin: undefined,
              pmax: undefined
            });
          }}
        >
          <X className="size-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
