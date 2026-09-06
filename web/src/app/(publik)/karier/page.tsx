import Link from 'next/link'
import { ambil, ambilPengaturan, type Lowongan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { tanggalId } from '@/lib/format'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Panah, Titik } from '@/komponen/ikon'

export const revalidate = 300

export const metadata = buatMetadata({
  judul: 'Lowongan Kerja Terbuka',
  deskripsi:
    'Lowongan kerja di PT. Dharmapati Putra Nusantara: anggota Satpam, petugas cleaning service, operator forklift, dan tenaga produksi untuk penempatan di Purwakarta, Karawang, Subang, dan Cikarang. Seleksi tanpa biaya.',
  jalur: '/karier',
  gambar: FOTO.pelepasan,
  kataKunci: ['lowongan satpam purwakarta', 'loker cleaning service karawang', 'lowongan operator forklift cikarang'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Karier', jalur: '/karier' }]
const SAUDARA = MENU.find((m) => m.label === 'Karier')!.anak!

export default async function LowonganTerbuka() {
  const [lowongan, pengaturan] = await Promise.all([ambil<Lowongan[]>('/lowongan'), ambilPengaturan()])
  const daftar = lowongan ?? []
  const surelKarier = pengaturan.kontak?.emailKarier ?? pengaturan.kontak?.email

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Karier"
        judul="Bergabung menjadi kader Dharmapati"
        deskripsi="Kami merekrut, melatih di Pusdiklat sendiri, lalu menempatkan. Seluruh tahapan seleksi tidak dipungut biaya — waspadai pihak yang mengatasnamakan perusahaan kami."
        anak={
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/karier/lamar" className="tombol-utama">Kirim Lamaran <Panah className="h-4 w-4" /></Link>
            <Link href="/karier/proses-seleksi" className="tombol-garis">Lihat Proses Seleksi</Link>
          </div>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <JudulBagian label="Lowongan terbuka" judul={`${daftar.length} posisi yang sedang kami cari`} />
          <div className="grid gap-5 lg:grid-cols-2">
            {daftar.map((l) => (
              <article key={l.id} className="group relative rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emas-300 hover:shadow-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-navy-950 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{l.tipe}</span>
                  <span className="rounded-full bg-emas-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emas-700">Kuota {l.kuota}</span>
                </div>
                <h2 className="mt-4 text-xl font-bold">
                  <Link href={`/karier/${l.slug}`} className="relative after:absolute after:inset-0">{l.posisi}</Link>
                </h2>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500"><Titik className="h-4 w-4" />{l.lokasi}</p>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{l.deskripsi}</p>
                <p className="mt-5 flex items-center justify-between text-xs text-slate-400">
                  <span>Dibuka {tanggalId(l.dibuatAt, false)}</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-navy-800 transition group-hover:gap-2.5 group-hover:text-emas-600">
                    Lihat syarat <Panah className="h-3.5 w-3.5" />
                  </span>
                </p>
              </article>
            ))}
          </div>

          {!daftar.length && (
            <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              Belum ada lowongan terbuka saat ini. Anda tetap dapat mengirim lamaran umum.
            </p>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-sm font-bold text-amber-900">Perhatian</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-800">
                Seluruh proses rekrutmen Dharmapati <strong>tidak dipungut biaya</strong>. Kami tidak pernah
                meminta transfer uang untuk seragam, pelatihan, atau penempatan.
              </p>
            </div>
            {surelKarier && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-sm font-bold text-navy-900">Bertanya soal lowongan?</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Surelkan pertanyaan Anda ke{' '}
                  <a href={`mailto:${surelKarier}`} className="font-semibold text-navy-800 underline decoration-emas-400 decoration-2 underline-offset-2">
                    {surelKarier}
                  </a>
                  . Berkas lamaran tetap kami terima lewat formulir daring.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/karier" judul="Selanjutnya di bagian karier" />
    </>
  )
}
