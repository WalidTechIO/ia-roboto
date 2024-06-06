# IA Roboto

# Contexte

Ce projet est un ensemble de sous-projet réalisé lors d'un stage
consistant en la réalisation d'un robot télécommandé avec capteur intelligent
pour lequel j'ai reçu : 
 - 4 moteurs équipé sur un châssis avec des chenilles
 - Un Raspberry Pi 4
 - Un Arduino Uno avec shield L298P
 - D'une Webcam Logitech C170
 - D'un petit module batterie

# Contient
 - Application back-end raspberry (Node.js)
 - Application front-end raspberry (React)
 - Application base machine connecté en réseau au raspberry avec puissance de calcul satisfaisante (Python)
 - Application de contrôle de l'arduino et du shield L298P

# Modularité
Le robot a été penser pour être facilement modulable en terme de modes

Pour ajouter un mode au robot (detection, classification):
 - Créer un module Python qui etend de Mode et implémente treat dans le dossier app_base
 - A l'appel de treat un fichier image.jpg est accessible et représente l'image reçue du robot
 - Si vous détecté/classifié quelque chose grâce à votre modèle sur cette image, il suffit d'envoyer une réponse via le paramètre socket
 - Si vous n'avez rien identifié vous pouvez également ne pas répondre
 - La réponse doit être un objet JSON de forme {type: "type", payload: "payload"}
 - Ajouter les lignes d'instanciation dans main.py (à partir de la ligne 42)
 - Modifier la fonction receive (ligne 15 du fichier App.jsx dans le front raspberry)

Exemple:

Je souhaite ajouter un mode qui compte le nombres de personne que le robot identifie:

```python
app_base/human.py
class Human(Mode):
    """Human mode for processing images."""

    @staticmethod
    def count_humans(path: str) -> int:
        """Make your model extract information from the image."""
        return 2

    async def treat(self, socket: websockets.WebSocketClientProtocol) -> None:
        """Process the socket for OCR mode."""
        nb = self.count_humans("image.jpg")
        print(nb + " humans detected!")
        response = json.dumps({
            "type": "humans",
            "payload": nb
        })
        await socket.send(response)

```

```python
app_base/main.py
+ import human as Human
...
-    match sys.argv[1]:
-            case "ocr":
-                mode = OCR()
+            case "human":
+                mode = Human()
-            case _:
-                print("Invalid mode")
-                exit()
```

```js
-  const receive = msg => {
-    switch(msg.type) {
+      case "humans":
+        console.log("Nb humains détéctés: " + msg.payload)
+        showModal("Le robot a détécté: " + msg.payload + " humains")
+        break
-      case "location":
-        console.log("Localisation du robot : " + msg.payload)
-        showModal("Emplacement du robot détecté: " + msg.payload)
-        break
-      case "photo":
-        setImage(msg.payload)
-        break
-    }
-  }
```

# Base en image docker

L'application base qui a pour vocation d'être éxécuté sur une machine avec une puissance de calcul
suffisante pour faire tourner des modèles d'IA peut-être utilisé facilement sur n'importe quelle machine
supportant l'orchestrateur de container Docker pour construire l'image:
 - Ouvrez un terminal et rendez-vous dans le dossier app_base
 - Lancez la commande docker build . -t nom_de_limage:tag
 - Par défaut au lancement l'application base se lance en mode OCR sur l'adresse ipv4 du hotspot Wi-Fi du robot
 - Si l'IP de mon robot est 192.168.0.10 et que je veux le lancer en mode human il faudrait lancer cette commande :
```sh
docker run nom_de_limage:tag human 192.168.0.10
```

# Illustration du robot
[<img src="robot.bmp" width="20%">](robot.bmp)