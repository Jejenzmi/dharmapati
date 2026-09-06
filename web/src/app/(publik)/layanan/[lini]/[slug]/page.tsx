import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { ambil, type Layanan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { keHtml } from '@/lib/format'
import { liniDariSlug, slugDariLini } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldLayanan, ldRemah } from '@/lib/seo'
import { AjakanBertindak, KepalaHalaman } from '@/komponen/bagian'
import { Centang, IkonLayanan, Panah, Titik } from '@/komponen/ikon'

export const revalidate = 600
export const dynamicParams = true

const GAMBAR: Record<string, string> = {
  'jasa-pengamanan-satpam': FOTO.apel,
  'pengawalan-vip-protokoler': FOTO.hormatKantor,
  'cleaning-service': FOTO.bersihLantai,
  'pengendalian-hama': FOTO.bersihToilet,
  'manpower-tenaga-produksi': FOTO.manpowerMesin,
  'office-boy-pramusaji': FOTO.pramusajiSaji,
  'driver-operator-forklift': FOTO.manpowerGerbang,
  'perawatan-taman-parkir': FOTO.gudang,
  'pelatihan-sertifikasi': FOTO.smk3,
}

export async function generateStaticParams() {
  const layanan = (await ambil<Layanan[]>('/layanan')) ?? []
  return layanan.map((l) => ({ lini: slugDariLini(l.lini), slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ lini: string; slug: string }> }) {
  const { lini, slug } = await params
  const l = await ambil<Layanan>(`/layanan/${slug}`)
  if (!l) return buatMetadata({ judul: 'Layanan tidak ditemukan', deskripsi: 'Halaman layanan tidak tersedia.', jalur: `/layanan/${lini}/${slug}`, tanpaIndeks: true })
  return buatMetadata({
    judul: l.seoJudul ?? l.nama,
    deskripsi: l.seoDesk ?? l.ringkasan,
    jalur: `/layanan/${slugDariLini(l.lini)}/${l.slug}`,
    kataKunci: [l.nama.toLowerCase(), `${l.nama.toLowerCase()} purwakarta`, `${l.nama.toLowerCase()} karawang`],
  })
}

export default async function RincianLayanan({ params }: { params: Promise<{ lini: string; slug: string }> }) {
  const { lini, slug } = await params
  const [layanan, semua] = await Promise.all([
    ambil<Layanan>(`/layanan/${slug}`),
    ambil<Layanan[]>('/layanan'),
  ])
  if (!layanan) notFound()

  const liniBenar = slugDariLini(layanan.lini)
  if (lini !== liniBenar) permanentRedirect(`/layanan/${liniBenar}/${layanan.slug}`)

  const info = liniDariSlug(liniBenar)!
  const lain = (semua ?? []).filter((x) => x.slug !== layanan.slug && x.lini === layanan.lini).slice(0, 3)
  const remah = [
    { nama: 'Beranda', jalur: '/' },
    { nama: 'Layanan', jalur: '/layanan' },
    { nama: info.label, jalur: `/layanan/${info.slug}` },
    { nama: layanan.nama, jalur: `/layanan/${info.slug}/${layanan.slug}` },
  ]
  const gambar = layanan.gambar ?? GAMBAR[layanan.slug] ?? FOTO.hormat

  return (
    <>
      <DataTerstruktur data={ldRemah(remah)} />
      <DataTerstruktur data={ldLayanan({ ...layanan, slug: `${info.slug}/${layanan.slug}` })} />

      <KepalaHalaman remah={remah} label={info.label} judul={layanan.nama} deskripsi={layanan.ringkasan} />

      <section className="py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-[1.4fr_.8fr]">
          <div>
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl">
              <Image src={gambar} alt={`Kegiatan ${layanan.nama} oleh Dharmapati`} fill priority sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" />
            </div>

            <div className="prosa" dangerouslySetInnerHTML={{ __html: keHtml(layanan.deskripsi) }} />

            {layanan.fitur.length > 0 && (
              <>
                <h2 className="mb-4 mt-12 text-2xl font-bold">Yang Anda dapatkan</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {layanan.fitur.map((f) => (
                    <li key={f} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                      <Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {layanan.cakupan.length > 0 && (
              <>
                <h2 className="mb-4 mt-12 text-2xl font-bold">Cocok untuk</h2>
                <ul className="flex flex-wrap gap-2">
                  {layanan.cakupan.map((c) => (
                    <li key={c} className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
                      <Titik className="h-3.5 w-3.5 text-emas-600" />{c}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-navy-950 p-7 text-white">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emas-500 text-navy-950">
                <IkonLayanan nama={layanan.ikon} className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-lg font-bold !text-white">Minta penawaran layanan ini</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Kirim data lokasi, luas area, dan jumlah pos/shift yang dibutuhkan. Kami survei lokasi dan
                menyerahkan penawaran resmi maksimal 3 hari kerja.
              </p>
              <Link href={`/kontak?layanan=${encodeURIComponent(layanan.nama)}`} className="tombol-utama mt-6 w-full">
                Ajukan Sekarang <Panah className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 p-7">
              <h2 className="text-base font-bold">Kenapa lewat penyedia berizin?</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {[
                  'Kewajiban upah dan BPJS anggota menjadi tanggung jawab kami',
                  'Penempatan sesuai ketentuan Polri dan ketenagakerjaan',
                  'Ada pihak yang bertanggung jawab bila terjadi insiden',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5"><Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{x}</li>
                ))}
              </ul>
              <Link href="/legalitas" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
                Lihat legalitas kami <Panah className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {lain.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="wadah">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Layanan lain di lini {info.label}</h2>
              <Link href={`/layanan/${info.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
                Semua layanan {info.label.toLowerCase()} <Panah className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {lain.map((s) => (
                <Link key={s.id} href={`/layanan/${info.slug}/${s.slug}`} className="kartu group">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emas-500/10 text-emas-600">
                    <IkonLayanan nama={s.ikon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{s.nama}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.ringkasan}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AjakanBertindak />
    </>
  )
}
