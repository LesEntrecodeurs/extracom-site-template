'use client';

import { useCompany, useShopContext } from '@extracom/site-kit/react';
import { Spinner } from '@/components/site/Loader';

/**
 * Sélecteur d'entreprise (compte client). N'apparaît que si l'utilisateur est
 * rattaché à plusieurs sociétés sur cette boutique. Changer de société recharge
 * la page → prix, panier et commandes suivent la société choisie.
 */
export function CompanySwitcher() {
  const { data: context } = useShopContext();
  const { companies, activeId, isSwitching, switchTo } = useCompany();

  const shopName = context?.shopName;
  const list = shopName
    ? companies.filter((c) => c.shopName === shopName)
    : companies;

  if (list.length <= 1) return null;

  return (
    <div className="card p-3">
      <label className="text-xs font-medium text-neutral-500">Société</label>
      <select
        className="field mt-1 w-full truncate"
        value={activeId ?? ''}
        disabled={isSwitching}
        title={
          list.find((c) => c.customerId === activeId)?.companyName ??
          undefined
        }
        onChange={(e) => switchTo(e.target.value)}
      >
        {list.map((c) => (
          <option
            key={c.customerId}
            value={c.customerId}
            title={c.companyName ?? c.customerId}
          >
            {c.companyName?.trim() || c.customerId}
          </option>
        ))}
      </select>
      {isSwitching && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <Spinner className="h-3 w-3" />
          Changement en cours…
        </p>
      )}
    </div>
  );
}
