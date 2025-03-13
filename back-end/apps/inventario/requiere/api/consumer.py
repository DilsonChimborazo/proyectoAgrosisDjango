import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_authenticated and user.fk_id_rol and user.fk_id_rol.rol == "Administrador":
            self.group_name = f"admin_{user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def enviar_notificacion(self, event):
        message = json.loads(event["message"])
        await self.send(text_data=json.dumps(message))
