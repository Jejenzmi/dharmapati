'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { API_PERAMBAN } from '@/lib/api'
import { Centang, Panah } from './ikon'

const LAYANAN = [
  'Jasa Pengamanan (Satpam)',
  'Pengawalan VIP & Protokoler',
  'Cleaning Service',
  'Pengendalian Hama (Pest Control)',
  'Manpower & Tenaga Produksi',
  'Office Boy & Pramusaji',
  'Driver & Operator Forklift',
  'Perawatan Taman & Parkir',
  'Pelatihan & Sertifikasi',
  'Lainnya',
]

type Keadaan = 'diam' | 'kirim' | 'berhasil' | 'gagal'

export default function FormulirKontak() {
  const parameter = useSearchParams()
  const layananAwal = parameter.get('layanan') ?? ''
  const [keadaan, setKeadaan] = useState<Keadaan>('diam')
  const [pesanBalik, setPesanBalik] = useState('')

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setKeadaan('kirim')
    const isian = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const respons = await fetch(`${API_PERAMBAN}/api/kirim/pesan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isian),
      })
      const hasil = await respons.json().catch(() => ({}))
      if (!respons.ok) throw new Error(hasil.pesan ?? 'Pengiriman gagal')
      setPesanBalik(hasil.pesan ?? 'Pesan terkirim.')
      setKeadaan('berhasil')
      e.currentTarget.reset()
    } catch (galat) {
      setPesanBalik(galat instanceof Error ? galat.message : 'Terjadi kesalahan, coba lagi.')
      setKeadaan('gagal')
    }
  }

  if (keadaan === 'berhasil') {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Centang className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-emerald-900">Pesan Anda terkirim</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-800">{pesanBalik}</p>
        <button type="button" onClick={() => setKeadaan('diam')} className="tombol-navy mt-6">Kirim pesan lain</button>
      </div>
    )
  }

  const kelasIsian =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emas-500 focus:ring-4 focus:ring-emas-500/15'

  return (
    <form onSubmit={kirim} className="space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Nama lengkap *</span>
          <input name="nama" required minLength={2} maxLength={120} className={kelasIsian} placeholder="Nama Anda" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Perusahaan / instansi</span>
          <input name="perusahaan" maxLength={160} className={kelasIsian} placeholder="PT / Dinas / Perumahan" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Surel *</span>
          <input type="email" name="email" required className={kelasIsian} placeholder="nama@perusahaan.co.id" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Telepon / WhatsApp *</span>
          <input name="telepon" required minLength={6} maxLength={30} className={kelasIsian} placeholder="08xx xxxx xxxx" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Layanan yang dibutuhkan</span>
          <select name="layanan" defaultValue={layananAwal} className={kelasIsian}>
            <option value="">Pilih layanan…</option>
            {LAYANAN.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Lokasi objek</span>
          <input name="lokasi" maxLength={160} className={kelasIsian} placeholder="Kota / kawasan industri" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Perkiraan kebutuhan</span>
        <input name="kebutuhan" maxLength={120} className={kelasIsian} placeholder="Contoh: 8 anggota, 3 shift, 2 pos" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Pesan *</span>
        <textarea name="pesan" required minLength={10} maxLength={4000} rows={5} className={kelasIsian} placeholder="Ceritakan kebutuhan objek Anda: luas area, jam operasional, perlengkapan khusus, dan target waktu mulai." />
      </label>

      {/* Umpan lebah untuk menyaring bot — disembunyikan dari pengguna */}
      <input type="text" name="situs" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      {keadaan === 'gagal' && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{pesanBalik}</p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" disabled={keadaan === 'kirim'} className="tombol-utama disabled:cursor-not-allowed disabled:opacity-60">
          {keadaan === 'kirim' ? 'Mengirim…' : <>Kirim Permintaan <Panah className="h-4 w-4" /></>}
        </button>
        <p className="text-xs text-slate-500">Kami balas maksimal 1x24 jam kerja.</p>
      </div>
    </form>
  )
}
