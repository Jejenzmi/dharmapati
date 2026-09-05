import { FOTO } from '@/lib/foto'
import { ambil, type Galeri as GaleriDb } from '@/lib/api'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, KepalaHalaman } from '@/komponen/bagian'
import Galeri, { type Butir } from '@/komponen/Galeri'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Galeri Kegiatan & Dokumentasi Lapangan',
  deskripsi:
    'Dokumentasi kegiatan PT. Dharmapati Putra Nusantara: apel dan supervisi anggota, pelatihan di Pusdiklat, seleksi rekrutmen, pekerjaan cleaning service, pramusaji, serta tenaga manpower di kawasan industri.',
  jalur: '/galeri',
  gambar: FOTO.apel,
  kataKunci: ['dokumentasi satpam dharmapati', 'foto cleaning service', 'pelatihan satpam'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Galeri', jalur: '/galeri' }]

/** Dokumentasi bawaan hasil company profile resmi. */
const BAWAAN: Butir[] = [
  { gambar: FOTO.kantor, judul: 'Kantor pusat Dharmapati di Purwakarta', kategori: 'Perusahaan' },
  { gambar: FOTO.staf1, judul: 'Staf administrasi', kategori: 'Perusahaan' },
  { gambar: FOTO.staf2, judul: 'Staf HRD', kategori: 'Perusahaan' },
  { gambar: FOTO.staf3, judul: 'Staf keuangan', kategori: 'Perusahaan' },
  { gambar: FOTO.staf4, judul: 'Manajemen operasional', kategori: 'Perusahaan' },

  { gambar: FOTO.hormatKantor, judul: 'Anggota memberi penghormatan di kantor', kategori: 'Pengamanan' },
  { gambar: FOTO.hormat, judul: 'Regu jaga siap bertugas', kategori: 'Pengamanan' },
  { gambar: FOTO.danru, judul: 'Danru di pos jaga', kategori: 'Pengamanan' },
  { gambar: FOTO.satpamWanita, judul: 'Anggota Satpam wanita di lobi klien', kategori: 'Pengamanan' },
  { gambar: FOTO.jaya, judul: 'Anggota Satpam berseragam lengkap', kategori: 'Pengamanan' },
  { gambar: FOTO.apel, judul: 'Apel anggota di area proyek', kategori: 'Pengamanan' },
  { gambar: FOTO.pengarahan, judul: 'Pengarahan sebelum bertugas', kategori: 'Pengamanan' },

  { gambar: FOTO.supervisi, judul: 'Supervisi anggota di objek', kategori: 'Supervisi' },
  { gambar: FOTO.supervisiLapangan, judul: 'Kunjungan supervisor ke lapangan', kategori: 'Supervisi' },
  { gambar: FOTO.apelPagi, judul: 'Apel pagi bersama supervisor', kategori: 'Supervisi' },
  { gambar: FOTO.gudang, judul: 'Penjagaan area pergudangan', kategori: 'Supervisi' },

  { gambar: FOTO.belaDiri, judul: 'Latihan bela diri', kategori: 'Pelatihan' },
  { gambar: FOTO.drillTongkat, judul: 'Drill tongkat dan borgol', kategori: 'Pelatihan' },
  { gambar: FOTO.damkar, judul: 'Drill pemadam kebakaran', kategori: 'Pelatihan' },
  { gambar: FOTO.smk3, judul: 'Kelas SMK-3 dasar', kategori: 'Pelatihan' },
  { gambar: FOTO.larilari, judul: 'Bintal jasmani', kategori: 'Pelatihan' },
  { gambar: FOTO.ppm, judul: 'Peraturan baris-berbaris dan PPM', kategori: 'Pelatihan' },
  { gambar: FOTO.pbb, judul: 'Latihan PBB di lapangan', kategori: 'Pelatihan' },
  { gambar: FOTO.kelas, judul: 'Pembinaan tupoksi Satpam', kategori: 'Pelatihan' },
  { gambar: FOTO.barisan, judul: 'Barisan anggota saat pembinaan', kategori: 'Pelatihan' },

  { gambar: FOTO.seleksiBaris, judul: 'Seleksi administrasi calon anggota', kategori: 'Rekrutmen' },
  { gambar: FOTO.wawancara, judul: 'Wawancara calon anggota', kategori: 'Rekrutmen' },
  { gambar: FOTO.ukurTinggi, judul: 'Pengukuran postur tubuh', kategori: 'Rekrutmen' },
  { gambar: FOTO.cekKesehatan, judul: 'Pemeriksaan kesehatan', kategori: 'Rekrutmen' },
  { gambar: FOTO.pelepasan, judul: 'Upacara pelepasan anggota', kategori: 'Rekrutmen' },
  { gambar: FOTO.seleksiCln, judul: 'Barisan pelamar tenaga kerja', kategori: 'Rekrutmen' },
  { gambar: FOTO.seleksiCln2, judul: 'Wawancara tenaga cleaning service', kategori: 'Rekrutmen' },
  { gambar: FOTO.seleksiCln3, judul: 'Pengarahan calon tenaga kerja', kategori: 'Rekrutmen' },

  { gambar: FOTO.bersihLobi, judul: 'Pembersihan lobi gedung', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihPabrik, judul: 'Pembersihan area pabrik', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihMeja, judul: 'Perawatan ruang tamu', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihWastafel, judul: 'Pembersihan wastafel', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihKaca, judul: 'Pembersihan area toilet', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihLantai, judul: 'Mopping area terbuka', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihKolam, judul: 'Perawatan area kolam', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihPintu, judul: 'Pembersihan pintu kaca', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihJendela, judul: 'Pembersihan jendela dan blind', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihTangga, judul: 'Pembersihan tangga gedung', kategori: 'Cleaning Service' },
  { gambar: FOTO.bersihToilet, judul: 'Pembersihan toilet', kategori: 'Cleaning Service' },

  { gambar: FOTO.pramusajiDapur, judul: 'Pramusaji menyiapkan hidangan', kategori: 'Pramusaji' },
  { gambar: FOTO.pramusajiSaji, judul: 'Pelayanan tamu di ruang kerja', kategori: 'Pramusaji' },
  { gambar: FOTO.pramusajiCuci, judul: 'Penataan peralatan pantry', kategori: 'Pramusaji' },

  { gambar: FOTO.manpowerKelas, judul: 'Pembekalan tenaga produksi', kategori: 'Manpower' },
  { gambar: FOTO.manpowerLini, judul: 'Tenaga kerja di lini produksi', kategori: 'Manpower' },
  { gambar: FOTO.manpowerMesin, judul: 'Operator mesin dengan APD lengkap', kategori: 'Manpower' },
  { gambar: FOTO.manpowerGerbang, judul: 'Pergantian shift karyawan', kategori: 'Manpower' },
]

export default async function HalamanGaleri() {
  const dariDb = (await ambil<GaleriDb[]>('/galeri')) ?? []
  const butir: Butir[] = dariDb.length
    ? dariDb.map((g) => ({ gambar: g.gambar, judul: g.judul, kategori: g.kategori, keterangan: g.keterangan }))
    : BAWAAN

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Galeri"
        judul="Dokumentasi kegiatan di lapangan"
        deskripsi="Kumpulan foto kegiatan operasional, pelatihan di Pusdiklat, proses rekrutmen, dan pekerjaan harian tim kami di lokasi pengguna jasa."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <Galeri butir={butir} />
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
