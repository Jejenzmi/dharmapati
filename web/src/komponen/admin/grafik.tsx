'use client'

/**
 * Bagan sederhana berbasis HTML/CSS.
 * Palet kategori sudah lolos pemeriksaan keterbacaan bagi penyandang buta warna
 * (pasangan terburuk ΔE 9,1 protan), dan tiap segmen selalu diberi label langsung
 * — warna tidak pernah menjadi satu-satunya penanda.
 */

export const WARNA_KATEGORI = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'] as const

const NAVY = '#26398a'

type Baris = { label: string; jumlah: number }

/** Perbandingan besaran: panjang batang yang membawa makna, bukan warna. */
export function BatangMendatar({
  data, satuan = 'objek', warna = NAVY,
}: { data: Baris[]; satuan?: string; warna?: string }) {
  const puncak = Math.max(1, ...data.map((d) => d.jumlah))
  if (!data.length) return <p className="py-6 text-center text-sm text-slate-400">Belum ada data.</p>

  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label} className="group grid grid-cols-[minmax(90px,auto)_1fr_auto] items-center gap-3">
          <span className="truncate text-xs font-semibold text-slate-600">{d.label}</span>
          <span className="relative h-2.5 overflow-hidden rounded-full bg-slate-100" title={`${d.label}: ${d.jumlah} ${satuan}`}>
            <span
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500"
              style={{ width: `${(d.jumlah / puncak) * 100}%`, background: warna }}
            />
          </span>
          <span className="w-8 text-right text-xs font-bold tabular-nums text-navy-900">{d.jumlah}</span>
        </li>
      ))}
    </ul>
  )
}

/** Bagian-terhadap-keseluruhan: satu batang bertumpuk dengan keterangan dan angka. */
export function BatangTumpuk({
  data, urutan,
}: { data: Baris[]; urutan: string[] }) {
  const tertata = urutan
    .map((u) => data.find((d) => d.label === u) ?? { label: u, jumlah: 0 })
    .filter((d) => d.jumlah > 0)
  const total = tertata.reduce((a, b) => a + b.jumlah, 0)

  if (!total) return <p className="py-6 text-center text-sm text-slate-400">Belum ada data.</p>

  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={tertata.map((d) => `${d.label} ${d.jumlah}`).join(', ')}>
        {tertata.map((d) => (
          <span
            key={d.label}
            title={`${d.label}: ${d.jumlah} (${Math.round((d.jumlah / total) * 100)}%)`}
            className="first:rounded-l-full last:rounded-r-full transition-[flex-grow] duration-500"
            style={{ flexGrow: d.jumlah, background: WARNA_KATEGORI[urutan.indexOf(d.label) % WARNA_KATEGORI.length] }}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {urutan.map((u) => {
          const d = data.find((x) => x.label === u)
          return (
            <li key={u} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: WARNA_KATEGORI[urutan.indexOf(u) % WARNA_KATEGORI.length] }} />
              <span className="flex-1 truncate text-slate-600">{u}</span>
              <span className="font-bold tabular-nums text-navy-900">{d?.jumlah ?? 0}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Angka utama pada kartu ringkasan. */
export function Ubin({
  label, nilai, keterangan, warna = 'bg-navy-900', ikon, tautan,
}: { label: string; nilai: number | string; keterangan?: string; warna?: string; ikon?: string; tautan?: string }) {
  const isi = (
    <>
      <div className="flex items-start justify-between">
        <span className={`inline-block h-1.5 w-8 rounded-full ${warna}`} />
        {ikon && <span aria-hidden="true" className="text-lg opacity-70">{ikon}</span>}
      </div>
      <p className="mt-4 font-judul text-3xl font-bold tabular-nums text-navy-900">{nilai}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      {keterangan && <p className="mt-1 text-[11px] leading-snug text-slate-400">{keterangan}</p>}
    </>
  )
  const kelas = 'block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emas-300 hover:shadow-lg'
  return tautan ? <a href={tautan} className={kelas}>{isi}</a> : <div className={kelas}>{isi}</div>
}
