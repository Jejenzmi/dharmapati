'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as PetaLeaflet, Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Klien } from '@/lib/api'
import { NAMA_LINI, WARNA_LINI } from '@/lib/format'

type TitikKantor = { nama: string; jenis: string; alamat: string; lat: number; lng: number }

type Props = {
  klien: Klien[]
  kantor?: TitikKantor[]
  tinggi?: string
  ringkas?: boolean
}

const LINI = ['KEAMANAN', 'KEBERSIHAN'] as const

function penandaKlien(warna: string, aktif: boolean) {
  return `
    <span class="relative flex h-[30px] w-[30px] items-center justify-center">
      ${aktif ? `<span class="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style="background:${warna}"></span>` : ''}
      <span class="relative inline-flex h-[18px] w-[18px] rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(10,20,64,.45)]" style="background:${warna}"></span>
    </span>`
}

const penandaKantor = `
  <span class="relative flex h-[38px] w-[38px] items-center justify-center">
    <span class="absolute h-full w-full rounded-full bg-[#f5b301]/35 animate-ping"></span>
    <span class="relative flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] border-[#f5b301] bg-[#0a1440] shadow-lg">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f5b301" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v5.5c0 4.6 3.2 8.4 8 9.5 4.8-1.1 8-4.9 8-9.5V6l-8-3Z"/></svg>
    </span>
  </span>`

export default function PetaKlien({ klien, kantor = [], tinggi = '560px', ringkas = false }: Props) {
  const wadahRef = useRef<HTMLDivElement>(null)
  const petaRef = useRef<PetaLeaflet | null>(null)
  const penandaRef = useRef<Record<string, Marker>>({})
  const [siap, setSiap] = useState(false)
  const [saring, setSaring] = useState<'SEMUA' | (typeof LINI)[number]>('SEMUA')
  const [provinsi, setProvinsi] = useState('SEMUA')
  const [cari, setCari] = useState('')
  const [terpilih, setTerpilih] = useState<string | null>(null)

  const daftarProvinsi = useMemo(
    () => Array.from(new Set(klien.map((k) => k.provinsi))).sort(),
    [klien],
  )

  const tersaring = useMemo(() => {
    const kunci = cari.trim().toLowerCase()
    return klien.filter((k) => {
      const cocokLini = saring === 'SEMUA' || k.layananT.some((l) => (saring === 'KEAMANAN' ? l === 'Pengamanan' : l === 'Cleaning Service'))
      const cocokProv = provinsi === 'SEMUA' || k.provinsi === provinsi
      const cocokCari = !kunci || `${k.nama} ${k.kota} ${k.sektor}`.toLowerCase().includes(kunci)
      return cocokLini && cocokProv && cocokCari
    })
  }, [klien, saring, provinsi, cari])

  // Bangun peta sekali saja
  useEffect(() => {
    let batal = false
    ;(async () => {
      const L = (await import('leaflet')).default
      if (batal || !wadahRef.current || petaRef.current) return

      const peta = L.map(wadahRef.current, {
        center: [-6.9, 108.5],
        zoom: 7,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      })
      // Peta dasar Esri World Street Map: berwarna, tanpa kunci API
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Ubin peta &copy; <a href="https://www.esri.com/">Esri</a> — sumber: Esri, HERE, Garmin, &copy; kontributor OpenStreetMap',
          maxZoom: 18,
        },
      ).addTo(peta)
      peta.on('click', () => setTerpilih(null))
      petaRef.current = peta
      setSiap(true)
    })()
    return () => {
      batal = true
      petaRef.current?.remove()
      petaRef.current = null
    }
  }, [])

  // Gambar ulang penanda setiap kali hasil saringan berubah
  useEffect(() => {
    if (!siap || !petaRef.current) return
    let batal = false
    ;(async () => {
      const L = (await import('leaflet')).default
      const peta = petaRef.current
      if (batal || !peta) return

      Object.values(penandaRef.current).forEach((m) => m.remove())
      penandaRef.current = {}

      const semuaTitik: [number, number][] = []

      kantor.forEach((t) => {
        const m = L.marker([t.lat, t.lng], {
          icon: L.divIcon({ className: 'penanda-dharmapati', html: penandaKantor, iconSize: [38, 38], iconAnchor: [19, 19] }),
          zIndexOffset: 1000,
          title: t.nama,
        }).addTo(peta)
        m.bindPopup(
          `<strong style="color:#0a1440;font-size:13px">${t.nama}</strong><br/><span style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.08em">${t.jenis}</span><br/><span style="color:#475569">${t.alamat}</span>`,
        )
        semuaTitik.push([t.lat, t.lng])
      })

      tersaring.forEach((k) => {
        const warna = k.layananT.length > 1 ? '#a855f7' : WARNA_LINI[k.lini] ?? '#f5b301'
        const m = L.marker([k.lat, k.lng], {
          icon: L.divIcon({
            className: 'penanda-dharmapati',
            html: penandaKlien(warna, terpilih === k.id),
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
          title: k.nama,
        }).addTo(peta)
        m.bindPopup(
          `<strong style="color:#0a1440;font-size:13px">${k.nama}</strong><br/>
           <span style="color:#64748b">${k.kota}, ${k.provinsi}</span><br/>
           <span style="display:inline-block;margin-top:6px;color:#475569">Sektor: ${k.sektor}</span><br/>
           <span style="display:inline-block;margin-top:4px;font-size:11px;font-weight:700;color:#0a1440">${k.layananT.join(' • ')}</span>`,
        )
        m.on('click', () => setTerpilih(k.id))
        penandaRef.current[k.id] = m
        semuaTitik.push([k.lat, k.lng])
      })

      if (semuaTitik.length) {
        peta.fitBounds(L.latLngBounds(semuaTitik), { padding: [48, 48], maxZoom: 11 })
      }
    })()
    return () => { batal = true }
  }, [siap, tersaring, kantor, terpilih])

  function sorot(k: Klien) {
    setTerpilih(k.id)
    const peta = petaRef.current
    const m = penandaRef.current[k.id]
    if (peta && m) {
      peta.flyTo([k.lat, k.lng], 13, { duration: 0.8 })
      m.openPopup()
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-navy-900/5">
      {/* Penyaring */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {(['SEMUA', ...LINI] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setSaring(l)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
                saring === l ? 'bg-navy-900 text-white shadow' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-navy-800'
              }`}
            >
              {l === 'SEMUA' ? 'Semua lini' : NAMA_LINI[l]}
            </button>
          ))}
        </div>

        <select
          value={provinsi}
          onChange={(e) => setProvinsi(e.target.value)}
          aria-label="Saring berdasarkan provinsi"
          className="rounded-full border-0 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 focus:ring-2 focus:ring-emas-500"
        >
          <option value="SEMUA">Semua provinsi</option>
          {daftarProvinsi.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari klien atau kota…"
          aria-label="Cari klien"
          className="min-w-[180px] flex-1 rounded-full border-0 bg-white px-4 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emas-500"
        />

        <span className="ml-auto rounded-full bg-navy-900/5 px-3 py-1.5 text-xs font-bold text-navy-800">
          {tersaring.length} titik
        </span>
      </div>

      <div className={ringkas ? '' : 'grid lg:grid-cols-[1fr_320px]'}>
        <div className="relative">
          <div ref={wadahRef} style={{ height: tinggi }} className="z-0 w-full" role="application" aria-label="Peta sebaran klien Dharmapati" />
          {!siap && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 text-sm text-slate-400">
              Memuat peta…
            </div>
          )}
          {/* Keterangan warna */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-[400] rounded-xl bg-white/95 px-3.5 py-2.5 text-[11px] shadow-lg ring-1 ring-slate-200 backdrop-blur">
            <p className="mb-1.5 font-bold uppercase tracking-wider text-navy-900">Keterangan</p>
            <ul className="space-y-1 text-slate-600">
              <li className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: WARNA_LINI.KEAMANAN }} /> Pengamanan</li>
              <li className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: WARNA_LINI.KEBERSIHAN }} /> Cleaning service</li>
              <li className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" /> Dua lini layanan</li>
              <li className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full border-2 border-emas-500 bg-navy-900" /> Kantor & Pusdiklat</li>
            </ul>
          </div>
        </div>

        {!ringkas && (
          <aside className="max-h-[560px] overflow-y-auto border-t border-slate-100 lg:border-l lg:border-t-0">
            <ul className="divide-y divide-slate-100">
              {tersaring.map((k) => (
                <li key={k.id}>
                  <button
                    type="button"
                    onClick={() => sorot(k)}
                    className={`flex w-full flex-col items-start gap-1 px-5 py-3.5 text-left transition hover:bg-emas-50 ${
                      terpilih === k.id ? 'bg-emas-50' : ''
                    }`}
                  >
                    <span className="text-sm font-semibold leading-snug text-navy-900">{k.nama}</span>
                    <span className="text-xs text-slate-500">{k.kota}, {k.provinsi} · {k.sektor}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {k.layananT.map((l) => (
                        <i key={l} className="not-italic rounded-full bg-navy-900/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-700">{l}</i>
                      ))}
                    </span>
                  </button>
                </li>
              ))}
              {!tersaring.length && (
                <li className="px-5 py-10 text-center text-sm text-slate-400">Tidak ada klien yang cocok dengan penyaring.</li>
              )}
            </ul>
          </aside>
        )}
      </div>
    </div>
  )
}
