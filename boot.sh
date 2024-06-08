# Démarre le back-end et le front-end
sudo pm2 resurrect
# Démarre les services réseaux et le point d'accès
sudo systemctl start hostapd dhcpcd dnsmasq
