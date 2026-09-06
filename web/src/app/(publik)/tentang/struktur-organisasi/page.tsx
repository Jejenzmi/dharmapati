import Image from 'next/image'
import Link from 'next/link'
import { ambil, type Personel } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { MENU } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman, TautanSaudara } from '@/komponen/bagian'
import { Panah } from '@/komponen/ikon'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Struktur Organisasi',
  deskripsi:
    'Struktur organisasi PT. Dharmapati Putra Nusantara: komisaris, direktur utama, penasehat, senior manager, kepala cabang, manajer operasional, HRD, keuangan, marketing, beserta staf pendukungnya.',
  jalur: '/tentang/struktur-organisasi',
  kataKunci: ['struktur organisasi dharmapati', 'manajemen perusahaan keamanan'],
})

const REMAH = [
  { nama: 'Beranda', jalur: '/' },
  { nama: 'Tentang Kami', jalur: '/tentang' },
  { nama: 'Struktur Organisasi', jalur: '/tentang/struktur-organisasi' },
]
const SAUDARA = MENU.find((m) => m.label === 'Tentang')!.anak!

const LAPIS = [
  { n: 1, l: 'Dewan & Direksi' },
  { n: 2, l: 'Penasehat' },
  { n: 3, l: 'Manajemen Senior' },
  { n: 4, l: 'Manajer' },
  { n: 5, l: 'Staf' },
]

export default async function StrukturOrganisasi() {
  const orang = (await ambil<Personel[]>('/personel')) ?? []

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Struktur organisasi"
        judul="Orang-orang di balik Dharmapati"
        deskripsi="Pengawasan berjenjang memastikan setiap penempatan punya penanggung jawab yang jelas — dari Danru di pos, supervisor lapangan, sampai manajer operasional di kantor."
      />

      <section className="py-20 sm:py-24">
        <div className="wadah">
          <div className="space-y-10">
            {LAPIS.map((lapis) => {
              const isi = orang.filter((o) => o.tingkat === lapis.n)
              if (!isi.length) return null
              return (
                <div key={lapis.n}>
                  <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    {lapis.l}
                    <span className="h-px flex-1 bg-slate-200" />
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {isi.map((o) => (
                      <article key={o.id} className="w-full max-w-[230px] rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-emas-300 hover:shadow-lg">
                        {o.foto && (
                          <span className="mx-auto mb-3 block h-16 w-16 overflow-hidden rounded-full ring-2 ring-emas-500/30">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={o.foto} alt={o.nama} className="h-full w-full object-cover" />
                          </span>
                        )}
                        <h2 className="text-sm font-bold text-navy-900">{o.nama}</h2>
                        <p className="mt-1 text-xs font-semibold text-emas-700">{o.jabatan}</p>
                        {o.bio && <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{o.bio}</p>}
                      </article>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {!orang.length && (
            <p className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              Data struktur organisasi belum tersedia.
            </p>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="wadah grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {[FOTO.staf1, FOTO.staf2, FOTO.staf3, FOTO.staf4].map((f, i) => (
              <div key={f} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image src={f} alt={`Staf kantor Dharmapati ${i + 1}`} fill sizes="(max-width:1024px) 45vw, 22vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div>
            <JudulBagian label="Di kantor" judul="Tim pendukung yang memastikan penempatan berjalan" deskripsi="Administrasi kontrak, absensi, penggajian, BPJS, hingga penyiapan seragam dan perlengkapan dikerjakan tim kantor pusat di Purwakarta." />
            <Link href="/kontak" className="tombol-navy">Hubungi tim kami <Panah className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <TautanSaudara butir={SAUDARA} jalurKini="/tentang/struktur-organisasi" />
      <AjakanBertindak />
    </>
  )
}
