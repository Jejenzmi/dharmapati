import Link from 'next/link'
import { ambilPengaturan } from '@/lib/api'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah, mutlak } from '@/lib/seo'
import { JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Gedung, Jam, Panah, Titik } from '@/komponen/ikon'
import PetaKantor from '@/komponen/PetaKantor'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Lokasi Kantor & Pusdiklat',
  deskripsi:
    'Alamat dan peta kantor pusat PT. Dharmapati Putra Nusantara di Samesta Royal Campaka Purwakarta, kantor cabang Kelapa Gading Jakarta Utara, serta Pusdiklat di Gantar Kabupaten Indramayu.',
  jalur: '/kontak/lokasi',
  kataKunci: ['alamat dharmapati putra nusantara', 'kantor jasa keamanan purwakarta', 'pusdiklat satpam indramayu'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Kontak', jalur: '/kontak' },
  { nama: 'Lokasi Kantor', jalur: '/kontak/lokasi' },
]
const SAUDARA = MENU.find((m) => m.label === 'Kontak')!.anak!

export default async function LokasiKantor() {
  const pengaturan = await ambilPengaturan()
  const k = pengaturan.kontak!

  const titik = [
    { nama: 'Kantor Pusat', jenis: 'Head Office', alamat: k.alamatKantor, keterangan: 'Pusat administrasi, kontrak, penggajian, dan operasional harian.', ...k.petaKantor },
    { nama: 'Kantor Cabang', jenis: 'Branch Office', alamat: k.alamatCabang, keterangan: 'Melayani penempatan di wilayah Jabodetabek.', ...k.petaCabang },
    { nama: 'Pusdiklat Dharmapati', jenis: 'Pusat Pendidikan & Pelatihan', alamat: k.alamatPusdiklat, keterangan: 'Pembekalan anggota baru dan penyegaran berkala.', ...k.petaPusdiklat },
  ]

  const ldTempat = titik.map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${t.nama} — PT. Dharmapati Putra Nusantara`,
    address: { '@type': 'PostalAddress', streetAddress: t.alamat, addressCountry: 'ID' },
    geo: { '@type': 'GeoCoordinates', latitude: t.lat, longitude: t.lng },
    url: mutlak('/kontak/lokasi'),
  }))

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />
      {ldTempat.map((d, i) => <DataTerstruktur key={i} data={d} />)}

      <KepalaHalaman
        remah={REMAH}
        label="Lokasi"
        judul="Kantor dan Pusdiklat kami"
        deskripsi="Tiga titik operasional: kantor pusat di Purwakarta, kantor cabang di Jakarta Utara, dan pusat pendidikan di Indramayu."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-navy-900/5">
            <PetaKantor titik={titik} tinggi="480px" />
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {titik.map((t) => (
              <article key={t.nama} className="rounded-3xl border border-slate-200 bg-white p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-emas-400">
                  {t.nama.includes('Pusdiklat') ? <Titik className="h-5 w-5" /> : <Gedung className="h-5 w-5" />}
                </span>
                <h2 className="mt-4 text-lg font-bold">{t.nama}</h2>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emas-700">{t.jenis}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.alamat}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">{t.keterangan}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-800 transition hover:text-emas-600"
                >
                  Buka di Google Maps <Panah className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="flex gap-4 rounded-2xl bg-slate-50 p-6">
              <Jam className="h-5 w-5 shrink-0 text-emas-600" />
              <div>
                <h2 className="text-sm font-bold">Jam layanan</h2>
                <p className="mt-1 text-sm text-slate-600">{k.jamKerja}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-navy-950 p-6 text-white">
              <div>
                <h2 className="text-sm font-bold !text-white">Ingin berkunjung?</h2>
                <p className="mt-1 text-sm text-slate-400">Hubungi kami dulu agar tim yang tepat menyambut Anda.</p>
              </div>
              <Link href="/kontak" className="tombol-utama shrink-0">Hubungi</Link>
            </div>
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/kontak/lokasi" judul="Informasi lain" />
    </>
  )
}
