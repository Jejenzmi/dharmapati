import { Router } from 'express'
import multer from 'multer'
import { prisma } from '../lib/prisma.js'
import { wajibMasuk } from '../lib/auth.js'
import { bersihkanSinggahan, redisSiap } from '../lib/redis.js'
import { unggahBerkas } from '../lib/minio.js'

export const admin = Router()
admin.use(wajibMasuk)

/** Sumber daya yang boleh dikelola lewat panel admin, dipetakan ke model Prisma. */
const SUMBER: Record<string, { model: any; urut: any }> = {
  layanan: { model: prisma.layanan, urut: [{ urutan: 'asc' }] },
  klien: { model: prisma.klien, urut: [{ urutan: 'asc' }, { nama: 'asc' }] },
  legalitas: { model: prisma.legalitas, urut: [{ urutan: 'asc' }] },
  kbli: { model: prisma.kbli, urut: [{ urutan: 'asc' }] },
  personel: { model: prisma.personel, urut: [{ tingkat: 'asc' }, { urutan: 'asc' }] },
  galeri: { model: prisma.galeri, urut: [{ urutan: 'asc' }] },
  artikel: { model: prisma.artikel, urut: [{ terbitAt: 'desc' }] },
  lowongan: { model: prisma.lowongan, urut: [{ dibuatAt: 'desc' }] },
  lamaran: { model: prisma.lamaran, urut: [{ dibuatAt: 'desc' }] },
  pesan: { model: prisma.pesan, urut: [{ dibuatAt: 'desc' }] },
  testimoni: { model: prisma.testimoni, urut: [{ urutan: 'asc' }] },
  faq: { model: prisma.faq, urut: [{ urutan: 'asc' }] },
}

function ambilSumber(nama: string) {
  const sumber = SUMBER[nama]
  if (!sumber) throw Object.assign(new Error('Sumber daya tidak dikenal'), { status: 404 })
  return sumber
}

admin.get('/ringkasan', async (_req, res) => {
  const awalBulan = new Date()
  awalBulan.setDate(1)
  awalBulan.setHours(0, 0, 0, 0)

  const [
    klien, layanan, artikel, galeri, lowongan, testimoni,
    pesanBaru, lamaranBaru, pesanTotal, lamaranTotal, pesanBulanIni,
    statusPesan, statusLamaran, klienProvinsi, klienLini,
    pesanTerbaru, lamaranTerbaru, artikelTeratas,
  ] = await Promise.all([
    prisma.klien.count(),
    prisma.layanan.count(),
    prisma.artikel.count(),
    prisma.galeri.count(),
    prisma.lowongan.count({ where: { terbit: true } }),
    prisma.testimoni.count(),
    prisma.pesan.count({ where: { status: 'BARU' } }),
    prisma.lamaran.count({ where: { status: 'BARU' } }),
    prisma.pesan.count(),
    prisma.lamaran.count(),
    prisma.pesan.count({ where: { dibuatAt: { gte: awalBulan } } }),
    prisma.pesan.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.lamaran.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.klien.groupBy({ by: ['provinsi'], _count: { _all: true }, where: { terbit: true } }),
    prisma.klien.groupBy({ by: ['lini'], _count: { _all: true }, where: { terbit: true } }),
    prisma.pesan.findMany({ orderBy: { dibuatAt: 'desc' }, take: 6 }),
    prisma.lamaran.findMany({ orderBy: { dibuatAt: 'desc' }, take: 5 }),
    prisma.artikel.findMany({ where: { terbit: true }, orderBy: { dilihat: 'desc' }, take: 5, select: { id: true, judul: true, slug: true, dilihat: true } }),
  ])

  const cacah = (baris: { status: string; _count: { _all: number } }[]) =>
    baris.map((b) => ({ label: b.status, jumlah: b._count._all }))

  res.json({
    angka: {
      klien, layanan, artikel, galeri, lowongan, testimoni,
      pesanBaru, lamaranBaru, pesanTotal, lamaranTotal, pesanBulanIni,
    },
    statusPesan: cacah(statusPesan as any),
    statusLamaran: cacah(statusLamaran as any),
    klienProvinsi: klienProvinsi
      .map((b) => ({ label: b.provinsi, jumlah: b._count._all }))
      .sort((a, b) => b.jumlah - a.jumlah),
    klienLini: klienLini.map((b) => ({ label: b.lini, jumlah: b._count._all })),
    pesanTerbaru,
    lamaranTerbaru,
    artikelTeratas,
    sistem: { db: true, redis: redisSiap(), waktu: new Date().toISOString() },
  })
})

