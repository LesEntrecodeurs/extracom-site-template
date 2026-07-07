import { ImageResponse } from 'next/og';
import { getContextAction } from '@extracom/site-kit/server';

// Image OpenGraph générée dynamiquement (réseaux sociaux + aperçus). Convention
// Next : ce fichier produit l'image partagée pour la racine du site.
export const runtime = 'nodejs';
export const alt = 'Boutique en ligne pour professionnels';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  let name = 'Boutique';
  const tagline = 'Commande en ligne pour les professionnels';
  try {
    const ctx = await getContextAction();
    name = ctx.branding?.name ?? ctx.shopName ?? name;
  } catch {
    // Dégrade proprement si le contexte n'est pas disponible au build.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1d9e75 0%, #0f6e56 100%)',
          color: 'white',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>{name}</div>
        <div style={{ fontSize: 36, opacity: 0.9, marginTop: 16 }}>{tagline}</div>
      </div>
    ),
    { ...size }
  );
}
