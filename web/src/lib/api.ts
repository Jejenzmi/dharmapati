/** Lapisan pemanggilan API tunggal untuk seluruh situs. */

export const ASAL_API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5041'
export const API_PERAMBAN = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5041'
export const ASAL_SITUS = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:5194'

type Pilihan = { revalidate?: number; tanpaSinggahan?: boolean }

/**
 * Ambil data dari API publik. Situs harus tetap tampil walau API mati,
 * jadi kegagalan dikembalikan sebagai `null` — bukan melempar galat.
 */
export async function ambil<T>(jalur: string, pilihan: Pilihan = {}): Promise<T | null> {
  const { revalidate = 300, tanpaSinggahan = false } = pilihan
  try {
    const respons = await fetch(`${ASAL_API}/api/publik${jalur}`, {
      ...(tanpaSinggahan ? { cache: 'no-store' as const } : { next: { revalidate } }),
      headers: { Accept: 'application/json' },
    })
    if (!respons.ok) return null
    return (await respons.json()) as T
  } catch {
    return null
  }
}

// ---------- Bentuk data ----------

export type LiniLayanan = 'KEAMANAN' | 'KEBERSIHAN' | 'TENAGA_KERJA' | 'PENDUKUNG'

export type Layanan = {
  id: string
  slug: string
  nama: string
  lini: LiniLayanan
  ikon: string
  ringkasan: string
  deskripsi: string
  fitur: string[]
  cakupan: string[]
  gambar: string | null
  urutan: number
  unggulan: boolean
  seoJudul: string | null
  seoDesk: string | null
}

export type Klien = {
  id: string
  nama: string
  slug: string
  kota: string
  provinsi: string
  lat: number
  lng: number
  sektor: string
  lini: LiniLayanan
  layananT: string[]
  logo: string | null
  sejakThn: number | null
}

export type Legalitas = { id: string; label: string; nomor: string; penerbit: string | null; tanggal: string | null; catatan: string | null }
export type Kbli = { id: string; kode: string; judul: string; lini: LiniLayanan }
export type Personel = { id: string; nama: string; jabatan: string; tingkat: number; induk: string | null; foto: string | null; bio: string | null }
export type Galeri = { id: string; judul: string; kategori: string; gambar: string; keterangan: string | null }
export type Artikel = {
  id: string; slug: string; judul: string; ringkasan: string; isi: string; sampul: string | null
  kategori: string; tag: string[]; penulis: string; terbitAt: string; dilihat: number
  seoJudul: string | null; seoDesk: string | null; diubahAt?: string
}
export type Lowongan = {
  id: string; slug: string; posisi: string; lokasi: string; tipe: string; penempatan: string | null
  deskripsi: string; syarat: string[]; gaji: string | null; kuota: number; tutupAt: string | null; dibuatAt: string
}
export type Faq = { id: string; tanya: string; jawab: string; kategori: string }
export type Testimoni = { id: string; nama: string; jabatan: string; instansi: string; isi: string; foto: string | null; rating: number }

export type Pengaturan = {
  perusahaan?: {
    nama: string; namaPendek: string; tagline: string; slogan: string
    berdiri: number; induk: string; sikap: string[]
  }
  kontak?: {
    alamatKantor: string; alamatCabang: string; alamatPusdiklat: string
    email: string; telepon: string[]; whatsapp: string; jamKerja: string
    petaKantor: { lat: number; lng: number }
    petaCabang: { lat: number; lng: number }
    petaPusdiklat: { lat: number; lng: number }
  }
  visiMisi?: {
    visiKeamanan: string; misiKeamanan: string; visiFasilitas: string; misiFasilitas: string
    pedoman5R: string[]; pedoman5DM: string[]
  }
  sejarah?: {
    filosofi: string; arti: string; hubunganInduk: string
    tonggak: { tahun: string; judul: string; isi: string }[]
  }
  direktur?: { nama: string; jabatan: string; paragraf: string[] }
  rekrutmen?: { tahapan: { judul: string; isi: string }[]; kriteria: string[] }
  pelatihan?: { kelompok: { judul: string; butir: string[] }[] }
  perlengkapan?: { kelompok: { judul: string; butir: string[] }[] }
  beranda?: {
    hero: {
      label: string; judulAwal: string; judulSorot: string; judulAkhir: string
      deskripsi: string; poin: string[]; gambar: string; tahunBerdiri: string
    }
    pilar: { judul: string; ikon: string; isi: string; tautan: string }[]
    metode: { judul: string; deskripsi: string; langkah: { judul: string; isi: string }[] }
    legalSingkat: { label: string; nilai: string }[]
  }
  profil?: { paragraf: string[]; poin: string[]; gambar: string }
  lini?: Record<string, {
    ringkas: string; gambar: string; intro: string; gambarRinci: string
    poin: { judul: string; isi: string }[]
  }>
  jaminanLegalitas?: { butir: { judul: string; isi: string }[] }
  galeriKategori?: Record<string, string>
  daftarBantuan?: { kontakButir: string[]; berkasLamaran: string[] }
  seo?: { judulBawaan: string; deskripsiBawaan: string; kataKunci: string[] }
}

