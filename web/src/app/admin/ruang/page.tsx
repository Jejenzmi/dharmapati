'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiAdmin, SUMBER } from '@/lib/admin'
import { BatangMendatar, BatangTumpuk, Ubin } from '@/komponen/admin/grafik'
import { Panah } from '@/komponen/ikon'

type Baris = { label: string; jumlah: number }
type Pesan = { id: string; nama: string; perusahaan: string | null; layanan: string | null; pesan: string; status: string; dibuatAt: string }
type Lamaran = { id: string; nama: string; domisili: string; status: string; dibuatAt: string }
type Artikel = { id: string; judul: string; slug: string; dilihat: number }

type Ringkasan = {
  angka: {
    klien: number; layanan: number; artikel: number; galeri: number; lowongan: number; testimoni: number
    pesanBaru: number; lamaranBaru: number; pesanTotal: number; lamaranTotal: number; pesanBulanIni: number
  }
  statusPesan: Baris[]
  statusLamaran: Baris[]
  klienProvinsi: Baris[]
  klienLini: Baris[]
  pesanTerbaru: Pesan[]
  lamaranTerbaru: Lamaran[]
  artikelTeratas: Artikel[]
  sistem: { db: boolean; redis: boolean; waktu: string }
}

const URUT_PESAN = ['BARU', 'DIPROSES', 'SELESAI', 'BATAL']
const URUT_LAMARAN = ['BARU', 'SELEKSI', 'DITERIMA', 'DITOLAK']

const WARNA_STATUS: Record<string, string> = {
  BARU: 'bg-blue-100 text-blue-800',
  DIPROSES: 'bg-orange-100 text-orange-800',
  SELESAI: 'bg-emerald-100 text-emerald-800',
  BATAL: 'bg-slate-100 text-slate-600',
  SELEKSI: 'bg-orange-100 text-orange-800',
  DITERIMA: 'bg-emerald-100 text-emerald-800',
  DITOLAK: 'bg-slate-100 text-slate-600',
}

function salam() {
  const jam = new Date().getHours()
  if (jam < 11) return 'Selamat pagi'
  if (jam < 15) return 'Selamat siang'
  if (jam < 19) return 'Selamat sore'
  return 'Selamat malam'
}

