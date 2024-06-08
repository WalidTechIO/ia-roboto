#!/bin/bash

# Démarre le programme Node.js
sudo pm2 start /home/pi/node/app_rpi_back/server.js --name node-app

# Démarre l'application React
cd /home/pi/node/app_rpi_front
sudo pm2 start npm --name react-app -- run dev

# Sauvegarde la liste des applications pm2
sudo pm2 save
