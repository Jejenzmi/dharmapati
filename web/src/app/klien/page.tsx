import Link from 'next/link'
import { ambil, ambilPengaturan, type Klien } from '@/lib/api'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, Statistik } from '@/komponen/bagian'
import { Gedung, Panah, Peta, Titik } from '@/komponen/ikon'
import PetaKlien from '@/komponen/PetaKlien'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Klien & Peta Jangkauan Layanan',
  deskripsi:
    'Peta interaktif sebaran klien PT. Dharmapati Putra Nusantara: kawasan industri Bekasi, Cikarang, Cibitung, Karawang, instansi pemerintah Purwakarta, Subang, hingga Indramayu, Cirebon, Kendal, Gresik, dan Jember.',
  jalur: '/klien',
  kataKunci: ['klien jasa keamanan jawa barat', 'penyedia satpam kawasan industri', 'peta jangkauan outsourcing'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Klien & Jangkauan', jalur: '/klien' }]

export default async function HalamanKlien() {
  const [klien, pengaturan] = await Promise.all([ambil<Klien[]>('/klien'), ambilPengaturan()])
  const daftar = klien ?? []
  const k = pengaturan.kontak

  const perProvinsi = daftar.reduce<Record<string, Klien[]>>((akun, x) => {
    ;(akun[x.provinsi] ??= []).push(x)
    return akun
  }, {})
  const sektor = Array.from(new Set(daftar.map((x) => x.sektor))).sort()
  const kota = new Set(daftar.map((x) => x.kota))

  const titikKantor = k
    ? [
        { nama: 'Kantor Pusat', jenis: 'Head Office', alamat: k.alamatKantor, ...k.petaKantor },
        { nama: 'Kantor Cabang', jenis: 'Branch Office', alamat: k.alamatCabang, ...k.petaCabang },
        { nama: 'Pusdiklat Dharmapati', jenis: 'Pusat Pendidikan & Pelatihan', alamat: k.alamatPusdiklat, ...k.petaPusdiklat },
      ]
    : []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Klien & jangkauan"
        judul="Kami sudah bertugas di sini"
        deskripsi="Setiap titik pada peta adalah objek yang kami jaga atau kelola. Saring berdasarkan lini layanan dan provinsi, atau klik nama klien untuk memusatkan peta."
        anak={
          <div className="mt-10">
            <Statistik
              angka={[
                { nilai: `${daftar.length}`, label: 'Objek penempatan' },
                { nilai: `${kota.size}`, label: 'Kota & kabupaten' },
                { nilai: `${Object.keys(perProvinsi).length}`, label: 'Provinsi' },
                { nilai: `${sektor.length}`, label: 'Sektor industri' },
              ]}
            />
          </div>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <PetaKlien klien={daftar} kantor={titikKantor} tinggi="600px" />
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Posisi penanda merupakan perkiraan pada tingkat kota untuk menjaga kerahasiaan lokasi objek.
            Nama klien ditampilkan sebagai referensi pengalaman kerja.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="wadah">
          <JudulBagian label="Daftar klien" judul="Dipercaya lintas sektor" deskripsi="Instansi pemerintah, manufaktur, konstruksi, distribusi, perumahan, dan properti." />

          <div className="space-y-10">
            {Object.entries(perProvinsi).map(([provinsi, isi]) => (
              <div key={provinsi}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-emas-700">
                  <Peta className="h-4 w-4" /> {provinsi}
                  <span className="rounded-full bg-navy-900/5 px-2.5 py-0.5 text-[11px] font-bold text-navy-700">{isi.length}</span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {isi.map((x) => (
                    <div key={x.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <Gedung className="mt-0.5 h-5 w-5 shrink-0 text-emas-600" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy-900">{x.nama}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                          <Titik className="h-3 w-3" />{x.kota} · {x.sektor}
                        </p>
                        <p className="mt-1.5 flex flex-wrap gap-1">
                          {x.layananT.map((l) => (
                            <span key={l} className="rounded-full bg-emas-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emas-700">{l}</span>
                          ))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!daftar.length && <p className="py-10 text-center text-slate-400">Daftar klien belum tersedia.</p>}

          <div className="mt-12 rounded-3xl bg-navy-950 p-8 text-center sm:p-10">
            <h2 className="text-2xl font-bold !text-white">Objek Anda belum ada di peta ini?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Kami membuka penempatan baru di seluruh Jawa. Sampaikan lokasi dan kebutuhan Anda,
              tim survei kami akan menjadwalkan kunjungan.
            </p>
            <Link href="/kontak" className="tombol-utama mt-7">Ajukan Survei Lokasi <Panah className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
