'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiAdmin, type Bidang, type Sumber } from '@/lib/admin'
import { API_PERAMBAN } from '@/lib/api'
import { Silang } from '../ikon'

type Baris = Record<string, any>

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
  const tersaring = cari
    ? data.filter((d) => JSON.stringify(d).toLowerCase().includes(cari.toLowerCase()))
    : data

  async function hapus(baris: Baris) {
    if (!confirm(`Hapus data ini? Tindakan tidak dapat dibatalkan.`)) return
    try {
      await apiAdmin(`/admin/data/${sumber.kunci}/${baris.id}`, { method: 'DELETE' })
      await ambilData()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Gagal menghapus')
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">{sumber.label}</h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{data.length}</span>
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari…"
          className="ml-auto w-56 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-emas-500"
        />
        {!sumber.bacaSaja && (
          <button type="button" onClick={() => setSunting({})} className="rounded-xl bg-navy-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-800">
            + Tambah
          </button>
        )}
      </div>

      {galat && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {kolom.map((k) => <th key={k.nama} scope="col" className="px-4 py-3 font-bold">{k.label}</th>)}
              <th scope="col" className="px-4 py-3 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {muat && <tr><td colSpan={kolom.length + 1} className="px-4 py-10 text-center text-slate-400">Memuat…</td></tr>}
            {!muat && !tersaring.length && <tr><td colSpan={kolom.length + 1} className="px-4 py-10 text-center text-slate-400">Belum ada data.</td></tr>}
            {tersaring.map((b) => (
              <tr key={b.id} className="transition hover:bg-slate-50">
                {kolom.map((k) => (
                  <td key={k.nama} className="max-w-[240px] truncate px-4 py-3 text-slate-700">
                    {k.jenis === 'saklar'
                      ? <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${b[k.nama] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{b[k.nama] ? 'Ya' : 'Tidak'}</span>
                      : String(b[k.nama] ?? '—')}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button type="button" onClick={() => setSunting(b)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-navy-800 hover:bg-slate-100">
                    {sumber.bacaSaja ? 'Lihat' : 'Ubah'}
                  </button>
                  <button type="button" onClick={() => hapus(b)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">Hapus</button>
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
    <div className="fixed inset-0 z-[960] flex items-start justify-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm" onClick={tutup}>
      <form
        onSubmit={kirim}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">{baru ? `Tambah ${sumber.label}` : `Ubah ${sumber.label}`}</h2>
          <button type="button" onClick={tutup} aria-label="Tutup" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Silang className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4">
          {sumber.bidang.map((b) => (
            <Isian key={b.nama} bidang={b} nilai={nilai[b.nama]} ubah={(v) => setNilai((n) => ({ ...n, [b.nama]: v }))} />
          ))}
        </div>

        {galat && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>}

        <div className="mt-7 flex gap-3">
          <button type="submit" disabled={simpan} className="rounded-xl bg-emas-500 px-6 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-emas-400 disabled:opacity-60">
            {simpan ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button type="button" onClick={tutup} className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Batal</button>
        </div>
      </form>
    </div>
  )
}

function Isian({ bidang, nilai, ubah }: { bidang: Bidang; nilai: any; ubah: (v: any) => void }) {
  const kelas = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emas-500 focus:ring-4 focus:ring-emas-500/10'

  if (bidang.jenis === 'saklar') {
    return (
      <label className="flex items-center gap-3">
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
        <textarea rows={bidang.nama === 'isi' || bidang.nama === 'deskripsi' ? 10 : 3} value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} required={bidang.wajib} className={kelas} />
      )}
      {bidang.jenis === 'daftar' && (
        <textarea
          rows={5}
          value={Array.isArray(nilai) ? nilai.join('\n') : (nilai ?? '')}
          onChange={(e) => ubah(e.target.value.split('\n'))}
          className={kelas}
        />
      )}
      {bidang.jenis === 'pilih' && (
        <select value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} className={kelas}>
          <option value="">—</option>
          {bidang.pilihan?.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      )}
      {bidang.jenis === 'angka' && (
        <input type="number" step="any" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} required={bidang.wajib} className={kelas} />
      )}
      {bidang.jenis === 'gambar' && <PilihGambar nilai={nilai} ubah={ubah} kelas={kelas} />}
      {bidang.jenis === 'teks' && (
        <input type="text" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} required={bidang.wajib} className={kelas} />
      )}

      {bidang.bantuan && <span className="mt-1 block text-xs text-slate-400">{bidang.bantuan}</span>}
    </label>
  )
}

function PilihGambar({ nilai, ubah, kelas }: { nilai: any; ubah: (v: any) => void; kelas: string }) {
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
      <input type="text" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} placeholder="URL gambar atau unggah berkas" className={kelas} />
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) unggah(f) }}
          className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-navy-950 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
        />
        {naik && <span className="text-xs text-slate-400">Mengunggah…</span>}
        {nilai && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={nilai} alt="Pratinjau" className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200" />
        )}
      </div>
      <p className="text-[11px] text-slate-400">Berkas disimpan di MinIO ({API_PERAMBAN.replace(/^https?:\/\//, '')}).</p>
    </div>
  )
}
