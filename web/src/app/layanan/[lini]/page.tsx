import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { ambil, type Layanan } from '@/lib/api'
import { FOTO } from '@/lib/foto'
import { LINI_LAYANAN, liniDariSlug, slugDariLini } from '@/lib/navigasi'
import { buatMetadata, DataTerstruktur, ldRemah, mutlak } from '@/lib/seo'
import { AjakanBertindak, JudulBagian, KepalaHalaman } from '@/komponen/bagian'
import { Centang, IkonLayanan, Panah } from '@/komponen/ikon'

export const revalidate = 600

const RINCI: Record<string, { intro: string; foto: string; poin: { j: string; i: string }[] }> = {
  KEAMANAN: {
    intro:
      'Lini pengamanan adalah asal-usul Dharmapati. Pola kerjanya diwarisi langsung dari pengalaman pendiri kami sebagai Polisi Militer TNI AL: setiap objek dipetakan lebih dulu, dituangkan ke dalam Rencana Pengamanan, lalu diturunkan menjadi SOP yang dipegang tiap anggota di pos.',
    foto: FOTO.apel,
    poin: [
      { j: 'Anggota bersertifikat', i: 'Seluruh anggota telah mengikuti pelatihan Gada Pratama dan memiliki Kartu Tanda Anggota satuan pengamanan.' },
      { j: 'Dokumen kerja tertulis', i: 'RENPAM dan SOP disusun khusus per objek, bukan salinan dari lokasi lain.' },
      { j: 'Pengawasan berjenjang', i: 'Danru di lokasi, supervisor yang berkunjung rutin, dan manajer operasional di kantor pusat.' },
      { j: 'Pelaporan berkala', i: 'Buku mutasi harian, laporan kehadiran, dan rekap insiden bulanan diserahkan ke pengguna jasa.' },
    ],
  },
  KEBERSIHAN: {
    intro:
      'Mutu kebersihan biasanya bagus di bulan pertama lalu menurun. Kami mencegahnya dengan menghitung beban kerja per zona, menyusun jadwal harian sampai bulanan yang bisa diperiksa pengguna jasa, dan menerapkan pedoman 5R sebagai kebiasaan kerja.',
    foto: FOTO.bersihLobi,
    poin: [
      { j: 'Anggota APKLINDO', i: 'Terdaftar di Asosiasi Perusahaan Klining Servis Indonesia sejak 2023.' },
      { j: 'Bahan kimia sesuai permukaan', i: 'Pemilihan chemical disesuaikan jenis lantai, kaca, dan furnitur agar tidak merusak aset.' },
      { j: 'Ceklis area per shift', i: 'Setiap area ditandatangani petugas dan diperiksa supervisor kebersihan.' },
      { j: 'Pengendalian hama terjadwal', i: 'Inspeksi, kartu kendali per titik umpan, dan laporan kunjungan berkala.' },
    ],
  },
  TENAGA_KERJA: {
    intro:
      'Kami menyediakan tenaga kerja dengan alur rekrutmen yang sama ketatnya dengan penerimaan Satpam. Seluruh kewajiban ketenagakerjaan — upah, lembur, BPJS Ketenagakerjaan, dan BPJS Kesehatan — menjadi tanggung jawab kami sebagai pemberi kerja.',
    foto: FOTO.manpowerLini,
    poin: [
      { j: 'Izin KBLI 78200', i: 'Aktivitas Penyediaan Tenaga Kerja Waktu Tertentu, sehingga penempatan sah secara regulasi.' },
      { j: 'Seleksi berjenjang', i: 'Administrasi, wawancara, uji fisik, dan pemeriksaan kesehatan sebelum penempatan.' },
      { j: 'Administrasi penuh', i: 'Absensi, penggajian, lembur, dan kepesertaan BPJS dikelola kantor pusat.' },
      { j: 'Penggantian tenaga', i: 'Tenaga yang tidak sesuai kualifikasi diganti tanpa biaya tambahan.' },
    ],
  },
  PENDUKUNG: {
    intro:
      'Layanan pendukung melengkapi dua lini utama agar pengelolaan fasilitas Anda tuntas dalam satu kontrak — mulai dari perawatan lanskap dan pengaturan parkir sampai pelatihan satuan pengamanan internal perusahaan.',
    foto: FOTO.drillTongkat,
    poin: [
      { j: 'Pusdiklat sendiri', i: 'Pusat pendidikan dan pelatihan di Gantar, Kabupaten Indramayu.' },
      { j: 'Materi lengkap', i: 'Dari pengetahuan dasar Polri, PBB dan PPM, bela diri, drill damkar, sampai SMK-3 dasar.' },
      { j: 'Izin perparkiran & taman', i: 'KBLI 52215 dan 81300 untuk parkir di luar badan jalan dan perawatan taman.' },
      { j: 'Terhubung pos jaga', i: 'Pencatatan keluar-masuk kendaraan tersambung dengan anggota di pos.' },
    ],
  },
}

