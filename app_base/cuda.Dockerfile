# Utilise l'image CUDA de base
FROM nvidia/cuda:12.4.0-runtime-ubuntu22.04

# Installe python3 et pip3
RUN apt-get update && apt-get install -y python3 python3-pip

# Copier l'app Python dans le conteneur
COPY . /app

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances Python
RUN pip install -r requirements.txt

# Commande à exécuter lorsque le conteneur démarre
ENTRYPOINT ["python3", "/app/main.py"]
CMD ["ocr"]