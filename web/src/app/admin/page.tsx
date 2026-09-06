'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { API_PERAMBAN } from '@/lib/api'
import { simpanToken } from '@/lib/admin'
import { FOTO } from '@/lib/foto'
import { Panah, Perisai, Silang } from '@/komponen/ikon'

export default function Masuk() {
  const arahkan = useRouter()
  const [galat, setGalat] = useState('')
  const [proses, setProses] = useState(false)
  const [lihat, setLihat] = useState(false)

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProses(true); setGalat('')
    const isi = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const respons = await fetch(`${API_PERAMBAN}/api/auth/masuk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(isi),
      })
      const hasil = await respons.json().catch(() => ({}))
      if (!respons.ok) throw new Error(hasil.pesan ?? 'Gagal masuk')
      simpanToken(hasil.token)
      arahkan.push('/admin/ruang')
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal masuk')
      setProses(false)
    }
  }

  const kelas =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emas-500 focus:ring-4 focus:ring-emas-500/15'

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      {/* Panel merek */}
      <aside className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <Image src={FOTO.hormat} alt="" fill sizes="55vw" className="object-cover opacity-25" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-emas-500/15 blur-[100px]" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/merek/logo-192.png" alt="Logo Dharmapati" width={48} height={56} className="h-14 w-auto" />
            <span className="leading-tight">
              <span className="block font-judul text-lg font-bold text-white">DHARMAPATI</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-emas-400">Putra Nusantara</span>
            </span>
          </Link>

          <div className="max-w-md">
            <span className="label-bagian-gelap"><Perisai className="h-3.5 w-3.5" /> Panel pengelolaan</span>
            <h1 className="mt-5 font-judul text-4xl font-bold leading-tight text-white">
              Ruang kendali isi situs
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300">
              Kelola layanan, klien, artikel, lowongan, galeri, hingga seluruh teks halaman —
              tanpa menyentuh satu baris kode.
            </p>
            <ul className="mt-8 space-y-2.5">
              {['Kotak masuk penawaran & lamaran', 'Peta sebaran klien', 'Pengaturan teks seluruh halaman'].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emas-400" />{t}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-500">© {new Date().getFullYear()} PT. Dharmapati Putra Nusantara</p>
        </div>
      </aside>

      {/* Formulir */}
      <main className="flex items-center justify-center bg-slate-50 px-5 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/merek/logo-192.png" alt="Logo Dharmapati" width={40} height={46} className="h-12 w-auto" />
            <span className="font-judul text-base font-bold text-navy-900">DHARMAPATI</span>
          </Link>

          <h2 className="font-judul text-2xl font-bold text-navy-900">Masuk ke panel</h2>
          <p className="mt-1.5 text-sm text-slate-500">Gunakan akun yang diberikan administrator.</p>

          <form onSubmit={kirim} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Nama pengguna</span>
              <input name="username" required autoComplete="username" autoFocus className={kelas} placeholder="admin" />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Kata sandi</span>
              <span className="relative block">
                <input
                  type={lihat ? 'text' : 'password'}
                  name="kataSandi"
                  required
                  autoComplete="current-password"
                  className={`${kelas} pr-20`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setLihat((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 transition hover:bg-slate-100 hover:text-navy-800"
                >
                  {lihat ? 'Sembunyi' : 'Lihat'}
                </button>
              </span>
            </label>

            {galat && (
              <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <Silang className="mt-0.5 h-4 w-4 shrink-0" /> {galat}
              </p>
            )}

            <button
              type="submit"
              disabled={proses}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 py-3.5 text-sm font-bold text-white transition hover:bg-navy-800 disabled:opacity-60"
            >
              {proses ? 'Memproses…' : <>Masuk <Panah className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-400">
            Halaman ini tidak diindeks mesin pencari. Bila lupa kata sandi, hubungi administrator sistem.
          </p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-navy-700 hover:text-emas-600">
            <Panah className="h-3.5 w-3.5 rotate-180" /> Kembali ke situs
          </Link>
        </div>
      </main>
    </div>
  )
}
