import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.mide.models import Mide

class MideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("mide", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("mide", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print("Dato recibido:", data)

        # Guardar en la base de datos
        nuevo_mide = await sync_to_async(Mide.objects.create)(
            fk_id_sensor_id=data["fk_id_sensor"],
            fk_id_era_id=data["fk_id_era"],
            valor_medicion=data["valor_medicion"]
        )

        # Enviar a todos los clientes conectados
        await self.channel_layer.group_send(
            "mide",
            {
                "type": "enviar_dato",
                "message": {
                    "valor_medicion": data["valor_medicion"],
                    "fecha_medicion": nuevo_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                    "fk_id_sensor": data["fk_id_sensor"],
                    "fk_id_era": data["fk_id_era"]
                }
            }
        )

    async def enviar_dato(self, event):
        await self.send(text_data=json.dumps(event["message"]))
