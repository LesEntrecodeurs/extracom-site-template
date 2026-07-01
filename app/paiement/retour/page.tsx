import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RetourPaiementPage({
  searchParams
}: {
  searchParams: Promise<{ paymentStatus?: string }>;
}) {
  const { paymentStatus } = await searchParams;
  const success = paymentStatus === 'success';

  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">
        {success ? 'Paiement réussi ✓' : 'Paiement non abouti'}
      </h1>
      <p className="mt-4 text-neutral-600">
        {success
          ? 'Votre commande a été enregistrée. Merci !'
          : 'Le paiement a échoué ou a été annulé.'}
      </p>
      <Link
        href={success ? '/compte' : '/panier'}
        className="mt-8 inline-block rounded bg-[var(--brand)] px-6 py-3 text-white"
      >
        {success ? 'Voir mon compte' : 'Retour au panier'}
      </Link>
    </div>
  );
}
