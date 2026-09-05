import Image from 'next/image'
import Link from 'next/link'
import { ambil, ambilPengaturan, type Personel } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { buatMetadata, DataTerstruktur, ldRemah } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Centang, Gedung, Panah, Perisai, Titik } from '@/komponen/ikon'

export const revalidate = 600

export const metadata = buatMetadata({
  judul: 'Tentang Kami — Sejarah, Visi Misi & Struktur Organisasi',
  deskripsi:
    'Profil PT. Dharmapati Putra Nusantara: sejarah sejak 2016, filosofi lambang kuda, visi misi, biografi Direktur Utama purnawirawan Polisi Militer TNI AL, dan struktur organisasi perusahaan.',
  jalur: '/tentang',
  kataKunci: ['profil dharmapati', 'perusahaan jasa pengamanan purwakarta', 'sejarah dharmapati putra nusantara'],
})

const REMAH = [{ nama: 'Beranda', jalur: '/' }, { nama: 'Tentang Kami', jalur: '/tentang' }]

export default async function Tentang() {
  const [pengaturan, personel] = await Promise.all([
    ambilPengaturan(),
    ambil<Personel[]>('/personel'),
  ])
  const s = pengaturan.sejarah
  const v = pengaturan.visiMisi
  const d = pengaturan.direktur
  const orang = personel ?? []
  const tingkat = (n: number) => orang.filter((o) => o.tingkat === n)

  return (
    <>
      <DataTerstruktur data={ldRemah(REMAH)} />

      <KepalaHalaman
        remah={REMAH}
        label="Tentang kami"
        judul="Perusahaan jasa pengamanan dan pengelolaan tenaga kerja yang lahir dari disiplin militer"
        deskripsi="Berdiri sejak 2016 di Purwakarta, tumbuh menjadi penyedia tenaga pengamanan, kebersihan, dan tenaga kerja untuk industri serta instansi pemerintah di empat provinsi."
      />

      {/* Filosofi & sejarah */}
      <section className="py-20 sm:py-24">
        <div className="wadah grid items-start gap-14 lg:grid-cols-[1fr_.85fr]">
          <div>
            <JudulBagian label="Filosofi" judul="Mengapa kuda menjadi lambang kami" />
            <div className="prosa">
              <p>{s?.filosofi}</p>
              <p className="rounded-2xl border-l-4 border-emas-500 bg-emas-50/60 px-6 py-5 font-judul text-lg font-bold text-navy-900">
                {s?.arti}
              </p>
              <p>{s?.hubunganInduk}</p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-6">
                <Gedung className="mb-3 h-6 w-6 text-emas-600" />
                <h3 className="text-base font-bold">Kantor Pusat</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pengaturan.kontak?.alamatKantor}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-6">
                <Titik className="mb-3 h-6 w-6 text-emas-600" />
                <h3 className="text-base font-bold">Pusdiklat</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pengaturan.kontak?.alamatPusdiklat}</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/10">
              <Image src={FOTO.kantor} alt="Kantor pusat PT. Dharmapati Putra Nusantara di Purwakarta" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-navy-950 px-6 py-5 text-white shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emas-400">Berdiri</p>
              <p className="font-judul text-3xl font-bold">2016</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tonggak sejarah */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-halus opacity-60" aria-hidden="true" />
        <div className="wadah relative">
          <JudulBagian gelap tengah label="Perjalanan" judul="Tonggak penting perusahaan" />
          <ol className="relative mx-auto max-w-3xl border-l border-white/15 pl-8">
            {(s?.tonggak ?? []).map((t) => (
              <li key={t.tahun} className="relative mb-10 last:mb-0">
                <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-emas-500 bg-navy-950">
                  <span className="h-2 w-2 rounded-full bg-emas-500" />
                </span>
                <span className="font-judul text-2xl font-bold text-emas-400">{t.tahun}</span>
                <h3 className="mt-1 text-lg font-bold !text-white">{t.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t.isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Direktur */}
      <section className="py-20 sm:py-24">
        <div className="wadah grid items-center gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl bg-navy-950">
            <Image src={FOTO.direktur} alt={`${d?.nama}, ${d?.jabatan} PT. Dharmapati Putra Nusantara`} fill sizes="(max-width:1024px) 80vw, 32vw" className="object-cover object-top" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 to-transparent p-6 pt-16">
              <p className="font-judul text-xl font-bold text-white">{d?.nama}</p>
              <p className="text-sm text-emas-400">{d?.jabatan}</p>
            </div>
          </div>
          <div>
            <JudulBagian label="Sambutan direktur" judul="“Pengamanan yang baik dimulai dari dokumen, bukan dari jumlah orang”" />
            <div className="prosa">
              {(d?.paragraf ?? []).map((p) => <p key={p.slice(0, 28)}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      {/* Visi misi */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="wadah">
          <JudulBagian tengah label="Arah perusahaan" judul="Visi, misi, dan pedoman kerja" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="label-bagian"><Perisai className="h-3.5 w-3.5" /> Lini pengamanan</span>
              <h3 className="mt-5 text-lg font-bold">Visi</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v?.visiKeamanan}</p>
              <h3 className="mt-6 text-lg font-bold">Misi</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v?.misiKeamanan}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <span className="label-bagian">Lini fasilitas &amp; tenaga kerja</span>
              <h3 className="mt-5 text-lg font-bold">Visi</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v?.visiFasilitas}</p>
              <h3 className="mt-6 text-lg font-bold">Misi</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v?.misiFasilitas}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-navy-950 p-8 text-white">
              <h3 className="text-lg font-bold !text-white">Sikap Dharmapati</h3>
              <p className="mt-2 text-sm text-slate-400">Empat sikap yang ditanamkan sejak pembekalan.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {(pengaturan.perusahaan?.sikap ?? []).map((x) => (
                  <li key={x} className="rounded-full bg-emas-500/15 px-4 py-1.5 text-sm font-bold text-emas-300">{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <h3 className="text-lg font-bold">Pedoman 5R</h3>
              <ul className="mt-4 space-y-2">
                {(v?.pedoman5R ?? []).map((x) => (
                  <li key={x} className="flex items-center gap-2 text-sm text-slate-600"><Centang className="h-4 w-4 text-emas-600" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <h3 className="text-lg font-bold">Pedoman 5 DM</h3>
              <ul className="mt-4 space-y-2">
                {(v?.pedoman5DM ?? []).map((x) => (
                  <li key={x} className="flex items-center gap-2 text-sm text-slate-600"><Centang className="h-4 w-4 text-emas-600" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur organisasi */}
      {orang.length > 0 && (
        <section className="py-20 sm:py-24">
          <div className="wadah">
            <JudulBagian tengah label="Struktur organisasi" judul="Orang-orang di balik Dharmapati" deskripsi="Pengawasan berjenjang memastikan setiap penempatan punya penanggung jawab yang jelas." />

            <div className="space-y-8">
              {[
                { n: 1, l: 'Dewan & Direksi' },
                { n: 2, l: 'Penasehat' },
                { n: 3, l: 'Manajemen Senior' },
                { n: 4, l: 'Manajer' },
                { n: 5, l: 'Staf' },
              ].map((lapis) => {
                const isi = tingkat(lapis.n)
                if (!isi.length) return null
                return (
                  <div key={lapis.n}>
                    <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{lapis.l}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {isi.map((o) => (
                        <div key={o.id} className="w-full max-w-[220px] rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-emas-300 hover:shadow-lg">
                          <p className="text-sm font-bold text-navy-900">{o.nama}</p>
                          <p className="mt-1 text-xs text-emas-700">{o.jabatan}</p>
                          {o.bio && <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{o.bio}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <Link href="/legalitas" className="tombol-navy">Lihat legalitas perusahaan <Panah className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      )}

      <AjakanBertindak />
    </>
  )
}
