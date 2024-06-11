import json
import websockets
import cv2
import time
import tensorflow as tf
import numpy as np
from mode import Mode
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.image import rgb_to_grayscale

class Chiffres(Mode):

    def __init__(self) -> None:
        self.model = tf.keras.models.load_model("models/chiffres.keras")

    def detect_digits(self, image, scales=[1.5, 1.0, 0.75], window_size=(56, 56), step_size=28, threshold=0.95):
        h, w = image.shape[:2]
        results = []
        total_windows = 0

        start_time = time.time()

        for scale in scales:
            scaled_h, scaled_w = int(h * scale), int(w * scale)
            resized_image = cv2.resize(image, (scaled_w, scaled_h))

            for y in range(0, scaled_h - window_size[1], step_size):
                for x in range(0, scaled_w - window_size[0], step_size):
                    window = resized_image[y:y + window_size[1], x:x + window_size[0]]
                    window_resized = cv2.resize(window, (28, 28)).astype('float32')
                    window_resized = np.expand_dims(window_resized, axis=-1)
                    window_resized = np.expand_dims(window_resized, axis=0)

                    preds = self.model.predict(window_resized, verbose=0)
                    prob = np.max(preds)
                    label = np.argmax(preds)

                    if prob > threshold:
                        results.append((int(x / scale), int(y / scale), int(window_size[0] / scale), int(window_size[1] / scale), label, prob))

                    total_windows += 1

        end_time = time.time()
        elapsed_time = end_time - start_time
        avg_time_per_window = elapsed_time / total_windows

        print(f"Total windows processed: {total_windows}")
        print(f"Elapsed time: {elapsed_time:.2f} seconds")
        print(f"Average time per window: {avg_time_per_window:.6f} seconds")

        return results[0] or None

    @staticmethod
    def preprocess_image(path: str):
        image = load_img(path, target_size=(480, 640))
        image = img_to_array(image) / 255.0
        image = rgb_to_grayscale(image).numpy()
        return 1 - image

    async def treat(self, socket: websockets.WebSocketClientProtocol) -> None:
        chiffre = self.detect_digits(self.preprocess_image("image.jpg"))
        if(chiffre):
            chiffre = (chiffre[0], chiffre[1], chiffre[2], chiffre[3], int(chiffre[4]), int(chiffre[5]*100))
            print("Chiffre détecté: " + str(chiffre))
            response = json.dumps({
                "type": "chiffre",
                "payload": chiffre,
            })
            await socket.send(response)
