import Image from 'next/image'
import { ambilPengaturan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Sejarah & Filosofi Perusahaan',
  deskripsi:
    'Sejarah PT. Dharmapati Putra Nusantara sejak 2016, arti nama Dharmapati sebagai pengabdian yang tulus dan gagah berani, filosofi lambang kuda, serta tonggak penting perusahaan hingga menjangkau empat provinsi.',
  jalur: '/tentang/sejarah',
  kataKunci: ['sejarah dharmapati putra nusantara', 'arti dharmapati', 'filosofi lambang kuda dharmapati'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Tentang Kami', jalur: '/tentang' },
  { nama: 'Sejarah & Filosofi', jalur: '/tentang/sejarah' },
]
const SAUDARA = MENU.find((m) => m.label === 'Tentang')!.anak!

export default async function Sejarah() {
  const pengaturan = await ambilPengaturan()
  const s = pengaturan.sejarah

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Sejarah & filosofi"
        judul="Mengapa kuda menjadi lambang kami"
        deskripsi="Nama, lambang, dan cara kerja perusahaan ini tidak dipilih secara kebetulan. Ketiganya berakar pada satu prinsip yang sama."
      />

      <section className="py-20 sm:py-24">
        <div className="wadah grid items-start gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <JudulBagian label="Filosofi" judul="Kesetiaan sebagai dasar pengabdian" />
            <div className="prosa">
              <p>{s?.filosofi}</p>
              <p className="tanpa-rata rounded-2xl border-l-4 border-emas-500 bg-emas-50/60 px-6 py-5 font-judul text-lg font-bold text-navy-900">
                {s?.arti}
              </p>
              <p>{s?.hubunganInduk}</p>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-navy-950 p-10">
              <Image src="/merek/logo.png" alt="Lambang perisai dan kepala kuda PT. Dharmapati Putra Nusantara" fill sizes="(max-width:1024px) 80vw, 36vw" className="object-contain p-8" />
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">
              Perisai melambangkan perlindungan, kuda melambangkan kesetiaan dan keberanian.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
        <div className="wadah relative">
          <JudulBagian gelap tengah label="Perjalanan" judul="Tonggak penting perusahaan" />
          <ol className="relative mx-auto max-w-3xl border-l border-white/15 pl-8">
            {(s?.tonggak ?? []).map((t) => (
              <li key={t.tahun} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-emas-500 bg-navy-950">
                  <span className="h-2 w-2 rounded-full bg-emas-500" />
                </span>
                <span className="font-judul text-2xl font-bold text-emas-400">{t.tahun}</span>
                <h3 className="mt-1 text-lg font-bold !text-white">{t.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16">
        <div className="wadah grid gap-3 sm:grid-cols-3">
          {[
            { f: FOTO.hormatKantor, a: 'Anggota Dharmapati di depan kantor' },
            { f: FOTO.apelPagi, a: 'Apel pagi anggota bersama supervisor' },
            { f: FOTO.pelepasan, a: 'Upacara pelepasan anggota sebelum penempatan' },
          ].map((g) => (
            <div key={g.f} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={g.f} alt={g.a} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/tentang/sejarah" />
      <AjakanBertindak />
    </>
  )
}
