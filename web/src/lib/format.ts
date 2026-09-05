export function tanggalId(nilai: string | Date, panjang = true) {
  const d = typeof nilai === 'string' ? new Date(nilai) : nilai
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: panjang ? 'long' : 'short',
    year: 'numeric',
  })
}

export function potong(teks: string, panjang = 160) {
  const bersih = teks.replace(/[#*_>`]/g, '').replace(/\s+/g, ' ').trim()
  return bersih.length <= panjang ? bersih : `${bersih.slice(0, panjang - 1).trimEnd()}…`
}

export const NAMA_LINI: Record<string, string> = {
  KEAMANAN: 'Pengamanan',
  KEBERSIHAN: 'Kebersihan',
  TENAGA_KERJA: 'Tenaga Kerja',
  PENDUKUNG: 'Layanan Pendukung',
}

export const WARNA_LINI: Record<string, string> = {
  KEAMANAN: '#f5b301',
  KEBERSIHAN: '#38bdf8',
  TENAGA_KERJA: '#34d399',
  PENDUKUNG: '#c084fc',
}

/** Ubah teks Markdown sederhana (## judul, daftar, **tebal**) menjadi HTML. */
export function keHtml(mentah: string) {
  const baris = mentah.replace(/\r\n/g, '\n').split('\n')
  const keluaran: string[] = []
  let dalamDaftar: 'ul' | 'ol' | null = null

  const tutupDaftar = () => {
    if (dalamDaftar) { keluaran.push(`</${dalamDaftar}>`); dalamDaftar = null }
  }
  const sebaris = (t: string) =>
    t
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

  for (const b of baris) {
    const t = b.trim()
    if (!t) { tutupDaftar(); continue }
    if (t.startsWith('### ')) { tutupDaftar(); keluaran.push(`<h3>${sebaris(t.slice(4))}</h3>`); continue }
    if (t.startsWith('## ')) { tutupDaftar(); keluaran.push(`<h2>${sebaris(t.slice(3))}</h2>`); continue }
    if (t.startsWith('# ')) { tutupDaftar(); keluaran.push(`<h2>${sebaris(t.slice(2))}</h2>`); continue }
    if (/^[-*]\s+/.test(t)) {
      if (dalamDaftar !== 'ul') { tutupDaftar(); keluaran.push('<ul>'); dalamDaftar = 'ul' }
      keluaran.push(`<li>${sebaris(t.replace(/^[-*]\s+/, ''))}</li>`); continue
    }
    if (/^\d+\.\s+/.test(t)) {
      if (dalamDaftar !== 'ol') { tutupDaftar(); keluaran.push('<ol>'); dalamDaftar = 'ol' }
      keluaran.push(`<li>${sebaris(t.replace(/^\d+\.\s+/, ''))}</li>`); continue
    }
    tutupDaftar()
    keluaran.push(`<p>${sebaris(t)}</p>`)
  }
  tutupDaftar()
  return keluaran.join('\n')
}