export type DataBeranda = {
  layanan: Layanan[]
  klien: Klien[]
  testimoni: Testimoni[]
  artikel: Artikel[]
  angka: { klien: number; kota: number; provinsi: number }
  pengaturan: Pengaturan
}

// ---------- Nilai cadangan bila API belum hidup ----------

export const PENGATURAN_CADANGAN: Pengaturan = {
  perusahaan: {
    nama: 'PT. Dharmapati Putra Nusantara',
    namaPendek: 'Dharmapati',
    tagline: 'Pengabdian yang Tulus dan Gagah Berani',
    slogan: 'Mitra pengamanan dan pengelolaan tenaga kerja untuk industri, perkantoran, dan instansi pemerintah.',
    berdiri: 2020,
    induk: 'PT. Dharmapati Utama Nusantara',
    sikap: ['Tanggap', 'Tangguh', 'Tanggon', 'Trengginas'],
  },
  kontak: {
    alamatKantor: 'Samesta Royal Campaka, Ruko Blok R1 No. 36, Campaka, Purwakarta, Jawa Barat 41181',
    alamatCabang: 'Jl. Raya Pegangsaan Dua H. Oyar No. 3, Kelapa Gading, Jakarta Utara 14250',
    alamatPusdiklat: 'Jl. Raya Gantar – Sanca, Blok Tanjungsari 1, Mekarjaya, Kec. Gantar, Kab. Indramayu',
    email: 'dharmapati02@gmail.com',
    telepon: ['087777889158', '081288931154', '089648278879'],
    whatsapp: '6287777889158',
    jamKerja: 'Senin – Jumat, 08.00 – 17.00 WIB',
    petaKantor: { lat: -6.5236, lng: 107.4102 },
    petaCabang: { lat: -6.1583, lng: 106.9077 },
    petaPusdiklat: { lat: -6.4497, lng: 107.9564 },
  },
  beranda: {
    hero: {
      label: 'Berizin SIO Polri · ABUJAPI · APKLINDO',
      judulAwal: 'Pengabdian yang',
      judulSorot: 'Tulus',
      judulAkhir: 'dan Gagah Berani',
      deskripsi:
        'PT. Dharmapati Putra Nusantara menyediakan dan mengelola tenaga pengamanan, cleaning service, serta tenaga kerja untuk industri, perkantoran, dan instansi pemerintah.',
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
      { judul: 'Pengamanan', ikon: 'shield', isi: 'Satpam bersertifikat, pengawalan VIP, dan pengamanan objek vital.', tautan: '/layanan/pengamanan' },
      { judul: 'Kebersihan', ikon: 'sparkles', isi: 'Cleaning service gedung dan pengendalian hama terjadwal.', tautan: '/layanan/kebersihan' },
      { judul: 'Tenaga Kerja', ikon: 'users', isi: 'Manpower, office boy, driver, dan operator forklift.', tautan: '/layanan/tenaga-kerja' },
    ],
    metode: {
      judul: 'Empat langkah yang membuat penjagaan terukur, bukan sekadar berjaga',
      deskripsi: 'Pengamanan yang baik selalu dimulai dari dokumen, bukan dari jumlah orang.',
      langkah: [
        { judul: 'Pemetaan area', isi: 'Survei objek untuk memetakan titik masuk, jalur kendaraan, dan area kritis.' },
        { judul: 'Perumusan RENPAM', isi: 'Rencana Pengamanan disusun sesuai kerawanan objek.' },
        { judul: 'Penurunan ke SOP', isi: 'RENPAM diterjemahkan menjadi SOP praktis yang dipegang tiap anggota.' },
        { judul: 'Pengawasan & evaluasi', isi: 'Pengawasan berjenjang dengan laporan bulanan.' },
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
    paragraf: ['PT. Dharmapati Putra Nusantara adalah perusahaan penyediaan dan pengelolaan tenaga kerja: pengamanan, cleaning service, manpower, office boy, driver, dan operator forklift.'],
    poin: ['Berizin operasional Polri dan terdaftar ABUJAPI', 'Anggota APKLINDO', 'ISO 9001:2015', 'Pusdiklat sendiri di Indramayu'],
    gambar: '/galeri/sec-h03-585-b0ba4753d0.jpg',
  },
  lini: {},
  jaminanLegalitas: { butir: [] },
  galeriKategori: {},
  daftarBantuan: { kontakButir: [], berkasLamaran: [] },
  seo: {
    judulBawaan: 'PT. Dharmapati Putra Nusantara — Jasa Pengamanan, Cleaning Service & Tenaga Kerja',
    deskripsiBawaan:
      'Perusahaan jasa pengamanan (Satpam), cleaning service, dan penyediaan tenaga kerja berizin SIO Polri, ABUJAPI, dan APKLINDO.',
    kataKunci: ['jasa keamanan purwakarta', 'outsourcing satpam karawang', 'cleaning service purwakarta'],
  },
}

export async function ambilPengaturan(): Promise<Pengaturan> {
  const data = await ambil<Pengaturan>('/pengaturan')
  return { ...PENGATURAN_CADANGAN, ...(data ?? {}) }
}
