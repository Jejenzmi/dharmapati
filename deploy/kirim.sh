#!/usr/bin/env bash
# Kirim sumber ke VPS lalu bangun ulang susunan produksi dharmapati.co.id.
#
# Urutannya penting. Next.js memanggang isi basis data ke dalam halaman saat
# prarender, jadi sebelum membangun kita pastikan API menyajikan data terbaru —
# bukan yang tersimpan di singgahan Redis. Tanpa itu, halaman hasil build ikut
# membawa nilai usang meski basis datanya sudah benar.
set -euo pipefail

VPS="${VPS:-root@76.13.197.249}"
KUNCI="${KUNCI:-$HOME/.ssh/gokar_prod}"
TUJUAN="${TUJUAN:-/root/dharmapati}"
AKAR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH=(ssh -o ConnectTimeout=25 -o ServerAliveInterval=15 -i "$KUNCI")

# Hanya bangun bagian yang diminta: web, api, atau keduanya (bawaan).
BAGIAN="${1:-semua}"
case "$BAGIAN" in
  web)   LAYANAN="web" ;;
  api)   LAYANAN="api" ;;
  semua) LAYANAN="api web" ;;
  *) echo "Pemakaian: $0 [web|api|semua]"; exit 1 ;;
esac

echo "› Menyalin sumber ke $VPS:$TUJUAN"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude 'backend/.env' --exclude 'web/.env.local' --exclude 'deploy/.env' \
  -e "${SSH[*]}" \
  "$AKAR/backend" "$AKAR/web" "$AKAR/deploy" "$VPS:$TUJUAN/"

echo "› Membersihkan singgahan API agar prarender memakai data terbaru"
"${SSH[@]}" "$VPS" 'docker exec dharmapati-redis-1 redis-cli FLUSHALL >/dev/null 2>&1 && echo "  singgahan Redis dibersihkan" || echo "  (Redis tidak berjalan, dilewati)"'

echo "› Membangun ulang: $LAYANAN"
"${SSH[@]}" "$VPS" "cd $TUJUAN/deploy && PENANDA_BANGUN=\$(date +%s) docker compose build $LAYANAN"

echo "› Menjalankan wadah"
"${SSH[@]}" "$VPS" "cd $TUJUAN/deploy && docker compose up -d $LAYANAN && sleep 15 && docker compose ps --format '{{.Service}}\t{{.Status}}'"

echo "› Memeriksa kesehatan"
"${SSH[@]}" "$VPS" 'curl -fsS http://127.0.0.1:5042/sehat; echo; curl -sS -o /dev/null -w "web: %{http_code}\n" http://127.0.0.1:8118/'

echo "✓ Selesai — https://dharmapati.co.id"
