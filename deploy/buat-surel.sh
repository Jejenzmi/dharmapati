#!/usr/bin/env bash
# Membuat kotak surat dharmapati.co.id dan menyamakan kata sandinya.
set -euo pipefail

DOMAIN=dharmapati.co.id
BARU="recruitment carrier support bussiness"
SEMUA="info admin marketing hrd keuangan operasional recruitment carrier support bussiness"
BERKAS_SANDI=/root/sandi-dharmapati.txt

CAD=/root/cadangan-surel-$(date +%Y%m%d-%H%M%S)
mkdir -p "$CAD"
cp /etc/postfix/vmailbox /etc/dovecot/users "$CAD/"
echo "cadangan: $CAD"

# Satu kata sandi bersama untuk seluruh kotak surat domain ini
SANDI=$(openssl rand -base64 15 | tr -d '/+=' | cut -c1-14)
HASH=$(doveadm pw -s SHA512-CRYPT -p "$SANDI")

for k in $SEMUA; do
  ALAMAT="$k@$DOMAIN"

  # Peta kotak surat Postfix
  if ! grep -q "^$ALAMAT " /etc/postfix/vmailbox; then
    echo "$ALAMAT $DOMAIN/$k/Maildir/" >> /etc/postfix/vmailbox
    echo "  + kotak surat baru: $ALAMAT"
  fi

  # Kata sandi Dovecot — ganti bila sudah ada, tambah bila belum
  BARIS="$ALAMAT:$HASH:5000:5000::/var/vmail/$DOMAIN/$k::userdb_mail=maildir:/var/vmail/$DOMAIN/$k/Maildir"
  if grep -q "^$ALAMAT:" /etc/dovecot/users; then
    grep -v "^$ALAMAT:" /etc/dovecot/users > /tmp/users.baru
    echo "$BARIS" >> /tmp/users.baru
    mv /tmp/users.baru /etc/dovecot/users
  else
    echo "$BARIS" >> /etc/dovecot/users
  fi

  mkdir -p "/var/vmail/$DOMAIN/$k/Maildir"/{cur,new,tmp}
done

chown -R 5000:5000 "/var/vmail/$DOMAIN"
chown root:dovecot /etc/dovecot/users
chmod 640 /etc/dovecot/users
postmap /etc/postfix/vmailbox

# Simpan kata sandi hanya di berkas, tidak dicetak ke layar
{
  echo "Kotak surat $DOMAIN — kata sandi sama untuk semua"
  echo "Diperbarui: $(date '+%d %B %Y %H:%M %Z')"
  echo
  for k in $SEMUA; do echo "$k@$DOMAIN"; done
  echo
  echo "Kata sandi : $SANDI"
  echo
  echo "Webmail    : https://email.$DOMAIN"
  echo "IMAP       : mail.miruum.id  porta 993 (SSL/TLS)"
  echo "SMTP       : mail.miruum.id  porta 587 (STARTTLS)"
} > "$BERKAS_SANDI"
chmod 600 "$BERKAS_SANDI"

postfix check && echo "  postfix bersih"
doveconf -n > /dev/null && echo "  dovecot bersih"
systemctl reload postfix dovecot
echo "layanan dimuat ulang"
