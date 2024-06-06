import asyncio
import websockets
import json
import base64
import sys
from mode import Mode
from ocr import OCR

async def process_message(message: str, websocket: websockets.WebSocketClientProtocol, mode: Mode) -> None:
    """Process the received message."""
    try:
        data = json.loads(message)
        if "type" in data and data["type"] == "photo" and "payload" in data and data["forBase"]:
            image_data = base64.b64decode(data["payload"].split(",")[1])
            with open("image.jpg", "wb") as image_file:
                image_file.write(image_data)
            print("Image received and saved as image.jpg")
            await mode.treat(websocket)
    except json.JSONDecodeError:
        print("Received message is not a valid JSON.")

async def listen_websocket(uri: str, mode: Mode) -> None:
    """Listen to the websocket for incoming messages."""
    async with websockets.connect(uri) as websocket:
        while True:
            try:
                message = await websocket.recv()
                await process_message(message, websocket, mode)
            except websockets.ConnectionClosed:
                print("Connection closed")
                break

def main() -> None:
    """Main entry point of the application."""
    if len(sys.argv) < 2:
        print("Usage: python main.py <mode> [address]")
        exit()

    mode: Mode
    adr: str = sys.argv[2] if len(sys.argv) > 2 else "ws://192.168.50.1:3002"

    match sys.argv[1]:
        case "ocr":
            mode = OCR()
        case _:
            print("Invalid mode")
            exit()

    try:
        asyncio.get_event_loop().run_until_complete(listen_websocket(adr, mode))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
