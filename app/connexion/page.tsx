'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useShopContext } from '@extracom/site-kit/react';

export default function ConnexionPage() {
  const { login } = useAuth();
  const { data: context } = useShopContext();
  const registrationOpen = context?.capabilities?.registrationOpen ?? false;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setErr(null);
          try {
            const res = await login({ email, password });
            if ('user' in res) {
              const redirect =
                new URLSearchParams(window.location.search).get('redirect') ||
                '/compte';
              router.push(redirect);
            } else {
              // Changement de mot de passe imposé → on bascule sur le flux reset.
              router.push(
                `/mot-de-passe-oublie?email=${encodeURIComponent(email)}`
              );
            }
          } catch {
            setErr('Identifiants invalides.');
          } finally {
            setPending(false);
          }
        }}
      >
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
        {err && (
          <p role="alert" className="text-sm text-red-600">
            {err}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-[var(--brand)] py-2 text-white disabled:opacity-50"
        >
          {pending ? '…' : 'Se connecter'}
        </button>
      </form>
      {registrationOpen && (
        <p className="mt-4 text-sm text-neutral-600">
          Pas de compte ?{' '}
          <Link
            href="/inscription"
            className="text-[var(--brand-dark)] underline"
          >
            Créer un compte
          </Link>
        </p>
      )}
      <p className="mt-1 text-sm text-neutral-600">
        <Link
          href="/mot-de-passe-oublie"
          className="text-[var(--brand-dark)] underline"
        >
          Mot de passe oublié ?
        </Link>
      </p>
    </div>
  );
}
