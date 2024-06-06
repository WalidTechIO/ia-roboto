import websockets

class Mode:
    """Base class for modes."""
    async def treat(self, socket: websockets.WebSocketClientProtocol) -> None:
        """Process the socket in the mode."""
        pass
