import Link from 'next/link'
import Image from 'next/image'
import { ambil, type Layanan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { NAMA_LINI } from '@/lib/format'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Centang, IkonLayanan, Panah } from '@/komponen/ikon'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Layanan — Pengamanan, Cleaning Service, Manpower & Pelatihan',
  deskripsi:
    'Sembilan layanan PT. Dharmapati Putra Nusantara: jasa Satpam, pengawalan VIP, cleaning service, pest control, manpower produksi, office boy, driver dan operator forklift, perawatan taman, serta pelatihan dan sertifikasi.',
  jalur: '/layanan',
  kataKunci: [
    'jasa satpam purwakarta', 'jasa cleaning service karawang', 'outsourcing tenaga kerja subang',
    'penyedia office boy', 'jasa pest control gedung', 'pelatihan satpam gada pratama',
  ],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Layanan', jalur: '/layanan' }]

const GAMBAR_LINI: Record<string, string> = {
  KEAMANAN: FOTO.hormatKantor,
  KEBERSIHAN: FOTO.bersihLantai,
  TENAGA_KERJA: FOTO.manpowerMesin,
  PENDUKUNG: FOTO.ppm,
}

export default async function DaftarLayanan() {
  const layanan = (await ambil<Layanan[]>('/layanan')) ?? []
  const lini = ['KEAMANAN', 'KEBERSIHAN', 'TENAGA_KERJA', 'PENDUKUNG'] as const

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Layanan"
        judul="Dari pos jaga sampai perawatan taman"
        deskripsi="Setiap layanan berdiri di atas pola kerja yang sama: pemetaan area, dokumen kerja tertulis, lalu pengawasan berjenjang dengan pelaporan berkala."
        anak={
          <nav aria-label="Pintasan lini layanan" className="mt-8 flex flex-wrap gap-2">
            {lini.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-200 transition hover:border-emas-400 hover:text-emas-300">
                {NAMA_LINI[l]}
              </a>
            ))}
          </nav>
        }
      />

      {lini.map((l, indeks) => {
        const isi = layanan.filter((x) => x.lini === l)
        if (!isi.length) return null
        return (
          <section key={l} id={l.toLowerCase()} className={`scroll-mt-24 py-20 sm:py-24 ${indeks % 2 ? 'bg-slate-50' : ''}`}>
            <div className="wadah">
              <div className="grid items-center gap-10 lg:grid-cols-[1fr_.7fr]">
                <JudulBagian
                  label={`Lini ${indeks + 1}`}
                  judul={NAMA_LINI[l]}
                  deskripsi={
                    l === 'KEAMANAN' ? 'Menjaga objek, orang, dan ketertiban dengan personel bersertifikat dan rencana pengamanan tertulis.'
                    : l === 'KEBERSIHAN' ? 'Menjaga gedung tetap bersih dan sehat lewat jadwal terdokumentasi serta bahan kimia yang tepat.'
                    : l === 'TENAGA_KERJA' ? 'Menyediakan tenaga kerja siap pakai berikut seluruh pengelolaan administrasi ketenagakerjaannya.'
                    : 'Layanan pelengkap yang membuat pengelolaan fasilitas Anda tuntas dalam satu kontrak.'
                  }
                />
                <div className="relative mb-12 hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
                  <Image src={GAMBAR_LINI[l]} alt={`Kegiatan lini ${NAMA_LINI[l]} Dharmapati`} fill sizes="35vw" className="object-cover" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isi.map((s) => (
                  <article key={s.id} className="kartu group flex flex-col">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-emas-400">
                      <IkonLayanan nama={s.ikon} className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold leading-snug">
                      <Link href={`/layanan/${s.slug}`} className="after:absolute after:inset-0 relative">{s.nama}</Link>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.ringkasan}</p>
                    <ul className="mt-5 flex-1 space-y-2">
                      {s.fitur.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
                          <Centang className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emas-500" />{f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-800 transition group-hover:gap-3 group-hover:text-emas-600">
                      Rincian layanan <Panah className="h-4 w-4" />
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {!layanan.length && (
        <section className="py-24">
          <p className="wadah text-center text-slate-400">Daftar layanan belum tersedia.</p>
        </section>
      )}

      <AjakanBertindak />
    </>
  )
}
