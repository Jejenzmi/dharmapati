import Link from 'next/link'
import { ambilPengaturan } from '@/lib/api'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { KepalaHalaman } from '@/komponen/bagian'
import { Perisai } from '@/komponen/ikon'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Kebijakan Privasi Aplikasi DHARMAPATI',
  deskripsi:
    'Kebijakan privasi aplikasi lapangan DHARMAPATI milik PT. Dharmapati Putra Nusantara: data yang dikumpulkan, alasan pengumpulannya, lama penyimpanan, pihak yang dapat melihatnya, serta cara menarik persetujuan dan menghapus data.',
  jalur: '/kebijakan-privasi',
  kataKunci: [
    'kebijakan privasi dharmapati',
    'privasi aplikasi satpam',
    'perlindungan data anggota keamanan',
  ],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Kebijakan Privasi', jalur: '/kebijakan-privasi' },
]

const BERLAKU = '6 September 2026'

/** Judul bagian bernomor — lebih tenang daripada judul bagian pemasaran. */
function Judul({ nomor, children }: { nomor: string; children: React.ReactNode }) {
  return (
    <h2 className="!mb-4 flex items-baseline gap-3 text-xl font-bold text-navy-950 sm:text-2xl">
      <span className="text-sm font-bold text-emas-600">{nomor}.</span>
      {children}
    </h2>
  )
}

/** Satu baris tabel data: apa yang diambil, untuk apa, dan berapa lama disimpan. */
type BarisData = { jenis: string; isi: string; tujuan: string; simpan: string }

const DATA: BarisData[] = [
  {
    jenis: 'Identitas kepegawaian',
    isi: 'Nama, nomor induk anggota, jabatan, nomor telepon, foto profil, penempatan site.',
    tujuan: 'Mengenali siapa yang bertugas dan menyusun jadwal jaga.',
    simpan: 'Selama menjadi anggota, lalu sesuai kewajiban arsip ketenagakerjaan.',
  },
  {
    jenis: 'Presensi',
    isi: 'Waktu masuk dan pulang, titik koordinat saat presensi, jarak dari pos, swafoto.',
    tujuan:
      'Membuktikan anggota benar berada di pos saat jam jaga — dasar penggajian dan tagihan kepada pengguna jasa.',
    simpan: 'Catatan presensi disimpan permanen; swafotonya dihapus otomatis setelah 180 hari.',
  },
  {
    jenis: 'Ciri wajah',
    isi: 'Rangkaian 128 angka hasil pengukuran wajah. Bukan foto, dan tidak dapat dikembalikan menjadi gambar wajah.',
    tujuan: 'Memastikan yang melakukan presensi adalah orang yang bersangkutan, bukan rekannya.',
    simpan: 'Selama menjadi anggota; dihapus saat anggota berhenti atau atas permintaan.',
  },
  {
    jenis: 'Lokasi saat bertugas',
    isi: 'Titik koordinat berkala selama shift berjalan, dan koordinat setiap pemindaian titik patroli.',
    tujuan:
      'Menunjukkan ronde benar dijalankan, dan menemukan anggota dengan cepat saat tombol darurat ditekan.',
    simpan: 'Jejak lokasi dihapus otomatis setelah 30 hari.',
  },
  {
    jenis: 'Kegiatan jaga',
    isi: 'Pemindaian titik patroli, laporan kondisi titik, laporan insiden beserta fotonya, serah terima shift, tugas.',
    tujuan: 'Laporan pertanggungjawaban kepada perusahaan dan pengguna jasa.',
    simpan: 'Permanen sebagai arsip operasional.',
  },
  {
    jenis: 'Perangkat',
    isi: 'Penanda acak aplikasi, merek dan model ponsel, versi sistem operasi, versi aplikasi, serta penanda apakah lokasi berasal dari aplikasi pengubah lokasi.',
    tujuan:
      'Mengikat satu akun pada satu ponsel agar akun tidak dapat dipinjamkan, dan menolak presensi berlokasi palsu.',
    simpan: 'Selama perangkat masih terdaftar. Percobaan yang ditolak disimpan 180 hari.',
  },
  {
    jenis: 'Kepegawaian & penggajian',
    isi: 'Golongan upah, kehadiran, lembur, potongan, pajak, nomor rekening, masa berlaku KTA/SKCK/sertifikat.',
    tujuan: 'Menghitung dan membayarkan gaji, serta memenuhi kewajiban perpajakan dan jaminan sosial.',
    simpan: 'Sesuai kewajiban penyimpanan dokumen keuangan dan perpajakan.',
  },
]

