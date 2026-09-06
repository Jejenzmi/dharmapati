'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiAdmin, type Bidang, type Sumber } from '@/lib/admin'
import { Panah, Silang } from '../ikon'

type Baris = Record<string, any>

const WARNA_STATUS: Record<string, string> = {
  BARU: 'bg-blue-100 text-blue-800',
  DIPROSES: 'bg-orange-100 text-orange-800',
  SELEKSI: 'bg-orange-100 text-orange-800',
  SELESAI: 'bg-emerald-100 text-emerald-800',
  DITERIMA: 'bg-emerald-100 text-emerald-800',
  BATAL: 'bg-slate-100 text-slate-600',
  DITOLAK: 'bg-slate-100 text-slate-600',
}

export default function Pengelola({ sumber }: { sumber: Sumber }) {
  const [data, setData] = useState<Baris[]>([])
  const [muat, setMuat] = useState(true)
  const [galat, setGalat] = useState('')
  const [sunting, setSunting] = useState<Baris | null>(null)
  const [cari, setCari] = useState('')

  const ambilData = useCallback(async () => {
    setMuat(true); setGalat('')
    try {
      setData(await apiAdmin<Baris[]>(`/admin/data/${sumber.kunci}`))
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal memuat data')
    } finally {
      setMuat(false)
    }
  }, [sumber.kunci])

  useEffect(() => { ambilData() }, [ambilData])

  const kolom = sumber.bidang.filter((b) => b.diTabel).slice(0, 5)
  const tersaring = useMemo(
    () => (cari ? data.filter((d) => JSON.stringify(d).toLowerCase().includes(cari.toLowerCase())) : data),
    [data, cari],
  )

  async function hapus(baris: Baris) {
    if (!confirm('Hapus data ini? Tindakan tidak dapat dibatalkan.')) return
    try {
      await apiAdmin(`/admin/data/${sumber.kunci}/${baris.id}`, { method: 'DELETE' })
      await ambilData()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal menghapus')
    }
  }

  return (
    <div>
      {/* Bilah alat */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <span aria-hidden="true" className="text-xl">{sumber.ikon}</span>
        <span>
          <span className="block text-sm font-bold text-navy-900">{sumber.label}</span>
          <span className="block text-[11px] text-slate-500">
            {muat ? 'memuat…' : `${data.length} baris${sumber.bacaSaja ? ' · hanya baca' : ''}`}
          </span>
        </span>

        <span className="relative ml-auto">
          <input
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari…"
            aria-label={`Cari ${sumber.label}`}
            className="w-44 rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-emas-500 focus:ring-4 focus:ring-emas-500/10 sm:w-60"
          />
          <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" strokeLinecap="round" />
          </svg>
        </span>

        {!sumber.bacaSaja && (
          <button type="button" onClick={() => setSunting({})} className="rounded-xl bg-navy-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800">
            + Tambah
          </button>
        )}
      </div>

      {galat && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              {kolom.map((k) => <th key={k.nama} scope="col" className="px-5 py-3.5 font-bold">{k.label}</th>)}
              <th scope="col" className="px-5 py-3.5 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {muat && Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {kolom.map((k) => <td key={k.nama} className="px-5 py-4"><span className="block h-3 w-24 animate-pulse rounded bg-slate-100" /></td>)}
                <td className="px-5 py-4"><span className="ml-auto block h-3 w-14 animate-pulse rounded bg-slate-100" /></td>
              </tr>
            ))}

            {!muat && !tersaring.length && (
              <tr>
                <td colSpan={kolom.length + 1} className="px-5 py-16 text-center">
                  <p className="text-3xl" aria-hidden="true">{sumber.ikon}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    {cari ? 'Tidak ada yang cocok dengan pencarian' : `Belum ada ${sumber.label.toLowerCase()}`}
                  </p>
                  {cari
                    ? <button type="button" onClick={() => setCari('')} className="mt-3 text-xs font-bold text-navy-700 hover:text-emas-600">Hapus pencarian</button>
                    : !sumber.bacaSaja && (
                      <button type="button" onClick={() => setSunting({})} className="mt-4 rounded-xl bg-navy-950 px-4 py-2 text-xs font-bold text-white">
                        + Tambah data pertama
                      </button>
                    )}
                </td>
              </tr>
            )}

            {!muat && tersaring.map((b) => (
              <tr key={b.id} className="transition hover:bg-slate-50/70">
                {kolom.map((k) => (
                  <td key={k.nama} className="max-w-[260px] px-5 py-3.5 text-slate-700">
                    {k.jenis === 'saklar' ? (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${b[k.nama] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${b[k.nama] ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {b[k.nama] ? 'Aktif' : 'Nonaktif'}
                      </span>
                    ) : k.nama === 'status' ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${WARNA_STATUS[b[k.nama]] ?? 'bg-slate-100 text-slate-600'}`}>
                        {b[k.nama]}
                      </span>
                    ) : (
                      <span className="block truncate">{String(b[k.nama] ?? '—')}</span>
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap px-5 py-3.5 text-right">
                  <button type="button" onClick={() => setSunting(b)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-navy-800 transition hover:bg-slate-100">
                    {sumber.bacaSaja ? 'Lihat' : 'Ubah'}
                  </button>
                  <button type="button" onClick={() => hapus(b)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sunting && (
        <Formulir
          sumber={sumber}
          awal={sunting}
          tutup={() => setSunting(null)}
          selesai={async () => { setSunting(null); await ambilData() }}
        />
      )}
    </div>
  )
}

function Formulir({ sumber, awal, tutup, selesai }: { sumber: Sumber; awal: Baris; tutup: () => void; selesai: () => void }) {
  const [nilai, setNilai] = useState<Baris>(() => {
    const dasar: Baris = {}
    sumber.bidang.forEach((b) => {
      dasar[b.nama] = awal[b.nama] ?? (b.jenis === 'daftar' ? [] : b.jenis === 'saklar' ? true : b.jenis === 'angka' ? 0 : '')
    })
    return dasar
  })
  const [simpan, setSimpan] = useState(false)
  const [galat, setGalat] = useState('')
  const baru = !awal.id

  useEffect(() => {
    const tombol = (e: KeyboardEvent) => { if (e.key === 'Escape') tutup() }
    window.addEventListener('keydown', tombol)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', tombol); document.body.style.overflow = '' }
  }, [tutup])

  async function kirim(e: React.FormEvent) {
    e.preventDefault()
    setSimpan(true); setGalat('')
    try {
      const muatan: Baris = {}
      sumber.bidang.forEach((b) => {
        let v = nilai[b.nama]
        if (b.jenis === 'angka') v = v === '' || v === null ? null : Number(v)
        if (b.jenis === 'daftar') v = Array.isArray(v) ? v : String(v).split('\n').map((s) => s.trim()).filter(Boolean)
        if (b.jenis === 'teks' && v === '') v = null
        muatan[b.nama] = v
      })
      await apiAdmin(
        baru ? `/admin/data/${sumber.kunci}` : `/admin/data/${sumber.kunci}/${awal.id}`,
        { method: baru ? 'POST' : 'PUT', body: JSON.stringify(muatan) },
      )
      selesai()
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal menyimpan')
    } finally {
      setSimpan(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[960] flex justify-end bg-navy-950/50 backdrop-blur-sm" onClick={tutup}>
      <form
        onSubmit={kirim}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{sumber.label}</p>
            <h2 className="font-judul text-xl font-bold text-navy-900">{baru ? 'Tambah data' : 'Ubah data'}</h2>
          </div>
          <button type="button" onClick={tutup} aria-label="Tutup" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-navy-900">
            <Silang className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-7 py-6">
          {sumber.bidang.map((b) => (
            <Isian key={b.nama} bidang={b} nilai={nilai[b.nama]} ubah={(v) => setNilai((n) => ({ ...n, [b.nama]: v }))} />
          ))}
          {galat && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>}
        </div>

        <footer className="flex items-center gap-3 border-t border-slate-200 px-7 py-5">
          <button type="submit" disabled={simpan} className="inline-flex items-center gap-2 rounded-xl bg-emas-500 px-6 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-emas-400 disabled:opacity-60">
            {simpan ? 'Menyimpan…' : <>Simpan <Panah className="h-4 w-4" /></>}
          </button>
          <button type="button" onClick={tutup} className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50">Batal</button>
        </footer>
      </form>
    </div>
  )
}

const KELAS = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emas-500 focus:ring-4 focus:ring-emas-500/10'

function Isian({ bidang, nilai, ubah }: { bidang: Bidang; nilai: any; ubah: (v: any) => void }) {
  if (bidang.jenis === 'saklar') {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <input type="checkbox" checked={!!nilai} onChange={(e) => ubah(e.target.checked)} className="h-4 w-4 rounded accent-emas-500" />
        <span className="text-sm font-semibold text-slate-700">{bidang.label}</span>
      </label>
    )
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {bidang.label}{bidang.wajib && <span className="text-rose-500"> *</span>}
      </span>

      {bidang.jenis === 'panjang' && (
        <textarea rows={bidang.nama === 'isi' || bidang.nama === 'deskripsi' ? 10 : 3} value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} required={bidang.wajib} className={KELAS} />
      )}
      {bidang.jenis === 'daftar' && (
        <textarea rows={5} value={Array.isArray(nilai) ? nilai.join('\n') : (nilai ?? '')} onChange={(e) => ubah(e.target.value.split('\n'))} className={KELAS} />
      )}
      {bidang.jenis === 'pilih' && (
        <select value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} className={KELAS}>
          <option value="">—</option>
          {bidang.pilihan?.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      )}
      {bidang.jenis === 'angka' && (
        <input type="number" step="any" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} required={bidang.wajib} className={KELAS} />
      )}
      {bidang.jenis === 'gambar' && <PilihGambar nilai={nilai} ubah={ubah} />}
      {bidang.jenis === 'teks' && (
        <input type="text" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} required={bidang.wajib} className={KELAS} />
      )}

      {bidang.bantuan && <span className="mt-1 block text-xs text-slate-400">{bidang.bantuan}</span>}
    </label>
  )
}

function PilihGambar({ nilai, ubah }: { nilai: any; ubah: (v: any) => void }) {
  const [naik, setNaik] = useState(false)

  async function unggah(berkas: File) {
    setNaik(true)
    try {
      const bentuk = new FormData()
      bentuk.append('berkas', berkas)
      bentuk.append('folder', 'situs')
      const hasil = await apiAdmin<{ url: string }>('/admin/unggah', { method: 'POST', body: bentuk })
      ubah(hasil.url)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal mengunggah')
    } finally {
      setNaik(false)
    }
  }

  return (
    <div className="space-y-2">
      <input type="text" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} placeholder="URL gambar atau unggah berkas" className={KELAS} />
      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) unggah(f) }}
          className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-navy-950 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
        />
        {naik && <span className="text-xs text-slate-400">Mengunggah…</span>}
        {nilai && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={nilai} alt="Pratinjau" className="ml-auto h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200" />
        )}
      </div>
    </div>
  )
}
