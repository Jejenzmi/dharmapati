#!/bin/sh
set -e

echo "› Menyelaraskan skema basis data…"
npx prisma db push --skip-generate --accept-data-loss

echo "› Menanam data awal bila belum ada…"
npx tsx prisma/seed.ts || echo "  (penanaman dilewati)"

echo "› Menjalankan API…"
exec npx tsx src/index.ts
