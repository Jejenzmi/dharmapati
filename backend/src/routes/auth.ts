import { Router } from 'express'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { buatToken, wajibMasuk } from '../lib/auth.js'

export const auth = Router()

const batasMasuk = rateLimit({ windowMs: 10 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false })

auth.post('/masuk', batasMasuk, async (req, res) => {
  const skema = z.object({ username: z.string().min(3), kataSandi: z.string().min(4) })
  const hasil = skema.safeParse(req.body)
  if (!hasil.success) return res.status(400).json({ pesan: 'Isian tidak sah' })

  const pengguna = await prisma.pengguna.findUnique({ where: { username: hasil.data.username } })
  if (!pengguna || !pengguna.aktif || !(await bcrypt.compare(hasil.data.kataSandi, pengguna.kataSandi))) {
    return res.status(401).json({ pesan: 'Nama pengguna atau kata sandi salah' })
  }
  const token = buatToken({ sub: pengguna.id, nama: pengguna.nama, peran: pengguna.peran })
  res.cookie('dp_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 12 * 60 * 60 * 1000,
  })
  res.json({ token, pengguna: { id: pengguna.id, nama: pengguna.nama, peran: pengguna.peran } })
})

auth.post('/keluar', (_req, res) => {
  res.clearCookie('dp_token')
  res.json({ pesan: 'Berhasil keluar' })
})

auth.get('/saya', wajibMasuk, (req, res) => res.json(req.pengguna))
