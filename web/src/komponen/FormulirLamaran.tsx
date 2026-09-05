'use client'

import { useState } from 'react'
import { API_PERAMBAN } from '@/lib/api'
import { Centang, Panah } from './ikon'

type Keadaan = 'diam' | 'kirim' | 'berhasil' | 'gagal'

export default function FormulirLamaran({ lowonganId, posisi }: { lowonganId?: string; posisi?: string }) {
  const [keadaan, setKeadaan] = useState<Keadaan>('diam')
  const [balik, setBalik] = useState('')

  async function kirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setKeadaan('kirim')
    const formulir = e.currentTarget
    try {
      const respons = await fetch(`${API_PERAMBAN}/api/kirim/lamaran`, {
        method: 'POST',
        body: new FormData(formulir),
      })
      const hasil = await respons.json().catch(() => ({}))
      if (!respons.ok) throw new Error(hasil.pesan ?? 'Pengiriman gagal')
      setBalik(hasil.pesan ?? 'Lamaran terkirim.')
      setKeadaan('berhasil')
      formulir.reset()
    } catch (galat) {
      setBalik(galat instanceof Error ? galat.message : 'Terjadi kesalahan, coba lagi.')
      setKeadaan('gagal')
    }
  }

  if (keadaan === 'berhasil') {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Centang className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-emerald-900">Lamaran terkirim</h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800">{balik}</p>
        <button type="button" onClick={() => setKeadaan('diam')} className="tombol-navy mt-5">Kirim lamaran lain</button>
      </div>
    )
  }

  const kelas =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emas-500 focus:ring-4 focus:ring-emas-500/15'

  return (
    <form onSubmit={kirim} className="space-y-4">
      {lowonganId && <input type="hidden" name="lowonganId" value={lowonganId} />}
      {posisi && (
        <p className="rounded-xl bg-emas-500/10 px-4 py-3 text-sm text-emas-800">
          Melamar untuk posisi <strong className="font-bold">{posisi}</strong>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Nama lengkap *</span>
          <input name="nama" required minLength={2} className={kelas} placeholder="Sesuai KTP" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Domisili *</span>
          <input name="domisili" required className={kelas} placeholder="Kecamatan, Kabupaten/Kota" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Surel *</span>
          <input type="email" name="email" required className={kelas} placeholder="nama@email.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Nomor WhatsApp *</span>
          <input name="telepon" required minLength={6} className={kelas} placeholder="08xx xxxx xxxx" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Pendidikan terakhir</span>
          <input name="pendidikan" className={kelas} placeholder="SMA / SMK / D3 / S1" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Berkas lamaran (PDF/JPG, maks 5 MB)</span>
          <input
            type="file"
            name="berkas"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-950 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Pengalaman kerja</span>
        <textarea name="pengalaman" rows={3} maxLength={2000} className={kelas} placeholder="Sebutkan perusahaan, posisi, dan lama bekerja." />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Catatan tambahan</span>
        <textarea name="catatan" rows={2} maxLength={2000} className={kelas} placeholder="Sertifikat yang dimiliki, kesiapan penempatan, dsb." />
      </label>

      {keadaan === 'gagal' && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{balik}</p>
      )}

      <button type="submit" disabled={keadaan === 'kirim'} className="tombol-utama disabled:opacity-60">
        {keadaan === 'kirim' ? 'Mengirim…' : <>Kirim Lamaran <Panah className="h-4 w-4" /></>}
      </button>
      <p className="text-xs leading-relaxed text-slate-500">
        Data yang Anda kirim hanya digunakan untuk proses seleksi. Kami tidak memungut biaya apa pun dalam
        seluruh tahapan rekrutmen.
      </p>
    </form>
  )
}