function waktuSingkat(iso: string) {
  const selisih = Date.now() - new Date(iso).getTime()
  const menit = Math.floor(selisih / 60000)
  if (menit < 1) return 'baru saja'
  if (menit < 60) return `${menit} menit lalu`
  const jam = Math.floor(menit / 60)
  if (jam < 24) return `${jam} jam lalu`
  const hari = Math.floor(jam / 24)
  if (hari < 30) return `${hari} hari lalu`
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function HalamanRingkasan() {
  const [data, setData] = useState<Ringkasan | null>(null)
  const [galat, setGalat] = useState('')

  useEffect(() => {
    apiAdmin<Ringkasan>('/admin/ringkasan')
      .then(setData)
      .catch((e) => setGalat(e instanceof Error ? e.message : 'Gagal memuat'))
  }, [])

  if (galat) return <p className="rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-700">{galat}</p>
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        ))}
      </div>
    )
  }

  const a = data.angka
  const perluTindakan = a.pesanBaru + a.lamaranBaru

  return (
    <div className="space-y-8">
      {/* Sapaan + status sistem */}
      <section className="overflow-hidden rounded-3xl bg-navy-950 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emas-400">{salam()}</p>
            <h2 className="mt-2 font-judul text-2xl font-bold text-white sm:text-3xl">
              {perluTindakan > 0
                ? `${perluTindakan} hal menunggu ditangani`
                : 'Semua kotak masuk sudah bersih'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              {perluTindakan > 0
                ? `${a.pesanBaru} permintaan penawaran dan ${a.lamaranBaru} lamaran berstatus baru.`
                : 'Tidak ada permintaan penawaran atau lamaran berstatus baru saat ini.'}
            </p>
            {perluTindakan > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {a.pesanBaru > 0 && (
                  <Link href="/admin/ruang/pesan" className="inline-flex items-center gap-2 rounded-full bg-emas-500 px-4 py-2 text-xs font-bold text-navy-950 transition hover:bg-emas-400">
                    Buka pesan ({a.pesanBaru}) <Panah className="h-3.5 w-3.5" />
                  </Link>
                )}
                {a.lamaranBaru > 0 && (
                  <Link href="/admin/ruang/lamaran" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white transition hover:border-emas-400 hover:text-emas-300">
                    Buka lamaran ({a.lamaranBaru}) <Panah className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>

          <dl className="flex flex-wrap gap-2">
            {[
              { l: 'Basis data', ok: data.sistem.db },
              { l: 'Singgahan Redis', ok: data.sistem.redis },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-2 rounded-full bg-white/[.06] px-3.5 py-2">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${s.ok ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <dt className="text-[11px] text-slate-300">{s.l}</dt>
                <dd className={`text-[11px] font-bold ${s.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{s.ok ? 'Normal' : 'Mati'}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Angka utama */}
      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Angka utama</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Ubin label="Pesan baru" nilai={a.pesanBaru} keterangan={`dari ${a.pesanTotal} total pesan masuk`} warna="bg-rose-500" ikon="✉️" tautan="/admin/ruang/pesan" />
          <Ubin label="Lamaran baru" nilai={a.lamaranBaru} keterangan={`dari ${a.lamaranTotal} total pelamar`} warna="bg-amber-500" ikon="📄" tautan="/admin/ruang/lamaran" />
          <Ubin label="Pesan bulan ini" nilai={a.pesanBulanIni} keterangan="sejak tanggal 1" warna="bg-sky-600" ikon="📈" />
          <Ubin label="Objek klien" nilai={a.klien} keterangan="tampil di peta sebaran" warna="bg-navy-900" ikon="📍" tautan="/admin/ruang/klien" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Ubin label="Layanan" nilai={a.layanan} warna="bg-emerald-600" ikon="🛡️" tautan="/admin/ruang/layanan" />
          <Ubin label="Artikel" nilai={a.artikel} warna="bg-violet-600" ikon="📰" tautan="/admin/ruang/artikel" />
          <Ubin label="Foto galeri" nilai={a.galeri} warna="bg-cyan-600" ikon="🖼️" tautan="/admin/ruang/galeri" />
          <Ubin label="Lowongan terbuka" nilai={a.lowongan} warna="bg-orange-500" ikon="💼" tautan="/admin/ruang/lowongan" />
        </div>
      </section>

      {/* Bagan */}
      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold text-navy-900">Sebaran klien per provinsi</h2>
          <p className="mb-5 mt-1 text-xs text-slate-500">Jumlah objek yang tampil di peta publik.</p>
          <BatangMendatar data={data.klienProvinsi} />
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold text-navy-900">Status pesan masuk</h2>
          <p className="mb-5 mt-1 text-xs text-slate-500">Total {a.pesanTotal} permintaan penawaran.</p>
          <BatangTumpuk data={data.statusPesan} urutan={URUT_PESAN} />
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold text-navy-900">Status lamaran kerja</h2>
          <p className="mb-5 mt-1 text-xs text-slate-500">Total {a.lamaranTotal} pelamar.</p>
          <BatangTumpuk data={data.statusLamaran} urutan={URUT_LAMARAN} />
        </article>
      </section>

      {/* Kotak masuk & artikel */}
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white">
          <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-bold text-navy-900">Pesan terbaru</h2>
            <Link href="/admin/ruang/pesan" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-emas-600">
              Semua <Panah className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ul className="divide-y divide-slate-100">
            {data.pesanTerbaru.map((p) => (
              <li key={p.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-navy-900">{p.nama}</span>
                  {p.perusahaan && <span className="text-xs text-slate-500">· {p.perusahaan}</span>}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${WARNA_STATUS[p.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {p.status}
                  </span>
                  <span className="ml-auto text-[11px] text-slate-400">{waktuSingkat(p.dibuatAt)}</span>
                </div>
                {p.layanan && <p className="mt-1 text-[11px] font-semibold text-emas-700">{p.layanan}</p>}
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">{p.pesan}</p>
              </li>
            ))}
            {!data.pesanTerbaru.length && <li className="px-6 py-12 text-center text-sm text-slate-400">Belum ada pesan masuk.</li>}
          </ul>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-bold text-navy-900">Lamaran terbaru</h2>
              <Link href="/admin/ruang/lamaran" className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-emas-600">
                Semua <Panah className="h-3.5 w-3.5" />
              </Link>
            </header>
            <ul className="divide-y divide-slate-100">
              {data.lamaranTerbaru.map((l) => (
                <li key={l.id} className="flex items-center gap-3 px-6 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-900">{l.nama}</span>
                    <span className="block truncate text-[11px] text-slate-500">{l.domisili}</span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${WARNA_STATUS[l.status] ?? 'bg-slate-100 text-slate-600'}`}>{l.status}</span>
                </li>
              ))}
              {!data.lamaranTerbaru.length && <li className="px-6 py-10 text-center text-sm text-slate-400">Belum ada lamaran.</li>}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white">
            <header className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-sm font-bold text-navy-900">Artikel paling banyak dibaca</h2>
            </header>
            <ol className="divide-y divide-slate-100">
              {data.artikelTeratas.map((t, i) => (
                <li key={t.id} className="flex items-center gap-3 px-6 py-3">
                  <span className="font-judul text-sm font-bold text-slate-300">{i + 1}</span>
                  <a href={`/artikel/${t.slug}`} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-xs font-semibold text-navy-900 hover:text-emas-700">{t.judul}</a>
                  <span className="shrink-0 text-[11px] font-bold tabular-nums text-slate-500">{t.dilihat}×</span>
                </li>
              ))}
              {!data.artikelTeratas.length && <li className="px-6 py-10 text-center text-sm text-slate-400">Belum ada artikel.</li>}
            </ol>
          </article>
        </div>
      </section>

      {/* Pintasan */}
      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Kelola konten</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li>
            <Link href="/admin/ruang/pengaturan" className="flex items-center gap-3 rounded-2xl border border-emas-300 bg-emas-50 px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <span aria-hidden="true" className="text-lg">⚙️</span>
              <span className="text-sm font-bold text-navy-900">Pengaturan Situs</span>
            </Link>
          </li>
          {SUMBER.map((s) => (
            <li key={s.kunci}>
              <Link href={`/admin/ruang/${s.kunci}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-emas-300 hover:shadow-md">
                <span aria-hidden="true" className="text-lg">{s.ikon}</span>
                <span className="text-sm font-bold text-navy-900">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
