import Link from 'next/link'
import { ambil, type Legalitas } from '@/lib/api'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Berkas, Centang, Panah, Perisai } from '@/komponen/ikon'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Dokumen Legalitas Perusahaan',
  deskripsi:
    'Dokumen legalitas PT. Dharmapati Putra Nusantara: akta pendirian, pengesahan AHU, NPWP, NIB, SKDP, SPPKP, Surat Izin Operasional Polri, keanggotaan ABUJAPI dan APKLINDO, serta sertifikat ISO 9001:2015.',
  jalur: '/legalitas',
  kataKunci: ['legalitas perusahaan keamanan', 'sio polri jasa pengamanan', 'izin abujapi apklindo', 'perusahaan satpam berizin'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Legalitas', jalur: '/legalitas' }]
const SAUDARA = MENU.find((m) => m.label === 'Legalitas')!.anak!

const JAMINAN = [
  { judul: 'Izin operasional Polri', isi: 'Penempatan anggota Satpam dilakukan di bawah Surat Izin Operasional yang diterbitkan Kepolisian Negara Republik Indonesia.' },
  { judul: 'Terdaftar di asosiasi', isi: 'Anggota ABUJAPI untuk lini pengamanan dan APKLINDO untuk lini cleaning service.' },
  { judul: 'Pengusaha Kena Pajak', isi: 'Berstatus PKP sehingga penagihan dapat disertai faktur pajak sesuai ketentuan.' },
  { judul: 'Sistem mutu ISO 9001:2015', isi: 'Prosedur kerja, pencatatan, dan evaluasi mengacu pada sistem manajemen mutu.' },
]

export default async function DokumenLegalitas() {
  const data = await ambil<{ legalitas: Legalitas[] }>('/legalitas')
  const legalitas = data?.legalitas ?? []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Legalitas"
        judul="Perizinan lengkap, penempatan yang sah"
        deskripsi="Menggunakan penyedia jasa berizin melindungi pengguna jasa dari risiko ketenagakerjaan dan sengketa hukum. Berikut dokumen yang kami pegang."
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {JAMINAN.map((j) => (
              <div key={j.judul} className="rounded-2xl border border-slate-200 bg-white p-6">
                <Perisai className="mb-4 h-6 w-6 text-emas-600" />
                <h2 className="text-base font-bold leading-snug">{j.judul}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{j.isi}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <JudulBagian label="Dokumen" judul="Daftar legalitas perusahaan" />
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Daftar dokumen legalitas PT. Dharmapati Putra Nusantara</caption>
                  <thead className="bg-navy-950 text-white">
                    <tr>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Dokumen</th>
                      <th scope="col" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Nomor / Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {legalitas.map((l) => (
                      <tr key={l.id} className="transition hover:bg-emas-50/50">
                        <th scope="row" className="whitespace-nowrap px-5 py-4 align-top font-bold text-navy-900">{l.label}</th>
                        <td className="px-5 py-4 text-slate-600">
                          <span className="block font-medium text-slate-800">{l.nomor}</span>
                          {l.penerbit && <span className="block text-xs text-slate-500">{l.penerbit}</span>}
                          {l.tanggal && <span className="block text-xs text-slate-500">Tanggal {l.tanggal}</span>}
                        </td>
                      </tr>
                    ))}
                    {!legalitas.length && (
                      <tr><td colSpan={2} className="px-5 py-10 text-center text-slate-400">Data legalitas belum tersedia.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Salinan dokumen dapat kami kirimkan atas permintaan resmi calon pengguna jasa pada tahap penawaran.
              </p>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-navy-950 p-7 text-white">
                <Berkas className="mb-4 h-6 w-6 text-emas-400" />
                <h2 className="text-base font-bold !text-white">Butuh berkas untuk proses tender?</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Kami terbiasa melengkapi dokumen kualifikasi pengadaan barang/jasa pemerintah maupun swasta:
                  akta, NIB, NPWP, SPPKP, SIO, sertifikat asosiasi, hingga bukti pengalaman kerja sejenis.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {['Dokumen administrasi lengkap', 'Referensi pengalaman kerja', 'Bukti kepesertaan BPJS'].map((x) => (
                    <li key={x} className="flex items-center gap-2"><Centang className="h-4 w-4 text-emas-400" />{x}</li>
                  ))}
                </ul>
                <Link href="/kontak" className="tombol-utama mt-6 w-full">Minta Berkas <Panah className="h-4 w-4" /></Link>
              </div>

              <div className="rounded-3xl border border-slate-200 p-7">
                <h2 className="text-base font-bold">Bidang usaha kami</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Tujuh kode KBLI yang kami pegang menentukan pekerjaan apa saja yang boleh kami kerjakan
                  secara sah.
                </p>
                <Link href="/legalitas/bidang-usaha" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-emas-600">
                  Lihat daftar KBLI <Panah className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/legalitas" />
      <AjakanBertindak
        judul="Butuh salinan dokumen legalitas?"
        deskripsi="Sampaikan keperluan Anda — untuk kualifikasi tender, verifikasi vendor, atau audit kepatuhan — dan kami siapkan berkasnya."
      />
    </>
  )
}
