/** Titik acuan kota untuk peta Leaflet (perkiraan pusat kota). */
export const KOTA: Record<string, { lat: number; lng: number; provinsi: string }> = {
  Bekasi: { lat: -6.2383, lng: 106.9756, provinsi: 'Jawa Barat' },
  Jakarta: { lat: -6.2088, lng: 106.8456, provinsi: 'DKI Jakarta' },
  Cibitung: { lat: -6.265, lng: 107.085, provinsi: 'Jawa Barat' },
  Cikarang: { lat: -6.2614, lng: 107.1523, provinsi: 'Jawa Barat' },
  Karawang: { lat: -6.3227, lng: 107.3376, provinsi: 'Jawa Barat' },
  Purwakarta: { lat: -6.5569, lng: 107.4433, provinsi: 'Jawa Barat' },
  Subang: { lat: -6.5717, lng: 107.7583, provinsi: 'Jawa Barat' },
  Indramayu: { lat: -6.3373, lng: 108.32, provinsi: 'Jawa Barat' },
  Cirebon: { lat: -6.732, lng: 108.5523, provinsi: 'Jawa Barat' },
  Kendal: { lat: -6.921, lng: 110.202, provinsi: 'Jawa Tengah' },
  Gresik: { lat: -7.156, lng: 112.656, provinsi: 'Jawa Timur' },
  Jember: { lat: -8.1729, lng: 113.7, provinsi: 'Jawa Timur' },
}

type Baris = {
  nama: string
  kota: keyof typeof KOTA
  sektor: string
  lini: 'KEAMANAN' | 'KEBERSIHAN' | 'TENAGA_KERJA'
  layananT: string[]
}

/**
 * Daftar klien digabung dari dua company profile (pengamanan & cleaning service).
 * Klien yang muncul di keduanya ditandai pada `layananT`.
 */
export const KLIEN: Baris[] = [
  { nama: 'PT. Aver Asia Indonesia', kota: 'Bekasi', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Aver Asia', kota: 'Bekasi', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Nachindo Tape Industry', kota: 'Jakarta', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Bina Busana Internusa', kota: 'Jakarta', sektor: 'Garmen', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Pandurasa Kharisma', kota: 'Jakarta', sektor: 'Distribusi Pangan', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'Mahogany Residence', kota: 'Jakarta', sektor: 'Perumahan', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Balihai Beer', kota: 'Cibitung', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Robertson FastBuild Indonesia', kota: 'Cibitung', sektor: 'Bahan Bangunan', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Lumos Building Materials', kota: 'Cibitung', sektor: 'Bahan Bangunan', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. KK Label', kota: 'Cikarang', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Nachindo Tape Industry', kota: 'Cikarang', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Yamatogomu Indonesia', kota: 'Karawang', sektor: 'Otomotif', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Sinar Niaga Sejahtera', kota: 'Purwakarta', sektor: 'Distribusi', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. KOIN Pratama', kota: 'Purwakarta', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Outdoor Footwear Network', kota: 'Purwakarta', sektor: 'Alas Kaki', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Handal Indonesia Motor', kota: 'Purwakarta', sektor: 'Otomotif', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'Badan Pendapatan Daerah (BAPENDA) Purwakarta', kota: 'Purwakarta', sektor: 'Instansi Pemerintah', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'Dinas Lingkungan Hidup Kab. Purwakarta', kota: 'Purwakarta', sektor: 'Instansi Pemerintah', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'Dinas Kesehatan Kab. Purwakarta', kota: 'Purwakarta', sektor: 'Instansi Pemerintah', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'Balai Riset Pemulihan Sumber Daya Ikan', kota: 'Purwakarta', sektor: 'Instansi Pemerintah', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'Perumnas Samesta Royal Campaka', kota: 'Purwakarta', sektor: 'Perumahan', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Asri Pelangi Nusa', kota: 'Purwakarta', sektor: 'Properti', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Skyline Taeho Indonesia', kota: 'Purwakarta', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'Energi Sumber Daya Manusia', kota: 'Purwakarta', sektor: 'Jasa', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'Cabang Dinas ESDM Wilayah III', kota: 'Purwakarta', sektor: 'Instansi Pemerintah', lini: 'KEBERSIHAN', layananT: ['Cleaning Service'] },
  { nama: 'Sekretariat DPRD Kab. Purwakarta', kota: 'Purwakarta', sektor: 'Instansi Pemerintah', lini: 'KEBERSIHAN', layananT: ['Cleaning Service'] },
  { nama: 'PT. Jesi Jason Surya Makmur', kota: 'Subang', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Samudera Sinergi Industri', kota: 'Subang', sektor: 'Industri', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Brantas Abipraya', kota: 'Subang', sektor: 'Konstruksi', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'PT. Jaya Huma Perkasa', kota: 'Subang', sektor: 'Konstruksi', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Pulau Intan Lestari', kota: 'Indramayu', sektor: 'Konstruksi', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'PT. Alkon Nusa Teknik Inti', kota: 'Cirebon', sektor: 'Teknik', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Aver Asia', kota: 'Kendal', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan'] },
  { nama: 'PT. Aver Asia', kota: 'Gresik', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
  { nama: 'PT. Sarana Kencana Mulya', kota: 'Jember', sektor: 'Manufaktur', lini: 'KEAMANAN', layananT: ['Pengamanan', 'Cleaning Service'] },
]
