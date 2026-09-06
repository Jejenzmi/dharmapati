'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Centang, Panah, Silang } from '../ikon'

// ---------- Bentuk data ----------

type Nada = 'sukses' | 'galat' | 'info'

type Pemberitahuan = { id: number; nada: Nada; judul: string; rincian?: string }

type PermintaanKonfirmasi = {
  judul: string
  pesan?: string
  rincian?: string[]
  tombolYa?: string
  tombolTidak?: string
  bahaya?: boolean
}

type IsiPanel = {
  /** Tampilkan dialog konfirmasi; mengembalikan true bila pengguna menyetujui. */
  konfirmasi: (p: PermintaanKonfirmasi) => Promise<boolean>
  /** Tampilkan pemberitahuan mengambang di sudut layar. */
  beritahu: (judul: string, nada?: Nada, rincian?: string) => void
}

const Konteks = createContext<IsiPanel | null>(null)

export function usePanel() {
  const isi = useContext(Konteks)
  if (!isi) throw new Error('usePanel harus dipakai di dalam PenyediaPanel')
  return isi
}

// ---------- Penyedia ----------

export function PenyediaPanel({ children }: { children: React.ReactNode }) {
  const [antrean, setAntrean] = useState<Pemberitahuan[]>([])
  const [dialog, setDialog] = useState<(PermintaanKonfirmasi & { jawab: (v: boolean) => void }) | null>(null)
  const nomor = useRef(0)

  const beritahu = useCallback((judul: string, nada: Nada = 'sukses', rincian?: string) => {
    const id = ++nomor.current
    setAntrean((a) => [...a, { id, nada, judul, rincian }])
    setTimeout(() => setAntrean((a) => a.filter((x) => x.id !== id)), nada === 'galat' ? 7000 : 4500)
  }, [])

  const konfirmasi = useCallback(
    (p: PermintaanKonfirmasi) => new Promise<boolean>((jawab) => setDialog({ ...p, jawab })),
    [],
  )

  return (
    <Konteks.Provider value={{ konfirmasi, beritahu }}>
      {children}
      <TumpukanPemberitahuan antrean={antrean} tutup={(id) => setAntrean((a) => a.filter((x) => x.id !== id))} />
      {dialog && (
        <DialogKonfirmasi
          {...dialog}
          selesai={(v) => { dialog.jawab(v); setDialog(null) }}
        />
      )}
    </Konteks.Provider>
  )
}

// ---------- Dialog konfirmasi ----------

function DialogKonfirmasi({
  judul, pesan, rincian, tombolYa = 'Lanjutkan', tombolTidak = 'Batal', bahaya, selesai,
}: PermintaanKonfirmasi & { selesai: (v: boolean) => void }) {
  const tombolRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    tombolRef.current?.focus()
    const tekan = (e: KeyboardEvent) => {
      if (e.key === 'Escape') selesai(false)
      if (e.key === 'Enter') selesai(true)
    }
    window.addEventListener('keydown', tekan)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', tekan); document.body.style.overflow = '' }
  }, [selesai])

  return (
    <div
      className="fixed inset-0 z-[980] flex items-center justify-center bg-navy-950/60 p-5 backdrop-blur-sm"
      onClick={() => selesai(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-naik overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="p-7">
          <span
            aria-hidden="true"
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              bahaya ? 'bg-rose-100 text-rose-600' : 'bg-emas-500/15 text-emas-700'
            }`}
          >
            {bahaya ? <Silang className="h-6 w-6" /> : <Panah className="h-6 w-6" />}
          </span>

          <h2 id="judul-dialog" className="mt-5 font-judul text-xl font-bold text-navy-900">{judul}</h2>
          {pesan && <p className="mt-2 text-sm leading-relaxed text-slate-600">{pesan}</p>}

          {rincian && rincian.length > 0 && (
            <ul className="mt-4 space-y-1.5 rounded-2xl bg-slate-50 p-4">
              {rincian.map((r) => (
                <li key={r} className="flex gap-2 text-xs leading-relaxed text-slate-600">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />{r}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-100 bg-slate-50/60 px-7 py-4">
          <button
            ref={tombolRef}
            type="button"
            onClick={() => selesai(true)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition ${
              bahaya ? 'bg-rose-600 hover:bg-rose-700' : 'bg-navy-950 hover:bg-navy-800'
            }`}
          >
            {tombolYa}
          </button>
          <button
            type="button"
            onClick={() => selesai(false)}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            {tombolTidak}
          </button>
          <span className="ml-auto self-center text-[11px] text-slate-400">Esc untuk batal</span>
        </div>
      </div>
    </div>
  )
}

// ---------- Pemberitahuan mengambang ----------

const GAYA: Record<Nada, { bilah: string; ikon: string; teks: string }> = {
  sukses: { bilah: 'bg-emerald-500', ikon: 'bg-emerald-100 text-emerald-700', teks: 'text-emerald-900' },
  galat: { bilah: 'bg-rose-500', ikon: 'bg-rose-100 text-rose-700', teks: 'text-rose-900' },
  info: { bilah: 'bg-sky-500', ikon: 'bg-sky-100 text-sky-700', teks: 'text-sky-900' },
}

function TumpukanPemberitahuan({ antrean, tutup }: { antrean: Pemberitahuan[]; tutup: (id: number) => void }) {
  if (!antrean.length) return null
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[990] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2.5">
      {antrean.map((p) => {
        const g = GAYA[p.nada]
        return (
          <div
            key={p.id}
            role="status"
            aria-live="polite"
            className="pointer-events-auto flex animate-naik overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
          >
            <span aria-hidden="true" className={`w-1.5 shrink-0 ${g.bilah}`} />
            <div className="flex flex-1 items-start gap-3 p-4">
              <span aria-hidden="true" className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${g.ikon}`}>
                {p.nada === 'galat' ? <Silang className="h-4 w-4" /> : <Centang className="h-4 w-4" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-sm font-bold ${g.teks}`}>{p.judul}</span>
                {p.rincian && <span className="mt-0.5 block text-xs leading-snug text-slate-500">{p.rincian}</span>}
              </span>
              <button
                type="button"
                onClick={() => tutup(p.id)}
                aria-label="Tutup pemberitahuan"
                className="shrink-0 rounded-lg p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <Silang className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
