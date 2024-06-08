import json
import websockets
import tensorflow as tf
import numpy as np
from typing import Tuple
from mode import Mode
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.image import rgb_to_grayscale

class Chiffres(Mode):

    def __init__(self) -> None:
        self.model = tf.keras.models.load_model("models/chiffres.keras")

    def get_chiffre_from_image(self, path: str) -> Tuple[int, float]:
        image = load_img(path, target_size=(28, 28))
        image = 1 - rgb_to_grayscale(np.expand_dims(image,axis=0) / 255)
        predicitons = self.model.predict(image)
        chiffre = np.argmax(predicitons, axis=-1)[0]
        return (chiffre, predicitons[0][chiffre])

    async def treat(self, socket: websockets.WebSocketClientProtocol) -> None:
        chiffre = self.get_chiffre_from_image("image.jpg")
        chiffre = (int(chiffre[0]), int(chiffre[1]*100))
        if(chiffre[1] > 80):
            print("Chiffre détecté: " + str(chiffre[0]))
            response = json.dumps({
                "type": "chiffre",
                "payload": chiffre,
            })
            await socket.send(response)
