import Kerangka from '@/komponen/admin/Kerangka'

export const metadata = { title: 'Panel Admin', robots: { index: false, follow: false } }


export default function TataLetakRuang({ children }: { children: React.ReactNode }) {
  return <Kerangka>{children}</Kerangka>
}
