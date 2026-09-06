'use client'

import { Panah } from '../ikon'

/** Susun deretan nomor halaman dengan elipsis bila jumlahnya banyak. */
function deret(kini: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (kini <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (kini >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', kini - 1, kini, kini + 1, '…', total]
}

export default function Halaman({
  kini, totalBaris, perHalaman, ubahHalaman, ubahPerHalaman,
}: {
  kini: number
  totalBaris: number
  perHalaman: number
  ubahHalaman: (n: number) => void
  ubahPerHalaman: (n: number) => void
}) {
  const totalHalaman = Math.max(1, Math.ceil(totalBaris / perHalaman))
  const dari = totalBaris === 0 ? 0 : (kini - 1) * perHalaman + 1
  const sampai = Math.min(kini * perHalaman, totalBaris)

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-wrap items-center gap-4 border-t border-slate-200 px-5 py-3.5"
    >
      <p className="text-xs text-slate-500">
        Menampilkan <span className="font-bold tabular-nums text-navy-900">{dari}–{sampai}</span> dari{' '}
        <span className="font-bold tabular-nums text-navy-900">{totalBaris}</span> baris
      </p>

      <label className="flex items-center gap-2 text-xs text-slate-500">
        Per halaman
        <select
          value={perHalaman}
          onChange={(e) => ubahPerHalaman(Number(e.target.value))}
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-navy-900 outline-none focus:border-emas-500"
        >
          {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>

      {totalHalaman > 1 && (
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => ubahHalaman(kini - 1)}
            disabled={kini <= 1}
            aria-label="Halaman sebelumnya"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <Panah className="h-4 w-4 rotate-180" />
          </button>

          {deret(kini, totalHalaman).map((n, i) =>
            n === '…' ? (
              <span key={`titik-${i}`} aria-hidden="true" className="px-1.5 text-xs text-slate-300">…</span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => ubahHalaman(n)}
                aria-current={n === kini ? 'page' : undefined}
                className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-xs font-bold tabular-nums transition ${
                  n === kini ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {n}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => ubahHalaman(kini + 1)}
            disabled={kini >= totalHalaman}
            aria-label="Halaman berikutnya"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-30"
          >
            <Panah className="h-4 w-4" />
          </button>
        </div>
      )}
    </nav>
  )
}
