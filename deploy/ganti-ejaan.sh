#!/usr/bin/env bash
# Ganti kotak surat salah eja menjadi ejaan yang benar, kata sandi tetap sama.
set -euo pipefail

DOMAIN=dharmapati.co.id
declare -a LAMA=(carrier bussiness)
declare -a BARU=(career business)

CAD=/root/cadangan-surel-$(date +%Y%m%d-%H%M%S)
mkdir -p "$CAD"
cp /etc/postfix/vmailbox /etc/dovecot/users "$CAD/"
echo "cadangan: $CAD"

# Ambil kata sandi bersama yang sudah dipakai, lalu pakai hash yang sama persis
HASH=$(grep "^career@$DOMAIN:\|^info@$DOMAIN:" /etc/dovecot/users | head -1 | cut -d: -f2)
[ -n "$HASH" ] || { echo "gagal membaca hash kata sandi"; exit 1; }

for i in "${!LAMA[@]}"; do
  L="${LAMA[$i]}"; B="${BARU[$i]}"

  # Buang yang salah eja
  grep -v "^$L@$DOMAIN " /etc/postfix/vmailbox > /tmp/vm.baru && mv /tmp/vm.baru /etc/postfix/vmailbox
  grep -v "^$L@$DOMAIN:" /etc/dovecot/users > /tmp/us.baru && mv /tmp/us.baru /etc/dovecot/users
  rm -rf "/var/vmail/$DOMAIN/$L"
  echo "  - dihapus : $L@$DOMAIN"

  # Pasang ejaan yang benar
  grep -q "^$B@$DOMAIN " /etc/postfix/vmailbox || echo "$B@$DOMAIN $DOMAIN/$B/Maildir/" >> /etc/postfix/vmailbox
  grep -q "^$B@$DOMAIN:" /etc/dovecot/users || \
    echo "$B@$DOMAIN:$HASH:5000:5000::/var/vmail/$DOMAIN/$B::userdb_mail=maildir:/var/vmail/$DOMAIN/$B/Maildir" >> /etc/dovecot/users
  mkdir -p "/var/vmail/$DOMAIN/$B/Maildir"/{cur,new,tmp}
  echo "  + dibuat  : $B@$DOMAIN"
done

chown -R 5000:5000 "/var/vmail/$DOMAIN"
chown root:dovecot /etc/dovecot/users
chmod 640 /etc/dovecot/users
postmap /etc/postfix/vmailbox

# Perbarui daftar pada berkas kata sandi tanpa mengubah sandinya
SANDI=$(grep "^Kata sandi" /root/sandi-dharmapati.txt | sed 's/.*: //')
{
  echo "Kotak surat $DOMAIN — kata sandi sama untuk semua"
  echo "Diperbarui: $(date '+%d %B %Y %H:%M %Z')"
  echo
  grep " $DOMAIN/" /etc/postfix/vmailbox | awk '{print $1}' | sort
  echo
  echo "Kata sandi : $SANDI"
  echo
  echo "Webmail    : https://email.$DOMAIN"
  echo "IMAP       : mail.$DOMAIN  porta 993 (SSL/TLS)"
  echo "SMTP       : mail.$DOMAIN  porta 587 (STARTTLS)"
} > /root/sandi-dharmapati.txt
chmod 600 /root/sandi-dharmapati.txt

postfix check && echo "  postfix bersih"
doveconf -n > /dev/null && echo "  dovecot bersih"
systemctl reload postfix dovecot
echo "layanan dimuat ulang"
