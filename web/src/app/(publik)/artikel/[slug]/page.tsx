import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ambil, type Artikel } from '@/lib/api'
import { keHtml, tanggalId } from '@/lib/format'
import { buatMetadata, DataTerstruktur, ldArtikel, ldRemah } from '@/lib/seo'
import { AjakanBertindak, KepalaHalaman } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'

export const revalidate = 300

type Muatan = { artikel: Artikel; terkait: Artikel[] }

export async function generateStaticParams() {
  const hasil = await ambil<{ daftar: Artikel[] }>('/artikel?per=24')
  return (hasil?.daftar ?? []).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await ambil<Muatan>(`/artikel/${slug}`)
  if (!data) return buatMetadata({ judul: 'Artikel tidak ditemukan', deskripsi: 'Artikel tidak tersedia.', jalur: `/artikel/${slug}`, tanpaIndeks: true })
  const a = data.artikel
  return buatMetadata({
    judul: a.seoJudul ?? a.judul,
    deskripsi: a.seoDesk ?? a.ringkasan,
    jalur: `/artikel/${a.slug}`,
    jenis: 'article',
    gambar: a.sampul ?? undefined,
    kataKunci: a.tag,
    terbitAt: a.terbitAt,
    diubahAt: a.diubahAt,
  })
}

export default async function RincianArtikel({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await ambil<Muatan>(`/artikel/${slug}`, { tanpaSinggahan: true })
  if (!data) notFound()
  const { artikel: a, terkait } = data

  const remah = [
    { nama: 'Beranda', jalur: '/' },
    { nama: 'Artikel', jalur: '/artikel' },
    { nama: a.judul, jalur: `/artikel/${a.slug}` },
  ]

  return (
    <>
      <DataTerstruktur data={ldRemah(remah)} />
      <DataTerstruktur data={ldArtikel(a)} />

      <KepalaHalaman
        remah={remah}
        label={a.kategori}
        judul={a.judul}
        deskripsi={a.ringkasan}
        anak={
          <p className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>{tanggalId(a.terbitAt)}</span><span aria-hidden="true">·</span><span>{a.penulis}</span>
          </p>
        }
      />

      <article className="py-16 sm:py-20">
        <div className="wadah max-w-3xl">
          <div className="prosa" dangerouslySetInnerHTML={{ __html: keHtml(a.isi) }} />

          {a.tag.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-8">
              {a.tag.map((t) => (
                <li key={t} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600">#{t}</li>
              ))}
            </ul>
          )}

          <Link href="/artikel" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
            <Panah className="h-4 w-4 rotate-180" /> Kembali ke daftar artikel
          </Link>
        </div>
      </article>

      {terkait.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="wadah">
            <h2 className="mb-8 text-2xl font-bold">Bacaan lain</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {terkait.map((t) => (
                <Link key={t.id} href={`/artikel/${t.slug}`} className="kartu group">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emas-600">{t.kategori}</span>
                  <h3 className="mt-2 text-base font-bold leading-snug transition group-hover:text-emas-700">{t.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.ringkasan}</p>
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
