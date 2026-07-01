import { getContextAction } from '@extracom/site-kit/server';
import type { TermsDocument } from '@extracom/site-kit';
import { RegisterForm } from '@/components/site/RegisterForm';

export const dynamic = 'force-dynamic';

export default async function InscriptionPage() {
  let terms: TermsDocument[] = [];
  try {
    const ctx = await getContextAction();
    terms = ctx.terms ?? [];
  } catch {
    terms = [];
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Créer un compte</h1>
      <RegisterForm terms={terms} />
    </div>
  );
}
