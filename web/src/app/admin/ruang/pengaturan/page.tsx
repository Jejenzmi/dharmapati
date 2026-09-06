'use client'

import Link from 'next/link'
import PenyuntingPengaturan from '@/komponen/admin/PenyuntingPengaturan'
import { Panah } from '@/komponen/ikon'

export default function HalamanPengaturan() {
  return (
    <>
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
