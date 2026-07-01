'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAccount } from '@extracom/site-kit/react';

type Step = 'email' | 'code' | 'password';

export default function MotDePasseOubliePage() {
  const { requestPasswordReset, verifyResetCode, changePassword, isLoading } =
    useAccount();
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-2 text-2xl font-bold">Mot de passe oublié</h1>
      <p className="mb-6 text-sm text-neutral-500">
        {step === 'email' && 'Recevez un code de réinitialisation par email.'}
        {step === 'code' && 'Saisissez le code reçu par email.'}
        {step === 'password' && 'Choisissez un nouveau mot de passe.'}
      </p>

      {step === 'email' && (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await requestPasswordReset(email);
              toast.success('Code envoyé par email');
              setStep('code');
            } catch {
              setErr("Impossible d'envoyer le code. Vérifiez l'email.");
            }
          }}
        >
          <input
            type="email"
            required
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
          {err && (
            <p role="alert" className="text-sm text-red-600">
              {err}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '…' : 'Envoyer le code'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            try {
              await verifyResetCode(email, code);
              setStep('password');
            } catch {
              setErr('Code invalide ou expiré.');
            }
          }}
        >
          <input
            required
            placeholder="Code reçu par email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="field"
          />
          {err && (
            <p role="alert" className="text-sm text-red-600">
              {err}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '…' : 'Vérifier'}
          </button>
          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-sm text-neutral-500 hover:underline"
          >
            ← Renvoyer un code
          </button>
        </form>
      )}

      {step === 'password' && (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            if (password !== confirm) {
              setErr('Les mots de passe ne correspondent pas.');
              return;
            }
            try {
              await changePassword({ email, code, newPassword: password });
              toast.success('Mot de passe mis à jour');
              router.push('/connexion');
            } catch {
              setErr('La réinitialisation a échoué.');
            }
          }}
        >
          <input
            type="password"
            required
            minLength={8}
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
          <input
            type="password"
            required
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="field"
          />
          {err && (
            <p role="alert" className="text-sm text-red-600">
              {err}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? '…' : 'Réinitialiser'}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-neutral-600">
        <Link href="/connexion" className="text-[var(--brand-dark)] underline">
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
