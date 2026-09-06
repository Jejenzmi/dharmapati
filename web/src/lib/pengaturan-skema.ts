/** Skema bidang untuk penyunting Pengaturan di panel admin. */

export type BidangP =
  | { nama: string; label: string; jenis: 'teks' | 'panjang' | 'angka' | 'gambar'; bantuan?: string }
  | { nama: string; label: string; jenis: 'daftar'; bantuan?: string }
  | { nama: string; label: string; jenis: 'petaTeks'; bantuan?: string }
  | { nama: string; label: string; jenis: 'grup'; bidang: BidangP[] }
  | { nama: string; label: string; jenis: 'ulang'; judulButir: string; bidang: BidangP[] }

export type KelompokPengaturan = {
  kunci: string
  label: string
  ikon: string
  keterangan: string
  bidang: BidangP[]
}

const POIN_JUDUL_ISI: BidangP[] = [
  { nama: 'judul', label: 'Judul', jenis: 'teks' },
  { nama: 'isi', label: 'Keterangan', jenis: 'panjang' },
]

export const KELOMPOK_PENGATURAN: KelompokPengaturan[] = [
  {
    kunci: 'perusahaan',
    label: 'Identitas Perusahaan',
    ikon: '🏢',
    keterangan: 'Nama, tagline, dan sikap dasar yang tampil di seluruh situs.',
    bidang: [
      { nama: 'nama', label: 'Nama lengkap', jenis: 'teks' },
      { nama: 'namaPendek', label: 'Nama pendek', jenis: 'teks' },
      { nama: 'tagline', label: 'Tagline', jenis: 'teks' },
      { nama: 'slogan', label: 'Slogan (dipakai di kaki halaman)', jenis: 'panjang' },
      { nama: 'berdiri', label: 'Tahun berdiri', jenis: 'angka' },
      { nama: 'induk', label: 'Perusahaan induk', jenis: 'teks' },
      { nama: 'sikap', label: 'Sikap Dharmapati', jenis: 'daftar', bantuan: 'Satu sikap per baris' },
    ],
  },
  {
    kunci: 'kontak',
    label: 'Kontak & Alamat',
    ikon: '📞',
    keterangan: 'Alamat kantor, nomor telepon, surel, jam layanan, dan titik peta.',
    bidang: [
      { nama: 'alamatKantor', label: 'Alamat kantor pusat', jenis: 'panjang' },
      { nama: 'alamatCabang', label: 'Alamat kantor cabang', jenis: 'panjang' },
      { nama: 'alamatPusdiklat', label: 'Alamat Pusdiklat', jenis: 'panjang' },
      { nama: 'email', label: 'Surel utama', jenis: 'teks', bantuan: 'Dipakai di kaki halaman, halaman kontak, dan data terstruktur' },
      { nama: 'emailKarier', label: 'Surel karier', jenis: 'teks', bantuan: 'Ditampilkan di halaman lowongan dan lamaran' },
      { nama: 'emailBisnis', label: 'Surel kerja sama', jenis: 'teks', bantuan: 'Ditampilkan di halaman permintaan penawaran' },
      { nama: 'emailDukungan', label: 'Surel dukungan', jenis: 'teks', bantuan: 'Ditampilkan di halaman tanya jawab' },
      { nama: 'telepon', label: 'Nomor telepon', jenis: 'daftar', bantuan: 'Satu nomor per baris' },
      { nama: 'whatsapp', label: 'Nomor WhatsApp', jenis: 'teks', bantuan: 'Format internasional tanpa tanda plus, contoh 6287777889158' },
      { nama: 'jamKerja', label: 'Jam layanan', jenis: 'teks' },
      {
        nama: 'petaKantor', label: 'Titik peta kantor pusat', jenis: 'grup',
        bidang: [{ nama: 'lat', label: 'Lintang', jenis: 'angka' }, { nama: 'lng', label: 'Bujur', jenis: 'angka' }],
      },
      {
        nama: 'petaCabang', label: 'Titik peta kantor cabang', jenis: 'grup',
        bidang: [{ nama: 'lat', label: 'Lintang', jenis: 'angka' }, { nama: 'lng', label: 'Bujur', jenis: 'angka' }],
      },
      {
        nama: 'petaPusdiklat', label: 'Titik peta Pusdiklat', jenis: 'grup',
        bidang: [{ nama: 'lat', label: 'Lintang', jenis: 'angka' }, { nama: 'lng', label: 'Bujur', jenis: 'angka' }],
      },
    ],
  },
  {
    kunci: 'beranda',
    label: 'Beranda',
    ikon: '🏠',
    keterangan: 'Judul utama, tiga pilar layanan, empat langkah metode kerja, dan bilah legalitas.',
    bidang: [
      {
        nama: 'hero', label: 'Bagian utama (hero)', jenis: 'grup',
        bidang: [
          { nama: 'label', label: 'Label kecil di atas judul', jenis: 'teks' },
          { nama: 'judulAwal', label: 'Judul — bagian awal', jenis: 'teks' },
          { nama: 'judulSorot', label: 'Judul — kata yang disorot emas', jenis: 'teks' },
          { nama: 'judulAkhir', label: 'Judul — bagian akhir', jenis: 'teks' },
          { nama: 'deskripsi', label: 'Paragraf pembuka', jenis: 'panjang' },
          { nama: 'poin', label: 'Poin ceklis', jenis: 'daftar' },
          { nama: 'gambar', label: 'Foto utama', jenis: 'gambar' },
          { nama: 'tahunBerdiri', label: 'Tahun pada lencana', jenis: 'teks' },
        ],
      },
      {
        nama: 'pilar', label: 'Tiga pilar layanan', jenis: 'ulang', judulButir: 'judul',
        bidang: [
          { nama: 'judul', label: 'Judul pilar', jenis: 'teks' },
          { nama: 'ikon', label: 'Ikon', jenis: 'teks', bantuan: 'shield, sparkles, users, coffee, truck, leaf, bug, graduation-cap, user-shield' },
          { nama: 'isi', label: 'Keterangan', jenis: 'panjang' },
          { nama: 'tautan', label: 'Tautan tujuan', jenis: 'teks' },
        ],
      },
      {
        nama: 'metode', label: 'Metode kerja', jenis: 'grup',
        bidang: [
          { nama: 'judul', label: 'Judul bagian', jenis: 'teks' },
          { nama: 'deskripsi', label: 'Paragraf pengantar', jenis: 'panjang' },
          { nama: 'langkah', label: 'Langkah', jenis: 'ulang', judulButir: 'judul', bidang: POIN_JUDUL_ISI },
        ],
      },
      {
        nama: 'legalSingkat', label: 'Bilah legalitas', jenis: 'ulang', judulButir: 'label',
        bidang: [
          { nama: 'label', label: 'Nama izin', jenis: 'teks' },
          { nama: 'nilai', label: 'Nomor', jenis: 'teks' },
        ],
      },
    ],
  },
  {
    kunci: 'profil',
    label: 'Profil Perusahaan',
    ikon: '📄',
    keterangan: 'Isi halaman /tentang bagian “Siapa kami”.',
    bidang: [
      { nama: 'paragraf', label: 'Paragraf', jenis: 'daftar', bantuan: 'Satu paragraf per baris' },
      { nama: 'poin', label: 'Poin ceklis', jenis: 'daftar' },
      { nama: 'gambar', label: 'Foto', jenis: 'gambar' },
    ],
  },
  {
    kunci: 'sejarah',
    label: 'Sejarah & Filosofi',
    ikon: '📜',
    keterangan: 'Isi halaman /tentang/sejarah.',
    bidang: [
      { nama: 'filosofi', label: 'Filosofi lambang', jenis: 'panjang' },
      { nama: 'arti', label: 'Arti nama Dharmapati', jenis: 'teks' },
      { nama: 'hubunganInduk', label: 'Hubungan dengan induk', jenis: 'panjang' },
      {
        nama: 'tonggak', label: 'Tonggak sejarah', jenis: 'ulang', judulButir: 'tahun',
        bidang: [
          { nama: 'tahun', label: 'Tahun', jenis: 'teks' },
          { nama: 'judul', label: 'Judul', jenis: 'teks' },
          { nama: 'isi', label: 'Keterangan', jenis: 'panjang' },
        ],
      },
    ],
  },
  {
    kunci: 'direktur',
    label: 'Sambutan Direktur',
    ikon: '👔',
    keterangan: 'Isi halaman /tentang/direktur.',
    bidang: [
      { nama: 'nama', label: 'Nama', jenis: 'teks' },
      { nama: 'jabatan', label: 'Jabatan', jenis: 'teks' },
      { nama: 'paragraf', label: 'Paragraf sambutan', jenis: 'daftar', bantuan: 'Satu paragraf per baris' },
    ],
  },
  {
    kunci: 'visiMisi',
    label: 'Visi & Misi',
    ikon: '🎯',
    keterangan: 'Isi halaman /tentang/visi-misi.',
    bidang: [
      { nama: 'visiKeamanan', label: 'Visi lini pengamanan', jenis: 'panjang' },
      { nama: 'misiKeamanan', label: 'Misi lini pengamanan', jenis: 'panjang' },
      { nama: 'visiFasilitas', label: 'Visi lini fasilitas', jenis: 'panjang' },
      { nama: 'misiFasilitas', label: 'Misi lini fasilitas', jenis: 'panjang' },
      { nama: 'pedoman5R', label: 'Pedoman 5R', jenis: 'daftar' },
      { nama: 'pedoman5DM', label: 'Pedoman 5 DM', jenis: 'daftar' },
    ],
  },
  {
    kunci: 'lini',
    label: 'Lini Layanan',
    ikon: '🛡️',
    keterangan: 'Pengantar dan poin pembeda tiap lini pada halaman /layanan dan /layanan/<lini>.',
    bidang: (['KEAMANAN', 'KEBERSIHAN', 'TENAGA_KERJA', 'PENDUKUNG'] as const).map((k) => ({
      nama: k,
      label: k === 'KEAMANAN' ? 'Pengamanan' : k === 'KEBERSIHAN' ? 'Kebersihan' : k === 'TENAGA_KERJA' ? 'Tenaga Kerja' : 'Layanan Pendukung',
      jenis: 'grup' as const,
      bidang: [
        { nama: 'ringkas', label: 'Ringkasan (halaman /layanan)', jenis: 'panjang' as const },
        { nama: 'gambar', label: 'Foto pada ikhtisar', jenis: 'gambar' as const },
        { nama: 'intro', label: 'Pengantar (halaman lini)', jenis: 'panjang' as const },
        { nama: 'gambarRinci', label: 'Foto pada halaman lini', jenis: 'gambar' as const },
        { nama: 'poin', label: 'Poin pembeda', jenis: 'ulang' as const, judulButir: 'judul', bidang: POIN_JUDUL_ISI },
      ],
    })),
  },
  {
    kunci: 'jaminanLegalitas',
    label: 'Jaminan Legalitas',
    ikon: '⚖️',
    keterangan: 'Empat kartu jaminan pada halaman /legalitas.',
    bidang: [
      { nama: 'butir', label: 'Kartu jaminan', jenis: 'ulang', judulButir: 'judul', bidang: POIN_JUDUL_ISI },
    ],
  },
  {
    kunci: 'rekrutmen',
    label: 'Rekrutmen',
    ikon: '🧑‍💼',
    keterangan: 'Tahapan seleksi dan kriteria pada halaman /karier/proses-seleksi.',
    bidang: [
      { nama: 'tahapan', label: 'Tahapan seleksi', jenis: 'ulang', judulButir: 'judul', bidang: POIN_JUDUL_ISI },
      { nama: 'kriteria', label: 'Kriteria calon anggota', jenis: 'daftar' },
    ],
  },
  {
    kunci: 'daftarBantuan',
    label: 'Daftar Bantuan',
    ikon: '📋',
    keterangan: 'Daftar “Yang perlu kami tahu” di halaman kontak dan “Berkas yang perlu disiapkan” di halaman lamaran.',
    bidang: [
      { nama: 'kontakButir', label: 'Yang perlu kami tahu (halaman kontak)', jenis: 'daftar' },
      { nama: 'berkasLamaran', label: 'Berkas lamaran yang disiapkan', jenis: 'daftar' },
    ],
  },
  {
    kunci: 'galeriKategori',
    label: 'Keterangan Kategori Galeri',
    ikon: '🖼️',
    keterangan: 'Paragraf pengantar pada tiap halaman kategori galeri.',
    bidang: [
      { nama: '__peta__', label: 'Keterangan per kategori', jenis: 'petaTeks', bantuan: 'Kunci adalah slug kategori, misalnya cleaning-service' },
    ],
  },
  {
    kunci: 'pelatihan',
    label: 'Materi Pelatihan',
    ikon: '🎓',
    keterangan: 'Kelompok materi pelatihan di Pusdiklat.',
    bidang: [
      {
        nama: 'kelompok', label: 'Kelompok materi', jenis: 'ulang', judulButir: 'judul',
        bidang: [
          { nama: 'judul', label: 'Judul kelompok', jenis: 'teks' },
          { nama: 'butir', label: 'Materi', jenis: 'daftar' },
        ],
      },
    ],
  },
  {
    kunci: 'perlengkapan',
    label: 'Perlengkapan',
    ikon: '🎽',
    keterangan: 'Daftar seragam, perlengkapan tugas, dan peralatan kebersihan.',
    bidang: [
      {
        nama: 'kelompok', label: 'Kelompok perlengkapan', jenis: 'ulang', judulButir: 'judul',
        bidang: [
          { nama: 'judul', label: 'Judul kelompok', jenis: 'teks' },
          { nama: 'butir', label: 'Perlengkapan', jenis: 'daftar' },
        ],
      },
    ],
  },
  {
    kunci: 'seo',
    label: 'SEO',
    ikon: '🔍',
    keterangan: 'Judul dan deskripsi bawaan serta kata kunci utama.',
    bidang: [
      { nama: 'judulBawaan', label: 'Judul bawaan', jenis: 'teks' },
      { nama: 'deskripsiBawaan', label: 'Deskripsi bawaan', jenis: 'panjang' },
      { nama: 'kataKunci', label: 'Kata kunci', jenis: 'daftar' },
    ],
  },
]
