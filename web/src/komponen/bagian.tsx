import Link from 'next/link'
import type { ReactNode } from 'react'
import { Panah } from './ikon'

export function JudulBagian({
  label, judul, deskripsi, gelap = false, tengah = false,
}: { label?: string; judul: ReactNode; deskripsi?: ReactNode; gelap?: boolean; tengah?: boolean }) {
  return (
    <div className={`${tengah ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} mb-12`}>
      {label && <span className={gelap ? 'label-bagian-gelap' : 'label-bagian'}>{label}</span>}
      <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${gelap ? '!text-white' : ''}`}>{judul}</h2>
      {deskripsi && (
        <p className={`mt-4 text-[15px] leading-relaxed ${gelap ? 'text-slate-300' : 'text-slate-600'}`}>{deskripsi}</p>
      )}
    </div>
  )
}

export function Remah({ butir }: { butir: { nama: string; jalur: string }[] }) {
  return (
    <nav aria-label="Remah roti" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
        {butir.map((b, i) => (
          <li key={b.jalur} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-slate-500">/</span>}
            {i === butir.length - 1 ? (
              <span className="font-semibold text-emas-300">{b.nama}</span>
            ) : (
              <Link href={b.jalur} className="transition hover:text-white">{b.nama}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function KepalaHalaman({
  label, judul, deskripsi, remah, anak,
}: { label?: string; judul: string; deskripsi?: string; remah?: { nama: string; jalur: string }[]; anak?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emas-500/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" aria-hidden="true" />
      <div className="wadah relative">
        {remah && <Remah butir={remah} />}
        {label && <span className="label-bagian-gelap">{label}</span>}
        <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight !text-white sm:text-4xl lg:text-5xl">{judul}</h1>
        {deskripsi && <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-300 sm:text-base">{deskripsi}</p>}
        {anak}
      </div>
    </section>
  )
}

export function AjakanBertindak({
  judul = 'Siap menjadi mitra kerja Anda',
  deskripsi = 'Sampaikan kebutuhan objek Anda. Tim kami melakukan survei lokasi dan menyerahkan penawaran resmi maksimal 3 hari kerja.',
}: { judul?: string; deskripsi?: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-emas-500/15 blur-3xl" aria-hidden="true" />
      <div className="wadah relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <div className="max-w-2xl">
          <span className="label-bagian-gelap">Mulai kerja sama</span>
          <h2 className="mt-4 text-3xl font-bold !text-white sm:text-4xl">{judul}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-300">{deskripsi}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Link href="/kontak" className="tombol-utama">
            Minta Penawaran <Panah className="h-4 w-4" />
          </Link>
          <Link href="/layanan" className="tombol-garis">Lihat Layanan</Link>
        </div>
      </div>
    </section>
  )
}

export function Statistik({ angka }: { angka: { label: string; nilai: string; keterangan?: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
      {angka.map((a) => (
        <div key={a.label} className="bg-navy-950 px-6 py-7 text-center">
          <dd className="font-judul text-3xl font-bold text-emas-400 sm:text-4xl">{a.nilai}</dd>
          <dt className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-300">{a.label}</dt>
          {a.keterangan && <p className="mt-1 text-[11px] text-slate-500">{a.keterangan}</p>}
        </div>
      ))}
    </dl>
  )
}
