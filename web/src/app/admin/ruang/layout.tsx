import Kerangka from '@/komponen/admin/Kerangka'
import { PenyediaPanel } from '@/komponen/admin/Panel'

export const metadata = { title: 'Panel Admin', robots: { index: false, follow: false } }


export default function TataLetakRuang({ children }: { children: React.ReactNode }) {
  return (
    <PenyediaPanel>
      <Kerangka>{children}</Kerangka>
    </PenyediaPanel>
  )
}
