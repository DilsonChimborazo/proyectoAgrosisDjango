import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.apps import apps

class MideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """ Se ejecuta cuando un cliente se conecta al WebSocket """
        await self.channel_layer.group_add("mide", self.channel_name)
        await self.accept()
        print("✅ Cliente conectado al WebSocket")

    async def disconnect(self, close_code):
        """ Se ejecuta cuando un cliente se desconecta """
        await self.channel_layer.group_discard("mide", self.channel_name)
        print("⚠ Cliente desconectado del WebSocket")

    async def receive(self, text_data):
        """ Recibe datos del ESP32, los almacena en la BD y los envía al frontend """
        Mide = apps.get_model('mide', 'Mide')  
        Sensores = apps.get_model('sensores', 'Sensores')

        try:
            data = json.loads(text_data)
            print("✅ Dato recibido:", data)

            # Verificar que los datos requeridos estén presentes
            required_fields = ["fk_id_sensor", "fk_id_era", "valor_medicion"]
            if not all(field in data for field in required_fields):
                print("⚠️ Datos incompletos recibidos:", data)
                return

            # Guardar los datos en la base de datos
            nuevo_mide = await sync_to_async(Mide.objects.create)(
                fk_id_sensor_id=data["fk_id_sensor"],
                fk_id_era_id=data["fk_id_era"],
                valor_medicion=data["valor_medicion"]
            )

            # Obtener el nombre del sensor
            sensor = await sync_to_async(lambda: Sensores.objects.get(id=data["fk_id_sensor"]))()
            nombre_sensor = sensor.nombre_sensor

            # Construir el mensaje para el frontend
            message = {
                "valor_medicion": float(data["valor_medicion"]),
                "fecha_medicion": nuevo_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                "fk_id_sensor": data["fk_id_sensor"],
                "nombre_sensor": nombre_sensor,
                "fk_id_era": data["fk_id_era"]
            }

            print("📡 Enviando datos al frontend:", message)

            # Enviar los datos al frontend en tiempo real
            await self.channel_layer.group_send("mide", {"type": "enviar_dato", "message": message})

        except Exception as e:
            print(f"❌ Error al procesar mensaje WebSocket: {e}")

    async def enviar_dato(self, event):
        """ Envia los datos al frontend """
        try:
            mensaje = json.dumps(event["message"])
            print("📡 Datos enviados al frontend:", mensaje)
            await self.send(text_data=mensaje)
        except Exception as e:
            print(f"❌ Error al enviar datos WebSocket: {e}")