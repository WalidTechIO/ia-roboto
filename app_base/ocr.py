import easyocr
import json
import websockets
import re
from mode import Mode
#pip install torch torchvision torchaudio easyocr websockets
class OCR(Mode):
    """OCR mode for processing images."""

    @staticmethod
    def get_location_from_image(path: str) -> str:
        """Extract location information from the image."""
        reader = easyocr.Reader(['fr'])
        for result in reader.readtext(path):
            if re.search(r"^salle (\d(\.|,)\d) (bas|haut) (gauche|droit)$", result[1].lower()):
                return result[1]
        return ""

    async def treat(self, socket: websockets.WebSocketClientProtocol) -> None:
        """Process the socket for OCR mode."""
        location = self.get_location_from_image("image.jpg")
        if location:
            print("Emplacement: " + location)
            response = json.dumps({
                "type": "location",
                "payload": location
            })
            await socket.send(response)
