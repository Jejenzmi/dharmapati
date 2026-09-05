import Image from 'next/image'
import Link from 'next/link'
import { ambil, ambilPengaturan, type Lowongan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { tanggalId } from '@/lib/format'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Centang, Panah, Titik } from '@/komponen/ikon'
import FormulirLamaran from '@/komponen/FormulirLamaran'

export const revalidate = 300

export const metadata = buatMetadata({
  judul: 'Karier — Lowongan Satpam, Cleaning Service & Tenaga Kerja',
  deskripsi:
    'Lowongan kerja di PT. Dharmapati Putra Nusantara: anggota Satpam, petugas cleaning service, operator forklift, dan tenaga produksi. Proses seleksi gratis, tanpa biaya apa pun.',
  jalur: '/karier',
  gambar: FOTO.pelepasan,
  kataKunci: ['lowongan satpam purwakarta', 'loker cleaning service karawang', 'lowongan operator forklift cikarang'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Karier', jalur: '/karier' }]

export default async function HalamanKarier() {
  const [lowongan, pengaturan] = await Promise.all([ambil<Lowongan[]>('/lowongan'), ambilPengaturan()])
  const daftar = lowongan ?? []
  const r = pengaturan.rekrutmen

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Karier"
        judul="Bergabung menjadi kader Dharmapati"
        deskripsi="Kami merekrut, melatih, dan menempatkan. Seluruh tahapan seleksi tidak dipungut biaya — waspadai pihak yang mengatasnamakan perusahaan kami."
      />

      {/* Lowongan */}
      <section className="py-16 sm:py-20">
        <div className="wadah">
          <JudulBagian label="Lowongan terbuka" judul="Posisi yang sedang kami cari" />
          <div className="grid gap-5 lg:grid-cols-2">
            {daftar.map((l) => (
              <article key={l.id} className="group relative rounded-3xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-emas-300 hover:shadow-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-navy-950 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{l.tipe}</span>
                  <span className="rounded-full bg-emas-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emas-700">Kuota {l.kuota}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  <Link href={`/karier/${l.slug}`} className="relative after:absolute after:inset-0">{l.posisi}</Link>
                </h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500"><Titik className="h-4 w-4" />{l.lokasi}</p>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{l.deskripsi}</p>
                <p className="mt-5 flex items-center justify-between text-xs text-slate-400">
                  <span>Dibuka {tanggalId(l.dibuatAt, false)}</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-navy-800 transition group-hover:gap-2.5 group-hover:text-emas-600">
                    Lihat syarat <Panah className="h-3.5 w-3.5" />
                  </span>
                </p>
              </article>
            ))}
          </div>
          {!daftar.length && (
            <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              Belum ada lowongan terbuka saat ini. Anda tetap dapat mengirim lamaran umum melalui formulir di bawah.
            </p>
          )}
        </div>
      </section>

      {/* Tahapan seleksi */}
      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
        <div className="wadah relative">
          <JudulBagian gelap tengah label="Proses seleksi" judul="Enam tahap sebelum penempatan" deskripsi="Setiap calon anggota melewati tahapan yang sama, tanpa terkecuali." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(r?.tahapan ?? []).map((t, i) => (
              <div key={t.judul} className="rounded-2xl border border-white/10 bg-white/[.04] p-6">
                <span className="font-judul text-2xl font-bold text-emas-500/70">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-base font-bold !text-white">{t.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.isi}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[FOTO.seleksiBaris, FOTO.wawancara, FOTO.ukurTinggi, FOTO.cekKesehatan, FOTO.kelas, FOTO.pelepasan].map((f, i) => (
              <div key={f} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={f} alt={`Tahapan seleksi ${i + 1}`} fill sizes="(max-width:640px) 100vw, 16vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kriteria + formulir */}
      <section className="py-16 sm:py-20">
        <div className="wadah grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <JudulBagian label="Kriteria umum" judul="Persyaratan calon anggota" />
            <ul className="space-y-2.5">
              {(r?.kriteria ?? []).map((k) => (
                <li key={k} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Centang className="mt-0.5 h-4 w-4 shrink-0 text-emas-600" />{k}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-sm font-bold text-amber-900">Perhatian</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-amber-800">
                Seluruh proses rekrutmen Dharmapati <strong>tidak dipungut biaya</strong>. Kami tidak pernah
                meminta transfer uang untuk seragam, pelatihan, atau penempatan.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-navy-900/5">
            <h2 className="text-xl font-bold">Kirim lamaran</h2>
            <p className="mb-6 mt-1.5 text-sm text-slate-600">Isi data diri Anda dan lampirkan berkas lamaran.</p>
            <FormulirLamaran />
          </div>
        </div>
      </section>
    </>
  )
}
