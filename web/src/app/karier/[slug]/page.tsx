import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ambil, type Lowongan } from '@/lib/api'
import { tanggalId } from '@/lib/format'
import { buatMetadata, DataTerstruktur, ldLowongan, ldRemah } from '@/lib/seo'
import { KepalaHalaman } from '@/komponen/bagian'
import { Centang, Panah, Titik } from '@/komponen/ikon'
import FormulirLamaran from '@/komponen/FormulirLamaran'

export const revalidate = 300

export async function generateStaticParams() {
  const daftar = (await ambil<Lowongan[]>('/lowongan')) ?? []
  return daftar.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const l = await ambil<Lowongan>(`/lowongan/${slug}`)
  if (!l) return buatMetadata({ judul: 'Lowongan tidak ditemukan', deskripsi: 'Lowongan tidak tersedia.', jalur: `/karier/${slug}`, tanpaIndeks: true })
  return buatMetadata({
    judul: `Lowongan ${l.posisi} — ${l.lokasi}`,
    deskripsi: `${l.deskripsi.slice(0, 150)}… Lamar langsung secara daring, proses seleksi tanpa biaya.`,
    jalur: `/karier/${l.slug}`,
    kataKunci: [`lowongan ${l.posisi.toLowerCase()}`, `loker ${l.lokasi.toLowerCase()}`],
  })
}

export default async function RincianLowongan({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const l = await ambil<Lowongan>(`/lowongan/${slug}`)
  if (!l) notFound()

  const remah = [
    { nama: 'Beranda', jalur: '/' },
    { nama: 'Karier', jalur: '/karier' },
    { nama: l.posisi, jalur: `/karier/${l.slug}` },
  ]

  return (
    <>
      <DataTerstruktur data={ldRemah(remah)} />
      <DataTerstruktur data={ldLowongan(l)} />

      <KepalaHalaman
        remah={remah}
        label="Lowongan"
        judul={l.posisi}
        deskripsi={l.deskripsi}
        anak={
          <ul className="mt-8 flex flex-wrap gap-3 text-sm">
            <li className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-slate-200"><Titik className="h-4 w-4 text-emas-400" />{l.lokasi}</li>
            <li className="rounded-full border border-white/20 px-4 py-2 text-slate-200">{l.tipe}</li>
            <li className="rounded-full border border-white/20 px-4 py-2 text-slate-200">Kuota {l.kuota} orang</li>
            {l.penempatan && <li className="rounded-full border border-white/20 px-4 py-2 text-slate-200">{l.penempatan}</li>}
            {l.gaji && <li className="rounded-full bg-emas-500 px-4 py-2 font-bold text-navy-950">{l.gaji}</li>}
          </ul>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">Persyaratan</h2>
            <ul className="mt-5 space-y-2.5">
              {l.syarat.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{s}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
              <p><strong className="text-navy-900">Dibuka:</strong> {tanggalId(l.dibuatAt)}</p>
              {l.tutupAt && <p className="mt-1"><strong className="text-navy-900">Ditutup:</strong> {tanggalId(l.tutupAt)}</p>}
              <p className="mt-3 leading-relaxed">
                Seluruh proses rekrutmen tidak dipungut biaya. Berkas yang lolos seleksi administrasi akan
                dihubungi melalui nomor yang Anda cantumkan.
              </p>
            </div>

            <Link href="/karier" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
              <Panah className="h-4 w-4 rotate-180" /> Lihat lowongan lain
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-navy-900/5 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-xl font-bold">Lamar posisi ini</h2>
            <p className="mb-6 mt-1.5 text-sm text-slate-600">Lengkapi data berikut dan lampirkan berkas lamaran Anda.</p>
            <FormulirLamaran lowonganId={l.id} posisi={l.posisi} />
          </div>
        </div>
      </section>
    </>
  )
}
