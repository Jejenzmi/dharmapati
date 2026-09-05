'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { API_PERAMBAN } from '@/lib/api'
import { simpanToken } from '@/lib/admin'

export default function Masuk() {
  const arahkan = useRouter()
  const [galat, setGalat] = useState('')
  const [proses, setProses] = useState(false)

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 p-5">
      <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
      <form onSubmit={kirim} className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-7 text-center">
          <Image src="/merek/logo-192.png" alt="Logo Dharmapati" width={56} height={64} className="mx-auto h-16 w-auto" />
          <h1 className="mt-4 text-xl font-bold">Panel Admin</h1>
          <p className="mt-1 text-sm text-slate-500">PT. Dharmapati Putra Nusantara</p>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Nama pengguna</span>
          <input name="username" required autoComplete="username" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emas-500 focus:ring-4 focus:ring-emas-500/10" />
        </label>
        <label className="mb-5 block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Kata sandi</span>
          <input type="password" name="kataSandi" required autoComplete="current-password" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emas-500 focus:ring-4 focus:ring-emas-500/10" />
        </label>

        {galat && <p role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>}

        <button type="submit" disabled={proses} className="w-full rounded-xl bg-navy-950 py-3 text-sm font-bold text-white transition hover:bg-navy-800 disabled:opacity-60">
          {proses ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
