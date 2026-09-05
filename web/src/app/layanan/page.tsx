import Image from 'next/image'
import Link from 'next/link'
import { ambil, type Layanan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { LINI_LAYANAN, slugDariLini } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { IkonLayanan, Panah } from '@/komponen/ikon'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Layanan — Pengamanan, Cleaning Service, Manpower & Pelatihan',
  deskripsi:
    'Empat lini layanan PT. Dharmapati Putra Nusantara: pengamanan (Satpam dan pengawalan VIP), kebersihan (cleaning service dan pest control), tenaga kerja (manpower, office boy, driver, operator forklift), serta layanan pendukung.',
  jalur: '/layanan',
  kataKunci: [
    'jasa satpam purwakarta', 'jasa cleaning service karawang', 'outsourcing tenaga kerja subang',
    'penyedia office boy', 'jasa pest control gedung', 'pelatihan satpam gada pratama',
  ],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Layanan', jalur: '/layanan' }]

const RINGKAS: Record<string, { isi: string; foto: string }> = {
  KEAMANAN: {
    isi: 'Menjaga objek, orang, dan ketertiban dengan personel bersertifikat serta rencana pengamanan tertulis di setiap lokasi.',
    foto: FOTO.hormatKantor,
  },
  KEBERSIHAN: {
    isi: 'Menjaga gedung tetap bersih dan sehat lewat jadwal terdokumentasi, bahan kimia yang tepat, dan pengendalian hama berkala.',
    foto: FOTO.bersihLantai,
  },
  TENAGA_KERJA: {
    isi: 'Menyediakan tenaga kerja siap pakai berikut seluruh pengelolaan administrasi ketenagakerjaannya.',
    foto: FOTO.manpowerMesin,
  },
  PENDUKUNG: {
    isi: 'Layanan pelengkap yang membuat pengelolaan fasilitas Anda tuntas dalam satu kontrak.',
    foto: FOTO.smk3,
  },
}

export default async function IkhtisarLayanan() {
  const layanan = (await ambil<Layanan[]>('/layanan')) ?? []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Layanan"
        judul="Dari pos jaga sampai perawatan taman"
        deskripsi="Sembilan layanan dalam empat lini. Semuanya berdiri di atas pola kerja yang sama: pemetaan area, dokumen kerja tertulis, lalu pengawasan berjenjang dengan pelaporan berkala."
      />

      <section className="py-20 sm:py-24">
        <div className="wadah space-y-8">
          {LINI_LAYANAN.map((lini, i) => {
            const isi = layanan.filter((x) => x.lini === lini.kunci)
            const r = RINGKAS[lini.kunci]
            return (
              <article
                key={lini.slug}
                className={`grid items-center gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-2 ${i % 2 ? 'lg:[&>figure]:order-last' : ''}`}
              >
                <figure className="relative aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[300px]">
                  <Image src={r.foto} alt={`Lini layanan ${lini.label}`} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                </figure>

                <div className="p-8 lg:p-10">
                  <span className="label-bagian">Lini {i + 1} · {isi.length} layanan</span>
                  <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{lini.label}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{r.isi}</p>

                  <ul className="mt-6 space-y-2">
                    {isi.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/layanan/${lini.slug}/${s.slug}`}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emas-500/10 text-emas-600 transition group-hover:bg-emas-500 group-hover:text-navy-950">
                            <IkonLayanan nama={s.ikon} className="h-4.5 w-4.5" />
                          </span>
                          <span className="flex-1 text-sm font-semibold text-navy-900 group-hover:text-emas-700">{s.nama}</span>
                          <Panah className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emas-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/layanan/${lini.slug}`} className="tombol-navy mt-7">
                    Selengkapnya tentang {lini.label} <Panah className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        {!layanan.length && <p className="wadah pt-10 text-center text-slate-400">Daftar layanan belum tersedia.</p>}
      </section>

      <AjakanBertindak />
    </>
  )
}
