# apps/iot/sensores/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.sensores.models import Sensores
from ..api.serializers import SensoresSerializer

class SensorConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("sensores", self.channel_name)
        await self.accept()
        print("✅ Cliente conectado al WebSocket de sensores")

        sensors = await sync_to_async(lambda: list(Sensores.objects.all()))()
        serializer = SensoresSerializer(sensors, many=True)
        await self.send(text_data=json.dumps(serializer.data))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("sensores", self.channel_name)
        print("⚠ Cliente desconectado del WebSocket de sensores")

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("type") == "heartbeat":
            print("💓 Heartbeat recibido")
            return

    async def sensor_data(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))
        print(f"📡 Enviado nuevo sensor al frontend: {message}")