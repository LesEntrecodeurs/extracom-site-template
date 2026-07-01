import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales et informations sur l’éditeur du site.',
  alternates: { canonical: '/mentions-legales' }
};

/**
 * Mentions légales — contenu statique éditable par l'agent. Remplace les
 * champs entre crochets par les informations réelles du shop (éditeur,
 * hébergeur, etc.). Contenu indicatif, à faire valider juridiquement.
 */
export default function MentionsLegalesPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Mentions légales</h1>

      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="text-lg font-semibold">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-neutral-600">
            {s.body}
          </p>
        </section>
      ))}
    </article>
  );
}

// ⤵ À personnaliser pour le shop puis faire valider juridiquement.
const sections = [
  {
    title: 'Éditeur du site',
    body: `[Raison sociale] — [Forme juridique] au capital de [montant] €.
Siège social : [adresse]. SIREN : [numéro]. TVA intracom. : [numéro].
Directeur de la publication : [nom].`
  },
  {
    title: 'Hébergement',
    body: `Ce site est hébergé par [hébergeur], [adresse de l’hébergeur].`
  },
  {
    title: 'Propriété intellectuelle',
    body: `L’ensemble des contenus (textes, images, marques, logos) est protégé.
Toute reproduction sans autorisation préalable est interdite.`
  },
  {
    title: 'Données personnelles',
    body: `Les données collectées lors de la création de compte et des commandes
sont utilisées pour le traitement de la relation commerciale. Conformément au
RGPD, vous disposez d’un droit d’accès, de rectification et de suppression en
écrivant à [email de contact].`
  }
];
