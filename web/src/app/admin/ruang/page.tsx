'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { ambilToken, apiAdmin, hapusToken, SUMBER } from '@/lib/admin'
import { API_PERAMBAN } from '@/lib/api'
import Pengelola from '@/komponen/admin/Pengelola'

type Ringkasan = {
  angka: { klien: number; layanan: number; artikel: number; pesanBaru: number; lamaranBaru: number; galeri: number }
  pesanTerbaru: { id: string; nama: string; perusahaan: string | null; layanan: string | null; pesan: string; dibuatAt: string }[]
}

function Isi() {
  const arahkan = useRouter()
  const [tab, setTab] = useState('ringkasan')
  const [ringkasan, setRingkasan] = useState<Ringkasan | null>(null)
  const [siap, setSiap] = useState(false)

  const muatRingkasan = useCallback(async () => {
    try {
      setRingkasan(await apiAdmin<Ringkasan>('/admin/ringkasan'))
      setSiap(true)
    } catch {
      hapusToken()
      arahkan.replace('/admin')
    }
  }, [arahkan])

  useEffect(() => {
    if (!ambilToken()) { arahkan.replace('/admin'); return }
    muatRingkasan()
  }, [arahkan, muatRingkasan])

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

  const sumberAktif = SUMBER.find((s) => s.kunci === tab)

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy-950 p-5 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Image src="/merek/logo-192.png" alt="Dharmapati" width={36} height={42} className="h-10 w-auto" />
          <span className="text-sm font-bold leading-tight text-white">Panel<br /><span className="text-emas-400">Dharmapati</span></span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <button
            type="button"
            onClick={() => setTab('ringkasan')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === 'ringkasan' ? 'bg-emas-500 text-navy-950' : 'text-slate-300 hover:bg-white/5'}`}
          >
            📊 Ringkasan
          </button>
          {SUMBER.map((s) => (
            <button
              key={s.kunci}
              type="button"
              onClick={() => setTab(s.kunci)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === s.kunci ? 'bg-emas-500 text-navy-950' : 'text-slate-300 hover:bg-white/5'}`}
            >
              <span aria-hidden="true">{s.ikon}</span> {s.label}
              {s.kunci === 'pesan' && ringkasan?.angka.pesanBaru ? (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{ringkasan.angka.pesanBaru}</span>
              ) : null}
              {s.kunci === 'lamaran' && ringkasan?.angka.lamaranBaru ? (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">{ringkasan.angka.lamaranBaru}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
          <button type="button" onClick={bersihkanSinggahan} className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10">
            Bersihkan singgahan
          </button>
          <button type="button" onClick={keluar} className="w-full rounded-xl bg-rose-500/15 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/25">
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
          <Image src="/merek/logo-192.png" alt="Dharmapati" width={28} height={32} className="h-8 w-auto" />
          <select value={tab} onChange={(e) => setTab(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="ringkasan">Ringkasan</option>
            {SUMBER.map((s) => <option key={s.kunci} value={s.kunci}>{s.label}</option>)}
          </select>
          <button type="button" onClick={keluar} className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">Keluar</button>
        </header>

        <main className="p-5 sm:p-8">
          {tab === 'ringkasan' && ringkasan && (
            <>
              <h1 className="mb-6 text-2xl font-bold">Ringkasan</h1>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[
                  { l: 'Pesan baru', v: ringkasan.angka.pesanBaru, w: 'bg-rose-500' },
                  { l: 'Lamaran baru', v: ringkasan.angka.lamaranBaru, w: 'bg-amber-500' },
                  { l: 'Klien', v: ringkasan.angka.klien, w: 'bg-navy-900' },
                  { l: 'Layanan', v: ringkasan.angka.layanan, w: 'bg-emerald-600' },
                  { l: 'Artikel', v: ringkasan.angka.artikel, w: 'bg-sky-600' },
                  { l: 'Galeri', v: ringkasan.angka.galeri, w: 'bg-violet-600' },
                ].map((a) => (
                  <div key={a.l} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <span className={`mb-3 inline-block h-1.5 w-8 rounded-full ${a.w}`} />
                    <p className="font-judul text-3xl font-bold text-navy-900">{a.v}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{a.l}</p>
                  </div>
                ))}
              </div>

              <h2 className="mb-4 mt-10 text-lg font-bold">Pesan terbaru</h2>
              <div className="space-y-3">
                {ringkasan.pesanTerbaru.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-navy-900">{p.nama}</span>
                      {p.perusahaan && <span className="text-sm text-slate-500">· {p.perusahaan}</span>}
                      {p.layanan && <span className="rounded-full bg-emas-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emas-700">{p.layanan}</span>}
                      <span className="ml-auto text-xs text-slate-400">{new Date(p.dibuatAt).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.pesan}</p>
                  </div>
                ))}
                {!ringkasan.pesanTerbaru.length && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">Belum ada pesan masuk.</p>}
              </div>
            </>
          )}

          {sumberAktif && <Pengelola key={sumberAktif.kunci} sumber={sumberAktif} />}
        </main>
      </div>
    </div>
  )
}

export default function RuangAdmin() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-slate-400">Memuat…</div>}>
      <Isi />
    </Suspense>
  )
}
