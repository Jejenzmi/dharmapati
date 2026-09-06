import Image from 'next/image'
import Link from 'next/link'
import { ambilPengaturan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, Statistik, TautanSaudara } from '@/komponen/bagian'
import { Centang, Gedung, Panah, Perisai, Titik } from '@/komponen/ikon'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Profil Perusahaan',
  deskripsi:
    'Profil PT. Dharmapati Putra Nusantara — perusahaan penyedia jasa pengamanan, cleaning service, dan pengelolaan tenaga kerja di Purwakarta yang berdiri sejak 2016 dan melayani empat provinsi.',
  jalur: '/tentang',
  kataKunci: ['profil dharmapati', 'perusahaan jasa pengamanan purwakarta', 'perusahaan outsourcing purwakarta'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Tentang Kami', jalur: '/tentang' }]
const SAUDARA = MENU.find((m) => m.label === 'Tentang')!.anak!

export default async function ProfilPerusahaan() {
  const pengaturan = await ambilPengaturan()
  const p = pengaturan.perusahaan
  const k = pengaturan.kontak
  const profil = pengaturan.profil

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Profil perusahaan"
        judul="Perusahaan jasa pengamanan dan pengelolaan tenaga kerja yang lahir dari disiplin militer"
        deskripsi="Berdiri sejak 2016 di Purwakarta, tumbuh menjadi penyedia tenaga pengamanan, kebersihan, dan tenaga kerja untuk industri serta instansi pemerintah di empat provinsi."
        anak={
          <div className="mt-10">
            <Statistik
              angka={[
                { nilai: '2016', label: 'Tahun berdiri' },
                { nilai: '9', label: 'Jenis layanan' },
                { nilai: '4', label: 'Provinsi dilayani' },
                { nilai: '3', label: 'Lokasi operasional' },
              ]}
            />
          </div>
        }
      />

      <section className="py-20 sm:py-24">
        <div className="wadah grid items-start gap-14 lg:grid-cols-[1fr_.85fr]">
          <div>
            <JudulBagian label="Sekilas" judul="Siapa kami" />
            <div className="prosa">
              {(profil?.paragraf ?? []).map((teks) => <p key={teks.slice(0, 30)}>{teks}</p>)}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {(profil?.poin ?? []).map((t) => (
                <p key={t} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{t}
                </p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 p-5">
                <Gedung className="mb-3 h-5 w-5 text-emas-600" />
                <h3 className="text-sm font-bold">Kantor Pusat</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{k?.alamatKantor}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <Gedung className="mb-3 h-5 w-5 text-emas-600" />
                <h3 className="text-sm font-bold">Kantor Cabang</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{k?.alamatCabang}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-5">
                <Titik className="mb-3 h-5 w-5 text-emas-600" />
                <h3 className="text-sm font-bold">Pusdiklat</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{k?.alamatPusdiklat}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/10">
              <Image src={profil?.gambar ?? FOTO.kantor} alt="Kantor pusat PT. Dharmapati Putra Nusantara di Purwakarta" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-navy-950 px-6 py-5 text-white shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emas-400">Berdiri</p>
              <p className="font-judul text-3xl font-bold">2016</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-16">
        <div className="wadah flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-2xl">
            <span className="label-bagian-gelap"><Perisai className="h-3.5 w-3.5" /> Legalitas</span>
            <h2 className="mt-4 text-2xl font-bold !text-white sm:text-3xl">Semua perizinan bisa Anda periksa</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Akta pendirian, pengesahan AHU, NIB, SPPKP, SIO Polri, keanggotaan ABUJAPI dan APKLINDO,
              hingga sertifikat ISO 9001:2015.
            </p>
          </div>
          <Link href="/legalitas" className="tombol-utama shrink-0">Lihat Legalitas <Panah className="h-4 w-4" /></Link>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/tentang" judul="Selengkapnya tentang kami" />
      <AjakanBertindak />
    </>
  )
}