export async function generateStaticParams() {
  return LINI_LAYANAN.map((l) => ({ lini: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ lini: string }> }) {
  const { lini } = await params
  const l = liniDariSlug(lini)
  if (!l) return buatMetadata({ judul: 'Halaman tidak ditemukan', deskripsi: '', jalur: `/layanan/${lini}`, tanpaIndeks: true })
  return buatMetadata({
    judul: `Layanan ${l.label}`,
    deskripsi: RINCI[l.kunci].intro.slice(0, 180),
    jalur: `/layanan/${l.slug}`,
    kataKunci: [`jasa ${l.label.toLowerCase()}`, `${l.label.toLowerCase()} purwakarta`, `${l.label.toLowerCase()} karawang`],
  })
}

export default async function HalamanLini({ params }: { params: Promise<{ lini: string }> }) {
  const { lini } = await params
  const info = liniDariSlug(lini)

  // Alamat lama /layanan/<slug-layanan> dialihkan permanen ke struktur bersarang
  if (!info) {
    const layanan = await ambil<Layanan>(`/layanan/${lini}`)
    if (layanan) permanentRedirect(`/layanan/${slugDariLini(layanan.lini)}/${layanan.slug}`)
    notFound()
  }

  const semua = (await ambil<Layanan[]>('/layanan')) ?? []
  const isi = semua.filter((x) => x.lini === info.kunci)
  const r = RINCI[info.kunci]

  const remah = [
    { nama: 'Beranda', jalur: '/' },
    { nama: 'Layanan', jalur: '/layanan' },
    { nama: info.label, jalur: `/layanan/${info.slug}` },
  ]

  const ldDaftar = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Layanan ${info.label} — PT. Dharmapati Putra Nusantara`,
    itemListElement: isi.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.nama,
      url: mutlak(`/layanan/${info.slug}/${s.slug}`),
    })),
  }

  return (
    <>
      <DataTerstruktur data={ldRemah(remah)} />
      <DataTerstruktur data={ldDaftar} />

      <KepalaHalaman
        remah={remah}
        label={`Lini ${info.label}`}
        judul={`Layanan ${info.label}`}
        deskripsi={r.intro}
        anak={
          <nav aria-label="Lini lain" className="mt-8 flex flex-wrap gap-2">
            {LINI_LAYANAN.filter((x) => x.slug !== info.slug).map((x) => (
              <Link key={x.slug} href={`/layanan/${x.slug}`} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-200 transition hover:border-emas-400 hover:text-emas-300">
                {x.label}
              </Link>
            ))}
          </nav>
        }
      />

      <section className="py-16 sm:py-20">
        <div className="wadah">
          <JudulBagian label="Daftar layanan" judul={`${isi.length} layanan pada lini ini`} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {isi.map((s) => (
              <article key={s.id} className="kartu group relative flex flex-col">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-emas-400">
                  <IkonLayanan nama={s.ikon} className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-lg font-bold leading-snug">
                  <Link href={`/layanan/${info.slug}/${s.slug}`} className="after:absolute after:inset-0">{s.nama}</Link>
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.ringkasan}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {s.fitur.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
                      <Centang className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emas-500" />{f}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-800 transition group-hover:gap-3 group-hover:text-emas-600">
                  Rincian layanan <Panah className="h-4 w-4" />
                </span>
              </article>
            ))}
          </div>
          {!isi.length && <p className="py-10 text-center text-slate-400">Belum ada layanan pada lini ini.</p>}
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="wadah grid items-center gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image src={r.foto} alt={`Kegiatan lini ${info.label}`} fill sizes="(max-width:1024px) 80vw, 36vw" className="object-cover" />
          </div>
          <div>
            <JudulBagian label="Yang membedakan" judul={`Cara kami menjalankan lini ${info.label.toLowerCase()}`} />
            <div className="grid gap-4 sm:grid-cols-2">
              {r.poin.map((p) => (
                <div key={p.j} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-sm font-bold">{p.j}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.i}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AjakanBertindak />
    </>
  )
}
