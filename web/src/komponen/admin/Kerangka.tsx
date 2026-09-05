'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { ambilToken, apiAdmin, hapusToken, SUMBER } from '@/lib/admin'
import { API_PERAMBAN } from '@/lib/api'

type Hitung = { pesanBaru: number; lamaranBaru: number }

export default function Kerangka({ children }: { children: React.ReactNode }) {
  const arahkan = useRouter()
  const jalurKini = usePathname()
  const [siap, setSiap] = useState(false)
  const [hitung, setHitung] = useState<Hitung>({ pesanBaru: 0, lamaranBaru: 0 })
  const [laci, setLaci] = useState(false)

  const periksa = useCallback(async () => {
    if (!ambilToken()) { arahkan.replace('/admin'); return }
    try {
      const r = await apiAdmin<{ angka: Hitung }>('/admin/ringkasan')
      setHitung({ pesanBaru: r.angka.pesanBaru, lamaranBaru: r.angka.lamaranBaru })
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

  if (!siap) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Memuat panel…</div>

  const aktif = (jalur: string) => jalurKini === jalur

  const daftarMenu = (
    <>
      <Link
        href="/admin/ruang"
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          aktif('/admin/ruang') ? 'bg-emas-500 text-navy-950' : 'text-slate-300 hover:bg-white/5'
        }`}
      >
        📊 Ringkasan
      </Link>
      {SUMBER.map((s) => {
        const jalur = `/admin/ruang/${s.kunci}`
        const lencana = s.kunci === 'pesan' ? hitung.pesanBaru : s.kunci === 'lamaran' ? hitung.lamaranBaru : 0
        return (
          <Link
            key={s.kunci}
            href={jalur}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              aktif(jalur) ? 'bg-emas-500 text-navy-950' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span aria-hidden="true">{s.ikon}</span> {s.label}
            {lencana > 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${aktif(jalur) ? 'bg-navy-950 text-white' : 'bg-rose-500 text-white'}`}>
                {lencana}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 p-5 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Image src="/merek/logo-192.png" alt="Dharmapati" width={36} height={42} className="h-10 w-auto" />
          <span className="text-sm font-bold leading-tight text-white">Panel<br /><span className="text-emas-400">Dharmapati</span></span>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Menu panel admin">{daftarMenu}</nav>
        <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
          <button type="button" onClick={bersihkanSinggahan} className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10">
            Bersihkan singgahan
          </button>
          <button type="button" onClick={keluar} className="w-full rounded-xl bg-rose-500/15 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/25">
            Keluar
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
          <button type="button" onClick={() => setLaci((v) => !v)} aria-label="Buka menu panel" className="rounded-lg bg-navy-950 p-2 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <Image src="/merek/logo-192.png" alt="Dharmapati" width={28} height={32} className="h-8 w-auto" />
          <span className="flex-1 text-sm font-bold text-navy-900">Panel Admin</span>
          <button type="button" onClick={keluar} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">Keluar</button>
        </header>

        {laci && (
          <nav className="border-b border-slate-200 bg-navy-950 p-4 lg:hidden" aria-label="Menu panel admin">
            <div className="space-y-1">{daftarMenu}</div>
          </nav>
        )}

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
