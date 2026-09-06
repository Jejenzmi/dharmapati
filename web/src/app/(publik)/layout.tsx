import Kepala from '@/komponen/Kepala'
import Kaki from '@/komponen/Kaki'
import TombolWa from '@/komponen/TombolWa'
import { ambilPengaturan } from '@/lib/api'
import { DataTerstruktur, ldOrganisasi, ldSitus } from '@/lib/seo'

/** Kerangka situs publik: bilah navigasi, isi, kaki halaman, dan tombol WhatsApp. */
export default async function TataLetakPublik({ children }: { children: React.ReactNode }) {
  const pengaturan = await ambilPengaturan()
  const telepon = pengaturan.kontak?.telepon?.[0] ?? '087777889158'
  const whatsapp = pengaturan.kontak?.whatsapp ?? '6287777889158'

  return (
    <>
      <DataTerstruktur data={ldOrganisasi(pengaturan)} />
      <DataTerstruktur data={ldSitus()} />
      <a
        href="#isi"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-lg focus:bg-emas-500 focus:px-4 focus:py-2 focus:font-bold focus:text-navy-950"
      >
        Lompat ke konten utama
      </a>
      <Kepala telepon={telepon} whatsapp={whatsapp} />
      <main id="isi" className="isi-publik flex-1">{children}</main>
      <Kaki pengaturan={pengaturan} />
      <TombolWa nomor={whatsapp} />
    </>
  )
}
