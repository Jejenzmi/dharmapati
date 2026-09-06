# Situs PT. Dharmapati Putra Nusantara

Situs perusahaan penyedia jasa pengamanan (Satpam), cleaning service, dan pengelolaan
tenaga kerja — lengkap dengan peta sebaran klien interaktif dan panel admin.

**Produksi:** https://dharmapati.co.id

## Tumpukan teknologi

| Lapisan | Teknologi |
| --- | --- |
| Antarmuka | Next.js 16 (App Router) · React 19 · Tailwind CSS · Leaflet |
| API | Node.js · Express · TypeScript · Zod |
| Basis data | PostgreSQL 16 · Prisma ORM |
| Singgahan | Redis 7 |
| Penyimpanan berkas | MinIO (kompatibel S3) |
| Peladen web | Nginx + Let's Encrypt |

## Struktur

```
backend/    API Express + Prisma (skema, penanaman data, rute publik & admin)
web/        Situs Next.js (halaman publik, peta Leaflet, panel admin)
deploy/     Docker Compose produksi, konfigurasi Nginx, skrip kirim & TLS
```

## Menjalankan secara lokal

```bash
# 1. Infrastruktur (PostgreSQL 5490, Redis 6430, MinIO 9070/9071)
docker compose up -d

# 2. API — http://localhost:5041
cd backend
npm install
npx prisma db push
npm run seed
npm run dev

# 3. Situs — http://localhost:5194
cd ../web
npm install
npm run dev
```

Panel admin ada di `/admin` (bawaan: `admin` / `admin123` — ganti setelah pemasangan).

## Fitur utama

- **Peta sebaran klien** — Leaflet dengan penyaring lini layanan, provinsi, pencarian,
  daftar bersinkron, serta penanda kantor pusat, cabang, dan Pusdiklat.
- **SEO** — metadata per halaman, `sitemap.xml` dinamis, `robots.txt`, kanonikal,
  Open Graph/Twitter Card, dan data terstruktur JSON-LD (Organization, LocalBusiness,
  Service, Article, JobPosting, FAQPage, BreadcrumbList).
- **Panel admin** — CRUD untuk layanan, klien, artikel, lowongan, galeri, legalitas,
  KBLI, struktur organisasi, testimoni, tanya jawab; kotak masuk pesan dan lamaran;
  unggah berkas ke MinIO; pembersihan singgahan.
- **Formulir** — permintaan penawaran dan lamaran kerja dengan pembatasan laju,
  validasi Zod, dan penyaring bot.
- **Kinerja** — ISR Next.js, singgahan Redis di sisi API, gambar dioptimalkan.

## Penempatan (deployment)

```bash
./deploy/kirim.sh            # bangun ulang API dan situs
./deploy/kirim.sh web        # hanya situs
./deploy/kirim.sh api        # hanya API

# Setelah DNS dharmapati.co.id mengarah ke VPS, terbitkan sertifikat
ssh root@76.13.197.249 'bash /root/dharmapati/deploy/aktifkan-tls.sh'
```

### Mengapa skrip kirim membersihkan singgahan lebih dulu

Next.js memanggang isi basis data ke dalam halaman saat prarender. Ada dua lapis
singgahan yang bisa membuat hasil build membawa data usang:

1. **Redis di sisi API** menyimpan jawaban selama 5 menit. Perubahan yang ditulis
   langsung ke basis data (lewat `psql`, bukan panel admin) tidak membatalkannya.
2. **Lapisan build Docker.** Bila berkas sumber tidak berubah, Docker memakai
   lapisan lama — termasuk halaman prarender beserta datanya.

`kirim.sh` menangani keduanya: membersihkan Redis sebelum membangun, lalu
mengoper `PENANDA_BANGUN` berisi cap waktu sehingga langkah `npm run build`
selalu dijalankan ulang. Tahap `npm ci` tetap tersinggah, jadi pembangunan tidak
menjadi lambat.

Perubahan lewat panel admin tidak memerlukan pembangunan ulang: panel sudah
membersihkan singgahan Redis sendiri, dan halaman menyegar sendiri dalam waktu
paling lama 5 menit lewat ISR.

Salin `deploy/.env.contoh` menjadi `deploy/.env` di server dan isi kata sandi
basis data, MinIO, JWT, serta akun admin sebelum menjalankan `docker compose`.

## Sumber konten

Teks, data legalitas, daftar klien, struktur organisasi, dan foto berasal dari
company profile resmi perusahaan (edisi pengamanan dan cleaning service).
