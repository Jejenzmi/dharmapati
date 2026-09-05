'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiAdmin, SUMBER } from '@/lib/admin'

type Ringkasan = {
  angka: { klien: number; layanan: number; artikel: number; pesanBaru: number; lamaranBaru: number; galeri: number }
  pesanTerbaru: { id: string; nama: string; perusahaan: string | null; layanan: string | null; pesan: string; dibuatAt: string }[]
}

export default function HalamanRingkasan() {
  const [data, setData] = useState<Ringkasan | null>(null)

  useEffect(() => {
    apiAdmin<Ringkasan>('/admin/ringkasan').then(setData).catch(() => {})
  }, [])

  if (!data) return <p className="text-sm text-slate-400">Memuat ringkasan…</p>

  const kartu = [
    { l: 'Pesan baru', v: data.angka.pesanBaru, w: 'bg-rose-500', ke: '/admin/ruang/pesan' },
    { l: 'Lamaran baru', v: data.angka.lamaranBaru, w: 'bg-amber-500', ke: '/admin/ruang/lamaran' },
    { l: 'Klien', v: data.angka.klien, w: 'bg-navy-900', ke: '/admin/ruang/klien' },
    { l: 'Layanan', v: data.angka.layanan, w: 'bg-emerald-600', ke: '/admin/ruang/layanan' },
    { l: 'Artikel', v: data.angka.artikel, w: 'bg-sky-600', ke: '/admin/ruang/artikel' },
    { l: 'Galeri', v: data.angka.galeri, w: 'bg-violet-600', ke: '/admin/ruang/galeri' },
  ]

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Ringkasan</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kartu.map((a) => (
          <Link key={a.l} href={a.ke} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emas-300 hover:shadow-lg">
            <span className={`mb-3 inline-block h-1.5 w-8 rounded-full ${a.w}`} />
            <p className="font-judul text-3xl font-bold text-navy-900">{a.v}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{a.l}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold">Pesan terbaru</h2>
      <div className="space-y-3">
        {data.pesanTerbaru.map((p) => (
          <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-navy-900">{p.nama}</span>
              {p.perusahaan && <span className="text-sm text-slate-500">· {p.perusahaan}</span>}
              {p.layanan && <span className="rounded-full bg-emas-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emas-700">{p.layanan}</span>}
              <span className="ml-auto text-xs text-slate-400">{new Date(p.dibuatAt).toLocaleString('id-ID')}</span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.pesan}</p>
          </article>
        ))}
        {!data.pesanTerbaru.length && (
          <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">Belum ada pesan masuk.</p>
        )}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-bold">Kelola konten</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SUMBER.map((s) => (
          <li key={s.kunci}>
            <Link href={`/admin/ruang/${s.kunci}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-emas-300 hover:shadow-md">
              <span aria-hidden="true" className="text-lg">{s.ikon}</span>
              <span className="text-sm font-bold text-navy-900">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
