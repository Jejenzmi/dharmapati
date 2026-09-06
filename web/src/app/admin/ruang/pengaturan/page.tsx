'use client'

import Link from 'next/link'
import PenyuntingPengaturan from '@/komponen/admin/PenyuntingPengaturan'
import { Panah } from '@/komponen/ikon'

export default function HalamanPengaturan() {
  return (
    <>
      <nav aria-label="Remah roti" className="mb-4 flex items-center gap-2 text-xs text-slate-400">
        <Link href="/admin/ruang" className="transition hover:text-navy-800">Ringkasan</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-navy-800">Pengaturan Situs</span>
      </nav>
      <h1 className="mb-1 text-2xl font-bold">Pengaturan Situs</h1>
      <p className="mb-6 text-sm text-slate-500">
        Seluruh teks tetap di situs — judul beranda, profil, visi misi, pengantar lini layanan,
        tahapan rekrutmen, hingga kata kunci SEO — diatur dari sini.
      </p>
      <PenyuntingPengaturan />
      <Link href="/admin/ruang" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
        <Panah className="h-4 w-4 rotate-180" /> Kembali ke ringkasan
      </Link>
    </>
  )
}
