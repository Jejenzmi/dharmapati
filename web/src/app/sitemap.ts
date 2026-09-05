import type { MetadataRoute } from 'next'
import { ambil, ASAL_SITUS, type Layanan } from '@/lib/api'
import { JALUR_STATIS, slugDariLini } from '@/lib/navigasi'

type Ringkas = { slug: string; diubahAt: string }

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [peta, layanan] = await Promise.all([
    ambil<{ artikel: Ringkas[]; lowongan: Ringkas[] }>('/peta-situs', { revalidate: 3600 }),
    ambil<Layanan[]>('/layanan', { revalidate: 3600 }),
  ])

  const sekarang = new Date()

  const statis: MetadataRoute.Sitemap = JALUR_STATIS.map((s) => ({
    url: `${ASAL_SITUS}${s.jalur}`,
    lastModified: sekarang,
    changeFrequency: s.ubah,
    priority: s.prioritas,
  }))

  const dinamis: MetadataRoute.Sitemap = [
    ...(layanan ?? []).map((l) => ({
      url: `${ASAL_SITUS}/layanan/${slugDariLini(l.lini)}/${l.slug}`,
      lastModified: sekarang,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...(peta?.artikel ?? []).map((a) => ({
      url: `${ASAL_SITUS}/artikel/${a.slug}`,
      lastModified: new Date(a.diubahAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...(peta?.lowongan ?? []).map((l) => ({
      url: `${ASAL_SITUS}/karier/${l.slug}`,
      lastModified: new Date(l.diubahAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return [...statis, ...dinamis]
}
