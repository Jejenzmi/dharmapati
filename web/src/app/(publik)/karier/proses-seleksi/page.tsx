import Image from 'next/image'
import Link from 'next/link'
import { ambilPengaturan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Centang, Panah, TopiWisuda } from '@/komponen/ikon'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Proses Seleksi & Kriteria Calon Anggota',
  deskripsi:
    'Enam tahap seleksi calon anggota Dharmapati: administrasi, wawancara, uji fisik dan postur, pemeriksaan kesehatan, pembekalan di Pusdiklat, hingga upacara pelepasan. Lengkap dengan kriteria umum pelamar.',
  jalur: '/karier/proses-seleksi',
  gambar: FOTO.seleksiBaris,
  kataKunci: ['syarat jadi satpam', 'tinggi badan satpam 168', 'proses rekrutmen satpam'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Karier', jalur: '/karier' },
  { nama: 'Proses Seleksi', jalur: '/karier/proses-seleksi' },
]
const SAUDARA = MENU.find((m) => m.label === 'Karier')!.anak!

const FOTO_TAHAP = [FOTO.seleksiBaris, FOTO.wawancara, FOTO.ukurTinggi, FOTO.cekKesehatan, FOTO.kelas, FOTO.pelepasan]

export default async function ProsesSeleksi() {
  const pengaturan = await ambilPengaturan()
  const r = pengaturan.rekrutmen

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Proses seleksi"
        judul="Enam tahap sebelum penempatan"
        deskripsi="Setiap calon anggota melewati tahapan yang sama, tanpa terkecuali. Inilah yang membedakan anggota terlatih dari sekadar orang berseragam."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {(r?.tahapan ?? []).map((t, i) => (
              <li key={t.judul} className="overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[16/10]">
                  <Image src={FOTO_TAHAP[i] ?? FOTO.kelas} alt={`Tahap ${i + 1}: ${t.judul}`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
                  <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950/90 font-judul text-sm font-bold text-emas-400 backdrop-blur">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-base font-bold">{t.judul}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.isi}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-[1fr_.8fr]">
          <div>
            <JudulBagian label="Kriteria umum" judul="Persyaratan calon anggota" deskripsi="Berlaku untuk penerimaan anggota Satpam. Untuk posisi lain, persyaratan menyesuaikan uraian pada masing-masing lowongan." />
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {(r?.kriteria ?? []).map((k) => (
                <li key={k} className="flex items-start gap-2.5 rounded-xl bg-white p-3.5 text-sm text-slate-600">
                  <Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{k}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-navy-950 p-7 text-white">
              <TopiWisuda className="mb-4 h-6 w-6 text-emas-400" />
              <h2 className="text-lg font-bold !text-white">Dilatih di Pusdiklat sendiri</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Sebelum diterjunkan, anggota menjalani pembekalan di Pusdiklat Dharmapati, Gantar,
                Kabupaten Indramayu: pengetahuan dasar Polri, KAMTIBMAS, PBB dan PPM, bela diri,
                drill tongkat dan borgol, drill damkar, serta SMK-3 dasar.
              </p>
              <Link href="/layanan/pendukung/pelatihan-sertifikasi" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emas-400 hover:text-emas-300">
                Lihat program pelatihan <Panah className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-sm font-bold text-amber-900">Tidak ada pungutan</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-800">
                Seluruh tahapan di atas gratis. Bila ada pihak yang meminta uang atas nama Dharmapati,
                laporkan ke kantor pusat kami.
              </p>
            </div>

            <Link href="/karier/lamar" className="tombol-utama w-full">Kirim Lamaran <Panah className="h-4 w-4" /></Link>
          </aside>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/karier/proses-seleksi" judul="Selanjutnya di bagian karier" />
    </>
  )
}
