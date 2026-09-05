import { API_PERAMBAN } from './api'

const KUNCI_TOKEN = 'dp_admin_token'

export function simpanToken(token: string) {
  try { localStorage.setItem(KUNCI_TOKEN, token) } catch { /* abaikan */ }
}
export function ambilToken() {
  try { return localStorage.getItem(KUNCI_TOKEN) } catch { return null }
}
export function hapusToken() {
  try { localStorage.removeItem(KUNCI_TOKEN) } catch { /* abaikan */ }
}

export async function apiAdmin<T>(jalur: string, pilihan: RequestInit = {}): Promise<T> {
  const token = ambilToken()
  const respons = await fetch(`${API_PERAMBAN}/api${jalur}`, {
    ...pilihan,
    credentials: 'include',
    headers: {
      ...(pilihan.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(pilihan.headers ?? {}),
    },
  })
  if (respons.status === 401) {
    hapusToken()
    throw new Error('Sesi berakhir, silakan masuk kembali.')
  }
  if (respons.status === 204) return undefined as T
  const isi = await respons.json().catch(() => ({}))
  if (!respons.ok) throw new Error((isi as { pesan?: string }).pesan ?? 'Permintaan gagal')
  return isi as T
}

// ---------- Definisi bidang tiap sumber daya ----------

export type Bidang = {
  nama: string
  label: string
  jenis: 'teks' | 'panjang' | 'angka' | 'saklar' | 'daftar' | 'pilih' | 'gambar' | 'tanggal'
  pilihan?: string[]
  bantuan?: string
  wajib?: boolean
  diTabel?: boolean
}

export type Sumber = {
  kunci: string
  label: string
  ikon: string
  bidang: Bidang[]
  bacaSaja?: boolean
}

const LINI = ['KEAMANAN', 'KEBERSIHAN', 'TENAGA_KERJA', 'PENDUKUNG']

export const SUMBER: Sumber[] = [
  {
    kunci: 'pesan', label: 'Pesan Masuk', ikon: '✉️', bacaSaja: true,
    bidang: [
      { nama: 'nama', label: 'Nama', jenis: 'teks', diTabel: true },
      { nama: 'perusahaan', label: 'Perusahaan', jenis: 'teks', diTabel: true },
      { nama: 'email', label: 'Surel', jenis: 'teks', diTabel: true },
      { nama: 'telepon', label: 'Telepon', jenis: 'teks', diTabel: true },
      { nama: 'layanan', label: 'Layanan', jenis: 'teks', diTabel: true },
      { nama: 'lokasi', label: 'Lokasi', jenis: 'teks' },
      { nama: 'kebutuhan', label: 'Kebutuhan', jenis: 'teks' },
      { nama: 'pesan', label: 'Pesan', jenis: 'panjang' },
      { nama: 'status', label: 'Status', jenis: 'pilih', pilihan: ['BARU', 'DIPROSES', 'SELESAI', 'BATAL'], diTabel: true },
    ],
  },
  {
    kunci: 'lamaran', label: 'Lamaran Kerja', ikon: '📄', bacaSaja: true,
    bidang: [
      { nama: 'nama', label: 'Nama', jenis: 'teks', diTabel: true },
      { nama: 'email', label: 'Surel', jenis: 'teks', diTabel: true },
      { nama: 'telepon', label: 'Telepon', jenis: 'teks', diTabel: true },
      { nama: 'domisili', label: 'Domisili', jenis: 'teks', diTabel: true },
      { nama: 'pendidikan', label: 'Pendidikan', jenis: 'teks' },
      { nama: 'pengalaman', label: 'Pengalaman', jenis: 'panjang' },
      { nama: 'berkas', label: 'Berkas', jenis: 'teks' },
      { nama: 'catatan', label: 'Catatan', jenis: 'panjang' },
      { nama: 'status', label: 'Status', jenis: 'pilih', pilihan: ['BARU', 'SELEKSI', 'DITERIMA', 'DITOLAK'], diTabel: true },
    ],
  },
  {
    kunci: 'klien', label: 'Klien & Peta', ikon: '📍',
    bidang: [
      { nama: 'nama', label: 'Nama klien', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'slug', label: 'Slug', jenis: 'teks', wajib: true, bantuan: 'Unik, huruf kecil dan tanda hubung' },
      { nama: 'kota', label: 'Kota', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'provinsi', label: 'Provinsi', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'lat', label: 'Lintang (lat)', jenis: 'angka', wajib: true },
      { nama: 'lng', label: 'Bujur (lng)', jenis: 'angka', wajib: true },
      { nama: 'sektor', label: 'Sektor', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'lini', label: 'Lini utama', jenis: 'pilih', pilihan: LINI },
      { nama: 'layananT', label: 'Layanan diterima', jenis: 'daftar', bantuan: 'Pisahkan dengan baris baru. Contoh: Pengamanan' },
      { nama: 'sejakThn', label: 'Sejak tahun', jenis: 'angka' },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
      { nama: 'terbit', label: 'Ditampilkan', jenis: 'saklar', diTabel: true },
    ],
  },
  {
    kunci: 'layanan', label: 'Layanan', ikon: '🛡️',
    bidang: [
      { nama: 'nama', label: 'Nama layanan', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'slug', label: 'Slug', jenis: 'teks', wajib: true },
      { nama: 'lini', label: 'Lini', jenis: 'pilih', pilihan: LINI, diTabel: true },
      { nama: 'ikon', label: 'Ikon', jenis: 'pilih', pilihan: ['shield', 'user-shield', 'sparkles', 'bug', 'users', 'coffee', 'truck', 'leaf', 'graduation-cap'] },
      { nama: 'ringkasan', label: 'Ringkasan', jenis: 'panjang', wajib: true },
      { nama: 'deskripsi', label: 'Deskripsi', jenis: 'panjang', wajib: true, bantuan: 'Mendukung Markdown sederhana: ## judul, - daftar, **tebal**' },
      { nama: 'fitur', label: 'Fitur', jenis: 'daftar' },
      { nama: 'cakupan', label: 'Cocok untuk', jenis: 'daftar' },
      { nama: 'gambar', label: 'Gambar', jenis: 'gambar' },
      { nama: 'seoJudul', label: 'Judul SEO', jenis: 'teks' },
      { nama: 'seoDesk', label: 'Deskripsi SEO', jenis: 'panjang' },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
      { nama: 'unggulan', label: 'Unggulan', jenis: 'saklar', diTabel: true },
      { nama: 'terbit', label: 'Diterbitkan', jenis: 'saklar', diTabel: true },
    ],
  },
  {
    kunci: 'artikel', label: 'Artikel', ikon: '📰',
    bidang: [
      { nama: 'judul', label: 'Judul', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'slug', label: 'Slug', jenis: 'teks', wajib: true },
      { nama: 'kategori', label: 'Kategori', jenis: 'teks', diTabel: true },
      { nama: 'ringkasan', label: 'Ringkasan', jenis: 'panjang', wajib: true },
      { nama: 'isi', label: 'Isi', jenis: 'panjang', wajib: true, bantuan: 'Markdown sederhana' },
      { nama: 'sampul', label: 'Gambar sampul', jenis: 'gambar' },
      { nama: 'tag', label: 'Tag', jenis: 'daftar' },
      { nama: 'penulis', label: 'Penulis', jenis: 'teks' },
      { nama: 'seoJudul', label: 'Judul SEO', jenis: 'teks' },
      { nama: 'seoDesk', label: 'Deskripsi SEO', jenis: 'panjang' },
      { nama: 'terbit', label: 'Diterbitkan', jenis: 'saklar', diTabel: true },
    ],
  },
  {
    kunci: 'lowongan', label: 'Lowongan', ikon: '💼',
    bidang: [
      { nama: 'posisi', label: 'Posisi', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'slug', label: 'Slug', jenis: 'teks', wajib: true },
      { nama: 'lokasi', label: 'Lokasi', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'tipe', label: 'Tipe', jenis: 'pilih', pilihan: ['Penuh Waktu', 'Kontrak', 'Paruh Waktu', 'Harian'], diTabel: true },
      { nama: 'penempatan', label: 'Penempatan', jenis: 'teks' },
      { nama: 'deskripsi', label: 'Deskripsi', jenis: 'panjang', wajib: true },
      { nama: 'syarat', label: 'Syarat', jenis: 'daftar' },
      { nama: 'gaji', label: 'Gaji', jenis: 'teks' },
      { nama: 'kuota', label: 'Kuota', jenis: 'angka' },
      { nama: 'terbit', label: 'Diterbitkan', jenis: 'saklar', diTabel: true },
    ],
  },
  {
    kunci: 'galeri', label: 'Galeri', ikon: '🖼️',
    bidang: [
      { nama: 'judul', label: 'Judul', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'kategori', label: 'Kategori', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'gambar', label: 'Gambar', jenis: 'gambar', wajib: true },
      { nama: 'keterangan', label: 'Keterangan', jenis: 'panjang' },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
      { nama: 'terbit', label: 'Ditampilkan', jenis: 'saklar', diTabel: true },
    ],
  },
  {
    kunci: 'personel', label: 'Struktur Organisasi', ikon: '👥',
    bidang: [
      { nama: 'nama', label: 'Nama', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'jabatan', label: 'Jabatan', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'tingkat', label: 'Tingkat (1 tertinggi)', jenis: 'angka', diTabel: true },
      { nama: 'induk', label: 'Atasan', jenis: 'teks' },
      { nama: 'foto', label: 'Foto', jenis: 'gambar' },
      { nama: 'bio', label: 'Keterangan', jenis: 'panjang' },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
      { nama: 'terbit', label: 'Ditampilkan', jenis: 'saklar' },
    ],
  },
  {
    kunci: 'legalitas', label: 'Legalitas', ikon: '📜',
    bidang: [
      { nama: 'label', label: 'Nama dokumen', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'nomor', label: 'Nomor', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'penerbit', label: 'Penerbit', jenis: 'teks', diTabel: true },
      { nama: 'tanggal', label: 'Tanggal', jenis: 'teks' },
      { nama: 'catatan', label: 'Catatan', jenis: 'panjang' },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
    ],
  },
  {
    kunci: 'kbli', label: 'KBLI', ikon: '🏷️',
    bidang: [
      { nama: 'kode', label: 'Kode', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'judul', label: 'Judul', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'lini', label: 'Lini', jenis: 'pilih', pilihan: LINI, diTabel: true },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
    ],
  },
  {
    kunci: 'faq', label: 'Tanya Jawab', ikon: '❓',
    bidang: [
      { nama: 'tanya', label: 'Pertanyaan', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'jawab', label: 'Jawaban', jenis: 'panjang', wajib: true },
      { nama: 'kategori', label: 'Kategori', jenis: 'teks', diTabel: true },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
      { nama: 'terbit', label: 'Ditampilkan', jenis: 'saklar', diTabel: true },
    ],
  },
  {
    kunci: 'testimoni', label: 'Testimoni', ikon: '💬',
    bidang: [
      { nama: 'nama', label: 'Nama', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'jabatan', label: 'Jabatan', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'instansi', label: 'Instansi', jenis: 'teks', wajib: true, diTabel: true },
      { nama: 'isi', label: 'Isi testimoni', jenis: 'panjang', wajib: true },
      { nama: 'foto', label: 'Foto', jenis: 'gambar' },
      { nama: 'rating', label: 'Rating (1-5)', jenis: 'angka' },
      { nama: 'urutan', label: 'Urutan', jenis: 'angka' },
      { nama: 'terbit', label: 'Ditampilkan', jenis: 'saklar', diTabel: true },
    ],
  },
]
