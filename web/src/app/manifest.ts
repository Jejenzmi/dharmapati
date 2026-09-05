import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PT. Dharmapati Putra Nusantara',
    short_name: 'Dharmapati',
    description: 'Jasa pengamanan, cleaning service, dan penyediaan tenaga kerja.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a1440',
    theme_color: '#0a1440',
    lang: 'id',
    icons: [
      { src: '/merek/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/merek/ikon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
