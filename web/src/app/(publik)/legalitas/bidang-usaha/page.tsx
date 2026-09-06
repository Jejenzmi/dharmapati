import Link from 'next/link'
import { ambil, type Kbli } from '@/lib/api'
import { NAMA_LINI } from '@/lib/format'
import { LINI_LAYANAN, MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Bidang Usaha & Kode KBLI',
  deskripsi:
    'Kode KBLI izin usaha PT. Dharmapati Putra Nusantara: 78200 penyediaan tenaga kerja waktu tertentu, 80100 keamanan swasta, 81210 dan 81290 kebersihan bangunan, 81300 perawatan taman, 52215 perparkiran, serta 62021 konsultasi keamanan informasi.',
  jalur: '/legalitas/bidang-usaha',
  kataKunci: ['kbli 80100 keamanan swasta', 'kbli 78200 penyedia tenaga kerja', 'kbli 81210 kebersihan bangunan'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Legalitas', jalur: '/legalitas' },
  { nama: 'Bidang Usaha', jalur: '/legalitas/bidang-usaha' },
]
const SAUDARA = MENU.find((m) => m.label === 'Legalitas')!.anak!

export default async function BidangUsaha() {
  const data = await ambil<{ kbli: Kbli[] }>('/legalitas')
  const kbli = data?.kbli ?? []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Bidang usaha"
        judul="Kode KBLI yang kami pegang"
        deskripsi="Kode Klasifikasi Baku Lapangan Usaha Indonesia pada Nomor Induk Berusaha kami menentukan pekerjaan apa saja yang sah untuk kami kerjakan. Pastikan penyedia jasa Anda memegang kode yang sesuai."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <div className="grid gap-4 md:grid-cols-2">
            {kbli.map((k) => (
              <article key={k.id} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emas-300 hover:shadow-lg">
                <span className="font-judul text-2xl font-bold text-emas-600">{k.kode}</span>
                <div>
                  <h2 className="text-base font-semibold leading-snug text-navy-900">{k.judul}</h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{NAMA_LINI[k.lini]}</p>
                </div>
              </article>
            ))}
          </div>
          {!kbli.length && <p className="py-10 text-center text-slate-400">Data KBLI belum tersedia.</p>}

          <div className="mt-12 rounded-3xl bg-slate-50 p-8">
            <JudulBagian label="Kaitannya dengan layanan" judul="Setiap kode punya layanan yang menaunginya" />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {LINI_LAYANAN.map((l) => (
                <li key={l.slug}>
                  <Link href={`/layanan/${l.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-emas-300">
                    <span className="text-sm font-bold text-navy-900 group-hover:text-emas-700">{l.label}</span>
                    <Panah className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emas-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/legalitas/bidang-usaha" />
      <AjakanBertindak />
    </>
  )
}