const IZIN = [
  {
    nama: 'Lokasi presisi',
    isi: 'Dipakai saat presensi, saat memindai titik patroli, dan saat tombol darurat ditekan. Aplikasi tidak mengambil lokasi ketika Anda sedang tidak bertugas, dan tidak meminta izin lokasi latar belakang.',
  },
  {
    nama: 'Kamera',
    isi: 'Untuk swafoto presensi, foto bukti patroli dan insiden, serta memindai kode QR titik patroli. Pemindaian kode dilakukan di dalam ponsel, gambarnya tidak dikirim ke mana pun.',
  },
  {
    nama: 'Sensor gerak',
    isi: 'Mengenali anggota yang tidak bergerak dalam waktu lama saat berjaga sendirian, agar pertolongan dapat dikirim. Hanya angka percepatan yang dibaca, bukan isi apa pun.',
  },
  {
    nama: 'Status jaringan',
    isi: 'Mengetahui kapan sambungan kembali tersedia sehingga catatan yang sempat tertahan di area tanpa sinyal dapat dikirim.',
  },
]

export default async function KebijakanPrivasi() {
  const pengaturan = await ambilPengaturan()
  const k = pengaturan.kontak
  const namaPT = pengaturan.perusahaan?.nama ?? 'PT. Dharmapati Putra Nusantara'
  const email = k?.emailDukungan ?? 'support@dharmapati.co.id'

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Kebijakan Privasi"
        judul="Kebijakan Privasi Aplikasi DHARMAPATI"
        deskripsi={`Berlaku sejak ${BERLAKU}. Menjelaskan data apa yang dikumpulkan aplikasi lapangan DHARMAPATI, untuk apa dipakai, berapa lama disimpan, dan hak Anda atasnya.`}
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-emas-200 bg-emas-50 p-6">
              <Perisai className="mb-3 h-6 w-6 text-emas-600" />
              <h2 className="text-base font-bold">Ringkasnya</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                DHARMAPATI adalah aplikasi kerja untuk anggota satuan pengamanan PT. Dharmapati Putra
                Nusantara. Aplikasi ini bukan untuk masyarakat umum dan hanya dapat dibuka dengan akun
                yang diberikan perusahaan. Data yang dikumpulkan sebatas yang diperlukan untuk
                membuktikan tugas jaga benar dijalankan — presensi, ronde patroli, laporan kejadian —
                serta untuk menghitung gaji. Kami tidak menjual data siapa pun, tidak memasang iklan,
                dan tidak menyalakan pelacakan lokasi di luar jam tugas.
              </p>
            </div>

            <div className="prosa mt-12 space-y-12">
              <section>
                <Judul nomor="1">Siapa yang bertanggung jawab</Judul>
                <p>
                  Pengendali data adalah <strong>{namaPT}</strong>, berkantor di{' '}
                  {k?.alamatKantor}. Pertanyaan mengenai kebijakan ini dapat dikirim ke{' '}
                  <a href={`mailto:${email}`} className="font-semibold text-navy-900 underline">
                    {email}
                  </a>
                  {k?.telepon?.[0] ? ` atau telepon ${k.telepon[0]}` : ''}.
                </p>
              </section>

              <section>
                <Judul nomor="2">Siapa penggunanya</Judul>
                <p>
                  Aplikasi ini dipakai oleh anggota satuan pengamanan yang ditugaskan perusahaan, serta
                  komandan regu dan pengawasnya. Akun dibuat oleh administrator perusahaan; tidak ada
                  pendaftaran mandiri dan tidak ada bagian aplikasi yang terbuka untuk umum.
                </p>
              </section>

              <section>
                <Judul nomor="3">Data yang dikumpulkan dan alasannya</Judul>
                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">
                      Rincian data yang dikumpulkan aplikasi DHARMAPATI
                    </caption>
                    <thead className="bg-navy-950 text-white">
                      <tr>
                        <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">
                          Jenis
                        </th>
                        <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">
                          Untuk apa &amp; berapa lama
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {DATA.map((d) => (
                        <tr key={d.jenis} className="align-top">
                          <td className="px-5 py-4">
                            <p className="font-bold text-navy-950">{d.jenis}</p>
                            <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{d.isi}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[13px] leading-relaxed text-slate-700">{d.tujuan}</p>
                            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                              <strong>Lama simpan:</strong> {d.simpan}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Aplikasi tidak membaca daftar kontak, pesan, riwayat panggilan, maupun berkas pribadi
                  di ponsel Anda.
                </p>
              </section>

              <section>
                <Judul nomor="4">Izin perangkat yang diminta</Judul>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {IZIN.map((i) => (
                    <div key={i.nama} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <h3 className="text-sm font-bold text-navy-950">{i.nama}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{i.isi}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <Judul nomor="5">Ciri wajah dan lokasi</Judul>
                <p>
                  Dua jenis data ini kami perlakukan lebih ketat karena sifatnya melekat pada diri
                  seseorang.
                </p>
                <p>
                  <strong>Ciri wajah</strong> hanya disimpan sebagai rangkaian angka hasil pengukuran,
                  bukan gambar, dan tidak dapat diubah kembali menjadi wajah. Pencocokannya dilakukan di
                  server perusahaan sendiri, tidak dikirim ke layanan pengenalan wajah pihak mana pun.
                  Pendaftarannya dilakukan administrator dengan sepengetahuan anggota, dan dapat dihapus
                  kapan saja atas permintaan anggota — presensi kemudian kembali memakai swafoto biasa.
                </p>
                <p>
                  <strong>Lokasi</strong> diambil saat presensi, saat memindai titik patroli, dan secara
                  berkala hanya selama shift berjalan dengan aplikasi terbuka. Aplikasi tidak meminta
                  izin lokasi latar belakang, sehingga tidak dapat mengikuti keberadaan Anda setelah
                  tugas selesai atau aplikasi ditutup. Seluruh jejak lokasi terhapus otomatis setelah 30
                  hari. Setiap kali pengawas membuka riwayat lokasi seseorang, pembukaan itu ikut
                  tercatat pada jejak audit.
                </p>
              </section>

              <section>
                <Judul nomor="6">Data orang lain yang Anda catat</Judul>
                <p>
                  Sebagian tugas jaga menuntut pencatatan data orang lain: nama dan nomor identitas tamu
                  pada buku tamu, serta nomor kendaraan yang keluar masuk. Data itu milik pengguna jasa
                  tempat Anda ditugaskan, dipakai semata untuk keamanan lokasi tersebut, dan tidak
                  digunakan untuk keperluan lain. Catat seperlunya dan sesuai arahan pengguna jasa.
                </p>
              </section>

              <section>
                <Judul nomor="7">Siapa saja yang dapat melihat</Judul>
                <ul>
                  <li>
                    <strong>Anda sendiri</strong> — seluruh catatan presensi, patroli, slip gaji, dan
                    berkas Anda.
                  </li>
                  <li>
                    <strong>Komandan regu dan pengawas</strong> — data operasional anggota yang menjadi
                    tanggung jawabnya. Data gaji tidak termasuk.
                  </li>
                  <li>
                    <strong>Administrator perusahaan</strong> — seluruh data, termasuk penggajian.
                  </li>
                  <li>
                    <strong>Pengguna jasa</strong> — hanya kegiatan jaga di lokasinya sendiri: kehadiran,
                    ronde, dan insiden. Pengguna jasa tidak dapat melihat berkas pribadi, data gaji,
                    maupun riwayat lokasi Anda.
                  </li>
                  <li>
                    <strong>Instansi berwenang</strong> — bila diminta secara sah, misalnya dalam
                    penyidikan sebuah kejadian.
                  </li>
                </ul>
                <p>
                  Data tidak pernah dijual, disewakan, atau dipertukarkan. Tidak ada layanan iklan
                  maupun analitik pihak ketiga di dalam aplikasi.
                </p>
              </section>

              <section>
                <Judul nomor="8">Tempat penyimpanan dan pengamanan</Judul>
                <p>
                  Data disimpan pada server yang dikelola perusahaan. Sambungan aplikasi ke server
                  selalu terenkripsi. Kata sandi disimpan dalam bentuk teracak yang tidak dapat
                  dikembalikan. Setiap peran hanya dapat membuka data yang menjadi haknya, dan
                  pembatasan itu ditegakkan di server — bukan sekadar disembunyikan pada tampilan.
                  Perubahan data penting serta pembukaan data pribadi tercatat pada jejak audit.
                </p>
              </section>

              <section id="hapus-akun" className="scroll-mt-28">
                <Judul nomor="9">Hak Anda dan cara menghapus data</Judul>
                <p>Anda berhak untuk:</p>
                <ul>
                  <li>melihat data diri yang kami simpan;</li>
                  <li>meminta perbaikan bila ada yang keliru;</li>
                  <li>meminta penghapusan ciri wajah tanpa harus berhenti bekerja;</li>
                  <li>meminta penghapusan akun beserta data pribadi di dalamnya.</li>
                </ul>
                <p>
                  Permintaan dikirim ke{' '}
                  <a href={`mailto:${email}`} className="font-semibold text-navy-900 underline">
                    {email}
                  </a>{' '}
                  dengan menyebutkan nama dan nomor induk anggota, atau disampaikan langsung ke bagian
                  personalia. Kami menanggapi paling lama <strong>14 hari kerja</strong>.
                </p>
                <p>
                  Setelah akun dihapus, Anda tidak dapat lagi masuk ke aplikasi, dan data pribadi seperti
                  ciri wajah, foto, jejak lokasi, serta nomor rekening dihapus. Sebagian catatan tetap
                  kami simpan karena diwajibkan hukum atau diperlukan sebagai bukti pelaksanaan
                  pekerjaan: rekap kehadiran, laporan insiden, dan dokumen penggajian beserta pajaknya.
                  Catatan itu dipisahkan dari data pengenal sejauh yang memungkinkan dan disimpan hanya
                  selama masa yang diwajibkan peraturan.
                </p>
              </section>

              <section>
                <Judul nomor="10">Anak-anak</Judul>
                <p>
                  Aplikasi ini adalah alat kerja bagi anggota satuan pengamanan yang seluruhnya berusia
                  dewasa. Kami tidak mengumpulkan data anak secara sengaja.
                </p>
              </section>

              <section>
                <Judul nomor="11">Perubahan kebijakan</Judul>
                <p>
                  Bila kebijakan ini berubah, versi terbarunya diterbitkan di halaman ini beserta
                  tanggal berlakunya. Perubahan yang menyangkut jenis data baru atau tujuan baru
                  diberitahukan lebih dulu lewat pengumuman di dalam aplikasi.
                </p>
              </section>

              <section>
                <Judul nomor="12">Hubungi kami</Judul>
                <p>
                  {namaPT}
                  <br />
                  {k?.alamatKantor}
                  <br />
                  Surel:{' '}
                  <a href={`mailto:${email}`} className="font-semibold text-navy-900 underline">
                    {email}
                  </a>
                  {k?.telepon?.[0] ? (
                    <>
                      <br />
                      Telepon: {k.telepon[0]}
                    </>
                  ) : null}
                </p>
              </section>
            </div>

            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              <p>
                Kebijakan ini berlaku khusus untuk aplikasi lapangan DHARMAPATI. Untuk pertanyaan
                mengenai layanan perusahaan, silakan buka{' '}
                <Link href="/kontak" className="font-semibold text-navy-900 underline">
                  halaman kontak
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
