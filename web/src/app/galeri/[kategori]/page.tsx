import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ambil, ambilPengaturan, type Galeri as GaleriDb } from '@/lib/api'
import { KATEGORI_GALERI, kategoriGaleriDariSlug } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, KepalaHalaman } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'
import Galeri, { type Butir } from '@/komponen/Galeri'
import { BAWAAN } from '../bawaan'

export const revalidate = 600

export async function generateStaticParams() {
  return KATEGORI_GALERI.map((k) => ({ kategori: k.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params
  const k = kategoriGaleriDariSlug(kategori)
  if (!k) return buatMetadata({ judul: 'Kategori tidak ditemukan', deskripsi: '', jalur: `/galeri/${kategori}`, tanpaIndeks: true })
  const pengaturan = await ambilPengaturan()
  return buatMetadata({
    judul: `Galeri ${k.label}`,
    deskripsi: pengaturan.galeriKategori?.[k.slug] ?? `Dokumentasi kegiatan ${k.label} PT. Dharmapati Putra Nusantara.`,
    jalur: `/galeri/${k.slug}`,
    kataKunci: [`foto ${k.label.toLowerCase()}`, `dokumentasi ${k.label.toLowerCase()} dharmapati`],
  })
}

export default async function GaleriKategori({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params
  const info = kategoriGaleriDariSlug(kategori)
  if (!info) notFound()

  const [dariDbAsal, pengaturan] = await Promise.all([ambil<GaleriDb[]>('/galeri'), ambilPengaturan()])
  const dariDb = dariDbAsal ?? []
  const keterangan = pengaturan.galeriKategori ?? {}
  const semua: Butir[] = dariDb.length
    ? dariDb.map((g) => ({ gambar: g.gambar, judul: g.judul, kategori: g.kategori, keterangan: g.keterangan }))
    : BAWAAN
  const butir = semua.filter((b) => b.kategori === info.label)

  const remah = [
    { nama: 'Beranda', jalur: '/' },
    { nama: 'Galeri', jalur: '/galeri' },
    { nama: info.label, jalur: `/galeri/${info.slug}` },
  ]

  return (
    <>
      <DataTerstruktur data={ldRemah(remah)} />

      <KepalaHalaman
        remah={remah}
        label="Galeri"
        judul={`Dokumentasi ${info.label}`}
        deskripsi={keterangan[info.slug]}
        anak={
          <nav aria-label="Kategori lain" className="mt-8 flex flex-wrap gap-2">
            {KATEGORI_GALERI.filter((k) => k.slug !== info.slug && semua.some((b) => b.kategori === k.label)).map((k) => (
              <Link key={k.slug} href={`/galeri/${k.slug}`} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-200 transition hover:border-emas-400 hover:text-emas-300">
                {k.label}
              </Link>
            ))}
          </nav>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <p className="mb-6 text-sm text-slate-500">{butir.length} foto pada kategori ini.</p>
          <Galeri butir={butir} tanpaSaring />
          <Link href="/galeri" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
            <Panah className="h-4 w-4 rotate-180" /> Semua dokumentasi
          </Link>
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
