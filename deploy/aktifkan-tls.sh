#!/usr/bin/env bash
# Terbitkan sertifikat Let's Encrypt setelah DNS dharmapati.co.id mengarah ke VPS ini.
set -euo pipefail

DOMAIN="${DOMAIN:-dharmapati.co.id}"
SUREL="${SUREL:-admin@dharmapati.co.id}"

echo "› Memastikan DNS mengarah ke server ini"
IP_SERVER="$(curl -4 -fsS --max-time 10 https://ifconfig.me || hostname -I | awk '{print $1}')"
IP_DOMAIN="$(dig +short "$DOMAIN" A @1.1.1.1 | tail -1)"
if [ "$IP_SERVER" != "$IP_DOMAIN" ]; then
  echo "✗ $DOMAIN mengarah ke '${IP_DOMAIN:-kosong}', bukan $IP_SERVER."
  echo "  Arahkan A record $DOMAIN dan www.$DOMAIN ke $IP_SERVER lebih dulu."
  exit 1
fi

certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "$SUREL" --redirect

echo "› Memasang konfigurasi nginx penuh (HTTPS)"
cp /root/dharmapati/deploy/nginx.conf /etc/nginx/sites-available/dharmapati.co.id
ln -sf /etc/nginx/sites-available/dharmapati.co.id /etc/nginx/sites-enabled/dharmapati.co.id
nginx -t && systemctl reload nginx

echo "✓ HTTPS aktif di https://$DOMAIN"
