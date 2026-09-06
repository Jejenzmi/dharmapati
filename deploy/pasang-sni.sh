#!/usr/bin/env bash
# Pasang sertifikat per-nama (SNI) agar tiap domain memakai sertifikatnya sendiri.
set -euo pipefail

CAD=/root/cadangan-surel-$(date +%Y%m%d-%H%M%S)
mkdir -p "$CAD"
cp /etc/postfix/main.cf "$CAD/"
cp -r /etc/dovecot/conf.d "$CAD/dovecot-conf.d" 2>/dev/null || true
echo "cadangan: $CAD"

# --- Postfix: peta SNI ---
cat > /etc/postfix/vmail_ssl.map <<'MAP'
mail.miruum.id /etc/letsencrypt/live/mail.miruum.id/privkey.pem /etc/letsencrypt/live/mail.miruum.id/fullchain.pem
mail.dharmapati.co.id /etc/letsencrypt/live/mail.dharmapati.co.id/privkey.pem /etc/letsencrypt/live/mail.dharmapati.co.id/fullchain.pem
MAP
postmap -F hash:/etc/postfix/vmail_ssl.map
postconf -e "tls_server_sni_maps = hash:/etc/postfix/vmail_ssl.map"
echo "  postfix: peta SNI dipasang"

# --- Dovecot: blok local_name ---
cat > /etc/dovecot/conf.d/99-sni-dharmapati.conf <<'DOV'
# Sertifikat khusus untuk klien yang menyambung ke mail.dharmapati.co.id
local_name mail.dharmapati.co.id {
  ssl_cert = </etc/letsencrypt/live/mail.dharmapati.co.id/fullchain.pem
  ssl_key = </etc/letsencrypt/live/mail.dharmapati.co.id/privkey.pem
}
DOV
echo "  dovecot: blok local_name dipasang"

postfix check && echo "  postfix bersih"
doveconf -n > /dev/null && echo "  dovecot bersih"
systemctl reload postfix dovecot
echo "layanan dimuat ulang"
