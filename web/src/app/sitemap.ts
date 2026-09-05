import type { MetadataRoute } from 'next'
import { ambil, ASAL_SITUS } from '@/lib/api'

type Ringkas = { slug: string; diubahAt: string }

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await ambil<{ layanan: Ringkas[]; artikel: Ringkas[]; lowongan: Ringkas[] }>('/peta-situs', { revalidate: 3600 })

  const statis: MetadataRoute.Sitemap = [
    { url: '/', prioritas: 1, ubah: 'weekly' },
    { url: '/tentang', prioritas: 0.9, ubah: 'monthly' },
    { url: '/layanan', prioritas: 0.9, ubah: 'monthly' },
    { url: '/klien', prioritas: 0.85, ubah: 'weekly' },
    { url: '/legalitas', prioritas: 0.8, ubah: 'yearly' },
    { url: '/galeri', prioritas: 0.6, ubah: 'monthly' },
    { url: '/karier', prioritas: 0.8, ubah: 'weekly' },
    { url: '/artikel', prioritas: 0.7, ubah: 'weekly' },
    { url: '/faq', prioritas: 0.6, ubah: 'monthly' },
    { url: '/kontak', prioritas: 0.9, ubah: 'yearly' },
  ].map((s) => ({
    url: `${ASAL_SITUS}${s.url}`,
    lastModified: new Date(),
    changeFrequency: s.ubah as 'weekly',
    priority: s.prioritas,
  }))

  const dinamis: MetadataRoute.Sitemap = [
    ...(data?.layanan ?? []).map((l) => ({
      url: `${ASAL_SITUS}/layanan/${l.slug}`,
      lastModified: new Date(l.diubahAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...(data?.artikel ?? []).map((a) => ({
      url: `${ASAL_SITUS}/artikel/${a.slug}`,
      lastModified: new Date(a.diubahAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...(data?.lowongan ?? []).map((l) => ({
      url: `${ASAL_SITUS}/karier/${l.slug}`,
      lastModified: new Date(l.diubahAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return [...statis, ...dinamis]
}
