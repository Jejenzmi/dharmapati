import Link from 'next/link'
import { ambil, type Faq } from '@/lib/api'
import { buatMetadata, DataTerstruktur, ldFaq, ldRemah } from '@/lib/seo'
import { AjakanBertindak, KepalaHalaman } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'

export const revalidate = 3600

export const metadata = buatMetadata({
  judul: 'Tanya Jawab Seputar Jasa Pengamanan & Cleaning Service',
  deskripsi:
    'Pertanyaan yang sering diajukan calon pengguna jasa: lama proses penempatan, sertifikasi anggota, penggantian personel, pengelolaan BPJS dan upah, serta cara mendapatkan penawaran harga.',
  jalur: '/faq',
  kataKunci: ['faq jasa keamanan', 'cara sewa satpam', 'biaya outsourcing satpam'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Tanya Jawab', jalur: '/faq' }]

export default async function HalamanFaq() {
  const daftar = (await ambil<Faq[]>('/faq')) ?? []
  const kategori = Array.from(new Set(daftar.map((f) => f.kategori)))

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />
      {daftar.length > 0 && <DataTerstruktur data={ldFaq(daftar)} />}

      <KepalaHalaman
        remah={REMAH}
        label="Tanya jawab"
        judul="Pertanyaan yang paling sering kami terima"
        deskripsi="Bila jawaban yang Anda cari belum ada di sini, hubungi kami langsung — kami balas maksimal 1x24 jam kerja."
      />

      <section className="py-20 sm:py-24">
        <div className="wadah max-w-4xl">
          {kategori.map((kat) => (
            <div key={kat} className="mb-12 last:mb-0">
              <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-emas-600">{kat}</h2>
              <div className="space-y-3">
                {daftar.filter((f) => f.kategori === kat).map((f) => (
                  <details key={f.id} className="group rounded-2xl border border-slate-200 bg-white transition hover:border-emas-300 open:border-emas-300 open:shadow-lg">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-[15px] font-bold text-navy-900 marker:content-['']">
                      {f.tanya}
                      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 transition group-open:rotate-45 group-open:bg-emas-500">
                        <span className="absolute h-3 w-0.5 rounded bg-navy-900" />
                        <span className="absolute h-0.5 w-3 rounded bg-navy-900" />
                      </span>
                    </summary>
                    <p className="border-t border-slate-100 px-6 py-5 text-sm leading-relaxed text-slate-600">{f.jawab}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {!daftar.length && (
            <p className="rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
              Daftar tanya jawab belum tersedia.
            </p>
          )}

          <div className="mt-12 rounded-3xl bg-slate-50 p-8 text-center">
            <h2 className="text-xl font-bold">Masih ada yang ingin ditanyakan?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600">
              Kirim pertanyaan Anda melalui formulir kontak, atau langsung hubungi kantor kami di Purwakarta.
            </p>
            <Link href="/kontak" className="tombol-utama mt-6">Hubungi Kami <Panah className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
