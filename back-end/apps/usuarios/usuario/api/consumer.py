# apps/usuarios/usuario/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class UsuariosConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.usuario_id = self.scope['url_route']['kwargs'].get("usuario_id")
        if not self.usuario_id:
            await self.close()
            return

        self.group_name = f"user_{self.usuario_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Por si deseas recibir algo del frontend
        print("Mensaje recibido del frontend:", text_data)

    async def desactivar_usuario(self, event):
        await self.send(text_data=json.dumps({
            "type": "logout",
            "message": event["message"]
        }))
