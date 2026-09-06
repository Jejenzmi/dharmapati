import Link from 'next/link'
import { ambil, type Artikel } from '@/lib/api'
import { tanggalId } from '@/lib/format'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'

export const revalidate = 300

export const metadata = buatMetadata({
  judul: 'Artikel & Wawasan Pengamanan Objek',
  deskripsi:
    'Panduan praktis seputar penyusunan RENPAM, pemilihan penyedia jasa pengamanan, dan pengelolaan cleaning service gedung dari tim PT. Dharmapati Putra Nusantara.',
  jalur: '/artikel',
  kataKunci: ['artikel keamanan', 'panduan renpam', 'tips cleaning service gedung'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Artikel', jalur: '/artikel' }]

type Hasil = { daftar: Artikel[]; total: number; halaman: number; totalHalaman: number }

export default async function DaftarArtikel({ searchParams }: { searchParams: Promise<{ halaman?: string }> }) {
  const { halaman } = await searchParams
  const no = Math.max(1, Number(halaman ?? 1))
  const hasil = await ambil<Hasil>(`/artikel?halaman=${no}&per=9`)
  const daftar = hasil?.daftar ?? []
  const utama = no === 1 ? daftar[0] : undefined
  const sisa = utama ? daftar.slice(1) : daftar

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Wawasan"
        judul="Catatan dari lapangan"
        deskripsi="Tulisan singkat dan praktis untuk pengelola fasilitas, HRD, dan bagian umum yang sedang menata sistem pengamanan atau kebersihan."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          {utama && (
            <Link href={`/artikel/${utama.slug}`} className="group mb-12 block rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 transition hover:border-emas-300 hover:shadow-xl sm:p-12">
              <span className="label-bagian">{utama.kategori} · Terbaru</span>
              <h2 className="mt-5 max-w-3xl text-3xl font-bold leading-tight transition group-hover:text-emas-700 sm:text-4xl">{utama.judul}</h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-600">{utama.ringkasan}</p>
              <p className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                <span>{tanggalId(utama.terbitAt)}</span><span>·</span><span>{utama.penulis}</span>
                <span className="ml-auto inline-flex items-center gap-2 font-bold text-navy-800 transition group-hover:gap-3 group-hover:text-emas-600">
                  Baca <Panah className="h-4 w-4" />
                </span>
              </p>
            </Link>
          )}

          {sisa.length > 0 && (
            <>
              <JudulBagian label="Semua tulisan" judul="Arsip artikel" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sisa.map((a) => (
                  <Link key={a.id} href={`/artikel/${a.slug}`} className="kartu group flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emas-600">{a.kategori}</span>
                    <h3 className="mt-2 text-lg font-bold leading-snug transition group-hover:text-emas-700">{a.judul}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{a.ringkasan}</p>
                    <span className="mt-5 text-xs text-slate-400">{tanggalId(a.terbitAt)}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!daftar.length && (
            <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400">Belum ada artikel yang diterbitkan.</p>
          )}

          {hasil && hasil.totalHalaman > 1 && (
            <nav aria-label="Navigasi halaman" className="mt-12 flex justify-center gap-2">
              {Array.from({ length: hasil.totalHalaman }, (_, i) => i + 1).map((h) => (
                <Link
                  key={h}
                  href={`/artikel?halaman=${h}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                    h === hasil.halaman ? 'bg-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {h}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
