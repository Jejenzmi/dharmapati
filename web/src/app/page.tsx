import Image from 'next/image'
import Link from 'next/link'
import { ambil, PENGATURAN_CADANGAN, type DataBeranda } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { NAMA_LINI, tanggalId } from '@/lib/format'
import { AjakanBertindak, JudulBagian, Statistik } from '@/komponen/bagian'
import { buatMetadata } from '@/lib/seo'
import { Berkas, Centang, IkonLayanan, Panah, Perisai, Peta, Titik, TopiWisuda } from '@/komponen/ikon'
import PetaKlien from '@/komponen/PetaKlien'

export const revalidate = 300

export const metadata = buatMetadata({
  judul: 'PT. Dharmapati Putra Nusantara — Jasa Pengamanan, Cleaning Service & Tenaga Kerja',
  deskripsi:
    'Perusahaan jasa pengamanan (Satpam), cleaning service, dan penyediaan tenaga kerja berizin SIO Polri, ABUJAPI, dan APKLINDO. Melayani industri, perkantoran, dan instansi pemerintah di Purwakarta, Karawang, Subang, Bekasi, Jakarta, hingga Jawa Timur.',
  jalur: '/',
  kataKunci: [
    'jasa keamanan purwakarta',
    'outsourcing satpam karawang',
    'perusahaan cleaning service purwakarta',
    'penyedia tenaga kerja subang',
    'jasa satpam bersertifikat abujapi',
    'security service jawa barat',
  ],
})

const PILAR = [
  {
    kunci: 'KEAMANAN',
    judul: 'Pengamanan',
    ikon: 'shield',
    isi: 'Satpam bersertifikat Gada Pratama, pengawalan VIP, dan pengamanan objek vital dengan RENPAM tertulis di setiap lokasi.',
    warna: 'from-emas-500/20 to-emas-500/0',
    tautan: '/layanan?lini=KEAMANAN',
  },
  {
    kunci: 'KEBERSIHAN',
    judul: 'Kebersihan',
    ikon: 'sparkles',
    isi: 'Cleaning service gedung, rumah sakit, dan kawasan industri dengan pedoman 5R serta pengendalian hama terjadwal.',
    warna: 'from-sky-400/20 to-sky-400/0',
    tautan: '/layanan?lini=KEBERSIHAN',
  },
  {
    kunci: 'TENAGA_KERJA',
    judul: 'Tenaga Kerja',
    ikon: 'users',
    isi: 'Manpower produksi, office boy, pramusaji, driver, dan operator forklift lengkap dengan pengelolaan BPJS dan upah.',
    warna: 'from-emerald-400/20 to-emerald-400/0',
    tautan: '/layanan?lini=TENAGA_KERJA',
  },
]

const METODE = [
  { no: '01', judul: 'Pemetaan area', isi: 'Survei objek untuk memetakan titik masuk, jalur kendaraan, area kritis, dan titik buta pengawasan.' },
  { no: '02', judul: 'Perumusan RENPAM', isi: 'Rencana Pengamanan disusun sesuai kerawanan objek, menentukan kekuatan personel dan pola jaga.' },
  { no: '03', judul: 'Penurunan ke SOP', isi: 'RENPAM diterjemahkan menjadi SOP praktis yang dipegang setiap anggota di pos, cukup ringkas untuk dihafal.' },
  { no: '04', judul: 'Pengawasan & evaluasi', isi: 'Danru, supervisor, dan manajer operasional mengawasi berjenjang; laporan bulanan menjadi bahan perbaikan.' },
]

const LEGAL_SINGKAT = [
  { label: 'SIO Polri', nilai: '532/I/SIO-POLRI/2023' },
  { label: 'ABUJAPI', nilai: '02846' },
  { label: 'APKLINDO', nilai: '00495/PWK/X/2023' },
  { label: 'ISO', nilai: '9001:2015' },
]

