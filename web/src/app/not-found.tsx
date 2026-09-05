import Link from 'next/link'
import { Panah } from '@/komponen/ikon'

export const metadata = { title: 'Halaman tidak ditemukan', robots: { index: false, follow: false } }

export default function TidakDitemukan() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
      <div className="wadah relative text-center">
        <p className="font-judul text-7xl font-bold text-emas-500/40 sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-bold !text-white sm:text-4xl">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-slate-400">
          Alamat yang Anda tuju mungkin sudah dipindahkan atau tidak pernah ada. Silakan kembali ke beranda
          atau telusuri layanan kami.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="tombol-utama">Ke Beranda <Panah className="h-4 w-4" /></Link>
          <Link href="/layanan" className="tombol-garis">Lihat Layanan</Link>
        </div>
      </div>
    </section>
  )
}
