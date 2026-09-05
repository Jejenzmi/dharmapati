import Redis from 'ioredis'
import { env } from './env.js'

/**
 * Singgahan (cache) sederhana. Bila Redis tidak tersedia, aplikasi tetap jalan
 * tanpa singgahan — situs publik tidak boleh mati hanya karena cache mati.
 */
export const redis = new Redis(env.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
  retryStrategy: (kali) => (kali > 5 ? null : Math.min(kali * 200, 2000)),
})

let siap = false
redis.on('ready', () => { siap = true })
redis.on('error', () => { siap = false })
redis.connect().catch(() => { siap = false })

export function redisSiap() { return siap }

export async function ambilSinggahan<T>(kunci: string): Promise<T | null> {
  if (!siap) return null
  try {
    const isi = await redis.get(kunci)
    return isi ? (JSON.parse(isi) as T) : null
  } catch { return null }
}

export async function simpanSinggahan(kunci: string, nilai: unknown, detik = 300) {
  if (!siap) return
  try { await redis.set(kunci, JSON.stringify(nilai), 'EX', detik) } catch { /* abaikan */ }
}

/** Hapus seluruh kunci singgahan berawalan tertentu, dipakai saat konten diubah. */
export async function bersihkanSinggahan(prefix = 'dp:') {
  if (!siap) return
  try {
    const aliran = redis.scanStream({ match: `${prefix}*`, count: 200 })
    for await (const kunci of aliran as AsyncIterable<string[]>) {
      if (kunci.length) await redis.del(...kunci)
    }
  } catch { /* abaikan */ }
}

/** Bungkus pemanggilan basis data dengan singgahan. */
export async function denganSinggahan<T>(kunci: string, detik: number, muat: () => Promise<T>): Promise<T> {
  const tersimpan = await ambilSinggahan<T>(kunci)
  if (tersimpan !== null) return tersimpan
  const segar = await muat()
  await simpanSinggahan(kunci, segar, detik)
  return segar
}
