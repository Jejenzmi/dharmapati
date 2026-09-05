'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Panah, Silang } from './ikon'

export type Butir = { gambar: string; judul: string; kategori: string; keterangan?: string | null }

export default function Galeri({ butir, tanpaSaring = false }: { butir: Butir[]; tanpaSaring?: boolean }) {
  const kategori = useMemo(() => ['Semua', ...Array.from(new Set(butir.map((b) => b.kategori)))], [butir])
  const [aktif, setAktif] = useState('Semua')
  const [indeks, setIndeks] = useState<number | null>(null)

  const tersaring = useMemo(
    () => (aktif === 'Semua' ? butir : butir.filter((b) => b.kategori === aktif)),
    [butir, aktif],
  )

  useEffect(() => {
    if (indeks === null) return
    const tombol = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndeks(null)
      if (e.key === 'ArrowRight') setIndeks((i) => (i === null ? null : (i + 1) % tersaring.length))
      if (e.key === 'ArrowLeft') setIndeks((i) => (i === null ? null : (i - 1 + tersaring.length) % tersaring.length))
    }
    window.addEventListener('keydown', tombol)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', tombol)
      document.body.style.overflow = ''
    }
  }, [indeks, tersaring.length])

  const terbuka = indeks === null ? null : tersaring[indeks]

  return (
    <>
      <div className={`mb-8 flex-wrap gap-2 ${tanpaSaring ? 'hidden' : 'flex'}`}>
        {kategori.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => { setAktif(k); setIndeks(null) }}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              aktif === k ? 'bg-navy-950 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {tersaring.map((b, i) => (
          <button
            key={b.gambar}
            type="button"
            onClick={() => setIndeks(i)}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-emas-400"
          >
            <Image
              src={b.gambar}
              alt={b.judul}
              width={600}
              height={800}
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
              className="h-auto w-full transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
              <span className="text-left text-xs font-semibold text-white">{b.judul}</span>
            </span>
          </button>
        ))}
      </div>

      {!tersaring.length && <p className="py-16 text-center text-slate-400">Belum ada dokumentasi pada kategori ini.</p>}

      {terbuka && (
        <div
          className="fixed inset-0 z-[950] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label={terbuka.judul}
          onClick={() => setIndeks(null)}
        >
          <button type="button" onClick={() => setIndeks(null)} aria-label="Tutup" className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20">
            <Silang className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={(e) => { e.stopPropagation(); setIndeks((i) => (i === null ? null : (i - 1 + tersaring.length) % tersaring.length)) }}
            className="absolute left-3 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-8"
          >
            <Panah className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={(e) => { e.stopPropagation(); setIndeks((i) => (i === null ? null : (i + 1) % tersaring.length)) }}
            className="absolute right-3 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-8"
          >
            <Panah className="h-5 w-5" />
          </button>

          <figure className="max-h-[88vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={terbuka.gambar}
              alt={terbuka.judul}
              width={1400}
              height={1000}
              className="max-h-[76vh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center">
              <p className="text-sm font-semibold text-white">{terbuka.judul}</p>
              <p className="mt-1 text-xs text-slate-400">{terbuka.kategori} · {indeks! + 1} dari {tersaring.length}</p>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
