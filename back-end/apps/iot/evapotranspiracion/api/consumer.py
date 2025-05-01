from channels.generic.websocket import AsyncWebsocketConsumer
import json

class EvapotranspiracionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("evapotranspiracion", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("evapotranspiracion", self.channel_name)

    async def evapotranspiracion_data(self, event):
        await self.send(text_data=json.dumps(event["message"]))