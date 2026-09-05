import Link from 'next/link'
import { FOTO } from '@/lib/foto'
import { ambil, type Galeri as GaleriDb } from '@/lib/api'
import { KATEGORI_GALERI } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'
import Galeri, { type Butir } from '@/komponen/Galeri'
import { BAWAAN } from './bawaan'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Galeri Kegiatan & Dokumentasi Lapangan',
  deskripsi:
    'Dokumentasi kegiatan PT. Dharmapati Putra Nusantara: apel dan supervisi anggota, pelatihan di Pusdiklat, seleksi rekrutmen, pekerjaan cleaning service, pramusaji, serta tenaga manpower di kawasan industri.',
  jalur: '/galeri',
  gambar: FOTO.apel,
  kataKunci: ['dokumentasi satpam dharmapati', 'foto cleaning service', 'pelatihan satpam'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Galeri', jalur: '/galeri' }]

export default async function HalamanGaleri() {
  const dariDb = (await ambil<GaleriDb[]>('/galeri')) ?? []
  const butir: Butir[] = dariDb.length
    ? dariDb.map((g) => ({ gambar: g.gambar, judul: g.judul, kategori: g.kategori, keterangan: g.keterangan }))
    : BAWAAN

  const jumlah = (label: string) => butir.filter((b) => b.kategori === label).length

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Galeri"
        judul="Dokumentasi kegiatan di lapangan"
        deskripsi="Kumpulan foto kegiatan operasional, pelatihan di Pusdiklat, proses rekrutmen, dan pekerjaan harian tim kami di lokasi pengguna jasa."
      />

      <section className="py-14">
        <div className="wadah">
          <JudulBagian label="Telusuri" judul="Kategori dokumentasi" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {KATEGORI_GALERI.filter((k) => jumlah(k.label) > 0).map((k) => (
              <li key={k.slug}>
                <Link href={`/galeri/${k.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-emas-300 hover:shadow-lg">
                  <span>
                    <span className="block text-sm font-bold text-navy-900 group-hover:text-emas-700">{k.label}</span>
                    <span className="text-xs text-slate-500">{jumlah(k.label)} foto</span>
                  </span>
                  <Panah className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emas-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="wadah">
          <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Semua dokumentasi</h2>
          <Galeri butir={butir} />
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
