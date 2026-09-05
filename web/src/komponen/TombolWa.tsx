'use client'

import { useEffect, useState } from 'react'
import { Wa } from './ikon'

export default function TombolWa({ nomor }: { nomor: string }) {
  const [tampil, setTampil] = useState(false)

  useEffect(() => {
    const cek = () => setTampil(window.scrollY > 400)
    cek()
    window.addEventListener('scroll', cek, { passive: true })
    return () => window.removeEventListener('scroll', cek)
  }, [])

  return (
    <a
      href={`https://wa.me/${nomor}?text=${encodeURIComponent('Halo Dharmapati, saya ingin menanyakan layanan pengamanan/cleaning service.')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami lewat WhatsApp"
      className={`fixed bottom-6 right-5 z-[880] flex items-center gap-2.5 rounded-full bg-emerald-500 py-3.5 pl-4 pr-5 font-semibold text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:bg-emerald-600 ${
        tampil ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Wa className="h-5 w-5" />
      <span className="hidden text-sm sm:inline">Konsultasi Gratis</span>
    </a>
  )
}
