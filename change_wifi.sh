#!/bin/bash

# Verifie le nb d'arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <SSID> <PASSPHRASE>"
    exit 1
fi

# Récupère les variables
SSID="$1"
PASSPHRASE="$2"

# Génère le bloc réseau à l'aide de wpa_passhphrase
NETWORK_BLOCK=$(wpa_passphrase "$SSID" "$PASSPHRASE")

# Supprime le bloc réseau existant de wpa_supplicant
sed -i '/^network={/,/^}$/d' /etc/wpa_supplicant/wpa_supplicant.conf
# Ajoute le bloc fourni par wpa_passphrase
echo "$NETWORK_BLOCK" >> /etc/wpa_supplicant/wpa_supplicant.conf

# Redémarre les services réseaux
sudo systemctl daemon-reload
sudo systemctl restart dhcpcd hostapd dnsmasq

echo "Wi-Fi configuration updated."

exit 0
