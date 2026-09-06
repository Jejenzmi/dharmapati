'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { ambilToken, apiAdmin, hapusToken, SUMBER } from '@/lib/admin'
import { API_PERAMBAN } from '@/lib/api'
import { Menu as IkonMenu, Panah, Silang } from '../ikon'

type Hitung = { pesanBaru: number; lamaranBaru: number }
type Saya = { nama: string; peran: string }

const KELOMPOK = ['Masuk', 'Konten', 'Profil'] as const
const JUDUL_KELOMPOK: Record<string, string> = {
  Masuk: 'Kotak masuk',
  Konten: 'Konten situs',
  Profil: 'Profil perusahaan',
}

export default function Kerangka({ children }: { children: React.ReactNode }) {
  const arahkan = useRouter()
  const jalurKini = usePathname()
  const [siap, setSiap] = useState(false)
  const [hitung, setHitung] = useState<Hitung>({ pesanBaru: 0, lamaranBaru: 0 })
  const [saya, setSaya] = useState<Saya | null>(null)
  const [laci, setLaci] = useState(false)

  const periksa = useCallback(async () => {
    if (!ambilToken()) { arahkan.replace('/admin'); return }
    try {
      const [r, u] = await Promise.all([
        apiAdmin<{ angka: Hitung }>('/admin/ringkasan'),
        apiAdmin<Saya>('/auth/saya').catch(() => null),
      ])
      setHitung({ pesanBaru: r.angka.pesanBaru, lamaranBaru: r.angka.lamaranBaru })
      if (u) setSaya(u)
      setSiap(true)
    } catch {
      hapusToken()
      arahkan.replace('/admin')
    }
  }, [arahkan])

  useEffect(() => { periksa() }, [periksa])
  useEffect(() => { setLaci(false) }, [jalurKini])

  async function keluar() {
    await fetch(`${API_PERAMBAN}/api/auth/keluar`, { method: 'POST', credentials: 'include' }).catch(() => {})
    hapusToken()
    arahkan.replace('/admin')
  }

  async function bersihkanSinggahan() {
    try {
      await apiAdmin('/admin/singgahan/bersihkan', { method: 'POST' })
      alert('Singgahan dibersihkan. Perubahan akan tampil di situs dalam beberapa saat.')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal')
    }
  }

  if (!siap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-emas-500" />
          <p className="text-sm text-slate-400">Memuat panel…</p>
        </div>
      </div>
    )
  }

  const aktif = (jalur: string) => jalurKini === jalur
  const judulHalaman =
    jalurKini === '/admin/ruang' ? 'Ringkasan'
    : jalurKini === '/admin/ruang/pengaturan' ? 'Pengaturan Situs'
    : SUMBER.find((s) => jalurKini === `/admin/ruang/${s.kunci}`)?.label ?? 'Panel'

  const butirNav = (
    <>
      <Link
        href="/admin/ruang"
        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
          aktif('/admin/ruang') ? 'bg-emas-500 text-navy-950 shadow-lg shadow-emas-500/20' : 'text-slate-300 hover:bg-white/[.06] hover:text-white'
        }`}
      >
        <span aria-hidden="true" className="w-5 text-center">📊</span> Ringkasan
      </Link>

      {KELOMPOK.map((kel) => (
        <div key={kel} className="pt-4">
          <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{JUDUL_KELOMPOK[kel]}</p>
          <div className="space-y-0.5">
            {SUMBER.filter((s) => s.kelompok === kel).map((s) => {
              const jalur = `/admin/ruang/${s.kunci}`
              const lencana = s.kunci === 'pesan' ? hitung.pesanBaru : s.kunci === 'lamaran' ? hitung.lamaranBaru : 0
              return (
                <Link
                  key={s.kunci}
                  href={jalur}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    aktif(jalur) ? 'bg-emas-500 text-navy-950 shadow-lg shadow-emas-500/20' : 'text-slate-300 hover:bg-white/[.06] hover:text-white'
                  }`}
                >
                  <span aria-hidden="true" className="w-5 text-center">{s.ikon}</span>
                  <span className="flex-1 truncate">{s.label}</span>
                  {lencana > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${aktif(jalur) ? 'bg-navy-950 text-white' : 'bg-rose-500 text-white'}`}>
                      {lencana}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      <div className="pt-4">
        <p className="mb-1.5 px-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Sistem</p>
        <Link
          href="/admin/ruang/pengaturan"
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
            aktif('/admin/ruang/pengaturan') ? 'bg-emas-500 text-navy-950 shadow-lg shadow-emas-500/20' : 'text-slate-300 hover:bg-white/[.06] hover:text-white'
          }`}
        >
          <span aria-hidden="true" className="w-5 text-center">⚙️</span> Pengaturan Situs
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Bilah samping */}
      <aside className="hidden w-[268px] shrink-0 flex-col bg-navy-950 lg:flex">
        <div className="border-b border-white/10 p-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/merek/logo-192.png" alt="Dharmapati" width={36} height={42} className="h-10 w-auto" />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-judul text-sm font-bold text-white">DHARMAPATI</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-emas-400">Panel Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Menu panel admin">{butirNav}</nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[.04] px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emas-500 font-judul text-sm font-bold text-navy-950">
              {(saya?.nama ?? 'A').charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-bold text-white">{saya?.nama ?? 'Administrator'}</span>
              <span className="block text-[10px] uppercase tracking-wide text-slate-400">{saya?.peran ?? 'ADMIN'}</span>
            </span>
          </div>
          <button type="button" onClick={bersihkanSinggahan} className="mb-1.5 w-full rounded-xl bg-white/[.04] px-3.5 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10">
            Bersihkan singgahan
          </button>
          <button type="button" onClick={keluar} className="w-full rounded-xl bg-rose-500/15 px-3.5 py-2.5 text-xs font-bold text-rose-300 transition hover:bg-rose-500/25">
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Bilah judul */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur sm:px-8">
          <button type="button" onClick={() => setLaci(true)} aria-label="Buka menu panel" className="rounded-xl bg-navy-950 p-2 text-white lg:hidden">
            <IkonMenu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Panel Admin</p>
            <h1 className="truncate font-judul text-lg font-bold text-navy-900">{judulHalaman}</h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-navy-800 transition hover:border-emas-400 hover:text-emas-700 sm:inline-flex"
          >
            Lihat situs <Panah className="h-3.5 w-3.5" />
          </Link>
          <button type="button" onClick={keluar} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 lg:hidden">Keluar</button>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>

      {/* Laci untuk layar kecil */}
      <div
        className={`fixed inset-0 z-[60] bg-navy-950/60 backdrop-blur-sm transition-opacity lg:hidden ${laci ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setLaci(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-[85%] max-w-[290px] flex-col bg-navy-950 transition-transform duration-300 lg:hidden ${laci ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!laci}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <span className="font-judul text-sm font-bold text-white">Panel Admin</span>
          <button type="button" onClick={() => setLaci(false)} aria-label="Tutup menu" className="rounded-lg bg-white/10 p-2 text-white">
            <Silang className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Menu panel admin">{butirNav}</nav>
        <div className="border-t border-white/10 p-3">
          <button type="button" onClick={keluar} className="w-full rounded-xl bg-rose-500/15 px-3.5 py-2.5 text-xs font-bold text-rose-300">Keluar</button>
        </div>
      </aside>
    </div>
  )
}
