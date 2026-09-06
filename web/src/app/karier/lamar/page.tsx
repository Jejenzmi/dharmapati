import Link from 'next/link'
import { ambil, ambilPengaturan, type Lowongan } from '@/lib/api'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Centang, Panah, Titik } from '@/komponen/ikon'
import FormulirLamaran from '@/komponen/FormulirLamaran'

export const revalidate = 300

export const metadata = buatMetadata({
  judul: 'Kirim Lamaran Kerja',
  deskripsi:
    'Formulir lamaran kerja daring PT. Dharmapati Putra Nusantara. Lampirkan berkas lamaran Anda dalam format PDF atau JPG. Proses seleksi tidak dipungut biaya apa pun.',
  jalur: '/karier/lamar',
  kataKunci: ['kirim lamaran satpam', 'lamaran kerja cleaning service', 'form lamaran daring dharmapati'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Karier', jalur: '/karier' },
  { nama: 'Kirim Lamaran', jalur: '/karier/lamar' },
]
const SAUDARA = MENU.find((m) => m.label === 'Karier')!.anak!

export default async function KirimLamaran() {
  const [daftarLowongan, pengaturan] = await Promise.all([ambil<Lowongan[]>('/lowongan'), ambilPengaturan()])
  const lowongan = daftarLowongan ?? []
  const berkas = pengaturan.daftarBantuan?.berkasLamaran ?? []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Kirim lamaran"
        judul="Lamaran umum"
        deskripsi="Belum menemukan posisi yang cocok, atau ingin masuk daftar tunggu kami? Kirim lamaran umum lewat formulir ini. Berkas Anda kami simpan dan dihubungi saat ada penempatan yang sesuai."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-navy-900/5">
            <h2 className="text-xl font-bold">Data pelamar</h2>
            <p className="mb-6 mt-1.5 text-sm text-slate-600">
              Isi selengkap mungkin. Berkas lamaran boleh berupa PDF gabungan atau foto berkas, maksimal 5 MB.
            </p>
            <FormulirLamaran />
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-navy-950 p-7 text-white">
              <h2 className="text-base font-bold !text-white">Melamar posisi tertentu?</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Lamaran akan langsung terhubung ke lowongan bila Anda mengirimnya dari halaman posisi
                yang bersangkutan.
              </p>
              <ul className="mt-5 space-y-2">
                {lowongan.map((l) => (
                  <li key={l.id}>
                    <Link href={`/karier/${l.slug}`} className="group flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 transition hover:bg-white/10">
                      <span>
                        <span className="block text-sm font-bold text-white">{l.posisi}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><Titik className="h-3 w-3" />{l.lokasi}</span>
                      </span>
                      <Panah className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-emas-400" />
                    </Link>
                  </li>
                ))}
                {!lowongan.length && <li className="text-sm text-slate-500">Belum ada lowongan terbuka.</li>}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 p-7">
              <h2 className="text-base font-bold">Berkas yang perlu disiapkan</h2>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                {berkas.map((b) => (
                  <li key={b} className="flex items-start gap-2.5"><Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{b}</li>
                ))}
              </ul>
              <Link href="/karier/proses-seleksi" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
                Pelajari proses seleksi <Panah className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/karier/lamar" judul="Selanjutnya di bagian karier" />
    </>
  )
}
