'use client';

import Link from 'next/link';
import { useAuth } from '@extracom/site-kit/react';

export default function ComptePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Bonjour {user?.name ?? ''}
      </h1>
      <p className="mt-1 text-neutral-500">{user?.email}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Tile href="/compte/profil" title="Profil" desc="Vos informations" />
        <Tile href="/compte/adresses" title="Adresses" desc="Livraison & facturation" />
        <Tile href="/compte/commandes" title="Commandes" desc="Votre historique" />
      </div>
    </div>
  );
}

function Tile({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card p-4">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-neutral-500">{desc}</p>
    </Link>
  );
}
