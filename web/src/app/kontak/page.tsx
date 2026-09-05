import { Suspense } from 'react'
import { ambilPengaturan } from '@/lib/api'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Amplop, Jam, Telepon, Titik, Wa } from '@/komponen/ikon'
import FormulirKontak from '@/komponen/FormulirKontak'
import PetaKantor from '@/komponen/PetaKantor'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Hubungi Kami — Minta Penawaran Jasa Pengamanan & Cleaning Service',
  deskripsi:
    'Hubungi PT. Dharmapati Putra Nusantara di Purwakarta, kantor cabang Kelapa Gading Jakarta Utara, atau Pusdiklat Gantar Indramayu. Kirim permintaan penawaran melalui formulir daring, telepon, atau WhatsApp.',
  jalur: '/kontak',
  kataKunci: ['kontak jasa keamanan purwakarta', 'penawaran satpam', 'alamat dharmapati putra nusantara'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Kontak', jalur: '/kontak' }]

export default async function HalamanKontak() {
  const pengaturan = await ambilPengaturan()
  const k = pengaturan.kontak!

  const titik = [
    { nama: 'Kantor Pusat', jenis: 'Head Office', alamat: k.alamatKantor, ...k.petaKantor },
    { nama: 'Kantor Cabang', jenis: 'Branch Office', alamat: k.alamatCabang, ...k.petaCabang },
    { nama: 'Pusdiklat Dharmapati', jenis: 'Pusat Pendidikan & Pelatihan', alamat: k.alamatPusdiklat, ...k.petaPusdiklat },
  ]

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Hubungi kami"
        judul="Ceritakan kebutuhan objek Anda"
        deskripsi="Isi formulir di bawah, atau hubungi kami langsung. Untuk permintaan penawaran, tim survei akan menghubungi Anda menjadwalkan kunjungan lokasi."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <JudulBagian label="Formulir" judul="Minta penawaran resmi" deskripsi="Semakin lengkap keterangan yang Anda isi, semakin akurat penawaran yang kami susun." />
            <Suspense fallback={<p className="text-sm text-slate-400">Memuat formulir…</p>}>
              <FormulirKontak />
            </Suspense>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-navy-950 p-7 text-white">
              <h2 className="text-lg font-bold !text-white">Kontak langsung</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Telepon className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                  <span className="flex flex-col gap-0.5">
                    {k.telepon.map((t) => (
                      <a key={t} href={`tel:${t}`} className="text-slate-300 transition hover:text-white">{t}</a>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Amplop className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                  <a href={`mailto:${k.email}`} className="text-slate-300 transition hover:text-white">{k.email}</a>
                </li>
                <li className="flex gap-3">
                  <Jam className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                  <span className="text-slate-300">{k.jamKerja}</span>
                </li>
              </ul>
              <a
                href={`https://wa.me/${k.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                <Wa className="h-4 w-4" /> Chat WhatsApp
              </a>
            </div>

            {[
              { j: 'Kantor Pusat', a: k.alamatKantor },
              { j: 'Kantor Cabang', a: k.alamatCabang },
              { j: 'Pusdiklat', a: k.alamatPusdiklat },
            ].map((x) => (
              <div key={x.j} className="rounded-2xl border border-slate-200 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Titik className="h-4 w-4 text-emas-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wide text-navy-900">{x.j}</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{x.a}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="wadah">
          <JudulBagian tengah label="Lokasi" judul="Kantor dan Pusdiklat kami" deskripsi="Tiga titik operasional: kantor pusat Purwakarta, kantor cabang Jakarta Utara, dan pusat pendidikan di Indramayu." />
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-navy-900/5">
            <PetaKantor titik={titik} tinggi="440px" />
          </div>
        </div>
      </section>
    </>
  )
}
