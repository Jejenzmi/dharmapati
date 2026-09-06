'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiAdmin } from '@/lib/admin'
import { KELOMPOK_PENGATURAN, type BidangP, type KelompokPengaturan } from '@/lib/pengaturan-skema'
import { Centang, Panah, Silang } from '../ikon'

type Isi = Record<string, any>

export default function PenyuntingPengaturan() {
  const [semua, setSemua] = useState<Record<string, Isi>>({})
  const [aktif, setAktif] = useState(KELOMPOK_PENGATURAN[0].kunci)
  const [muat, setMuat] = useState(true)
  const [galat, setGalat] = useState('')

  const ambilData = useCallback(async () => {
    setMuat(true)
    try {
      setSemua(await apiAdmin<Record<string, Isi>>('/admin/pengaturan'))
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal memuat pengaturan')
    } finally {
      setMuat(false)
    }
  }, [])

  useEffect(() => { ambilData() }, [ambilData])

  if (muat) return <p className="text-sm text-slate-400">Memuat pengaturan…</p>
  if (galat) return <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>

  const kelompok = KELOMPOK_PENGATURAN.find((k) => k.kunci === aktif)!

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Kelompok pengaturan" className="lg:sticky lg:top-6 lg:self-start">
        <ul className="space-y-1">
          {KELOMPOK_PENGATURAN.map((k) => (
            <li key={k.kunci}>
              <button
                type="button"
                onClick={() => setAktif(k.kunci)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                  aktif === k.kunci ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span aria-hidden="true">{k.ikon}</span> {k.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <FormulirKelompok
        key={kelompok.kunci}
        kelompok={kelompok}
        awal={semua[kelompok.kunci] ?? {}}
        tersimpan={(nilai) => setSemua((s) => ({ ...s, [kelompok.kunci]: nilai }))}
      />
    </div>
  )
}

function FormulirKelompok({
  kelompok, awal, tersimpan,
}: { kelompok: KelompokPengaturan; awal: Isi; tersimpan: (v: Isi) => void }) {
  const [nilai, setNilai] = useState<Isi>(awal)
  const [proses, setProses] = useState(false)
  const [pesan, setPesan] = useState('')
  const [galat, setGalat] = useState('')

  async function simpan(e: React.FormEvent) {
    e.preventDefault()
    setProses(true); setPesan(''); setGalat('')
    try {
      await apiAdmin(`/admin/pengaturan/${kelompok.kunci}`, { method: 'PUT', body: JSON.stringify(nilai) })
      tersimpan(nilai)
      setPesan('Tersimpan. Perubahan tampil di situs setelah singgahan menyegar (maksimal 5 menit).')
    } catch (e) {
      setGalat(e instanceof Error ? e.message : 'Gagal menyimpan')
    } finally {
      setProses(false)
    }
  }

  function ubahBidang(nama: string, v: any) {
    setNilai((n) => ({ ...n, [nama]: v }))
  }

  return (
    <form onSubmit={simpan} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <header className="mb-6 border-b border-slate-100 pb-5">
        <h2 className="text-xl font-bold">{kelompok.ikon} {kelompok.label}</h2>
        <p className="mt-1 text-sm text-slate-500">{kelompok.keterangan}</p>
      </header>

      <div className="space-y-5">
        {kelompok.bidang.map((b) =>
          b.jenis === 'petaTeks' ? (
            <PetaTeks key={b.nama} bidang={b as Extract<BidangP, { jenis: 'petaTeks' }>} nilai={nilai} ubah={setNilai} />
          ) : (
            <Bidang key={b.nama} bidang={b} nilai={nilai[b.nama]} ubah={(v) => ubahBidang(b.nama, v)} />
          ),
        )}
      </div>

      {pesan && (
        <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Centang className="h-4 w-4" /> {pesan}
        </p>
      )}
      {galat && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{galat}</p>}

      <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
        <button type="submit" disabled={proses} className="rounded-xl bg-emas-500 px-6 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-emas-400 disabled:opacity-60">
          {proses ? 'Menyimpan…' : 'Simpan perubahan'}
        </button>
        <span className="text-xs text-slate-400">Hanya kelompok ini yang disimpan.</span>
      </div>
    </form>
  )
}

const KELAS = 'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emas-500 focus:ring-4 focus:ring-emas-500/10'

function Bidang({ bidang, nilai, ubah }: { bidang: BidangP; nilai: any; ubah: (v: any) => void }) {
  if (bidang.jenis === 'grup') {
    return (
      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">{bidang.label}</legend>
        <div className="space-y-4">
          {bidang.bidang.map((b) => (
            <Bidang
              key={b.nama}
              bidang={b}
              nilai={(nilai ?? {})[b.nama]}
              ubah={(v) => ubah({ ...(nilai ?? {}), [b.nama]: v })}
            />
          ))}
        </div>
      </fieldset>
    )
  }

  if (bidang.jenis === 'ulang') {
    const daftar: any[] = Array.isArray(nilai) ? nilai : []
    const ubahButir = (i: number, v: any) => ubah(daftar.map((x, j) => (j === i ? v : x)))
    return (
      <fieldset className="rounded-2xl border border-slate-200 p-5">
        <legend className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">{bidang.label}</legend>
        <div className="space-y-3">
          {daftar.map((butir, i) => (
            <div key={i} className="rounded-xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">
                  {i + 1}. {butir?.[bidang.judulButir] || '(tanpa judul)'}
                </span>
                <span className="flex gap-1">
                  <button type="button" aria-label="Naikkan" disabled={i === 0}
                    onClick={() => { const d = [...daftar]; [d[i - 1], d[i]] = [d[i], d[i - 1]]; ubah(d) }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white disabled:opacity-30">
                    <Panah className="h-3.5 w-3.5 -rotate-90" />
                  </button>
                  <button type="button" aria-label="Turunkan" disabled={i === daftar.length - 1}
                    onClick={() => { const d = [...daftar]; [d[i], d[i + 1]] = [d[i + 1], d[i]]; ubah(d) }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white disabled:opacity-30">
                    <Panah className="h-3.5 w-3.5 rotate-90" />
                  </button>
                  <button type="button" aria-label="Hapus"
                    onClick={() => { if (confirm('Hapus butir ini?')) ubah(daftar.filter((_, j) => j !== i)) }}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50">
                    <Silang className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
              <div className="space-y-3">
                {bidang.bidang.map((b) => (
                  <Bidang
                    key={b.nama}
                    bidang={b}
                    nilai={(butir ?? {})[b.nama]}
                    ubah={(v) => ubahButir(i, { ...(butir ?? {}), [b.nama]: v })}
                  />
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => ubah([...daftar, Object.fromEntries(bidang.bidang.map((b) => [b.nama, b.jenis === 'daftar' ? [] : '']))])}
            className="w-full rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-emas-400 hover:text-emas-700"
          >
            + Tambah {bidang.label.toLowerCase()}
          </button>
        </div>
      </fieldset>
    )
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{bidang.label}</span>
      {bidang.jenis === 'panjang' && (
        <textarea rows={3} value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} className={KELAS} />
      )}
      {bidang.jenis === 'daftar' && (
        <textarea
          rows={Math.min(12, Math.max(3, (Array.isArray(nilai) ? nilai.length : 0) + 1))}
          value={Array.isArray(nilai) ? nilai.join('\n') : (nilai ?? '')}
          onChange={(e) => ubah(e.target.value.split('\n'))}
          className={KELAS}
        />
      )}
      {bidang.jenis === 'angka' && (
        <input type="number" step="any" value={nilai ?? ''} onChange={(e) => ubah(e.target.value === '' ? null : Number(e.target.value))} className={KELAS} />
      )}
      {bidang.jenis === 'gambar' && <PilihGambar nilai={nilai} ubah={ubah} />}
      {bidang.jenis === 'teks' && (
        <input type="text" value={nilai ?? ''} onChange={(e) => ubah(e.target.value)} className={KELAS} />
      )}
      {bidang.bantuan && <span className="mt-1 block text-xs text-slate-400">{bidang.bantuan}</span>}
    </label>
  )
}

/** Penyunting untuk objek berbentuk { kunci: teks }, misalnya keterangan kategori galeri. */
function PetaTeks({ bidang, nilai, ubah }: { bidang: Extract<BidangP, { jenis: 'petaTeks' }>; nilai: Isi; ubah: (v: Isi) => void }) {
  const pasangan = Object.entries(nilai ?? {})
  return (
    <fieldset className="rounded-2xl border border-slate-200 p-5">
      <legend className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">{bidang.label}</legend>
      <div className="space-y-3">
        {pasangan.map(([k, v]) => (
          <label key={k} className="block">
            <span className="mb-1.5 block text-xs font-semibold text-navy-800">{k}</span>
            <textarea rows={2} value={String(v ?? '')} onChange={(e) => ubah({ ...nilai, [k]: e.target.value })} className={KELAS} />
          </label>
        ))}
        {!pasangan.length && <p className="text-sm text-slate-400">Belum ada kategori.</p>}
      </div>
      {bidang.bantuan && <p className="mt-2 text-xs text-slate-400">{bidang.bantuan}</p>}
    </fieldset>
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
    </div>
  )
}
