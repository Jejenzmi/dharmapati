'use client'

import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { SUMBER } from '@/lib/admin'
import Pengelola from '@/komponen/admin/Pengelola'
import { Panah } from '@/komponen/ikon'

export default function HalamanSumber() {
  const parameter = useParams<{ sumber: string }>()
  const sumber = SUMBER.find((s) => s.kunci === parameter.sumber)
  if (!sumber) notFound()

  return (
    <>
      <Pengelola sumber={sumber} />
      <Link href="/admin/ruang" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
        <Panah className="h-4 w-4 rotate-180" /> Kembali ke ringkasan
      </Link>
    </>
  )
}
