import 'dotenv/config'

function wajib(kunci: string, bawaan?: string): string {
  const nilai = process.env[kunci] ?? bawaan
  if (nilai === undefined) throw new Error(`Variabel lingkungan ${kunci} belum diisi`)
  return nilai
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5041),
  jwtSecret: wajib('JWT_SECRET', 'rahasia-dev'),
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:5194').split(',').map((s) => s.trim()),
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6430',
  minio: {
    endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
    port: Number(process.env.MINIO_PORT ?? 9070),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'dharmapati',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'dharmapati123',
    bucket: process.env.MINIO_BUCKET ?? 'dharmapati',
    publicUrl: process.env.MINIO_PUBLIC_URL ?? 'http://localhost:9070/dharmapati',
  },
  admin: {
    username: process.env.ADMIN_USERNAME ?? 'admin',
    password: process.env.ADMIN_PASSWORD ?? 'admin123',
  },
}
