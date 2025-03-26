import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.apps import apps

class MideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("mide", self.channel_name)
        await self.accept()
        print("✅ Cliente conectado al WebSocket de mide")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("mide", self.channel_name)
        print("⚠ Cliente desconectado del WebSocket de mide")

    async def receive(self, text_data):
        Mide = apps.get_model('mide', 'Mide')  
        Sensores = apps.get_model('sensores', 'Sensores')

        try:
            data = json.loads(text_data)
            print("✅ Dato recibido:", data)

            required_fields = ["fk_id_sensor", "fk_id_era", "valor_medicion"]
            if not all(field in data for field in required_fields):
                print("⚠️ Datos incompletos recibidos:", data)
                return

            # Crear una nueva medición
            nuevo_mide = await sync_to_async(Mide.objects.create)(
                fk_id_sensor_id=data["fk_id_sensor"],
                fk_id_era_id=data["fk_id_era"],
                valor_medicion=data["valor_medicion"]
            )

            # Obtener el nombre del sensor
            sensor = await sync_to_async(lambda: Sensores.objects.get(id=data["fk_id_sensor"]))()
            nombre_sensor = sensor.nombre_sensor

            # Construir el mensaje asegurándonos de que fk_id_sensor sea un número
            message = {
                "valor_medicion": float(data["valor_medicion"]),
                "fecha_medicion": nuevo_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                "fk_id_sensor": int(data["fk_id_sensor"]),  # Aseguramos que sea un entero
                "nombre_sensor": nombre_sensor,
                "fk_id_era": int(data["fk_id_era"])
            }

            print("📡 Enviando datos al frontend:", message)
            await self.channel_layer.group_send("mide", {"type": "enviar_dato", "message": message})

        except Exception as e:
            print(f"❌ Error al procesar mensaje WebSocket: {e}")

    async def enviar_dato(self, event):
        try:
            mensaje = json.dumps(event["message"])
            print("📡 Datos enviados al frontend:", mensaje)
            await self.send(text_data=mensaje)
        except Exception as e:
            print(f"❌ Error al enviar datos WebSocket: {e}")