/**
 * Sumber tunggal struktur navigasi situs.
 * Dipakai bersama oleh header, kaki halaman, dan peta situs agar tidak berbeda.
 */

export type Butir = { label: string; jalur: string; ringkas?: string }
export type Menu = { label: string; jalur: string; anak?: Butir[] }

export const LINI_LAYANAN = [
  { kunci: 'KEAMANAN', slug: 'pengamanan', label: 'Pengamanan' },
  { kunci: 'KEBERSIHAN', slug: 'kebersihan', label: 'Kebersihan' },
  { kunci: 'TENAGA_KERJA', slug: 'tenaga-kerja', label: 'Tenaga Kerja' },
  { kunci: 'PENDUKUNG', slug: 'pendukung', label: 'Layanan Pendukung' },
] as const

export type SlugLini = (typeof LINI_LAYANAN)[number]['slug']

export function liniDariSlug(slug: string) {
  return LINI_LAYANAN.find((l) => l.slug === slug)
}
export function slugDariLini(kunci: string) {
  return LINI_LAYANAN.find((l) => l.kunci === kunci)?.slug ?? 'pengamanan'
}

export const KATEGORI_GALERI = [
  { slug: 'perusahaan', label: 'Perusahaan' },
  { slug: 'pengamanan', label: 'Pengamanan' },
  { slug: 'supervisi', label: 'Supervisi' },
  { slug: 'pelatihan', label: 'Pelatihan' },
  { slug: 'rekrutmen', label: 'Rekrutmen' },
  { slug: 'cleaning-service', label: 'Cleaning Service' },
  { slug: 'pramusaji', label: 'Pramusaji' },
  { slug: 'manpower', label: 'Manpower' },
] as const

export function kategoriGaleriDariSlug(slug: string) {
  return KATEGORI_GALERI.find((k) => k.slug === slug)
}

export const MENU: Menu[] = [
  { label: 'Beranda', jalur: '/' },
  {
    label: 'Tentang',
    jalur: '/tentang',
    anak: [
      { label: 'Profil Perusahaan', jalur: '/tentang', ringkas: 'Ikhtisar siapa kami dan apa yang kami kerjakan' },
      { label: 'Sejarah & Filosofi', jalur: '/tentang/sejarah', ringkas: 'Lambang kuda, arti Dharmapati, dan tonggak perusahaan' },
      { label: 'Sambutan Direktur', jalur: '/tentang/direktur', ringkas: 'Prinsip pengamanan dari purnawirawan Polisi Militer' },
      { label: 'Visi & Misi', jalur: '/tentang/visi-misi', ringkas: 'Arah perusahaan serta pedoman 5R dan 5 DM' },
      { label: 'Struktur Organisasi', jalur: '/tentang/struktur-organisasi', ringkas: 'Jajaran direksi, manajemen, dan staf' },
    ],
  },
  {
    label: 'Layanan',
    jalur: '/layanan',
    anak: [
      { label: 'Semua Layanan', jalur: '/layanan', ringkas: 'Sembilan layanan dalam empat lini' },
      { label: 'Pengamanan', jalur: '/layanan/pengamanan', ringkas: 'Satpam, pengawalan VIP, dan objek vital' },
      { label: 'Kebersihan', jalur: '/layanan/kebersihan', ringkas: 'Cleaning service gedung dan pengendalian hama' },
      { label: 'Tenaga Kerja', jalur: '/layanan/tenaga-kerja', ringkas: 'Manpower, office boy, driver, dan operator' },
      { label: 'Layanan Pendukung', jalur: '/layanan/pendukung', ringkas: 'Perawatan taman, parkir, serta pelatihan' },
    ],
  },
  { label: 'Klien & Jangkauan', jalur: '/klien' },
  {
    label: 'Legalitas',
    jalur: '/legalitas',
    anak: [
      { label: 'Dokumen Legalitas', jalur: '/legalitas', ringkas: 'Akta, NIB, SIO Polri, ABUJAPI, APKLINDO, ISO' },
      { label: 'Bidang Usaha (KBLI)', jalur: '/legalitas/bidang-usaha', ringkas: 'Kode izin usaha yang kami pegang' },
    ],
  },
  { label: 'Galeri', jalur: '/galeri' },
  {
    label: 'Karier',
    jalur: '/karier',
    anak: [
      { label: 'Lowongan Terbuka', jalur: '/karier', ringkas: 'Posisi yang sedang kami cari' },
      { label: 'Proses Seleksi', jalur: '/karier/proses-seleksi', ringkas: 'Enam tahap dan kriteria calon anggota' },
      { label: 'Kirim Lamaran', jalur: '/karier/lamar', ringkas: 'Formulir lamaran umum daring' },
    ],
  },
  { label: 'Artikel', jalur: '/artikel' },
  {
    label: 'Kontak',
    jalur: '/kontak',
    anak: [
      { label: 'Minta Penawaran', jalur: '/kontak', ringkas: 'Formulir permintaan penawaran resmi' },
      { label: 'Lokasi Kantor', jalur: '/kontak/lokasi', ringkas: 'Kantor pusat, cabang, dan Pusdiklat' },
      { label: 'Tanya Jawab', jalur: '/faq', ringkas: 'Pertanyaan yang paling sering diajukan' },
    ],
  },
]

/** Seluruh jalur statis untuk peta situs. */
export const JALUR_STATIS: { jalur: string; prioritas: number; ubah: 'weekly' | 'monthly' | 'yearly' }[] = [
  { jalur: '/', prioritas: 1, ubah: 'weekly' },
  { jalur: '/tentang', prioritas: 0.9, ubah: 'monthly' },
  { jalur: '/tentang/sejarah', prioritas: 0.7, ubah: 'yearly' },
  { jalur: '/tentang/direktur', prioritas: 0.7, ubah: 'yearly' },
  { jalur: '/tentang/visi-misi', prioritas: 0.7, ubah: 'yearly' },
  { jalur: '/tentang/struktur-organisasi', prioritas: 0.7, ubah: 'monthly' },
  { jalur: '/layanan', prioritas: 0.9, ubah: 'monthly' },
  ...LINI_LAYANAN.map((l) => ({ jalur: `/layanan/${l.slug}`, prioritas: 0.85, ubah: 'monthly' as const })),
  { jalur: '/klien', prioritas: 0.85, ubah: 'weekly' },
  { jalur: '/legalitas', prioritas: 0.8, ubah: 'yearly' },
  { jalur: '/legalitas/bidang-usaha', prioritas: 0.6, ubah: 'yearly' },
  { jalur: '/galeri', prioritas: 0.6, ubah: 'monthly' },
  ...KATEGORI_GALERI.map((k) => ({ jalur: `/galeri/${k.slug}`, prioritas: 0.5, ubah: 'monthly' as const })),
  { jalur: '/karier', prioritas: 0.8, ubah: 'weekly' },
  { jalur: '/karier/proses-seleksi', prioritas: 0.6, ubah: 'yearly' },
  { jalur: '/karier/lamar', prioritas: 0.7, ubah: 'monthly' },
  { jalur: '/artikel', prioritas: 0.7, ubah: 'weekly' },
  { jalur: '/faq', prioritas: 0.6, ubah: 'monthly' },
  { jalur: '/kontak', prioritas: 0.9, ubah: 'yearly' },
  { jalur: '/kontak/lokasi', prioritas: 0.7, ubah: 'yearly' },
]