admin.get('/data/:sumber', async (req, res, next) => {
  try {
    const { model, urut } = ambilSumber(req.params.sumber)
    const data = await model.findMany({ orderBy: urut })
    res.json(data)
  } catch (e) { next(e) }
})

admin.get('/data/:sumber/:id', async (req, res, next) => {
  try {
    const { model } = ambilSumber(req.params.sumber)
    const data = await model.findUnique({ where: { id: req.params.id } })
    if (!data) return res.status(404).json({ pesan: 'Data tidak ditemukan' })
    res.json(data)
  } catch (e) { next(e) }
})

admin.post('/data/:sumber', async (req, res, next) => {
  try {
    const { model } = ambilSumber(req.params.sumber)
    const data = await model.create({ data: bersihkan(req.body) })
    await bersihkanSinggahan()
    res.status(201).json(data)
  } catch (e) { next(e) }
})

admin.put('/data/:sumber/:id', async (req, res, next) => {
  try {
    const { model } = ambilSumber(req.params.sumber)
    const data = await model.update({ where: { id: req.params.id }, data: bersihkan(req.body) })
    await bersihkanSinggahan()
    res.json(data)
  } catch (e) { next(e) }
})

admin.delete('/data/:sumber/:id', async (req, res, next) => {
  try {
    const { model } = ambilSumber(req.params.sumber)
    await model.delete({ where: { id: req.params.id } })
    await bersihkanSinggahan()
    res.status(204).end()
  } catch (e) { next(e) }
})

/** Buang kolom sistem agar tidak menabrak Prisma. */
function bersihkan(isi: Record<string, unknown>) {
  const { id, dibuatAt, diubahAt, ...sisa } = isi ?? {}
  return sisa
}

// ---- Pengaturan situs (key/value) ----
admin.get('/pengaturan', async (_req, res) => {
  const baris = await prisma.pengaturan.findMany()
  res.json(Object.fromEntries(baris.map((b) => [b.kunci, b.nilai])))
})

admin.put('/pengaturan/:kunci', async (req, res) => {
  const data = await prisma.pengaturan.upsert({
    where: { kunci: req.params.kunci },
    create: { kunci: req.params.kunci, nilai: req.body },
    update: { nilai: req.body },
  })
  await bersihkanSinggahan()
  res.json(data)
})

// ---- Unggah berkas ke MinIO ----
const unggahan = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, berkas, lanjut) =>
    lanjut(null, ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'].includes(berkas.mimetype)),
})

admin.post('/unggah', unggahan.single('berkas'), async (req, res) => {
  if (!req.file) return res.status(400).json({ pesan: 'Berkas tidak ditemukan atau jenisnya tidak didukung' })
  const folder = typeof req.body.folder === 'string' ? req.body.folder.replace(/[^a-z0-9-]/gi, '') || 'umum' : 'umum'
  const { objek, url } = await unggahBerkas(req.file, folder)
  const catatan = await prisma.berkas.create({
    data: {
      namaAsli: req.file.originalname,
      objek,
      url,
      mime: req.file.mimetype,
      ukuran: req.file.size,
      folder,
    },
  })
  res.status(201).json(catatan)
})

admin.get('/berkas', async (_req, res) => {
  res.json(await prisma.berkas.findMany({ orderBy: { dibuatAt: 'desc' }, take: 200 }))
})

admin.post('/singgahan/bersihkan', async (_req, res) => {
  await bersihkanSinggahan()
  res.json({ pesan: 'Singgahan dibersihkan' })
})