export default async function Beranda() {
  const data = await ambil<DataBeranda>('/beranda')
  const pengaturan = { ...PENGATURAN_CADANGAN, ...(data?.pengaturan ?? {}) }
  const klien = data?.klien ?? []
  const layanan = (data?.layanan ?? []).slice(0, 6)
  const artikel = data?.artikel ?? []
  const angka = data?.angka ?? { klien: 35, kota: 12, provinsi: 4 }
  const k = pengaturan.kontak

  const titikKantor = k
    ? [
        { nama: 'Kantor Pusat', jenis: 'Head Office', alamat: k.alamatKantor, ...k.petaKantor },
        { nama: 'Kantor Cabang', jenis: 'Branch Office', alamat: k.alamatCabang, ...k.petaCabang },
        { nama: 'Pusdiklat Dharmapati', jenis: 'Pusat Pendidikan & Pelatihan', alamat: k.alamatPusdiklat, ...k.petaPusdiklat },
      ]
    : []

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-emas-500/15 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[22rem] w-[22rem] rounded-full bg-blue-600/20 blur-[100px]" aria-hidden="true" />

        <div className="wadah relative grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="animate-naik">
            <span className="label-bagian-gelap">
              <Perisai className="h-3.5 w-3.5" /> Berizin SIO Polri · ABUJAPI · APKLINDO
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] !text-white sm:text-5xl lg:text-6xl">
              Pengabdian yang{' '}
              <span className="relative whitespace-nowrap text-emas-400">
                Tulus
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none" aria-hidden="true">
                  <path d="M2 7c40-5 90-6 196-3" stroke="#f5b301" strokeWidth="3" strokeLinecap="round" opacity=".7" />
                </svg>
              </span>{' '}
              dan Gagah Berani
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              PT. Dharmapati Putra Nusantara menyediakan dan mengelola tenaga pengamanan, cleaning service,
              serta tenaga kerja untuk industri, perkantoran, dan instansi pemerintah — dengan metode kerja
              yang lahir dari disiplin Polisi Militer.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/kontak" className="tombol-utama">
                Minta Penawaran <Panah className="h-4 w-4" />
              </Link>
              <Link href="/layanan" className="tombol-garis">Jelajahi Layanan</Link>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                'RENPAM & SOP disusun khusus tiap objek',
                'Anggota bersertifikat Gada Pratama',
                'Penggantian anggota maksimal 1x24 jam',
                'BPJS & upah dikelola penuh oleh kami',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative animate-naik [animation-delay:.15s]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/40 sm:aspect-[5/5]">
              <Image
                src={FOTO.hormat}
                alt="Anggota Satpam Dharmapati memberi penghormatan di lokasi penempatan"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-4 w-[62%] rounded-2xl border border-white/10 bg-navy-900/95 p-5 shadow-2xl backdrop-blur sm:-left-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emas-400">Jangkauan Penempatan</p>
              <p className="mt-2 font-judul text-3xl font-bold text-white">{angka.kota} kota</p>
              <p className="mt-1 text-xs text-slate-400">
                {angka.klien} objek aktif di {angka.provinsi} provinsi — Jawa Barat, DKI Jakarta, Jawa Tengah, dan Jawa Timur.
              </p>
            </div>

            <div className="absolute -right-3 top-6 hidden whitespace-nowrap rounded-2xl border border-emas-500/30 bg-navy-950/95 px-5 py-3.5 shadow-xl backdrop-blur lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emas-400">Berdiri sejak</p>
              <p className="font-judul text-2xl font-bold text-white">2016</p>
            </div>
          </div>
        </div>

        {/* Bilah legalitas */}
        <div className="relative border-t border-white/10 bg-navy-950/60">
          <div className="wadah grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
            {LEGAL_SINGKAT.map((l) => (
              <div key={l.label} className="px-4 py-5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emas-400">{l.label}</p>
                <p className="mt-1 truncate text-xs text-slate-400">{l.nilai}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Tiga pilar ---------- */}
      <section className="py-20 sm:py-24">
        <div className="wadah">
          <JudulBagian
            label="Tiga lini layanan"
            judul="Satu mitra untuk pengamanan, kebersihan, dan tenaga kerja"
            deskripsi="Menggabungkan tiga kebutuhan pada satu penyedia memangkas beban koordinasi Anda: satu kontrak, satu titik komunikasi, dan satu standar pengawasan."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {PILAR.map((p) => (
              <Link
                key={p.kunci}
                href={p.tautan}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1.5 hover:border-emas-300 hover:shadow-2xl hover:shadow-navy-900/10"
              >
                <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${p.warna}`} aria-hidden="true" />
                <div className="relative">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-950 text-emas-400">
                    <IkonLayanan nama={p.ikon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{p.judul}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.isi}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-800 transition group-hover:gap-3 group-hover:text-emas-600">
                    Lihat layanan <Panah className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Metode kerja ---------- */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
        <div className="wadah relative grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <JudulBagian
              gelap
              label="Cara kami bekerja"
              judul="Empat langkah yang membuat penjagaan terukur, bukan sekadar berjaga"
              deskripsi="Prinsip ini diwarisi dari pengalaman pendiri kami sebagai Polisi Militer TNI AL: pengamanan yang baik selalu dimulai dari dokumen, bukan dari jumlah orang."
            />
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={FOTO.pengarahan}
                alt="Pengarahan anggota sebelum bertugas di lokasi klien"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <ol className="space-y-4">
            {METODE.map((m) => (
              <li key={m.no} className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:border-emas-500/40 hover:bg-white/[.06]">
                <span className="font-judul text-3xl font-bold text-emas-500/60 transition group-hover:text-emas-400">{m.no}</span>
                <div>
                  <h3 className="text-lg font-bold !text-white">{m.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{m.isi}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Daftar layanan ---------- */}
      <section className="py-20 sm:py-24">
        <div className="wadah">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <JudulBagian
              label="Layanan"
              judul="Yang bisa kami kerjakan untuk objek Anda"
              deskripsi="Sembilan layanan yang saling menopang, dari pos jaga sampai perawatan taman."
            />
            <Link href="/layanan" className="tombol-navy mb-12 shrink-0">
              Semua Layanan <Panah className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {layanan.map((l) => (
              <Link key={l.id} href={`/layanan/${l.slug}`} className="kartu group flex flex-col">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emas-500/10 text-emas-600 transition group-hover:bg-emas-500 group-hover:text-navy-950">
                  <IkonLayanan nama={l.ikon} className="h-6 w-6" />
                </span>
                <span className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{NAMA_LINI[l.lini]}</span>
                <h3 className="mt-1.5 text-lg font-bold leading-snug">{l.nama}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{l.ringkasan}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-navy-800 transition group-hover:gap-3 group-hover:text-emas-600">
                  Rincian <Panah className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Peta jangkauan ---------- */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="wadah">
          <JudulBagian
            tengah
            label="Jangkauan kami"
            judul="Sebaran klien Dharmapati"
            deskripsi="Geser dan perbesar peta untuk melihat objek yang kami jaga dan kelola — dari kawasan industri Bekasi dan Cikarang, instansi pemerintah Purwakarta, sampai Kendal, Gresik, dan Jember."
          />

          <PetaKlien klien={klien} kantor={titikKantor} tinggi="520px" />

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { ikon: Titik, judul: `${angka.klien} objek`, isi: 'Instansi pemerintah, industri, pergudangan, perumahan, dan perhotelan.' },
              { ikon: Peta, judul: `${angka.kota} kota/kabupaten`, isi: 'Tersebar di Jawa Barat, DKI Jakarta, Jawa Tengah, dan Jawa Timur.' },
              { ikon: Berkas, judul: 'Satu standar', isi: 'RENPAM, SOP, dan pelaporan yang sama diterapkan di seluruh titik penempatan.' },
            ].map((s) => (
              <div key={s.judul} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6">
                <s.ikon className="h-6 w-6 shrink-0 text-emas-600" />
                <div>
                  <h3 className="text-base font-bold">{s.judul}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.isi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Pusdiklat ---------- */}
      <section className="py-20 sm:py-24">
        <div className="wadah grid items-center gap-14 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={FOTO.drillTongkat} alt="Latihan drill tongkat dan borgol anggota Dharmapati" fill sizes="(max-width:1024px) 45vw, 22vw" className="object-cover" />
            </div>
            <div className="mt-8 grid gap-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={FOTO.damkar} alt="Drill pemadam kebakaran di Pusdiklat Dharmapati" fill sizes="(max-width:1024px) 45vw, 22vw" className="object-cover" />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={FOTO.smk3} alt="Kelas SMK-3 dasar untuk anggota" fill sizes="(max-width:1024px) 45vw, 22vw" className="object-cover" />
              </div>
            </div>
          </div>

          <div>
            <JudulBagian
              label="Pusdiklat sendiri"
              judul="Anggota kami dilatih, bukan sekadar diberi seragam"
              deskripsi="Kami mengoperasikan pusat pendidikan dan pelatihan sendiri di Gantar, Kabupaten Indramayu. Setiap anggota melewati pembekalan sebelum diterjunkan, lalu mendapat penyegaran berkala selama masa penempatan."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { j: 'Pendidikan dasar', i: 'Ilmu pengetahuan dasar Polri, KAMTIBMAS, dan SISKAMLING.' },
                { j: 'Kesamaptaan', i: 'Bintal jasmani dan rohani, mental serta ideologi.' },
                { j: 'Tata tertib', i: 'PBB, PPM, penghormatan militer, dan tata upacara.' },
                { j: 'Keterampilan', i: 'Bela diri, drill tongkat dan borgol, damkar, serta SMK-3 dasar.' },
              ].map((b) => (
                <div key={b.j} className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <TopiWisuda className="h-4 w-4 text-emas-600" />
                    <h3 className="text-sm font-bold">{b.j}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{b.i}</p>
                </div>
              ))}
            </div>
            <Link href="/layanan/pelatihan-sertifikasi" className="tombol-navy mt-8">
              Pelatihan untuk perusahaan Anda <Panah className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Angka ---------- */}
      <section className="bg-navy-950 py-16">
        <div className="wadah">
          <Statistik
            angka={[
              { nilai: `${angka.klien}+`, label: 'Objek dikelola', keterangan: 'Industri, instansi, perumahan' },
              { nilai: `${angka.kota}`, label: 'Kota & kabupaten', keterangan: 'Jawa Barat hingga Jawa Timur' },
              { nilai: '9', label: 'Jenis layanan', keterangan: 'Tiga lini utama' },
              { nilai: '2016', label: 'Berdiri sejak', keterangan: 'Grup Dharmapati Utama Nusantara' },
            ]}
          />
        </div>
      </section>

      {/* ---------- Galeri sekilas ---------- */}
      <section className="py-20 sm:py-24">
        <div className="wadah">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <JudulBagian label="Dokumentasi" judul="Sekilas kegiatan di lapangan" />
            <Link href="/galeri" className="tombol-navy mb-12 shrink-0">Galeri Lengkap <Panah className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 lg:grid-cols-6">
          {[FOTO.apel, FOTO.bersihLantai, FOTO.supervisiLapangan, FOTO.pramusajiSaji, FOTO.belaDiri, FOTO.manpowerMesin].map((f, i) => (
            <div key={f} className="group relative aspect-square overflow-hidden rounded-xl">
              <Image src={f} alt={`Dokumentasi kegiatan Dharmapati ${i + 1}`} fill sizes="(max-width:640px) 50vw, 16vw" className="object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/25" />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Artikel ---------- */}
      {artikel.length > 0 && (
        <section className="bg-slate-50 py-20 sm:py-24">
          <div className="wadah">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <JudulBagian label="Wawasan" judul="Catatan dari lapangan" deskripsi="Panduan praktis seputar pengamanan objek dan pengelolaan kebersihan gedung." />
              <Link href="/artikel" className="tombol-navy mb-12 shrink-0">Semua Artikel <Panah className="h-4 w-4" /></Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {artikel.map((a) => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="kartu group flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emas-600">{a.kategori}</span>
                  <h3 className="mt-2 text-lg font-bold leading-snug transition group-hover:text-emas-700">{a.judul}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{a.ringkasan}</p>
                  <span className="mt-5 text-xs text-slate-400">{tanggalId(a.terbitAt)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AjakanBertindak />
    </>
  )
}
