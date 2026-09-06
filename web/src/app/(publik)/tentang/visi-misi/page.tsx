import Image from 'next/image'
import { ambilPengaturan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Centang, Kilau, Perisai } from '@/komponen/ikon'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Visi & Misi Perusahaan',
  deskripsi:
    'Visi dan misi PT. Dharmapati Putra Nusantara untuk lini pengamanan dan lini fasilitas, sikap Tanggap-Tangguh-Tanggon-Trengginas, serta pedoman kerja 5R dan 5 DM yang dipegang setiap anggota.',
  jalur: '/tentang/visi-misi',
  kataKunci: ['visi misi perusahaan keamanan', 'pedoman 5R cleaning service', 'tanggap tangguh tanggon trengginas'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Tentang Kami', jalur: '/tentang' },
  { nama: 'Visi & Misi', jalur: '/tentang/visi-misi' },
]
const SAUDARA = MENU.find((m) => m.label === 'Tentang')!.anak!

export default async function VisiMisi() {
  const pengaturan = await ambilPengaturan()
  const v = pengaturan.visiMisi
  const sikap = pengaturan.perusahaan?.sikap ?? []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Visi & misi"
        judul="Arah perusahaan dan pedoman kerja harian"
        deskripsi="Dua lini usaha kami punya visi dan misi masing-masing, namun berpijak pada satu pedoman sikap dan kerja yang sama."
      />

      <section className="py-20 sm:py-24">
        <div className="wadah">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="label-bagian"><Perisai className="h-3.5 w-3.5" /> Lini pengamanan</span>
              <h2 className="mt-5 text-lg font-bold">Visi</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{v?.visiKeamanan}</p>
              <h2 className="mt-6 text-lg font-bold">Misi</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{v?.misiKeamanan}</p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="label-bagian"><Kilau className="h-3.5 w-3.5" /> Lini fasilitas &amp; tenaga kerja</span>
              <h2 className="mt-5 text-lg font-bold">Visi</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{v?.visiFasilitas}</p>
              <h2 className="mt-6 text-lg font-bold">Misi</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{v?.misiFasilitas}</p>
            </article>
          </div>

          <div className="mt-6 rounded-3xl bg-navy-950 p-8 sm:p-10">
            <h2 className="text-xl font-bold !text-white">Sikap Dharmapati</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Empat sikap yang ditanamkan sejak pembekalan di Pusdiklat dan dievaluasi selama masa penempatan.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {sikap.map((x, i) => (
                <li key={x} className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
                  <span className="font-judul text-2xl font-bold text-emas-500/60">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-1 text-lg font-bold text-emas-300">{x}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="wadah grid items-center gap-12 lg:grid-cols-[1fr_.8fr]">
          <div>
            <JudulBagian label="Pedoman kerja" judul="5R dan 5 DM" deskripsi="Dipakai terutama pada lini kebersihan, namun berlaku untuk seluruh anggota di lapangan." />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-base font-bold">Pedoman 5R</h3>
                <p className="mt-1 text-xs text-slate-500">Cara bekerja</p>
                <ul className="mt-4 space-y-2.5">
                  {(v?.pedoman5R ?? []).map((x) => (
                    <li key={x} className="flex items-center gap-2.5 text-sm text-slate-600"><Centang className="h-4 w-4 shrink-0 text-emas-600" />{x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="text-base font-bold">Pedoman 5 DM</h3>
                <p className="mt-1 text-xs text-slate-500">Sikap pribadi</p>
                <ul className="mt-4 space-y-2.5">
                  {(v?.pedoman5DM ?? []).map((x) => (
                    <li key={x} className="flex items-center gap-2.5 text-sm text-slate-600"><Centang className="h-4 w-4 shrink-0 text-emas-600" />{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src={FOTO.kelas} alt="Pembinaan tupoksi dan mental anggota Dharmapati" fill sizes="(max-width:1024px) 80vw, 34vw" className="object-cover" />
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/tentang/visi-misi" />
      <AjakanBertindak />
    </>
  )
}
