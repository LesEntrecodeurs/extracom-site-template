'use client';

import { useState } from 'react';
import type { AddDeliveryAddressInput } from '@extracom/site-kit';

export function AddressForm({
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
  initial
}: {
  onSubmit: (a: AddDeliveryAddressInput) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  /** Valeurs initiales (mode édition). */
  initial?: Partial<AddDeliveryAddressInput>;
}) {
  const [f, setF] = useState<AddDeliveryAddressInput>({
    label: initial?.label ?? '',
    line1: initial?.line1 ?? '',
    line2: initial?.line2 ?? '',
    postalCode: initial?.postalCode ?? '',
    city: initial?.city ?? '',
    country: initial?.country ?? 'FR',
    contactName: initial?.contactName ?? '',
    phone: initial?.phone ?? ''
  });
  const [pending, setPending] = useState(false);
  const set =
    (k: keyof AddDeliveryAddressInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setF({ ...f, [k]: e.target.value });

  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        try {
          await onSubmit(f);
        } finally {
          setPending(false);
        }
      }}
    >
      <input
        className="field"
        aria-label="Libellé de l'adresse"
        placeholder="Libellé (ex. Siège)"
        value={f.label}
        onChange={set('label')}
      />
      <input
        className="field"
        aria-label="Nom du contact"
        placeholder="Contact (ex. Service réception)"
        value={f.contactName}
        onChange={set('contactName')}
      />
      <input
        className="field"
        required
        aria-label="Adresse"
        placeholder="Adresse"
        value={f.line1}
        onChange={set('line1')}
      />
      <input
        className="field"
        aria-label="Complément d'adresse"
        placeholder="Complément (bâtiment, étage…)"
        value={f.line2}
        onChange={set('line2')}
      />
      <div className="flex gap-2">
        <input
          className="field w-28"
          required
          aria-label="Code postal"
          placeholder="Code postal"
          value={f.postalCode}
          onChange={set('postalCode')}
        />
        <input
          className="field flex-1"
          required
          aria-label="Ville"
          placeholder="Ville"
          value={f.city}
          onChange={set('city')}
        />
        <input
          className="field w-20"
          required
          aria-label="Pays"
          placeholder="Pays"
          value={f.country}
          onChange={set('country')}
        />
      </div>
      <input
        className="field"
        aria-label="Téléphone"
        placeholder="Téléphone"
        value={f.phone}
        onChange={set('phone')}
      />
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={pending} className="btn-primary !py-2">
          {pending ? '…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-neutral-500"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
