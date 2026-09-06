import Image from 'next/image'
import Link from 'next/link'
import { Amplop, Jam, Telepon, Titik, Wa } from './ikon'
import type { Pengaturan } from '@/lib/api'

const TAUTAN = [
  {
    judul: 'Perusahaan',
    butir: [
      { label: 'Profil Perusahaan', jalur: '/tentang' },
      { label: 'Sejarah & Filosofi', jalur: '/tentang/sejarah' },
      { label: 'Visi & Misi', jalur: '/tentang/visi-misi' },
      { label: 'Struktur Organisasi', jalur: '/tentang/struktur-organisasi' },
      { label: 'Legalitas & Perizinan', jalur: '/legalitas' },
    ],
  },
  {
    judul: 'Layanan',
    butir: [
      { label: 'Jasa Pengamanan (Satpam)', jalur: '/layanan/pengamanan/jasa-pengamanan-satpam' },
      { label: 'Cleaning Service', jalur: '/layanan/kebersihan/cleaning-service' },
      { label: 'Manpower & Tenaga Produksi', jalur: '/layanan/tenaga-kerja/manpower-tenaga-produksi' },
      { label: 'Layanan Pendukung', jalur: '/layanan/pendukung' },
      { label: 'Semua Layanan', jalur: '/layanan' },
    ],
  },
  {
    judul: 'Informasi',
    butir: [
      { label: 'Klien & Jangkauan', jalur: '/klien' },
      { label: 'Galeri Kegiatan', jalur: '/galeri' },
      { label: 'Lowongan Kerja', jalur: '/karier' },
      { label: 'Proses Seleksi', jalur: '/karier/proses-seleksi' },
      { label: 'Artikel & Wawasan', jalur: '/artikel' },
      { label: 'Tanya Jawab', jalur: '/faq' },
      { label: 'Lokasi Kantor', jalur: '/kontak/lokasi' },
    ],
  },
]

export default function Kaki({ pengaturan }: { pengaturan: Pengaturan }) {
  const k = pengaturan.kontak
  const p = pengaturan.perusahaan
  const tahun = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emas-500/10 blur-3xl" aria-hidden="true" />

      <div className="wadah relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <Image src="/merek/logo-192.png" alt="Logo Dharmapati" width={52} height={60} className="h-14 w-auto" />
              <span className="leading-tight">
                <span className="block font-judul text-lg font-bold text-white">DHARMAPATI</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-emas-400">Putra Nusantara</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-slate-400">
              {p?.slogan}
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <Titik className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                <span className="text-slate-400">{k?.alamatKantor}</span>
              </li>
              <li className="flex gap-3">
                <Amplop className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                <a href={`mailto:${k?.email}`} className="text-slate-400 transition hover:text-white">{k?.email}</a>
              </li>
              <li className="flex gap-3">
                <Telepon className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                <span className="flex flex-wrap gap-x-2 text-slate-400">
                  {k?.telepon?.map((t, i) => (
                    <a key={t} href={`tel:${t}`} className="transition hover:text-white">
                      {t}{i < (k.telepon.length - 1) ? ' ·' : ''}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Jam className="mt-0.5 h-4 w-4 shrink-0 text-emas-400" />
                <span className="text-slate-400">{k?.jamKerja}</span>
              </li>
            </ul>
          </div>

          {TAUTAN.map((kolom) => (
            <div key={kolom.judul}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-emas-400">{kolom.judul}</h2>
              <ul className="space-y-2.5 text-sm">
                {kolom.butir.map((b) => (
                  <li key={b.jalur}>
                    <Link href={b.jalur} className="text-slate-400 transition hover:text-white">{b.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emas-400">Kantor Cabang</p>
            <p className="text-sm text-slate-400">{k?.alamatCabang}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emas-400">Pusdiklat</p>
            <p className="text-sm text-slate-400">{k?.alamatPusdiklat}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {tahun} {p?.nama}. Seluruh hak cipta dilindungi.</span>
            <Link href="/kebijakan-privasi" className="text-slate-400 transition hover:text-white">
              Kebijakan Privasi
            </Link>
          </p>
          <p className="flex items-center gap-4">
            <span>NPWP 94.187.081.8-409.000</span>
            <a
              href={`https://wa.me/${k?.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 transition hover:text-emerald-300"
            >
              <Wa className="h-3.5 w-3.5" /> Chat WhatsApp
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
