import { Client } from 'minio'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { env } from './env.js'

export const minio = new Client({
  endPoint: env.minio.endPoint,
  port: env.minio.port,
  useSSL: env.minio.useSSL,
  accessKey: env.minio.accessKey,
  secretKey: env.minio.secretKey,
})

/** Pastikan bucket ada dan objeknya bisa dibaca publik (untuk gambar situs). */
export async function siapkanBucket() {
  const nama = env.minio.bucket
  const ada = await minio.bucketExists(nama).catch(() => false)
  if (!ada) await minio.makeBucket(nama)
  const kebijakan = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${nama}/*`],
      },
    ],
  }
  await minio.setBucketPolicy(nama, JSON.stringify(kebijakan)).catch(() => {})
}

export async function unggahBerkas(berkas: Express.Multer.File, folder = 'umum') {
  const ekstensi = path.extname(berkas.originalname).toLowerCase() || '.bin'
  const objek = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}${ekstensi}`
  await minio.putObject(env.minio.bucket, objek, berkas.buffer, berkas.size, {
    'Content-Type': berkas.mimetype,
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  return { objek, url: `${env.minio.publicUrl}/${objek}` }
}

export async function hapusBerkas(objek: string) {
  await minio.removeObject(env.minio.bucket, objek).catch(() => {})
}
