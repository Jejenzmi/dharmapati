import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { env } from './lib/env.js'
import { prisma } from './lib/prisma.js'
import { siapkanBucket } from './lib/minio.js'
import { redisSiap } from './lib/redis.js'
import { publik } from './routes/publik.js'
import { kirim } from './routes/kirim.js'
import { auth } from './routes/auth.js'
import { admin } from './routes/admin.js'

const app = express()

app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(compression())
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
if (env.nodeEnv !== 'test') app.use(morgan('dev'))

app.get('/sehat', async (_req, res) => {
  let db = false
  try { await prisma.$queryRaw`SELECT 1`; db = true } catch { db = false }
  res.json({ status: db ? 'ok' : 'gawat', db, redis: redisSiap(), waktu: new Date().toISOString() })
})

app.use('/api/publik', publik)
app.use('/api/kirim', kirim)
app.use('/api/auth', auth)
app.use('/api/admin', admin)

app.use((_req, res) => res.status(404).json({ pesan: 'Rute tidak ditemukan' }))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((galat: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = galat.status ?? (galat.code === 'P2025' ? 404 : 500)
  if (status >= 500) console.error(galat)
  res.status(status).json({ pesan: galat.message ?? 'Terjadi kesalahan di peladen' })
})

async function jalankan() {
  await siapkanBucket().catch((e) => console.warn('MinIO belum siap:', e.message))
  app.listen(env.port, () => {
    console.log(`API Dharmapati berjalan di http://localhost:${env.port}`)
  })
}

jalankan()
