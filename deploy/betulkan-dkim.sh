#!/usr/bin/env bash
# Daftarkan dharmapati.co.id pada tabel OpenDKIM yang benar-benar dibaca.
set -euo pipefail

D=dharmapati.co.id
CAD=/root/cadangan-surel-$(date +%Y%m%d-%H%M%S)
mkdir -p "$CAD"
cp /etc/opendkim/key.table /etc/opendkim/signing.table /etc/opendkim/trusted.hosts "$CAD/"
echo "cadangan: $CAD"

grep -q "$D" /etc/opendkim/key.table || \
  echo "mail._domainkey.$D $D:mail:/etc/opendkim/keys/$D/mail.private" >> /etc/opendkim/key.table
grep -q "@$D" /etc/opendkim/signing.table || \
  echo "*@$D mail._domainkey.$D" >> /etc/opendkim/signing.table
grep -qx "$D" /etc/opendkim/trusted.hosts || echo "$D" >> /etc/opendkim/trusted.hosts

# Buang berkas yang telanjur dibuat tapi tidak pernah dibaca konfigurasi
rm -f /etc/opendkim/KeyTable /etc/opendkim/SigningTable /etc/opendkim/TrustedHosts

chown -R opendkim:opendkim /etc/opendkim/keys/$D
chmod 600 /etc/opendkim/keys/$D/mail.private

# Tabel kunci hanya dibaca ulang saat mulai ulang, bukan saat muat ulang
systemctl restart opendkim
sleep 2
systemctl is-active opendkim
echo "--- key.table ---"; cat /etc/opendkim/key.table
