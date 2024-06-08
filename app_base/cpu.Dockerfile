# Utiliser l'image Python de base
FROM python:latest

# Copier le script Python dans le conteneur
COPY . /app

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances Python
RUN pip install -r requirements.txt

# Commande à exécuter lorsque le conteneur démarre
ENTRYPOINT ["python3", "/app/main.py"]
CMD ["ocr"]