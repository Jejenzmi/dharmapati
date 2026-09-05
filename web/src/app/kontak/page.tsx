import { Suspense } from 'react'
import Link from 'next/link'
import { ambilPengaturan } from '@/lib/api'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Amplop, Jam, Panah, Telepon, Titik, Wa } from '@/komponen/ikon'
import FormulirKontak from '@/komponen/FormulirKontak'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Minta Penawaran',
  deskripsi:
    'Kirim permintaan penawaran jasa pengamanan, cleaning service, atau tenaga kerja ke PT. Dharmapati Putra Nusantara. Tim survei menghubungi Anda dan penawaran resmi diserahkan maksimal 3 hari kerja.',
  jalur: '/kontak',
  kataKunci: ['kontak jasa keamanan purwakarta', 'penawaran satpam', 'harga jasa cleaning service'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Kontak', jalur: '/kontak' }]
const SAUDARA = MENU.find((m) => m.label === 'Kontak')!.anak!

export default async function HalamanKontak() {
  const pengaturan = await ambilPengaturan()
  const k = pengaturan.kontak!

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Minta penawaran"
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

            <div className="rounded-3xl border border-slate-200 p-7">
              <div className="mb-2 flex items-center gap-2">
                <Titik className="h-4 w-4 text-emas-600" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-navy-900">Kantor Pusat</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{k.alamatKantor}</p>
              <Link href="/kontak/lokasi" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
                Lihat semua lokasi &amp; peta <Panah className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 p-7">
              <h2 className="text-base font-bold">Yang perlu kami tahu</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                <li>Lokasi dan luas area objek</li>
                <li>Jumlah pos dan shift yang diinginkan</li>
                <li>Jam operasional</li>
                <li>Kebutuhan perlengkapan khusus</li>
                <li>Target waktu mulai</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/kontak" judul="Informasi lain" />
    </>
  )
}
