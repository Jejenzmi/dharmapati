'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Silang, Telepon, Wa } from './ikon'

const MENU = [
  { label: 'Beranda', jalur: '/' },
  { label: 'Tentang', jalur: '/tentang' },
  { label: 'Layanan', jalur: '/layanan' },
  { label: 'Klien & Jangkauan', jalur: '/klien' },
  { label: 'Legalitas', jalur: '/legalitas' },
  { label: 'Galeri', jalur: '/galeri' },
  { label: 'Karier', jalur: '/karier' },
  { label: 'Artikel', jalur: '/artikel' },
]

export default function Kepala({ telepon, whatsapp }: { telepon: string; whatsapp: string }) {
  const jalurKini = usePathname()
  const [terbuka, setTerbuka] = useState(false)
  const [digulir, setDigulir] = useState(false)

  useEffect(() => setTerbuka(false), [jalurKini])
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

  const aktif = (jalur: string) => (jalur === '/' ? jalurKini === '/' : jalurKini.startsWith(jalur))

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
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition hover:text-emerald-300"
            >
              <Wa className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-[900] transition-all duration-300 ${
          digulir ? 'bg-navy-950/95 shadow-lg shadow-navy-950/20 backdrop-blur' : 'bg-navy-950'
        }`}
      >
        <div className="wadah flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Beranda Dharmapati">
            <Image src="/merek/logo-192.png" alt="Logo PT. Dharmapati Putra Nusantara" width={44} height={50} className="h-11 w-auto" priority />
            <span className="leading-tight">
              <span className="block font-judul text-base font-bold tracking-wide text-white sm:text-lg">DHARMAPATI</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-emas-400">Putra Nusantara</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Menu utama">
            {MENU.map((m) => (
              <Link
                key={m.jalur}
                href={m.jalur}
                className={`relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                  aktif(m.jalur) ? 'text-emas-300' : 'text-slate-200 hover:text-white'
                }`}
              >
                {m.label}
                {aktif(m.jalur) && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-emas-400" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
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
              {terbuka ? <Silang className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Laci menu untuk layar kecil */}
      <div
        className={`fixed inset-0 z-[890] bg-navy-950/60 backdrop-blur-sm transition-opacity xl:hidden ${
          terbuka ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setTerbuka(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-[895] flex h-full w-[86%] max-w-sm flex-col bg-navy-950 px-6 py-6 shadow-2xl transition-transform duration-300 xl:hidden ${
          terbuka ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!terbuka}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-judul text-lg font-bold text-white">Menu</span>
          <button type="button" onClick={() => setTerbuka(false)} aria-label="Tutup menu" className="rounded-lg bg-white/10 p-2 text-white">
            <Silang className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto" aria-label="Menu utama telepon genggam">
          {MENU.map((m) => (
            <Link
              key={m.jalur}
              href={m.jalur}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                aktif(m.jalur) ? 'bg-emas-500/15 text-emas-300' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {m.label}
            </Link>
          ))}
          <Link href="/faq" className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">Tanya Jawab</Link>
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
