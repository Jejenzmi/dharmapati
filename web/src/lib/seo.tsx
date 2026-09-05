import type { Metadata } from 'next'
import { ASAL_SITUS, type Pengaturan } from './api'

export const NAMA_SITUS = 'PT. Dharmapati Putra Nusantara'

export function mutlak(jalur = '/') {
  return new URL(jalur, ASAL_SITUS).toString()
}

type Opsi = {
  judul: string
  deskripsi: string
  jalur: string
  gambar?: string
  jenis?: 'website' | 'article'
  kataKunci?: string[]
  terbitAt?: string
  diubahAt?: string
  tanpaIndeks?: boolean
}

export function buatMetadata(o: Opsi): Metadata {
  const gambar = o.gambar ?? '/merek/og.png'
  return {
    title: o.judul,
    description: o.deskripsi,
    keywords: o.kataKunci,
    alternates: { canonical: mutlak(o.jalur) },
    robots: o.tanpaIndeks ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: o.jenis ?? 'website',
      url: mutlak(o.jalur),
      siteName: NAMA_SITUS,
      title: o.judul,
      description: o.deskripsi,
      locale: 'id_ID',
      images: [{ url: mutlak(gambar), width: 1200, height: 630, alt: o.judul }],
      ...(o.terbitAt ? { publishedTime: o.terbitAt } : {}),
      ...(o.diubahAt ? { modifiedTime: o.diubahAt } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: o.judul,
      description: o.deskripsi,
      images: [mutlak(gambar)],
    },
  }
}

// ---------- Data terstruktur (JSON-LD) ----------

export function ldOrganisasi(p: Pengaturan) {
  const k = p.kontak
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'SecurityService', 'LocalBusiness'],
    '@id': mutlak('/#organisasi'),
    name: NAMA_SITUS,
    alternateName: 'Dharmapati Security',
    url: mutlak('/'),
    logo: mutlak('/merek/logo-512.png'),
    image: mutlak('/merek/og.png'),
    description: p.seo?.deskripsiBawaan,
    slogan: p.perusahaan?.tagline,
    foundingDate: '2020-01-27',
    email: k?.email,
    telephone: k?.telepon?.[0],
    priceRange: 'Rp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Samesta Royal Campaka, Ruko Blok R1 No. 36, Campaka',
      addressLocality: 'Purwakarta',
      addressRegion: 'Jawa Barat',
      postalCode: '41181',
      addressCountry: 'ID',
    },
    geo: k?.petaKantor
      ? { '@type': 'GeoCoordinates', latitude: k.petaKantor.lat, longitude: k.petaKantor.lng }
      : undefined,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    areaServed: [
      'Purwakarta', 'Karawang', 'Subang', 'Bekasi', 'Cikarang', 'Cibitung',
      'Jakarta', 'Indramayu', 'Cirebon', 'Kendal', 'Gresik', 'Jember',
    ].map((n) => ({ '@type': 'City', name: n })),
    sameAs: [] as string[],
  }
}

export function ldSitus() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': mutlak('/#situs'),
    url: mutlak('/'),
    name: NAMA_SITUS,
    inLanguage: 'id-ID',
    publisher: { '@id': mutlak('/#organisasi') },
  }
}

export function ldRemah(butir: { nama: string; jalur: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: butir.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.nama,
      item: mutlak(b.jalur),
    })),
  }
}

export function ldLayanan(l: { nama: string; slug: string; ringkasan: string; deskripsi: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: l.nama,
    serviceType: l.nama,
    description: l.ringkasan,
    url: mutlak(`/layanan/${l.slug}`),
    provider: { '@id': mutlak('/#organisasi') },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
  }
}

export function ldArtikel(a: { judul: string; slug: string; ringkasan: string; terbitAt: string; diubahAt?: string; penulis: string; sampul?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.judul,
    description: a.ringkasan,
    url: mutlak(`/artikel/${a.slug}`),
    datePublished: a.terbitAt,
    dateModified: a.diubahAt ?? a.terbitAt,
    author: { '@type': 'Organization', name: a.penulis },
    publisher: { '@id': mutlak('/#organisasi') },
    image: mutlak(a.sampul ?? '/merek/og.png'),
    inLanguage: 'id-ID',
  }
}

export function ldFaq(daftar: { tanya: string; jawab: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: daftar.map((f) => ({
      '@type': 'Question',
      name: f.tanya,
      acceptedAnswer: { '@type': 'Answer', text: f.jawab },
    })),
  }
}

export function ldLowongan(l: { posisi: string; slug: string; deskripsi: string; syarat: string[]; lokasi: string; tipe: string; dibuatAt: string; tutupAt: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: l.posisi,
    description: `<p>${l.deskripsi}</p><ul>${l.syarat.map((s) => `<li>${s}</li>`).join('')}</ul>`,
    datePosted: l.dibuatAt,
    validThrough: l.tutupAt ?? undefined,
    employmentType: l.tipe.toLowerCase().includes('kontrak') ? 'CONTRACTOR' : 'FULL_TIME',
    hiringOrganization: { '@id': mutlak('/#organisasi') },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: l.lokasi, addressRegion: 'Jawa Barat', addressCountry: 'ID' },
    },
    url: mutlak(`/karier/${l.slug}`),
  }
}

/** Sisipkan JSON-LD ke halaman. */
export function DataTerstruktur({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
