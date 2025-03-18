import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.eras.models import Eras
from apps.iot.eras.api.serializers import leerErasSerializer

class ErasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Conexión WebSocket"""
        await self.channel_layer.group_add("eras", self.channel_name)
        await self.accept()
        print("✅ Conexión WebSocket establecida con el cliente")

    async def disconnect(self, close_code):
        """Desconexión WebSocket"""
        await self.channel_layer.group_discard("eras", self.channel_name)
        print("❌ Conexión WebSocket cerrada")

    async def receive(self, text_data):
        """Maneja los mensajes entrantes desde el cliente"""
        data = json.loads(text_data)

        if "fk_id_lote" in data:
            fk_id_lote = data["fk_id_lote"]
            print(f"📩 Mensaje recibido: Buscando eras para lote {fk_id_lote}")

            # Obtener datos de las eras asociadas al lote
            eras_data = await self.get_eras_data(fk_id_lote)

            if eras_data:
                print(f"📡 Eras encontradas: {json.dumps(eras_data, indent=2)}")
                await self.send(text_data=json.dumps({
                    "status": "success",
                    "message": "Datos de eras encontrados",
                    "data": eras_data
                }))
            else:
                print("⚠️ No se encontraron eras para este lote")
                await self.send(text_data=json.dumps({
                    "status": "error",
                    "message": "No se encontraron eras para este lote"
                }))

        else:
            # Si no se especifica lote, obtener **todas las eras**
            eras_data = await self.get_all_eras()
            print(f"📡 Todas las eras encontradas: {json.dumps(eras_data, indent=2)}")

            await self.send(text_data=json.dumps({
                "status": "success",
                "message": "Lista completa de eras",
                "data": eras_data
            }))

    async def eras_data(self, event):
        """Envía los datos de las eras al cliente en tiempo real"""
        await self.send(text_data=json.dumps({
            "status": "update",
            "message": "Actualización de eras en tiempo real",
            "data": event["message"]
        }))

    @sync_to_async
    def get_eras_data(self, fk_id_lote):
        """Consulta la base de datos para obtener las eras asociadas a un lote"""
        eras = Eras.objects.filter(fk_id_lote=fk_id_lote)
        return self.serialize_eras(eras)

    @sync_to_async
    def get_all_eras(self):
        """Consulta la base de datos para obtener **todas** las eras registradas"""
        eras = Eras.objects.all()
        print(f"🔍 Total de eras encontradas: {eras.count()}")  # Depuración
        return self.serialize_eras(eras)

    def serialize_eras(self, eras):
        """Serializa las eras manualmente"""
        serialized_eras = [
            {
                "id": era.id,
                "nombre": era.nombre,
                "fk_id_sensor": era.fk_id_sensor.id if era.fk_id_sensor else None,
                "fk_id_lote": era.fk_id_lote.id if era.fk_id_lote else None,
            }
            for era in eras
        ]
        print(f"📊 Datos serializados manualmente: {json.dumps(serialized_eras, indent=2)}")
        return serialized_eras if serialized_eras else None
