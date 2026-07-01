/** @type {import('next').NextConfig} */

// Hosts d'images distants autorisés par next/image. Le host média des photos
// produit (Sage) vient de l'env et DOIT correspondre au `images.url` de l'API.
// Ex. dev : EXTRACOM_MEDIA_HOST=192.168.10.21 / EXTRACOM_MEDIA_PROTOCOL=http
const mediaHost = process.env.EXTRACOM_MEDIA_HOST;
const remotePatterns = mediaHost
  ? [
      {
        protocol: process.env.EXTRACOM_MEDIA_PROTOCOL || 'https',
        hostname: mediaHost
      }
    ]
  : [];

const nextConfig = {
  // Le kit est vendored (dépendance `file:`) : on le laisse transpiler par Next
  // pour préserver les boundaries 'use client' / 'use server'.
  transpilePackages: ['@extracom/site-kit'],
  images: {
    // Ajoute ici les hosts d'images statiques externes si besoin.
    remotePatterns
  },
  experimental: {
    // Server actions du kit invoquées depuis les hooks.
    serverActions: { bodySizeLimit: '2mb' }
  }
};

export default nextConfig;
