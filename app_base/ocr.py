import easyocr
import json
import websockets
import re
from mode import Mode
#pip install torch torchvision torchaudio easyocr websockets
class OCR(Mode):
    """OCR mode for processing images."""

    @staticmethod
    def get_location_from_image(path: str) -> list:
        """Extract location information from the image."""
        reader = easyocr.Reader(['fr'])
        for result in reader.readtext(path):
            if re.search(r"^salle (\d(\.|,)\d) (bas|haut) (gauche|droit)$", result[1].lower()):
                return result
        return None

    async def treat(self, socket: websockets.WebSocketClientProtocol) -> None:
        """Process the socket for OCR mode."""
        location = self.get_location_from_image("image.jpg")
        if location:
            print("Emplacement: " + location[1])
            (y0, x0), (y1, x1) = location[0][0], location[0][2]
            color = "green" if location[2] >= 0.9 else "yellow" if location[2] >= 0.75 else "red"
            location = [{"top": int(x0), "left": int(y0), "height": int(x1-x0), "width": int(y1-y0)}, location[1], color]
            response = json.dumps({
                "type": "location",
                "payload": location,
            })
            await socket.send(response)
