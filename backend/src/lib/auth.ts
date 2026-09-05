import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from './env.js'

export type MuatanToken = { sub: string; nama: string; peran: 'ADMIN' | 'EDITOR' }

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request { pengguna?: MuatanToken }
  }
}

export function buatToken(muatan: MuatanToken) {
  return jwt.sign(muatan, env.jwtSecret, { expiresIn: '12h' })
}

export function wajibMasuk(req: Request, res: Response, next: NextFunction) {
  const dariHeader = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  const token = dariHeader || (req as any).cookies?.dp_token
  if (!token) return res.status(401).json({ pesan: 'Belum masuk' })
  try {
    req.pengguna = jwt.verify(token, env.jwtSecret) as MuatanToken
    next()
  } catch {
    res.status(401).json({ pesan: 'Sesi tidak berlaku' })
  }
}

export function wajibAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.pengguna?.peran !== 'ADMIN') return res.status(403).json({ pesan: 'Butuh hak admin' })
  next()
}
