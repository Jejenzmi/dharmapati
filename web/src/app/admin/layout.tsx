import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Admin',
  robots: { index: false, follow: false, nocache: true },
}

export default function TataLetakAdmin({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100">{children}</div>
}
