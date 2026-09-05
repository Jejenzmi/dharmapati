#!/usr/bin/env bash
# Kirim sumber ke VPS lalu bangun ulang susunan produksi dharmapati.co.id
set -euo pipefail

VPS="${VPS:-root@76.13.197.249}"
KUNCI="${KUNCI:-$HOME/.ssh/gokar_prod}"
TUJUAN="${TUJUAN:-/root/dharmapati}"
AKAR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "› Menyalin sumber ke $VPS:$TUJUAN"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude 'backend/.env' --exclude 'web/.env.local' --exclude 'deploy/.env' \
  -e "ssh -i $KUNCI" \
  "$AKAR/backend" "$AKAR/web" "$AKAR/deploy" "$VPS:$TUJUAN/"

echo "› Membangun dan menjalankan wadah"
ssh -i "$KUNCI" "$VPS" bash -s <<'JARAK'
set -euo pipefail
cd /root/dharmapati/deploy
docker compose build
docker compose up -d
sleep 8
docker compose ps
JARAK

echo "› Memeriksa kesehatan layanan"
ssh -i "$KUNCI" "$VPS" 'curl -fsS http://127.0.0.1:5042/sehat && echo && curl -sS -o /dev/null -w "web: %{http_code}\n" http://127.0.0.1:8118/'

echo "✓ Selesai"
