import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez notre équipe : email, téléphone et adresse.',
  alternates: { canonical: '/contact' }
};

/**
 * Page contact — coordonnées statiques (server-rendered, éditables par l'agent :
 * remplace-les par celles du shop) + un formulaire de ticket support pour les
 * utilisateurs connectés (`<ContactForm/>`, via `useSupport` du kit). Ne pas
 * remplacer l'appel kit par un `fetch` direct.
 */
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Nous contacter</h1>
      <p className="mt-2 text-neutral-600">
        Une question sur le catalogue, une commande ou votre compte ? Notre
        équipe vous répond.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {coordonnees.map((c) => (
          <div key={c.label} className="card p-4">
            <span className="text-[var(--brand)]">{c.icon}</span>
            <p className="mt-2 text-sm font-medium">{c.label}</p>
            {c.href ? (
              <a
                href={c.href}
                className="mt-0.5 block text-sm text-neutral-600 hover:text-[var(--brand-dark)]"
              >
                {c.value}
              </a>
            ) : (
              <p className="mt-0.5 text-sm text-neutral-600">{c.value}</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        Horaires : du lundi au vendredi, 9h–18h.
      </p>

      <ContactForm />
    </div>
  );
}

// ⤵ Coordonnées à personnaliser pour le shop.
const coordonnees = [
  {
    label: 'Email',
    value: 'contact@exemple.fr',
    href: 'mailto:contact@exemple.fr',
    icon: <Mail className="size-6" />
  },
  {
    label: 'Téléphone',
    value: '01 23 45 67 89',
    href: 'tel:+33123456789',
    icon: <Phone className="size-6" />
  },
  {
    label: 'Adresse',
    value: '1 rue de l’Exemple, 75000 Paris',
    href: undefined,
    icon: <MapPin className="size-6" />
  }
];
