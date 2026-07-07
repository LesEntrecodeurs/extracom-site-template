'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useDocument, useCart } from '@extracom/site-kit/react';
import { getDocumentPdfAction } from '@extracom/site-kit/server';
import { formatPrice, formatDate } from '@extracom/site-kit';
import { PageLoader } from '@/components/site/Loader';

async function downloadPdf(documentId: string, type: string, filename: string) {
  const { base64, contentType } = await getDocumentPdfAction(documentId, type);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: contentType }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DocumentPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const typeParam = useSearchParams().get('type') ?? undefined;
  const { data: doc, isLoading } = useDocument(
    decodeURIComponent(id),
    typeParam
  );
  const { reorder } = useCart();
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  if (isLoading) return <PageLoader label="Chargement du document…" />;
  if (!doc) return <p>Document introuvable.</p>;

  // Code type pour le PDF/lignes : param d'URL en priorité, sinon celui du doc.
  const typeCode = typeParam ?? doc.typeCode?.toString() ?? '';

  return (
    <div className="max-w-xl">
      <Link
        href="/compte/commandes"
        className="text-sm text-neutral-500 hover:underline"
      >
        ← Mes commandes
      </Link>
      <h1 className="mt-2 text-xl font-semibold">{doc.reference}</h1>
      <p className="text-sm text-neutral-500">
        {doc.type} · {formatDate(doc.date)}
        {doc.status ? ` · ${doc.status}` : ''}
      </p>

      {doc.deliveryAddress && (
        <p className="mt-1 text-sm text-neutral-500">
          Livraison : {doc.deliveryAddress}
        </p>
      )}

      <ul className="card mt-4 divide-y divide-neutral-100 text-sm">
        {doc.lines.map((l, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: référence produit non garantie unique sur la commande
          <li key={`${l.reference}-${i}`} className="flex justify-between p-3">
            <span>
              {l.label ?? l.reference} × {l.quantity}
            </span>
            <span>{formatPrice(l.lineTotalInclVat ?? null)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex justify-between text-lg font-semibold">
        <span>Total TTC</span>
        <span>{formatPrice(doc.totalInclVat ?? null)}</span>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={async () => {
            await reorder(doc.orderReference ?? doc.reference);
            router.push('/panier');
          }}
          className="btn-primary"
        >
          Recommander
        </button>
        <button
          type="button"
          disabled={downloading}
          onClick={async () => {
            setDownloading(true);
            try {
              await downloadPdf(doc.id, typeCode, `${doc.reference}.pdf`);
            } catch {
              toast.error('Le téléchargement du PDF a échoué.');
            } finally {
              setDownloading(false);
            }
          }}
          className="btn-outline"
        >
          {downloading ? 'Préparation…' : 'Télécharger le PDF'}
        </button>
      </div>
    </div>
  );
}
