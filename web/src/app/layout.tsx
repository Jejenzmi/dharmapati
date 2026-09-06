import type { Metadata, Viewport } from 'next'
import { Bitter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ASAL_SITUS } from '@/lib/api'
import { NAMA_SITUS } from '@/lib/seo'

const tubuh = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-tubuh',
})

const judul = Bitter({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-judul',
})

export const metadata: Metadata = {
  metadataBase: new URL(ASAL_SITUS),
  title: {
    default: 'PT. Dharmapati Putra Nusantara — Jasa Pengamanan, Cleaning Service & Tenaga Kerja',
    template: `%s | ${NAMA_SITUS}`,
  },
  description:
    'Perusahaan jasa pengamanan (Satpam), cleaning service, dan penyediaan tenaga kerja berizin SIO Polri, ABUJAPI, dan APKLINDO. Melayani industri, perkantoran, dan instansi pemerintah di Purwakarta, Karawang, Subang, Bekasi, Jakarta, hingga Jawa Timur.',
  applicationName: NAMA_SITUS,
  authors: [{ name: NAMA_SITUS }],
  creator: NAMA_SITUS,
  publisher: NAMA_SITUS,
  category: 'business',
  formatDetection: { telephone: true, address: true, email: true },
  icons: {
    icon: [
      { url: '/merek/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/merek/ikon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/merek/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: NAMA_SITUS,
    url: ASAL_SITUS,
    title: 'PT. Dharmapati Putra Nusantara — Jasa Pengamanan, Cleaning Service & Tenaga Kerja',
    description:
      'Perusahaan jasa pengamanan (Satpam), cleaning service, dan penyediaan tenaga kerja berizin SIO Polri, ABUJAPI, dan APKLINDO.',
    images: [{ url: '/merek/og.png', width: 1200, height: 630, alt: NAMA_SITUS }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT. Dharmapati Putra Nusantara',
    description: 'Jasa pengamanan, cleaning service, dan penyediaan tenaga kerja berizin.',
    images: ['/merek/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#0a1440',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Tata letak akar hanya menyiapkan dokumen dan huruf.
 * Header serta kaki halaman publik dipasang di grup rute (publik) supaya
 * panel admin bersih tanpa navigasi situs.
 */
export default function TataLetakAkar({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${tubuh.variable} ${judul.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  )
}
