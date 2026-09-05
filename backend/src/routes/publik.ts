import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { denganSinggahan } from '../lib/redis.js'

export const publik = Router()

const TTL = 300 // detik

publik.get('/beranda', async (_req, res) => {
  const data = await denganSinggahan('dp:beranda', TTL, async () => {
    const [layanan, klien, testimoni, artikel, statistik, pengaturan] = await Promise.all([
      prisma.layanan.findMany({ where: { terbit: true, unggulan: true }, orderBy: { urutan: 'asc' } }),
      prisma.klien.findMany({ where: { terbit: true }, orderBy: { urutan: 'asc' } }),
      prisma.testimoni.findMany({ where: { terbit: true }, orderBy: { urutan: 'asc' }, take: 6 }),
      prisma.artikel.findMany({ where: { terbit: true }, orderBy: { terbitAt: 'desc' }, take: 3 }),
      prisma.klien.count({ where: { terbit: true } }),
      prisma.pengaturan.findMany(),
    ])
    const kota = new Set(klien.map((k) => k.kota))
    const provinsi = new Set(klien.map((k) => k.provinsi))
    return {
      layanan,
      klien,
      testimoni,
      artikel,
      angka: { klien: statistik, kota: kota.size, provinsi: provinsi.size },
      pengaturan: Object.fromEntries(pengaturan.map((p) => [p.kunci, p.nilai])),
    }
  })
  res.json(data)
})

publik.get('/pengaturan', async (_req, res) => {
  const data = await denganSinggahan('dp:pengaturan', TTL, async () => {
    const baris = await prisma.pengaturan.findMany()
    return Object.fromEntries(baris.map((p) => [p.kunci, p.nilai]))
  })
  res.json(data)
})

publik.get('/layanan', async (req, res) => {
  const lini = typeof req.query.lini === 'string' ? req.query.lini : undefined
  const data = await denganSinggahan(`dp:layanan:${lini ?? 'semua'}`, TTL, () =>
    prisma.layanan.findMany({
      where: { terbit: true, ...(lini ? { lini: lini as any } : {}) },
      orderBy: [{ urutan: 'asc' }, { nama: 'asc' }],
    }),
  )
  res.json(data)
})

publik.get('/layanan/:slug', async (req, res) => {
  const data = await denganSinggahan(`dp:layanan:slug:${req.params.slug}`, TTL, () =>
    prisma.layanan.findFirst({ where: { slug: req.params.slug, terbit: true } }),
  )
  if (!data) return res.status(404).json({ pesan: 'Layanan tidak ditemukan' })
  res.json(data)
})

publik.get('/klien', async (_req, res) => {
  const data = await denganSinggahan('dp:klien', TTL, () =>
    prisma.klien.findMany({ where: { terbit: true }, orderBy: [{ urutan: 'asc' }, { nama: 'asc' }] }),
  )
  res.json(data)
})

publik.get('/legalitas', async (_req, res) => {
  const data = await denganSinggahan('dp:legalitas', TTL, async () => {
    const [legalitas, kbli] = await Promise.all([
      prisma.legalitas.findMany({ orderBy: { urutan: 'asc' } }),
      prisma.kbli.findMany({ orderBy: { urutan: 'asc' } }),
    ])
    return { legalitas, kbli }
  })
  res.json(data)
})

publik.get('/personel', async (_req, res) => {
  const data = await denganSinggahan('dp:personel', TTL, () =>
    prisma.personel.findMany({ where: { terbit: true }, orderBy: [{ tingkat: 'asc' }, { urutan: 'asc' }] }),
  )
  res.json(data)
})

publik.get('/galeri', async (req, res) => {
  const kategori = typeof req.query.kategori === 'string' ? req.query.kategori : undefined
  const data = await denganSinggahan(`dp:galeri:${kategori ?? 'semua'}`, TTL, () =>
    prisma.galeri.findMany({
      where: { terbit: true, ...(kategori ? { kategori } : {}) },
      orderBy: [{ urutan: 'asc' }, { dibuatAt: 'desc' }],
    }),
  )
  res.json(data)
})

publik.get('/artikel', async (req, res) => {
  const halaman = Math.max(1, Number(req.query.halaman ?? 1))
  const per = Math.min(24, Math.max(1, Number(req.query.per ?? 9)))
  const kategori = typeof req.query.kategori === 'string' ? req.query.kategori : undefined
  const data = await denganSinggahan(`dp:artikel:${halaman}:${per}:${kategori ?? '-'}`, TTL, async () => {
    const where = { terbit: true, ...(kategori ? { kategori } : {}) }
    const [daftar, total] = await Promise.all([
      prisma.artikel.findMany({ where, orderBy: { terbitAt: 'desc' }, skip: (halaman - 1) * per, take: per }),
      prisma.artikel.count({ where }),
    ])
    return { daftar, total, halaman, per, totalHalaman: Math.ceil(total / per) }
  })
  res.json(data)
})

publik.get('/artikel/:slug', async (req, res) => {
  const artikel = await prisma.artikel.findFirst({ where: { slug: req.params.slug, terbit: true } })
  if (!artikel) return res.status(404).json({ pesan: 'Artikel tidak ditemukan' })
  prisma.artikel.update({ where: { id: artikel.id }, data: { dilihat: { increment: 1 } } }).catch(() => {})
  const terkait = await prisma.artikel.findMany({
    where: { terbit: true, id: { not: artikel.id }, kategori: artikel.kategori },
    orderBy: { terbitAt: 'desc' },
    take: 3,
  })
  res.json({ artikel, terkait })
})

publik.get('/lowongan', async (_req, res) => {
  const data = await denganSinggahan('dp:lowongan', 120, () =>
    prisma.lowongan.findMany({ where: { terbit: true }, orderBy: { dibuatAt: 'desc' } }),
  )
  res.json(data)
})

publik.get('/lowongan/:slug', async (req, res) => {
  const data = await prisma.lowongan.findFirst({ where: { slug: req.params.slug, terbit: true } })
  if (!data) return res.status(404).json({ pesan: 'Lowongan tidak ditemukan' })
  res.json(data)
})

publik.get('/faq', async (_req, res) => {
  const data = await denganSinggahan('dp:faq', TTL, () =>
    prisma.faq.findMany({ where: { terbit: true }, orderBy: { urutan: 'asc' } }),
  )
  res.json(data)
})

publik.get('/testimoni', async (_req, res) => {
  const data = await denganSinggahan('dp:testimoni', TTL, () =>
    prisma.testimoni.findMany({ where: { terbit: true }, orderBy: { urutan: 'asc' } }),
  )
  res.json(data)
})

/** Ringkasan untuk sitemap.xml di sisi Next.js. */
publik.get('/peta-situs', async (_req, res) => {
  const data = await denganSinggahan('dp:peta-situs', 600, async () => {
    const [layanan, artikel, lowongan] = await Promise.all([
      prisma.layanan.findMany({ where: { terbit: true }, select: { slug: true, diubahAt: true } }),
      prisma.artikel.findMany({ where: { terbit: true }, select: { slug: true, diubahAt: true } }),
      prisma.lowongan.findMany({ where: { terbit: true }, select: { slug: true, diubahAt: true } }),
    ])
    return { layanan, artikel, lowongan }
  })
  res.json(data)
})
