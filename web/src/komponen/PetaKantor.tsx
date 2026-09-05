'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

type Titik = { nama: string; jenis: string; alamat: string; lat: number; lng: number }

export default function PetaKantor({ titik, tinggi = '420px' }: { titik: Titik[]; tinggi?: string }) {
  const wadah = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let batal = false
    let peta: import('leaflet').Map | null = null
    ;(async () => {
      const L = (await import('leaflet')).default
      if (batal || !wadah.current) return
      peta = L.map(wadah.current, { scrollWheelZoom: false })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(peta)

      const ikon = L.divIcon({
        className: 'penanda-dharmapati',
        html: `<span class="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[#f5b301] bg-[#0a1440] shadow-lg">
                 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f5b301" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/></svg>
               </span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const titikPeta: [number, number][] = []
      titik.forEach((t) => {
        L.marker([t.lat, t.lng], { icon: ikon })
          .addTo(peta!)
          .bindPopup(`<strong style="color:#0a1440">${t.nama}</strong><br/><span style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#64748b">${t.jenis}</span><br/><span style="color:#475569">${t.alamat}</span>`)
        titikPeta.push([t.lat, t.lng])
      })
      if (titikPeta.length > 1) peta.fitBounds(L.latLngBounds(titikPeta), { padding: [56, 56] })
      else if (titikPeta.length) peta.setView(titikPeta[0], 15)
    })()
    return () => { batal = true; peta?.remove() }
  }, [titik])

  return <div ref={wadah} style={{ height: tinggi }} className="z-0 w-full rounded-3xl" role="application" aria-label="Peta lokasi kantor Dharmapati" />
}
