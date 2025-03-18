import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.apps import apps

class MideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Unirse al grupo de WebSocket
        await self.channel_layer.group_add("mide", self.channel_name)
        await self.accept()

        # Iniciar el envío de datos periódicos (cada 10 segundos)
        self.send_task = asyncio.create_task(self.send_data_periodically())

    async def disconnect(self, close_code):
        # Dejar el grupo cuando se desconecte
        await self.channel_layer.group_discard("mide", self.channel_name)
        
        # Cancelar la tarea de envío periódico si el WebSocket se desconecta
        if hasattr(self, "send_task"):
            self.send_task.cancel()

    async def receive(self, text_data):
        # Obtener los modelos dinámicamente
        Mide = apps.get_model('mide', 'Mide')  
        Sensores = apps.get_model('sensores', 'Sensores')

        try:
            data = json.loads(text_data)
            print("✅ Dato recibido:", data)

            if "fk_id_sensor" not in data or "fk_id_era" not in data or "valor_medicion" not in data:
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

            # Enviar a todos los clientes conectados
            await self.channel_layer.group_send(
                "mide",
                {
                    "type": "enviar_dato",
                    "message": {
                        "valor_medicion": float(data["valor_medicion"]),
                        "fecha_medicion": nuevo_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                        "fk_id_sensor": data["fk_id_sensor"],
                        "nombre_sensor": nombre_sensor,  # Agregamos el nombre del sensor
                        "fk_id_era": data["fk_id_era"]
                    }
                }
            )

        except Exception as e:
            print(f"❌ Error al procesar mensaje WebSocket: {e}")

    async def enviar_dato(self, event):
        """Recibe el evento de datos y lo envía al WebSocket."""
        await self.send(text_data=json.dumps(event["message"]))

    async def send_data_periodically(self):
        """Envía datos cada 10 segundos si existen registros en la BD."""
        Mide = apps.get_model('mide', 'Mide')
        Sensores = apps.get_model('sensores', 'Sensores')

        while True:
            await asyncio.sleep(10)  # Espera de 10 segundos

            try:
                # Obtener la última medición de la base de datos
                last_mide = await sync_to_async(lambda: Mide.objects.order_by('-fecha_medicion').first())()

                if last_mide:
                    # Obtener el nombre del sensor
                    sensor = await sync_to_async(lambda: Sensores.objects.get(id=last_mide.fk_id_sensor_id))()
                    nombre_sensor = sensor.nombre_sensor

                    message = {
                        "valor_medicion": float(last_mide.valor_medicion),
                        "fecha_medicion": last_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                        "fk_id_sensor": last_mide.fk_id_sensor_id,
                        "nombre_sensor": nombre_sensor,  # Agregamos el nombre del sensor
                        "fk_id_era": last_mide.fk_id_era_id
                    }
                    print("📡 Enviando datos:", message)
                    await self.send(text_data=json.dumps(message))
                else:
                    print("⚠️ No hay datos en la base de datos para enviar.")

            except Exception as e:
                print(f"❌ Error al obtener datos de la base de datos: {e}")
