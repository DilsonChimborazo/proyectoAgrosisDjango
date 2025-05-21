import json
from decimal import Decimal
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.mide.models import Mide
from apps.iot.sensores.models import Sensores
from apps.trazabilidad.plantacion.models import Plantacion

class MideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("mide", self.channel_name)
        await self.accept()
        print("✅ Cliente conectado al WebSocket de mide")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("mide", self.channel_name)
        print("⚠ Cliente desconectado del WebSocket de mide")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print("✅ Dato recibido:", data)

            required_fields = ["fk_id_sensor", "fk_id_plantacion", "valor_medicion"]
            if not all(field in data for field in required_fields):
                error_msg = "⚠️ Datos incompletos recibidos: " + str(data)
                print(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Verificar si el sensor existe
            try:
                sensor = await sync_to_async(lambda: Sensores.objects.get(id=data["fk_id_sensor"]))()
            except Sensores.DoesNotExist:
                error_msg = f"❌ Sensor con id {data['fk_id_sensor']} no existe"
                print(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Verificar si la plantación existe
            try:
                plantacion = await sync_to_async(lambda: Plantacion.objects.select_related('fk_id_eras', 'fk_id_cultivo').get(id=data["fk_id_plantacion"]))()
            except Plantacion.DoesNotExist:
                error_msg = f"❌ Plantación con id {data['fk_id_plantacion']} no existe"
                print(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Convertir valor_medicion a Decimal
            try:
                valor_medicion = Decimal(str(data["valor_medicion"]))
            except (ValueError, TypeError) as e:
                error_msg = f"❌ Error en valor_medicion: {str(e)}"
                print(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Crear una nueva medición
            nuevo_mide = await sync_to_async(Mide.objects.create)(
                fk_id_sensor_id=data["fk_id_sensor"],
                fk_id_plantacion_id=data["fk_id_plantacion"],
                valor_medicion=valor_medicion
            )

            # Obtener el nombre del sensor
            nombre_sensor = sensor.nombre_sensor

            # Obtener la plantación, era y cultivo
            nombre_era = plantacion.fk_id_eras.descripcion if plantacion.fk_id_eras else "Sin Era"
            nombre_cultivo = plantacion.fk_id_cultivo.nombre_cultivo if plantacion.fk_id_cultivo else "Sin Cultivo"

            # Construir el mensaje
            message = {
                "valor_medicion": float(data["valor_medicion"]),
                "fecha_medicion": nuevo_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                "fk_id_sensor": int(data["fk_id_sensor"]),
                "nombre_sensor": nombre_sensor,
                "fk_id_plantacion": int(data["fk_id_plantacion"]),
                "nombre_era": nombre_era,
                "nombre_cultivo": nombre_cultivo
            }

            print("📡 Enviando datos al frontend:", message)
            await self.channel_layer.group_send("mide", {"type": "enviar_dato", "message": message})

        except Exception as e:
            error_msg = f"❌ Error al procesar mensaje WebSocket: {str(e)}"
            print(error_msg)
            await self.send(text_data=json.dumps({"error": error_msg}))

    async def enviar_dato(self, event):
        try:
            mensaje = json.dumps(event["message"])
            print("📡 Datos enviados al frontend:", mensaje)
            await self.send(text_data=mensaje)
        except Exception as e:
            print(f"❌ Error al enviar datos WebSocket: {e}")