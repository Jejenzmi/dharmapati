import Image from 'next/image'
import { ambilPengaturan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah, mutlak } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Sambutan Direktur Utama',
  deskripsi:
    'Sambutan Pur. Nanang Setiawan, Direktur Utama PT. Dharmapati Putra Nusantara — purnawirawan TNI-AL Korps Marinir dan mantan Polisi Militer, tentang prinsip dasar pengamanan objek: pemetaan area, RENPAM, dan SOP.',
  jalur: '/tentang/direktur',
  gambar: FOTO.direktur,
  kataKunci: ['direktur dharmapati', 'nanang setiawan dharmapati', 'prinsip pengamanan objek vital'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Tentang Kami', jalur: '/tentang' },
  { nama: 'Sambutan Direktur', jalur: '/tentang/direktur' },
]
const SAUDARA = MENU.find((m) => m.label === 'Tentang')!.anak!

export default async function SambutanDirektur() {
  const pengaturan = await ambilPengaturan()
  const d = pengaturan.direktur

  const ldOrang = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: d?.nama,
    jobTitle: d?.jabatan,
    image: mutlak(FOTO.direktur),
    worksFor: { '@id': mutlak('/#organisasi') },
    url: mutlak('/tentang/direktur'),
  }

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />
      <DataTerstruktur data={ldOrang} />

      <KepalaHalaman
        remah={REMAH}
        label="Sambutan direktur"
        judul="“Pengamanan yang baik dimulai dari dokumen, bukan dari jumlah orang”"
        deskripsi={`${d?.nama} — ${d?.jabatan} PT. Dharmapati Putra Nusantara`}
      />

      <section className="py-20 sm:py-24">
        <div className="wadah grid items-start gap-14 lg:grid-cols-[.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-navy-950">
              <Image src={FOTO.direktur} alt={`${d?.nama}, ${d?.jabatan} PT. Dharmapati Putra Nusantara`} fill priority sizes="(max-width:1024px) 80vw, 30vw" className="object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 to-transparent p-6 pt-16">
                <p className="font-judul text-xl font-bold text-white">{d?.nama}</p>
                <p className="text-sm text-emas-400">{d?.jabatan}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 rounded-2xl border border-slate-200 p-5 text-sm">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Latar belakang</dt>
                <dd className="mt-0.5 text-slate-700">Purnawirawan TNI-AL Korps Marinir</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Penugasan</dt>
                <dd className="mt-0.5 text-slate-700">Timor Timur, Aceh, Irian, Maluku, Pulau Galang, Natuna</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kesatuan terakhir</dt>
                <dd className="mt-0.5 text-slate-700">Polisi Militer TNI AL</dd>
              </div>
            </dl>
          </div>

          <div>
            <JudulBagian label="Kata sambutan" judul="Dari pengalaman menjaga objek vital negara" />
            <blockquote className="prosa border-l-4 border-emas-500 pl-6">
              {(d?.paragraf ?? []).map((p) => <p key={p.slice(0, 28)}>{p}</p>)}
            </blockquote>
            <p className="mt-8 border-t border-slate-200 pt-6">
              <span className="block font-judul text-lg font-bold text-navy-900">{d?.nama}</span>
              <span className="block text-sm text-slate-500">{d?.jabatan}</span>
            </p>
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/tentang/direktur" />
      <AjakanBertindak />
    </>
  )
}
