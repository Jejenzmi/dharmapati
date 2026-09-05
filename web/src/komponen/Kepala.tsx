'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { MENU } from '@/lib/navigasi'
import { Menu as IkonMenu, Panah, Silang, Telepon, Wa } from './ikon'

export default function Kepala({ telepon, whatsapp }: { telepon: string; whatsapp: string }) {
  const jalurKini = usePathname()
  const [terbuka, setTerbuka] = useState(false)
  const [digulir, setDigulir] = useState(false)
  const [tarikTurun, setTarikTurun] = useState<string | null>(null)
  const [laciTerbuka, setLaciTerbuka] = useState<string | null>(null)
  const jedaRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setTerbuka(false); setTarikTurun(null) }, [jalurKini])

  useEffect(() => {
    const saatGulir = () => setDigulir(window.scrollY > 24)
    saatGulir()
    window.addEventListener('scroll', saatGulir, { passive: true })
    return () => window.removeEventListener('scroll', saatGulir)
  }, [])

  useEffect(() => {
    document.body.style.overflow = terbuka ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [terbuka])

  useEffect(() => {
    const saatTombol = (e: KeyboardEvent) => { if (e.key === 'Escape') { setTarikTurun(null); setTerbuka(false) } }
    window.addEventListener('keydown', saatTombol)
    return () => window.removeEventListener('keydown', saatTombol)
  }, [])

  /** Aktif bila jalur saat ini berada di dalam cabang menu tersebut. */
  const aktif = (jalur: string) => (jalur === '/' ? jalurKini === '/' : jalurKini === jalur || jalurKini.startsWith(`${jalur}/`))

  function buka(label: string) {
    if (jedaRef.current) clearTimeout(jedaRef.current)
    setTarikTurun(label)
  }
  function tutupTertunda() {
    if (jedaRef.current) clearTimeout(jedaRef.current)
    jedaRef.current = setTimeout(() => setTarikTurun(null), 140)
  }

  return (
    <>
      {/* Bilah atas */}
      <div className="hidden bg-navy-950 py-2 text-[12px] text-slate-300 lg:block">
        <div className="wadah flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Berizin SIO Polri · Anggota ABUJAPI &amp; APKLINDO · ISO 9001:2015
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${telepon}`} className="flex items-center gap-1.5 transition hover:text-emas-300">
              <Telepon className="h-3.5 w-3.5" /> {telepon}
            </a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition hover:text-emerald-300">
              <Wa className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-[900] transition-all duration-300 ${digulir ? 'bg-navy-950/95 shadow-lg shadow-navy-950/20 backdrop-blur' : 'bg-navy-950'}`}>
        <div className="wadah flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Beranda Dharmapati">
            <Image src="/merek/logo-192.png" alt="Logo PT. Dharmapati Putra Nusantara" width={44} height={50} className="h-11 w-auto" priority />
            <span className="leading-tight">
              <span className="block font-judul text-base font-bold tracking-wide text-white sm:text-lg">DHARMAPATI</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-emas-400">Putra Nusantara</span>
            </span>
          </Link>

          <nav className="hidden items-center xl:flex" aria-label="Menu utama">
            {MENU.map((m) => (
              <div
                key={m.label}
                className="relative"
                onMouseEnter={() => m.anak && buka(m.label)}
                onMouseLeave={() => m.anak && tutupTertunda()}
              >
                <Link
                  href={m.jalur}
                  aria-haspopup={m.anak ? 'true' : undefined}
                  aria-expanded={m.anak ? tarikTurun === m.label : undefined}
                  onFocus={() => m.anak && buka(m.label)}
                  className={`relative flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-semibold transition ${
                    aktif(m.jalur) ? 'text-emas-300' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {m.label}
                  {m.anak && (
                    <svg viewBox="0 0 12 12" aria-hidden="true" className={`h-2.5 w-2.5 transition-transform ${tarikTurun === m.label ? 'rotate-180' : ''}`}>
                      <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {aktif(m.jalur) && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-emas-400" />}
                </Link>

                {m.anak && tarikTurun === m.label && (
                  <div className="absolute left-1/2 top-full z-50 w-[320px] -translate-x-1/2 pt-3">
                    <ul className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900 p-2 shadow-2xl shadow-black/50">
                      {m.anak.map((a) => (
                        <li key={a.jalur}>
                          <Link
                            href={a.jalur}
                            className={`group block rounded-xl px-4 py-3 transition ${
                              jalurKini === a.jalur ? 'bg-emas-500/15' : 'hover:bg-white/5'
                            }`}
                          >
                            <span className={`flex items-center gap-2 text-sm font-bold ${jalurKini === a.jalur ? 'text-emas-300' : 'text-white'}`}>
                              {a.label}
                              <Panah className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-60" />
                            </span>
                            {a.ringkas && <span className="mt-0.5 block text-xs leading-snug text-slate-400">{a.ringkas}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/kontak" className="hidden rounded-full bg-emas-500 px-5 py-2.5 text-[13px] font-bold text-navy-950 transition hover:bg-emas-400 sm:inline-flex">
              Minta Penawaran
            </Link>
            <button
              type="button"
              onClick={() => setTerbuka((v) => !v)}
              aria-label={terbuka ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={terbuka}
              className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-white/20 xl:hidden"
            >
              {terbuka ? <Silang className="h-5 w-5" /> : <IkonMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Laci menu untuk layar kecil */}
      <div
        className={`fixed inset-0 z-[890] bg-navy-950/60 backdrop-blur-sm transition-opacity xl:hidden ${terbuka ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setTerbuka(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[895] flex h-full w-[88%] max-w-sm flex-col bg-navy-950 px-5 py-6 shadow-2xl transition-transform duration-300 xl:hidden ${terbuka ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!terbuka}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="font-judul text-lg font-bold text-white">Menu</span>
          <button type="button" onClick={() => setTerbuka(false)} aria-label="Tutup menu" className="rounded-lg bg-white/10 p-2 text-white">
            <Silang className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Menu utama telepon genggam">
          {MENU.map((m) =>
            m.anak ? (
              <div key={m.label} className="rounded-xl bg-white/[.03]">
                <button
                  type="button"
                  onClick={() => setLaciTerbuka((v) => (v === m.label ? null : m.label))}
                  aria-expanded={laciTerbuka === m.label}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    aktif(m.jalur) ? 'text-emas-300' : 'text-slate-200'
                  }`}
                >
                  {m.label}
                  <svg viewBox="0 0 12 12" aria-hidden="true" className={`h-3 w-3 transition-transform ${laciTerbuka === m.label ? 'rotate-180' : ''}`}>
                    <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {laciTerbuka === m.label && (
                  <ul className="space-y-0.5 border-t border-white/10 px-2 py-2">
                    {m.anak.map((a) => (
                      <li key={a.jalur}>
                        <Link
                          href={a.jalur}
                          className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                            jalurKini === a.jalur ? 'bg-emas-500/15 font-semibold text-emas-300' : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {a.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={m.jalur}
                href={m.jalur}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  aktif(m.jalur) ? 'bg-emas-500/15 text-emas-300' : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                {m.label}
              </Link>
            ),
          )}
        </nav>

        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          <Link href="/kontak" className="tombol-utama w-full">Minta Penawaran</Link>
          <a href={`tel:${telepon}`} className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-sm font-semibold text-white">
            <Telepon className="h-4 w-4" /> {telepon}
          </a>
        </div>
      </aside>
    </>
  )
}
