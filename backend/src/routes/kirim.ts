import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import multer from 'multer'
import { prisma } from '../lib/prisma.js'
import { unggahBerkas } from '../lib/minio.js'

export const kirim = Router()

const batas = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { pesan: 'Terlalu banyak pengiriman. Coba lagi dalam 15 menit.' },
})

const skemaPesan = z.object({
  nama: z.string().min(2).max(120),
  email: z.string().email(),
  telepon: z.string().min(6).max(30),
  perusahaan: z.string().max(160).optional().or(z.literal('')),
  layanan: z.string().max(80).optional().or(z.literal('')),
  lokasi: z.string().max(160).optional().or(z.literal('')),
  kebutuhan: z.string().max(120).optional().or(z.literal('')),
  pesan: z.string().min(10).max(4000),
  // Umpan lebah: bila terisi berarti bot.
  situs: z.string().max(0).optional().or(z.literal('')),
})

kirim.post('/pesan', batas, async (req, res) => {
  const hasil = skemaPesan.safeParse(req.body)
  if (!hasil.success) {
    return res.status(400).json({ pesan: 'Data belum lengkap', galat: hasil.error.flatten().fieldErrors })
  }
  const { situs, ...isi } = hasil.data
  if (situs) return res.json({ pesan: 'Terkirim' }) // diam-diam abaikan bot
  await prisma.pesan.create({
    data: { ...isi, ip: req.ip ?? null },
  })
  res.status(201).json({ pesan: 'Terima kasih, pesan Anda sudah kami terima. Tim kami menghubungi maksimal 1x24 jam kerja.' })
})

const unggahan = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, berkas, lanjut) => {
    const boleh = ['application/pdf', 'image/jpeg', 'image/png']
    lanjut(null, boleh.includes(berkas.mimetype))
  },
})

const skemaLamaran = z.object({
  lowonganId: z.string().optional().or(z.literal('')),
  nama: z.string().min(2).max(120),
  email: z.string().email(),
  telepon: z.string().min(6).max(30),
  domisili: z.string().min(2).max(160),
  pendidikan: z.string().max(120).optional().or(z.literal('')),
  pengalaman: z.string().max(2000).optional().or(z.literal('')),
  catatan: z.string().max(2000).optional().or(z.literal('')),
})

kirim.post('/lamaran', batas, unggahan.single('berkas'), async (req, res) => {
  const hasil = skemaLamaran.safeParse(req.body)
  if (!hasil.success) {
    return res.status(400).json({ pesan: 'Data belum lengkap', galat: hasil.error.flatten().fieldErrors })
  }
  let berkas: string | null = null
  if (req.file) {
    const naik = await unggahBerkas(req.file, 'lamaran')
    berkas = naik.url
  }
  const { lowonganId, ...isi } = hasil.data
  await prisma.lamaran.create({
    data: { ...isi, berkas, lowonganId: lowonganId || null },
  })
  res.status(201).json({ pesan: 'Lamaran terkirim. Kami hubungi bila lolos seleksi berkas.' })
})
