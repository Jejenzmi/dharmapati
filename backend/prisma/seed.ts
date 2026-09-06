import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { KLIEN, KOTA } from './data-klien.js'
import { GALERI } from './data-galeri.js'

const prisma = new PrismaClient()

function slugify(teks: string) {
  return teks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Sebaran kecil agar penanda di kota yang sama tidak saling menimpa. */
function geser(indeks: number) {
  const sudut = (indeks * 137.508 * Math.PI) / 180
  const jari = 0.006 * Math.sqrt(indeks + 1)
  return { dLat: jari * Math.cos(sudut), dLng: jari * Math.sin(sudut) }
}

const LAYANAN = [
  {
    slug: 'jasa-pengamanan-satpam',
    nama: 'Jasa Pengamanan (Satpam)',
    lini: 'KEAMANAN' as const,
    ikon: 'shield',
    unggulan: true,
    urutan: 1,
    ringkasan:
      'Penyediaan dan pengelolaan anggota Satpam bersertifikat Gada Pratama untuk objek industri, perkantoran, dan instansi pemerintah.',
    deskripsi:
      'Layanan pengamanan Dharmapati dibangun di atas prinsip kerja Polisi Militer: dimulai dari pemetaan area (mapping), penyusunan Rencana Pengamanan (RENPAM), lalu penurunan RENPAM menjadi SOP jaga yang dipegang setiap anggota di pos. Dengan begitu setiap personel punya standar tugas yang terukur, bukan sekadar berdiri di gerbang.\n\nSetiap penempatan dipimpin Danru dan diawasi supervisor lapangan yang melakukan kunjungan rutin, apel, serta pemeriksaan buku mutasi. Perusahaan memegang izin operasional Polri dan terdaftar di ABUJAPI, sehingga penempatan anggota sah secara regulasi.',
    fitur: [
      'Anggota bersertifikat Gada Pratama dan ber-KTA',
      'RENPAM & SOP disusun khusus per objek',
      'Pengawasan berjenjang: Danru, supervisor, manajer operasional',
      'Buku mutasi, laporan harian, dan rekap insiden bulanan',
      'Kesiapan tanggap darurat: kebakaran, huru-hara, evakuasi',
      'Penggantian anggota maksimal 1x24 jam',
    ],
    cakupan: ['Kawasan industri & pabrik', 'Perkantoran', 'Instansi pemerintah', 'Pergudangan & logistik', 'Perumahan & apartemen', 'Perhotelan'],
  },
  {
    slug: 'pengawalan-vip-protokoler',
    nama: 'Pengawalan VIP & Protokoler',
    lini: 'KEAMANAN' as const,
    ikon: 'user-shield',
    unggulan: true,
    urutan: 2,
    ringkasan: 'Pengamanan melekat (close protection) untuk pimpinan, tamu penting, dan kegiatan protokoler perusahaan maupun instansi.',
    deskripsi:
      'Pengamanan melekat menuntut personel yang terbiasa membaca situasi, bukan hanya bertubuh besar. Tim pengawalan kami disiapkan dari anggota terpilih dengan latar pengalaman pengamanan objek vital, dilengkapi kemampuan analisa rute, pengaturan titik jemput-antar, dan koordinasi dengan aparat setempat.\n\nSetiap penugasan diawali survei rute dan lokasi, penyusunan rencana kontinjensi, serta gelar pasukan sebelum hari pelaksanaan.',
    fitur: [
      'Survei rute dan lokasi sebelum penugasan',
      'Rencana kontinjensi dan jalur evakuasi',
      'Koordinasi dengan aparat wilayah',
      'Personel terlatih bela diri dan komunikasi protokoler',
    ],
    cakupan: ['Kunjungan pimpinan', 'Acara perusahaan', 'Kegiatan protokoler instansi', 'Pengamanan aset bergerak'],
  },
  {
    slug: 'cleaning-service',
    nama: 'Cleaning Service',
    lini: 'KEBERSIHAN' as const,
    ikon: 'sparkles',
    unggulan: true,
    urutan: 3,
    ringkasan: 'Pengelolaan kebersihan gedung, kantor, rumah sakit, sekolah, dan kawasan industri dengan SOP, peralatan, serta bahan kimia yang tepat.',
    deskripsi:
      'Kebersihan bukan hanya soal menyapu dan mengepel. Kami mulai dari pemetaan area, menghitung beban kerja per zona, lalu menyusun jadwal harian, mingguan, dan bulanan yang bisa diperiksa pengguna jasa. Pedoman kerja mengacu pada 5R (Resik, Ringkas, Rapi, Rawat, Rajin).\n\nSebagai anggota APKLINDO, kami menerapkan standar pemilihan bahan kimia sesuai jenis permukaan agar lantai, kaca, dan furnitur tidak rusak karena salah perlakuan.',
    fitur: [
      'Jadwal kerja harian, mingguan, dan bulanan terdokumentasi',
      'Pedoman 5R dan 5 DM (Ikhlas, Jujur, Disiplin, Tanggung Jawab, Loyalitas)',
      'Penyediaan mesin dan bahan kimia (chemical) sesuai permukaan',
      'Supervisor kebersihan dan ceklis area',
      'Pelatihan dan sertifikasi tenaga cleaning',
    ],
    cakupan: ['Kantor swasta & instansi pemerintah', 'Pusat perbelanjaan, hotel, apartemen', 'Rumah sakit & klinik', 'Sekolah & kampus', 'Kawasan industri & pergudangan'],
  },
  {
    slug: 'pengendalian-hama',
    nama: 'Pengendalian Hama (Pest Control)',
    lini: 'KEBERSIHAN' as const,
    ikon: 'bug',
    urutan: 4,
    ringkasan: 'Penanganan tikus, rayap, kecoa, dan nyamuk secara terjadwal untuk gedung, gudang, dan area produksi pangan.',
    deskripsi:
      'Pengendalian hama kami jalankan dengan pendekatan berkala: inspeksi awal untuk memetakan titik masuk dan sarang, tindakan sesuai jenis hama, lalu pemantauan berkala dengan kartu kendali di tiap titik umpan. Laporan hasil kunjungan diserahkan setiap periode agar pengguna jasa punya rekam jejak yang bisa diaudit.',
    fitur: ['Inspeksi dan pemetaan titik hama', 'Kartu kendali per titik umpan', 'Laporan kunjungan berkala', 'Bahan sesuai standar keamanan pangan'],
    cakupan: ['Gudang & pabrik', 'Restoran & dapur', 'Perkantoran', 'Rumah sakit'],
  },
  {
    slug: 'manpower-tenaga-produksi',
    nama: 'Manpower & Tenaga Produksi',
    lini: 'TENAGA_KERJA' as const,
    ikon: 'users',
    unggulan: true,
    urutan: 5,
    ringkasan: 'Penyediaan tenaga kerja produksi, helper, dan operator untuk kebutuhan industri dengan pengelolaan administrasi ketenagakerjaan penuh.',
    deskripsi:
      'Kami menyediakan tenaga kerja dalam jumlah besar dengan alur rekrutmen yang sama ketatnya dengan penerimaan Satpam: seleksi administrasi, wawancara, uji fisik, dan pemeriksaan kesehatan. Pengelolaan absensi, upah, BPJS Ketenagakerjaan, serta BPJS Kesehatan menjadi tanggung jawab kami sebagai pemberi kerja.\n\nDengan izin usaha KBLI 78200 (Aktivitas Penyediaan Tenaga Kerja Waktu Tertentu), penempatan tenaga kerja dilakukan sesuai ketentuan yang berlaku.',
    fitur: [
      'Rekrutmen massal dengan seleksi berjenjang',
      'Pengelolaan absensi, upah, dan lembur',
      'Kepesertaan BPJS Ketenagakerjaan & Kesehatan',
      'Penggantian tenaga bila tidak sesuai kualifikasi',
      'Pelaporan tenaga kerja periodik',
    ],
    cakupan: ['Operator produksi', 'Helper & loading', 'Admin gudang', 'Tenaga musiman'],
  },
  {
    slug: 'office-boy-pramusaji',
    nama: 'Office Boy & Pramusaji',
    lini: 'TENAGA_KERJA' as const,
    ikon: 'coffee',
    urutan: 6,
    ringkasan: 'Tenaga OB, pramusaji, dan pantry yang terlatih menjaga kerapian ruang kerja serta pelayanan tamu.',
    deskripsi:
      'Tenaga office boy dan pramusaji kami bekali pelatihan dasar tata graha, penanganan makanan dan minuman, serta etika pelayanan tamu. Untuk penempatan di ruang pimpinan dan ruang rapat, personel diseleksi tambahan pada aspek kerapian dan kemampuan komunikasi.',
    fitur: ['Pelatihan tata graha dan penyajian', 'Etika pelayanan tamu dan ruang rapat', 'Ceklis pantry dan ruang kerja harian'],
    cakupan: ['Perkantoran', 'Ruang pimpinan & rapat', 'Pantry perusahaan'],
  },
  {
    slug: 'driver-operator-forklift',
    nama: 'Driver & Operator Forklift',
    lini: 'TENAGA_KERJA' as const,
    ikon: 'truck',
    urutan: 7,
    ringkasan: 'Pengemudi operasional perusahaan dan operator forklift bersertifikat untuk kebutuhan gudang dan pabrik.',
    deskripsi:
      'Pengemudi diseleksi berdasarkan kelengkapan SIM sesuai golongan, rekam jejak berkendara, dan uji praktik. Operator forklift wajib memiliki sertifikat/lisensi operator yang berlaku serta memahami prosedur keselamatan kerja di area manuver.',
    fitur: ['Verifikasi SIM sesuai golongan dan uji praktik', 'Operator forklift berlisensi', 'Pembekalan keselamatan kerja (SMK3 dasar)'],
    cakupan: ['Kendaraan operasional & antar-jemput', 'Gudang & distribusi', 'Area produksi'],
  },
  {
    slug: 'perawatan-taman-parkir',
    nama: 'Perawatan Taman & Pengelolaan Parkir',
    lini: 'PENDUKUNG' as const,
    ikon: 'leaf',
    urutan: 8,
    ringkasan: 'Perawatan lanskap serta pengelolaan area parkir di luar badan jalan sesuai KBLI 81300 dan 52215.',
    deskripsi:
      'Perawatan taman mencakup pemangkasan, pemupukan, penyiraman terjadwal, serta penggantian tanaman mati. Pengelolaan parkir mencakup pengaturan arus kendaraan, penataan slot, dan pencatatan keluar-masuk yang terhubung dengan pos Satpam.',
    fitur: ['Jadwal perawatan lanskap berkala', 'Pengaturan arus dan penataan slot parkir', 'Terhubung dengan pos jaga'],
    cakupan: ['Kawasan perkantoran', 'Perumahan', 'Kawasan industri'],
  },
  {
    slug: 'pelatihan-sertifikasi',
    nama: 'Pelatihan & Sertifikasi',
    lini: 'PENDUKUNG' as const,
    ikon: 'graduation-cap',
    urutan: 9,
    ringkasan: 'Pelatihan Satpam, cleaning service, damkar dasar, dan SMK3 di Pusdiklat Dharmapati, Gantar, Indramayu.',
    deskripsi:
      'Kami mengoperasikan pusat pendidikan dan pelatihan sendiri di Gantar, Kabupaten Indramayu. Materi mencakup pengetahuan dasar kepolisian, KAMTIBMAS, siskamling, peraturan baris-berbaris, penghormatan militer, bela diri, drill tongkat dan borgol, drill pemadam kebakaran, hingga SMK3 dasar.\n\nSelain untuk anggota sendiri, pelatihan terbuka untuk perusahaan yang ingin meningkatkan kemampuan satuan pengamanan internalnya.',
    fitur: ['Pusdiklat sendiri di Gantar, Indramayu', 'Bintal jasmani dan rohani', 'Drill damkar, tongkat, dan borgol', 'PBB, PPM, dan tata upacara', 'SMK3 dasar'],
    cakupan: ['Satpam internal perusahaan', 'Tenaga cleaning service', 'Penyegaran anggota (refreshing)'],
  },
]

const LEGALITAS = [
  { label: 'Akta Pendirian', nomor: 'No. 02 tanggal 27 Januari 2020', penerbit: 'Susi Hastuty, S.H., M.Kn', urutan: 1 },
  { label: 'Pengesahan AHU', nomor: 'AHU-0005721-AH.01.01 Tahun 2020', penerbit: 'Kemenkumham RI', tanggal: '27 Januari 2020', urutan: 2 },
  { label: 'NPWP', nomor: '94.187.081.8-409.000', penerbit: 'KPP Pratama Purwakarta', urutan: 3 },
  { label: 'NIB / TDP', nomor: '0220107250047', penerbit: 'OSS', tanggal: '4 Februari 2020', urutan: 4 },
  { label: 'SKDP', nomor: '132534704462', tanggal: '30 Maret 2016', urutan: 5 },
  { label: 'SPPKP', nomor: 'S-77PKP/WPJ.09/KP.1003/2020', tanggal: '18 Juni 2020', urutan: 6 },
  { label: 'APKLINDO', nomor: '00495/PWK/X/2023', penerbit: 'Asosiasi Perusahaan Klining Servis Indonesia', tanggal: '4 Oktober 2023', urutan: 7 },
  { label: 'ABUJAPI', nomor: '02846/18-02-2020', penerbit: 'Asosiasi Badan Usaha Jasa Pengamanan Indonesia', tanggal: '18 April 2022', urutan: 8 },
  { label: 'SIO Polri', nomor: '532/I/SIO-POLRI/2023', penerbit: 'Kepolisian Negara Republik Indonesia', tanggal: '22 Juni 2023', urutan: 9 },
  { label: 'ISO', nomor: 'ISO 9001:2015', penerbit: 'Quality Management System', urutan: 10 },
  { label: 'BPJS Ketenagakerjaan', nomor: 'Terdaftar sebagai pemberi kerja', urutan: 11 },
]

const KBLI = [
  { kode: '78200', judul: 'Aktivitas Penyediaan Tenaga Kerja Waktu Tertentu', lini: 'TENAGA_KERJA' as const, urutan: 1 },
  { kode: '80100', judul: 'Aktivitas Keamanan Swasta', lini: 'KEAMANAN' as const, urutan: 2 },
  { kode: '81210', judul: 'Aktivitas Kebersihan Umum Bangunan', lini: 'KEBERSIHAN' as const, urutan: 3 },
  { kode: '81290', judul: 'Aktivitas Kebersihan Bangunan dan Industri Lainnya', lini: 'KEBERSIHAN' as const, urutan: 4 },
  { kode: '81300', judul: 'Aktivitas Perawatan dan Pemeliharaan Taman', lini: 'PENDUKUNG' as const, urutan: 5 },
  { kode: '52215', judul: 'Aktivitas Perparkiran di Luar Badan Jalan', lini: 'PENDUKUNG' as const, urutan: 6 },
  { kode: '62021', judul: 'Aktivitas Konsultasi Keamanan Informasi', lini: 'PENDUKUNG' as const, urutan: 7 },
]

const PERSONEL = [
  { nama: 'Ida Shalika, S.Pd', jabatan: 'Komisaris', tingkat: 1, urutan: 1 },
  { nama: 'Pur. Nanang Setiawan', jabatan: 'Direktur Utama', tingkat: 1, urutan: 2, bio: 'Purnawirawan TNI-AL Korps Marinir, mantan anggota Polisi Militer TNI AL.' },
  { nama: 'Drs. Asep Mahmud', jabatan: 'Penasehat', tingkat: 2, urutan: 1 },
  { nama: 'Dr. Harmadi, S.H., M.Hum', jabatan: 'Penasehat', tingkat: 2, urutan: 2 },
  { nama: 'Mifta Qurtubi, S.H.', jabatan: 'Senior Manager', tingkat: 3, urutan: 1 },
  { nama: 'Purwanto, S.H.', jabatan: 'Kepala Cabang', tingkat: 3, urutan: 2 },
  { nama: 'Mardi Saputra, S.T.', jabatan: 'Manager Operasional', tingkat: 4, urutan: 1 },
  { nama: 'Kanisya Putri Namira', jabatan: 'Manager HRD', tingkat: 4, urutan: 2 },
  { nama: 'Enung Nurhayati, S.E.', jabatan: 'Manager Keuangan', tingkat: 4, urutan: 3 },
  { nama: 'Agil Al Hariri, S.E.', jabatan: 'Manager Marketing', tingkat: 4, urutan: 4 },
  { nama: 'Asep Kurniawan', jabatan: 'Staff Operasional', tingkat: 5, induk: 'Manager Operasional', urutan: 1 },
  { nama: 'Nurliadin', jabatan: 'Staff HRD', tingkat: 5, induk: 'Manager HRD', urutan: 2 },
  { nama: 'Siti Patimah', jabatan: 'Staff Keuangan', tingkat: 5, induk: 'Manager Keuangan', urutan: 3 },
  { nama: 'Anton Hidayat', jabatan: 'Staff Marketing', tingkat: 5, induk: 'Manager Marketing', urutan: 4 },
]

const FAQ = [
  { tanya: 'Berapa lama proses penempatan anggota setelah kontrak disepakati?', jawab: 'Untuk kebutuhan reguler, penempatan dapat dilakukan 7–14 hari kerja setelah kontrak ditandatangani. Waktu tersebut kami gunakan untuk survei objek, penyusunan RENPAM dan SOP, penyiapan seragam serta perlengkapan, dan pembekalan anggota. Untuk kebutuhan mendesak, silakan hubungi kami agar dapat dijadwalkan tersendiri.', kategori: 'Kerja Sama', urutan: 1 },
  { tanya: 'Apakah anggota Satpam sudah bersertifikat?', jawab: 'Ya. Anggota yang ditempatkan memiliki sertifikat pelatihan Gada Pratama dan Kartu Tanda Anggota satuan pengamanan. Perusahaan memegang Surat Izin Operasional Polri dan terdaftar di ABUJAPI.', kategori: 'Kualifikasi', urutan: 2 },
  { tanya: 'Bagaimana bila anggota yang ditempatkan tidak sesuai harapan?', jawab: 'Pengguna jasa dapat mengajukan penggantian. Kami menyediakan anggota pengganti maksimal 1x24 jam sejak permintaan diterima, dan mengevaluasi anggota bersangkutan melalui manajer operasional.', kategori: 'Kerja Sama', urutan: 3 },
  { tanya: 'Apakah BPJS dan upah anggota menjadi tanggung jawab Dharmapati?', jawab: 'Ya. Sebagai perusahaan penyedia jasa, kami yang mengelola upah, lembur, BPJS Ketenagakerjaan, dan BPJS Kesehatan anggota sesuai ketentuan yang berlaku. Pengguna jasa cukup membayar nilai kontrak yang disepakati.', kategori: 'Administrasi', urutan: 4 },
  { tanya: 'Apa saja yang dibutuhkan untuk mendapatkan penawaran harga?', jawab: 'Kami membutuhkan informasi lokasi objek, luas area, jumlah pos dan shift yang diinginkan, jam operasional, serta kebutuhan perlengkapan khusus. Setelah survei lokasi, penawaran resmi kami sampaikan maksimal 3 hari kerja.', kategori: 'Kerja Sama', urutan: 5 },
  { tanya: 'Apakah melayani penempatan di luar Jawa Barat?', jawab: 'Ya. Selain Purwakarta, Karawang, Subang, Bekasi, dan Jakarta, kami sudah menempatkan tenaga di Indramayu, Cirebon, Kendal, Gresik, dan Jember.', kategori: 'Jangkauan', urutan: 6 },
  { tanya: 'Bagaimana cara melamar menjadi anggota Dharmapati?', jawab: 'Silakan buka halaman Karier, pilih posisi yang tersedia, lalu kirim lamaran beserta berkas melalui formulir daring. Berkas yang lolos seleksi administrasi akan dipanggil untuk wawancara, uji fisik, dan pemeriksaan kesehatan.', kategori: 'Karier', urutan: 7 },
]

const ARTIKEL = [
  {
    slug: 'lima-langkah-menyusun-renpam-objek-industri',
    judul: 'Lima Langkah Menyusun RENPAM untuk Objek Industri',
    kategori: 'Wawasan',
    ringkasan: 'Rencana Pengamanan bukan dokumen formalitas. Berikut urutan penyusunannya agar benar-benar terpakai anggota di pos.',
    isi: `Banyak perusahaan sudah menempatkan Satpam, namun belum punya Rencana Pengamanan (RENPAM) yang tertulis. Akibatnya, anggota bekerja berdasarkan kebiasaan, bukan standar. Berikut lima langkah penyusunan yang kami pakai di setiap objek baru.

## 1. Pemetaan area (mapping)

Petakan seluruh titik masuk dan keluar, jalur kendaraan, area produksi, gudang bahan baku, ruang panel listrik, serta titik buta kamera. Dari peta ini terlihat berapa pos yang benar-benar diperlukan.

## 2. Identifikasi kerawanan

Setiap objek punya kerawanan berbeda. Pabrik dengan bahan baku bernilai tinggi rawan kehilangan lewat jalur pengiriman. Perkantoran lebih rawan pada tamu tak dikenal. Kerawanan inilah yang menentukan prioritas patroli.

## 3. Penentuan kekuatan dan pola jaga

Tentukan jumlah anggota per shift, komposisi pos tetap dan patroli, serta jadwal rotasi. Pola jaga yang terlalu tetap mudah dibaca; berikan variasi waktu patroli.

## 4. Penurunan menjadi SOP

RENPAM diterjemahkan menjadi SOP praktis: bagaimana memeriksa kendaraan keluar, bagaimana mencatat tamu, apa yang dilakukan saat alarm kebakaran berbunyi. SOP harus cukup ringkas untuk dihafal.

## 5. Uji coba dan evaluasi

Jalankan selama satu bulan, lalu evaluasi bersama pengguna jasa. Catatan buku mutasi dan laporan insiden menjadi bahan perbaikan siklus berikutnya.`,
  },
  {
    slug: 'memilih-penyedia-jasa-pengamanan',
    judul: 'Enam Hal yang Perlu Diperiksa Sebelum Memilih Penyedia Jasa Pengamanan',
    kategori: 'Panduan',
    ringkasan: 'Harga termurah belum tentu paling menguntungkan. Periksa enam hal ini sebelum menandatangani kontrak.',
    isi: `Memilih penyedia jasa pengamanan sering berhenti pada perbandingan harga per orang per bulan. Padahal ada beberapa hal yang justru menentukan apakah kerja sama berjalan tenang atau merepotkan di kemudian hari.

## 1. Izin operasional Polri dan keanggotaan asosiasi

Badan usaha jasa pengamanan wajib memegang Surat Izin Operasional dari Polri. Keanggotaan ABUJAPI menunjukkan perusahaan tunduk pada standar asosiasi.

## 2. Sertifikasi anggota

Pastikan anggota yang akan ditempatkan sudah mengikuti pelatihan Gada Pratama, bukan hanya diberi seragam.

## 3. Kepatuhan ketenagakerjaan

Periksa apakah upah anggota memenuhi ketentuan daerah dan apakah BPJS benar-benar dibayarkan. Penyedia yang menekan biaya di pos ini biasanya berujung pada perputaran anggota yang tinggi.

## 4. Struktur pengawasan

Tanyakan siapa yang mengawasi anggota di lapangan dan seberapa sering. Tanpa supervisor, kualitas jaga menurun dalam hitungan bulan.

## 5. Mekanisme penggantian

Pastikan ada komitmen waktu penggantian anggota yang berhalangan atau tidak sesuai kualifikasi.

## 6. Pelaporan

Penyedia yang baik menyerahkan laporan berkala: rekap kehadiran, catatan insiden, dan hasil evaluasi. Laporan inilah bukti bahwa jasa yang dibayar benar-benar dikerjakan.`,
  },
  {
    slug: 'pedoman-5r-cleaning-service',
    judul: 'Pedoman 5R dalam Pengelolaan Cleaning Service Gedung',
    kategori: 'Wawasan',
    ringkasan: 'Resik, Ringkas, Rapi, Rawat, Rajin — cara sederhana menjaga mutu kebersihan tetap konsisten sepanjang kontrak.',
    isi: `Mutu cleaning service biasanya bagus di bulan pertama, lalu perlahan menurun. Pedoman 5R membantu menjaga konsistensi karena mengubah kebersihan dari pekerjaan menjadi kebiasaan.

## Resik

Bersihkan sampai ke sumber kotoran, bukan hanya yang terlihat. Sela lantai, bagian bawah wastafel, dan jalur udara pendingin masuk dalam ceklis.

## Ringkas

Singkirkan barang yang tidak diperlukan dari area kerja. Gudang alat kebersihan yang penuh barang rusak memperlambat pekerjaan harian.

## Rapi

Setiap alat punya tempat dan penanda. Petugas pengganti harus bisa menemukan alat tanpa bertanya.

## Rawat

Mesin poles, vacuum, dan trolley dijadwalkan perawatan. Alat rusak adalah penyebab paling umum jadwal kebersihan meleset.

## Rajin

Ceklis area ditandatangani setiap shift dan diperiksa supervisor. Yang tercatat lebih mudah diperbaiki daripada yang hanya diingat.`,
  },
]

const LOWONGAN = [
  {
    slug: 'anggota-satpam-purwakarta',
    posisi: 'Anggota Satpam',
    lokasi: 'Purwakarta, Jawa Barat',
    tipe: 'Penuh Waktu',
    penempatan: 'Kawasan industri & instansi pemerintah',
    kuota: 20,
    deskripsi: 'Bertugas menjaga keamanan dan ketertiban objek sesuai RENPAM dan SOP yang berlaku, melakukan patroli, mencatat buku mutasi, serta melayani tamu dan karyawan di pos jaga.',
    syarat: [
      'Warga Negara Indonesia',
      'Pendidikan minimal SMA/sederajat',
      'Memiliki KTP elektronik',
      'Tinggi badan minimal 168 cm (pria) / 158 cm (wanita), berat badan ideal',
      'Usia minimal 18 tahun dan maksimal 35 tahun',
      'Bebas narkoba dan memiliki SKCK',
      'Tidak bertato, tidak berkacamata, tidak buta warna',
      'Sehat jasmani dan rohani',
      'Diutamakan memiliki KTA satuan pengamanan dan NPWP',
    ],
  },
  {
    slug: 'petugas-cleaning-service-purwakarta',
    posisi: 'Petugas Cleaning Service',
    lokasi: 'Purwakarta & Subang',
    tipe: 'Penuh Waktu',
    penempatan: 'Perkantoran instansi pemerintah',
    kuota: 12,
    deskripsi: 'Menjalankan pekerjaan kebersihan harian sesuai ceklis area, merawat peralatan kebersihan, serta menjaga kerapian area kerja sesuai pedoman 5R.',
    syarat: [
      'Warga Negara Indonesia',
      'Pendidikan minimal SMP/sederajat',
      'Usia 18–40 tahun',
      'Sehat jasmani dan rohani',
      'Teliti, disiplin, dan mampu bekerja dalam tim',
      'Diutamakan berpengalaman di bidang kebersihan gedung',
    ],
  },
  {
    slug: 'operator-forklift-karawang',
    posisi: 'Operator Forklift',
    lokasi: 'Karawang & Cikarang',
    tipe: 'Kontrak',
    penempatan: 'Pergudangan',
    kuota: 6,
    deskripsi: 'Mengoperasikan forklift untuk kegiatan bongkar muat dan penataan barang di gudang dengan mematuhi prosedur keselamatan kerja.',
    syarat: [
      'Pendidikan minimal SMA/SMK sederajat',
      'Memiliki sertifikat/lisensi operator forklift yang masih berlaku',
      'Pengalaman minimal 1 tahun',
      'Memahami prosedur keselamatan kerja (K3)',
      'Bersedia bekerja dalam sistem shift',
    ],
  },
]

const PENGATURAN: Record<string, unknown> = {
  perusahaan: {
    nama: 'PT. Dharmapati Putra Nusantara',
    namaPendek: 'Dharmapati',
    tagline: 'Pengabdian yang Tulus dan Gagah Berani',
    slogan: 'Mitra pengamanan dan pengelolaan tenaga kerja untuk industri, perkantoran, dan instansi pemerintah.',
    berdiri: 2020,
    induk: 'PT. Dharmapati Utama Nusantara (berdiri 1 Januari 2016)',
    sikap: ['Tanggap', 'Tangguh', 'Tanggon', 'Trengginas'],
  },
  kontak: {
    alamatKantor: 'Samesta Royal Campaka, Ruko Blok R1 No. 36, Campaka, Purwakarta, Jawa Barat 41181',
    alamatCabang: 'Jl. Raya Pegangsaan Dua H. Oyar No. 3, Kelapa Gading, Jakarta Utara, DKI Jakarta 14250',
    alamatPusdiklat: 'Jl. Raya Gantar – Sanca, Blok Tanjungsari 1, Mekarjaya, Kec. Gantar, Kab. Indramayu',
    email: 'dharmapati02@gmail.com',
    telepon: ['087777889158', '081288931154', '089648278879'],
    whatsapp: '6287777889158',
    jamKerja: 'Senin – Jumat, 08.00 – 17.00 WIB (layanan darurat 24 jam)',
    petaKantor: { lat: -6.5236, lng: 107.4102 },
    petaCabang: { lat: -6.1583, lng: 106.9077 },
    petaPusdiklat: { lat: -6.4497, lng: 107.9564 },
  },
  visiMisi: {
    visiKeamanan: 'Menjadi Satpam yang profesional dan tangguh sesuai kebutuhan, serta mampu menjadi solusi keamanan bagi klien dan mitra usaha.',
    misiKeamanan: 'Menyediakan tenaga Satpam profesional dalam memberikan pelayanan dan pengamanan.',
    visiFasilitas: 'Menjadi perusahaan penyedia jasa yang profesional, handal, dan terpercaya.',
    misiFasilitas: 'Menyediakan tenaga kerja dengan kualitas SDM terbaik, membangun komunikasi yang baik dengan para pihak terkait, dan selalu menjaga komitmen dengan pengguna jasa.',
    pedoman5R: ['Resik', 'Ringkas', 'Rapi', 'Rawat', 'Rajin'],
    pedoman5DM: ['Ikhlas', 'Jujur', 'Disiplin', 'Tanggung Jawab', 'Loyalitas'],
  },
  sejarah: {
    filosofi:
      'PT. Dharmapati didirikan pada tahun 2016 dengan simbol kuda. Dalam sejarah perjuangan, kuda adalah hewan setia yang digunakan para pejuang kemerdekaan, serta dipelihara para raja dan abdi negara yang ksatria. Prinsip itulah yang menjadi simbol kaderisasi tenaga kerja Dharmapati di seluruh Nusantara.',
    arti: 'DHARMAPATI berarti PENGABDIAN YANG TULUS DAN GAGAH BERANI.',
    hubunganInduk:
      'PUTRA adalah anak perusahaan dari PT. DHARMAPATI UTAMA NUSANTARA yang lebih dulu didirikan, dengan tekad mengembangkan perusahaan jasa pengamanan dan pengelolaan tenaga kerja ke seluruh Nusantara.',
    tonggak: [
      { tahun: '2016', judul: 'PT. Dharmapati Utama Nusantara berdiri', isi: 'Didirikan 1 Januari 2016 berdasarkan Akta Notaris No. 03 tanggal 9 November 2016.' },
      { tahun: '2020', judul: 'PT. Dharmapati Putra Nusantara lahir', isi: 'Dibentuk melalui Akta Notaris No. 02 tanggal 27 Januari 2020 sebagai pengembangan perusahaan, disusul NIB dan SPPKP di tahun yang sama.' },
      { tahun: '2022', judul: 'Terdaftar di ABUJAPI', isi: 'Keanggotaan Asosiasi Badan Usaha Jasa Pengamanan Indonesia No. 02846.' },
      { tahun: '2023', judul: 'SIO Polri & APKLINDO', isi: 'Surat Izin Operasional Polri terbit 22 Juni 2023, disusul keanggotaan APKLINDO 4 Oktober 2023 untuk lini cleaning service.' },
      { tahun: '2024', judul: 'Perluasan lintas provinsi', isi: 'Penempatan tenaga menjangkau Jawa Tengah dan Jawa Timur: Kendal, Gresik, dan Jember.' },
    ],
  },
  direktur: {
    nama: 'Pur. Nanang Setiawan',
    jabatan: 'Direktur Utama',
    paragraf: [
      'Saya adalah Purnawirawan TNI-AL Korps Marinir. Beberapa kali bertugas di daerah konflik seperti Timor Timur, Aceh, Irian, dan Maluku, serta penugasan Satgas Pengungsi Vietnam di Pulau Galang dan Natuna, juga wilayah perbatasan negara.',
      'Saya kemudian direkrut bertugas di Polisi Militer TNI AL sebagai penegak disiplin prajurit dan pengamanan instalasi negara, VIP, protokoler, maupun objek vital negara di kota-kota besar dan wilayah perbatasan.',
      'Selama bertugas sebagai Polisi Militer, banyak ilmu dan pengalaman yang saya peroleh dalam hal pengamanan, karena tugas pokok di kesatuan tersebut lebih banyak berinteraksi dengan aktivitas pengamanan dan pengawasan personal maupun instalasi objek vital.',
      'Prinsip dasar pengamanan diawali dengan pemetaan area, merumuskan RENPAM dan SOP sebagai bahan dasar personel yang bertugas di objek, sehingga setiap anggota mempunyai standar tugas dengan target kondusifitas objek, serta membuat masyarakat dan pekerja di sekitarnya merasa aman, tertib, dan nyaman.',
    ],
  },
  rekrutmen: {
    tahapan: [
      { judul: 'Seleksi administrasi', isi: 'Pemeriksaan kelengkapan berkas: KTP elektronik, ijazah, SKCK, surat keterangan sehat, dan NPWP.' },
      { judul: 'Wawancara', isi: 'Menggali motivasi, kemampuan komunikasi, serta kesiapan bekerja dengan sistem shift.' },
      { judul: 'Uji fisik & postur', isi: 'Pengukuran tinggi dan berat badan, kesamaptaan jasmani, serta pemeriksaan tato dan buta warna.' },
      { judul: 'Pemeriksaan kesehatan', isi: 'Pemeriksaan tekanan darah dan kesehatan umum, termasuk tes bebas narkoba.' },
      { judul: 'Pembekalan & pelatihan', isi: 'Pelatihan dasar di Pusdiklat Gantar sebelum diterjunkan ke objek.' },
      { judul: 'Upacara pelepasan & penempatan', isi: 'Anggota dilepas secara resmi lalu ditempatkan sesuai objek dengan pendampingan supervisor.' },
    ],
    kriteria: [
      'Warga Negara Indonesia',
      'Pendidikan minimal SMA/sederajat',
      'Memiliki KTP elektronik',
      'Tinggi badan 168 cm (pria), 158 cm (wanita), berat badan ideal',
      'Usia minimal 18 tahun, maksimal 35 tahun',
      'Bebas narkoba',
      'Memiliki Surat Keterangan Catatan Kepolisian',
      'Tidak bertato, tidak berkacamata, tidak buta warna',
      'Memiliki kemampuan berkomunikasi',
      'Memiliki KTA satuan pengamanan',
      'Memiliki NPWP',
      'Sehat jasmani dan rohani',
      'Diutamakan berpengalaman di bidang security',
    ],
  },
  pelatihan: {
    kelompok: [
      { judul: 'Pendidikan & Pelatihan', butir: ['Ilmu Pengetahuan Dasar Polri', 'KAMTIBMAS', 'SISKAMLING'] },
      { judul: 'Pembinaan Tupoksi Satpam', butir: ['Kesamaptaan jasmani & rohani', 'Siraman rohani', 'Mental & ideologi'] },
      { judul: 'Tata Tertib & Disiplin', butir: ['Peraturan militer dasar', 'Peraturan baris-berbaris', 'Peraturan penghormatan militer', 'Tata upacara militer TNI/Polri', 'Peraturan hukum'] },
      { judul: 'Latihan Keterampilan', butir: ['Drill damkar', 'Bintal jasmani', 'Drill tongkat & borgol', 'Bela diri', 'PPB & PPM', 'SMK-3 dasar'] },
    ],
  },
  perlengkapan: {
    kelompok: [
      { judul: 'Seragam & atribut', butir: ['PDL/PDH satpam sesuai ketentuan Polri', 'Topi pet dan baret', 'Kopel, tali kur, dan papan nama', 'Sepatu PDL dan sepatu PDH'] },
      { judul: 'Perlengkapan tugas', butir: ['Borgol dan tongkat T', 'Handy talky', 'Metal detector genggam', 'Senter dan lampu lalu lintas', 'Rompi PKD dan helm'] },
      { judul: 'Peralatan kebersihan', butir: ['Mesin poles lantai dan vacuum basah/kering', 'Trolley dan alat kebersihan lengkap', 'Bahan kimia sesuai jenis permukaan', 'Perlengkapan keselamatan kerja'] },
    ],
  },

  beranda: {
    hero: {
      label: 'Berizin SIO Polri · ABUJAPI · APKLINDO',
      judulAwal: 'Pengabdian yang',
      judulSorot: 'Tulus',
      judulAkhir: 'dan Gagah Berani',
      deskripsi:
        'PT. Dharmapati Putra Nusantara menyediakan dan mengelola tenaga pengamanan, cleaning service, serta tenaga kerja untuk industri, perkantoran, dan instansi pemerintah — dengan metode kerja yang lahir dari disiplin Polisi Militer.',
      poin: [
        'RENPAM & SOP disusun khusus tiap objek',
        'Anggota bersertifikat Gada Pratama',
        'Penggantian anggota maksimal 1x24 jam',
        'BPJS & upah dikelola penuh oleh kami',
      ],
      gambar: '/galeri/sec-h12-2432-751ec36794.jpg',
      tahunBerdiri: '2016',
    },
    pilar: [
      {
        judul: 'Pengamanan',
        ikon: 'shield',
        isi: 'Satpam bersertifikat Gada Pratama, pengawalan VIP, dan pengamanan objek vital dengan RENPAM tertulis di setiap lokasi.',
        tautan: '/layanan/pengamanan',
      },
      {
        judul: 'Kebersihan',
        ikon: 'sparkles',
        isi: 'Cleaning service gedung, rumah sakit, dan kawasan industri dengan pedoman 5R serta pengendalian hama terjadwal.',
        tautan: '/layanan/kebersihan',
      },
      {
        judul: 'Tenaga Kerja',
        ikon: 'users',
        isi: 'Manpower produksi, office boy, pramusaji, driver, dan operator forklift lengkap dengan pengelolaan BPJS dan upah.',
        tautan: '/layanan/tenaga-kerja',
      },
    ],
    metode: {
      judul: 'Empat langkah yang membuat penjagaan terukur, bukan sekadar berjaga',
      deskripsi:
        'Prinsip ini diwarisi dari pengalaman pendiri kami sebagai Polisi Militer TNI AL: pengamanan yang baik selalu dimulai dari dokumen, bukan dari jumlah orang.',
      langkah: [
        { judul: 'Pemetaan area', isi: 'Survei objek untuk memetakan titik masuk, jalur kendaraan, area kritis, dan titik buta pengawasan.' },
        { judul: 'Perumusan RENPAM', isi: 'Rencana Pengamanan disusun sesuai kerawanan objek, menentukan kekuatan personel dan pola jaga.' },
        { judul: 'Penurunan ke SOP', isi: 'RENPAM diterjemahkan menjadi SOP praktis yang dipegang setiap anggota di pos, cukup ringkas untuk dihafal.' },
        { judul: 'Pengawasan & evaluasi', isi: 'Danru, supervisor, dan manajer operasional mengawasi berjenjang; laporan bulanan menjadi bahan perbaikan.' },
      ],
    },
    legalSingkat: [
      { label: 'SIO Polri', nilai: '532/I/SIO-POLRI/2023' },
      { label: 'ABUJAPI', nilai: '02846' },
      { label: 'APKLINDO', nilai: '00495/PWK/X/2023' },
      { label: 'ISO', nilai: '9001:2015' },
    ],
  },

  profil: {
    paragraf: [
      'PT. Dharmapati Putra Nusantara adalah perusahaan profesional di bidang penyediaan (recruitment) dan pengelolaan tenaga kerja (outsourcing): tenaga pengamanan, manpower, cleaning service, office boy, driver, operator forklift, serta tenaga kerja non-skill lainnya.',
      'Kami dibentuk pada 27 Januari 2020 sebagai pengembangan dari PT. Dharmapati Utama Nusantara, untuk menjawab keterbatasan tenaga pengamanan yang tersedia dari aparat pemerintah seiring meningkatnya level ancaman — terutama di sektor industri, perbankan, dan perusahaan swasta lainnya.',
      'Sampai hari ini kami berpengalaman mengelola keamanan dan tenaga kerja di berbagai lokasi: instansi pemerintah, perkantoran, kawasan industri, perhotelan, pergudangan, dan perumahan.',
    ],
    poin: [
      'Berizin operasional Polri dan terdaftar ABUJAPI',
      'Anggota APKLINDO untuk lini cleaning service',
      'Sistem manajemen mutu ISO 9001:2015',
      'Pusdiklat sendiri di Gantar, Indramayu',
    ],
    gambar: '/galeri/sec-h03-585-b0ba4753d0.jpg',
  },

  lini: {
    KEAMANAN: {
      ringkas: 'Menjaga objek, orang, dan ketertiban dengan personel bersertifikat serta rencana pengamanan tertulis di setiap lokasi.',
      gambar: '/galeri/sec-h11-2227-f0deb6570a.jpg',
      intro:
        'Lini pengamanan adalah asal-usul Dharmapati. Pola kerjanya diwarisi langsung dari pengalaman pendiri kami sebagai Polisi Militer TNI AL: setiap objek dipetakan lebih dulu, dituangkan ke dalam Rencana Pengamanan, lalu diturunkan menjadi SOP yang dipegang tiap anggota di pos.',
      gambarRinci: '/galeri/sec-h12-2430-51100a94ed.jpg',
      poin: [
        { judul: 'Anggota bersertifikat', isi: 'Seluruh anggota telah mengikuti pelatihan Gada Pratama dan memiliki Kartu Tanda Anggota satuan pengamanan.' },
        { judul: 'Dokumen kerja tertulis', isi: 'RENPAM dan SOP disusun khusus per objek, bukan salinan dari lokasi lain.' },
        { judul: 'Pengawasan berjenjang', isi: 'Danru di lokasi, supervisor yang berkunjung rutin, dan manajer operasional di kantor pusat.' },
        { judul: 'Pelaporan berkala', isi: 'Buku mutasi harian, laporan kehadiran, dan rekap insiden bulanan diserahkan ke pengguna jasa.' },
      ],
    },
    KEBERSIHAN: {
      ringkas: 'Menjaga gedung tetap bersih dan sehat lewat jadwal terdokumentasi, bahan kimia yang tepat, dan pengendalian hama berkala.',
      gambar: '/galeri/cln-h12-168-a2bc7dd7f2.jpg',
      intro:
        'Mutu kebersihan biasanya bagus di bulan pertama lalu menurun. Kami mencegahnya dengan menghitung beban kerja per zona, menyusun jadwal harian sampai bulanan yang bisa diperiksa pengguna jasa, dan menerapkan pedoman 5R sebagai kebiasaan kerja.',
      gambarRinci: '/galeri/cln-h11-161-179a90a440.jpg',
      poin: [
        { judul: 'Anggota APKLINDO', isi: 'Terdaftar di Asosiasi Perusahaan Klining Servis Indonesia sejak 2023.' },
        { judul: 'Bahan kimia sesuai permukaan', isi: 'Pemilihan chemical disesuaikan jenis lantai, kaca, dan furnitur agar tidak merusak aset.' },
        { judul: 'Ceklis area per shift', isi: 'Setiap area ditandatangani petugas dan diperiksa supervisor kebersihan.' },
        { judul: 'Pengendalian hama terjadwal', isi: 'Inspeksi, kartu kendali per titik umpan, dan laporan kunjungan berkala.' },
      ],
    },
    TENAGA_KERJA: {
      ringkas: 'Menyediakan tenaga kerja siap pakai berikut seluruh pengelolaan administrasi ketenagakerjaannya.',
      gambar: '/galeri/cln-h16-316-83e033c208.jpg',
      intro:
        'Kami menyediakan tenaga kerja dengan alur rekrutmen yang sama ketatnya dengan penerimaan Satpam. Seluruh kewajiban ketenagakerjaan — upah, lembur, BPJS Ketenagakerjaan, dan BPJS Kesehatan — menjadi tanggung jawab kami sebagai pemberi kerja.',
      gambarRinci: '/galeri/cln-h15-192-20915eb927.jpg',
      poin: [
        { judul: 'Izin KBLI 78200', isi: 'Aktivitas Penyediaan Tenaga Kerja Waktu Tertentu, sehingga penempatan sah secara regulasi.' },
        { judul: 'Seleksi berjenjang', isi: 'Administrasi, wawancara, uji fisik, dan pemeriksaan kesehatan sebelum penempatan.' },
        { judul: 'Administrasi penuh', isi: 'Absensi, penggajian, lembur, dan kepesertaan BPJS dikelola kantor pusat.' },
        { judul: 'Penggantian tenaga', isi: 'Tenaga yang tidak sesuai kualifikasi diganti tanpa biaya tambahan.' },
      ],
    },
    PENDUKUNG: {
      ringkas: 'Layanan pelengkap yang membuat pengelolaan fasilitas Anda tuntas dalam satu kontrak.',
      gambar: '/galeri/sec-h15-3022-2cb5796d8c.jpg',
      intro:
        'Layanan pendukung melengkapi dua lini utama agar pengelolaan fasilitas Anda tuntas dalam satu kontrak — mulai dari perawatan lanskap dan pengaturan parkir sampai pelatihan satuan pengamanan internal perusahaan.',
      gambarRinci: '/galeri/sec-h15-3020-a4bc0ea075.jpg',
      poin: [
        { judul: 'Pusdiklat sendiri', isi: 'Pusat pendidikan dan pelatihan di Gantar, Kabupaten Indramayu.' },
        { judul: 'Materi lengkap', isi: 'Dari pengetahuan dasar Polri, PBB dan PPM, bela diri, drill damkar, sampai SMK-3 dasar.' },
        { judul: 'Izin perparkiran & taman', isi: 'KBLI 52215 dan 81300 untuk parkir di luar badan jalan dan perawatan taman.' },
        { judul: 'Terhubung pos jaga', isi: 'Pencatatan keluar-masuk kendaraan tersambung dengan anggota di pos.' },
      ],
    },
  },

  jaminanLegalitas: {
    butir: [
      { judul: 'Izin operasional Polri', isi: 'Penempatan anggota Satpam dilakukan di bawah Surat Izin Operasional yang diterbitkan Kepolisian Negara Republik Indonesia.' },
      { judul: 'Terdaftar di asosiasi', isi: 'Anggota ABUJAPI untuk lini pengamanan dan APKLINDO untuk lini cleaning service.' },
      { judul: 'Pengusaha Kena Pajak', isi: 'Berstatus PKP sehingga penagihan dapat disertai faktur pajak sesuai ketentuan.' },
      { judul: 'Sistem mutu ISO 9001:2015', isi: 'Prosedur kerja, pencatatan, dan evaluasi mengacu pada sistem manajemen mutu.' },
    ],
  },

  galeriKategori: {
    perusahaan: 'Kantor pusat, ruang kerja, dan tim administrasi yang menopang seluruh penempatan di lapangan.',
    pengamanan: 'Anggota Satpam Dharmapati saat bertugas di pos jaga, lobi, dan area produksi pengguna jasa.',
    supervisi: 'Kunjungan supervisor, apel pagi, dan pemeriksaan buku mutasi di objek penempatan.',
    pelatihan: 'Kegiatan di Pusdiklat Gantar: bela diri, drill tongkat dan borgol, drill damkar, PBB, serta SMK-3 dasar.',
    rekrutmen: 'Tahapan seleksi calon anggota, dari administrasi dan wawancara sampai upacara pelepasan.',
    'cleaning-service': 'Pekerjaan kebersihan harian di gedung perkantoran, area produksi, toilet, dan area terbuka.',
    pramusaji: 'Tenaga pramusaji dan pantry saat menyiapkan hidangan serta melayani tamu.',
    manpower: 'Tenaga produksi dan operator di lini pabrik, gudang, dan gerbang kawasan industri.',
  },

  daftarBantuan: {
    kontakButir: [
      'Lokasi dan luas area objek',
      'Jumlah pos dan shift yang diinginkan',
      'Jam operasional',
      'Kebutuhan perlengkapan khusus',
      'Target waktu mulai',
    ],
    berkasLamaran: [
      'KTP elektronik',
      'Ijazah terakhir',
      'Surat Keterangan Catatan Kepolisian (SKCK)',
      'Surat keterangan sehat & bebas narkoba',
      'Pas foto terbaru',
      'KTA satuan pengamanan (bila ada)',
    ],
  },

  seo: {
    judulBawaan: 'PT. Dharmapati Putra Nusantara — Jasa Pengamanan, Cleaning Service & Tenaga Kerja',
    deskripsiBawaan:
      'Perusahaan jasa pengamanan (Satpam), cleaning service, dan penyediaan tenaga kerja berizin SIO Polri, ABUJAPI, dan APKLINDO. Melayani industri, perkantoran, dan instansi pemerintah di Purwakarta, Karawang, Subang, Bekasi, Jakarta, hingga Jawa Timur.',
    kataKunci: [
      'jasa keamanan purwakarta',
      'outsourcing satpam karawang',
      'perusahaan cleaning service purwakarta',
      'penyedia tenaga kerja subang',
      'jasa satpam bersertifikat abujapi',
      'security service jawa barat',
    ],
  },
}

async function main() {
  console.log('› Menyiapkan data awal Dharmapati...')

  // Pengguna admin
  const kataSandi = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin123', 10)
  await prisma.pengguna.upsert({
    where: { username: process.env.ADMIN_USERNAME ?? 'admin' },
    update: { kataSandi },
    create: {
      nama: 'Administrator',
      username: process.env.ADMIN_USERNAME ?? 'admin',
      email: 'dharmapati02@gmail.com',
      kataSandi,
      peran: 'ADMIN',
    },
  })

  // Seluruh penanaman bersifat menambah, bukan menimpa: perubahan lewat panel admin
  // harus selamat setiap kali wadah dijalankan ulang.
  for (const l of LAYANAN) {
    const ada = await prisma.layanan.findUnique({ where: { slug: l.slug } })
    if (!ada) await prisma.layanan.create({ data: l })
  }

  if ((await prisma.legalitas.count()) === 0) {
    await prisma.legalitas.createMany({ data: LEGALITAS })
  }

  for (const k of KBLI) {
    const ada = await prisma.kbli.findUnique({ where: { kode: k.kode } })
    if (!ada) await prisma.kbli.create({ data: k })
  }

  if ((await prisma.personel.count()) === 0) {
    await prisma.personel.createMany({ data: PERSONEL })
  }

  // Klien + koordinat peta
  const sudahAdaKlien = (await prisma.klien.count()) > 0
  const hitungKota: Record<string, number> = {}
  let urutan = 0
  for (const k of (sudahAdaKlien ? [] : KLIEN)) {
    const pusat = KOTA[k.kota]
    const n = (hitungKota[k.kota] = (hitungKota[k.kota] ?? 0) + 1)
    const { dLat, dLng } = geser(n - 1)
    await prisma.klien.create({
      data: {
        nama: k.nama,
        slug: `${slugify(k.nama)}-${slugify(k.kota)}-${n}`,
        kota: k.kota,
        provinsi: pusat.provinsi,
        lat: Number((pusat.lat + dLat).toFixed(6)),
        lng: Number((pusat.lng + dLng).toFixed(6)),
        sektor: k.sektor,
        lini: k.lini,
        layananT: k.layananT,
        urutan: urutan++,
      },
    })
  }

  if ((await prisma.galeri.count()) === 0) {
    await prisma.galeri.createMany({ data: GALERI })
  }

  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({ data: FAQ })
  }

  for (const a of ARTIKEL) {
    const ada = await prisma.artikel.findUnique({ where: { slug: a.slug } })
    if (!ada) await prisma.artikel.create({ data: { ...a, tag: [a.kategori] } })
  }

  for (const l of LOWONGAN) {
    const ada = await prisma.lowongan.findUnique({ where: { slug: l.slug } })
    if (!ada) await prisma.lowongan.create({ data: l })
  }

  for (const [kunci, nilai] of Object.entries(PENGATURAN)) {
    const ada = await prisma.pengaturan.findUnique({ where: { kunci } })
    if (!ada) await prisma.pengaturan.create({ data: { kunci, nilai: nilai as any } })
  }

  const jumlahKlien = await prisma.klien.count()
  console.log(`✓ Selesai. ${LAYANAN.length} layanan, ${jumlahKlien} klien, ${LEGALITAS.length} dokumen legalitas.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
