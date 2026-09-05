import type { ReactElement, SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement>

const dasar = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export function Perisai(p: Props) {
  return <svg {...dasar} {...p}><path d="M12 3 4 6v5.5c0 4.6 3.2 8.4 8 9.5 4.8-1.1 8-4.9 8-9.5V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
}
export function OrangPerisai(p: Props) {
  return <svg {...dasar} {...p}><path d="M12 3 5 5.6v5.1c0 4.3 2.9 7.8 7 8.8 4.1-1 7-4.5 7-8.8V5.6L12 3Z" /><circle cx="12" cy="10" r="2.2" /><path d="M8.4 16.4a4 4 0 0 1 7.2 0" /></svg>
}
export function Kilau(p: Props) {
  return <svg {...dasar} {...p}><path d="M9 3.5 10.4 7 14 8.4 10.4 9.8 9 13.3 7.6 9.8 4 8.4 7.6 7 9 3.5Z" /><path d="M17 12.5 17.9 15l2.6.9-2.6 1-.9 2.6-1-2.6-2.5-1 2.5-.9.9-2.5Z" /></svg>
}
export function Kumbang(p: Props) {
  return <svg {...dasar} {...p}><path d="M8 7a4 4 0 0 1 8 0" /><rect x="7" y="7" width="10" height="12" rx="5" /><path d="M3 11h4M17 11h4M3.5 16h3.5M17 16h3.5M4.5 6.5 7 8M19.5 6.5 17 8M12 7v12" /></svg>
}
export function Orang(p: Props) {
  return <svg {...dasar} {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.9M17.5 20a5.5 5.5 0 0 0-2.2-4.4" /></svg>
}
export function Cangkir(p: Props) {
  return <svg {...dasar} {...p}><path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" /><path d="M16 9.5h2.2a2.3 2.3 0 0 1 0 4.6H16" /><path d="M7 3.5v2M11 3.5v2" /></svg>
}
export function Truk(p: Props) {
  return <svg {...dasar} {...p}><path d="M2 7h11v9H2z" /><path d="M13 10h4l3 3.2V16h-7" /><circle cx="6.5" cy="18" r="1.8" /><circle cx="16.5" cy="18" r="1.8" /></svg>
}
export function Daun(p: Props) {
  return <svg {...dasar} {...p}><path d="M4 20c0-8 5-13 16-13 0 8-5 13-13 13H4Z" /><path d="M8 16c2.5-3 5.5-5 9-6" /></svg>
}
export function TopiWisuda(p: Props) {
  return <svg {...dasar} {...p}><path d="m12 4 9 4.2-9 4.2-9-4.2L12 4Z" /><path d="M7 10.4V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-4.6" /><path d="M21 8.2v5" /></svg>
}
export function Peta(p: Props) {
  return <svg {...dasar} {...p}><path d="M9 3 3 5.5v15L9 18l6 2.5 6-2.5v-15L15 6 9 3Z" /><path d="M9 3v15M15 6v15" /></svg>
}
export function Titik(p: Props) {
  return <svg {...dasar} {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
}
export function Telepon(p: Props) {
  return <svg {...dasar} {...p}><path d="M6.5 3.5h3l1.5 4-2 1.5a11.5 11.5 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" /></svg>
}
export function Amplop(p: Props) {
  return <svg {...dasar} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.8 7 7.3 5.2a1.6 1.6 0 0 0 1.8 0L20.2 7" /></svg>
}
export function Jam(p: Props) {
  return <svg {...dasar} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.2 2" /></svg>
}
export function Panah(p: Props) {
  return <svg {...dasar} {...p}><path d="M5 12h13M13 6.5 18.5 12 13 17.5" /></svg>
}
export function Centang(p: Props) {
  return <svg {...dasar} {...p}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
}
export function Bintang(p: Props) {
  return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.6Z" /></svg>
}
export function Berkas(p: Props) {
  return <svg {...dasar} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
}
export function Wa(p: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.92 9.92 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.88 9.88 0 0 0 12.04 2Zm0 18.16h-.01a8.26 8.26 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.34c0-4.56 3.71-8.27 8.27-8.27 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.2-8.27 8.2Zm4.53-6.15c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
    </svg>
  )
}
export function Menu(p: Props) {
  return <svg {...dasar} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
}
export function Silang(p: Props) {
  return <svg {...dasar} {...p}><path d="m6 6 12 12M18 6 6 18" /></svg>
}
export function Kembang(p: Props) {
  return <svg {...dasar} {...p}><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" /></svg>
}
export function Gedung(p: Props) {
  return <svg {...dasar} {...p}><path d="M4 21V6l7-3v18M11 21h9V10h-9" /><path d="M14.5 13.5h2M14.5 17h2M7 9h1M7 12.5h1M7 16h1" /></svg>
}

export const IKON: Record<string, (p: Props) => ReactElement> = {
  shield: Perisai,
  'user-shield': OrangPerisai,
  sparkles: Kilau,
  bug: Kumbang,
  users: Orang,
  coffee: Cangkir,
  truck: Truk,
  leaf: Daun,
  'graduation-cap': TopiWisuda,
}

export function IkonLayanan({ nama, ...p }: Props & { nama: string }) {
  const Komponen = IKON[nama] ?? Perisai
  return <Komponen {...p} />
}
