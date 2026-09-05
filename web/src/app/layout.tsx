import type { Metadata, Viewport } from 'next'
import { Bitter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Kepala from '@/komponen/Kepala'
import Kaki from '@/komponen/Kaki'
import TombolWa from '@/komponen/TombolWa'
import { ambilPengaturan, ASAL_SITUS } from '@/lib/api'
import { DataTerstruktur, ldOrganisasi, ldSitus, NAMA_SITUS } from '@/lib/seo'

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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  verification: {},
}

export const viewport: Viewport = {
  themeColor: '#0a1440',
  width: 'device-width',
  initialScale: 1,
}

export default async function TataLetakAkar({ children }: { children: React.ReactNode }) {
  const pengaturan = await ambilPengaturan()
  const telepon = pengaturan.kontak?.telepon?.[0] ?? '087777889158'
  const whatsapp = pengaturan.kontak?.whatsapp ?? '6287777889158'

  return (
    <html lang="id" className={`${tubuh.variable} ${judul.variable}`}>
      <body className="flex min-h-screen flex-col">
        <DataTerstruktur data={ldOrganisasi(pengaturan)} />
        <DataTerstruktur data={ldSitus()} />
        <a
          href="#isi"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-lg focus:bg-emas-500 focus:px-4 focus:py-2 focus:font-bold focus:text-navy-950"
        >
          Lompat ke konten utama
        </a>
        <Kepala telepon={telepon} whatsapp={whatsapp} />
        <main id="isi" className="flex-1">{children}</main>
        <Kaki pengaturan={pengaturan} />
        <TombolWa nomor={whatsapp} />
      </body>
    </html>
  )
}
