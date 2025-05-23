import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.evapotranspiracion.models import Evapotranspiracion
import logging

logger = logging.getLogger(__name__)

class EvapotranspiracionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("evapotranspiracion", self.channel_name)
        await self.accept()
        logger.info("✅ Cliente conectado al WebSocket de evapotranspiración")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("evapotranspiracion", self.channel_name)
        logger.info(f"WebSocket desconectado: {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            fk_id_plantacion = data.get('fk_id_plantacion')
            logger.info(f"📥 Mensaje recibido: fk_id_plantacion={fk_id_plantacion}")

            if not fk_id_plantacion:
                logger.warning("⚠️ No se proporcionó fk_id_plantacion")
                await self.send(text_data=json.dumps({'error': 'Se requiere fk_id_plantacion'}))
                return

            latest = await sync_to_async(
                lambda: Evapotranspiracion.objects.filter(fk_id_plantacion_id=fk_id_plantacion).order_by('-fecha').first()
            )()
            if latest:
                await self.send(text_data=json.dumps({
                    'id': latest.id,
                    'plantacion_id': latest.fk_id_plantacion_id,
                    'nombre_plantacion': latest.nombre_plantacion,
                    'era_id': latest.era_id,
                    'nombre_era': latest.nombre_era,
                    'cultivo': latest.cultivo,
                    'eto': float(latest.eto),
                    'etc': float(latest.etc),
                    'fecha': latest.fecha.isoformat(),
                }))
                logger.info(f"📡 Enviado dato de evapotranspiración para fk_id_plantacion: {fk_id_plantacion}")
            else:
                logger.info(f"No hay datos de evapotranspiración para fk_id_plantacion: {fk_id_plantacion}")
                await self.send(text_data=json.dumps({'message': 'No hay datos disponibles'}))
        except Exception as e:
            logger.error(f"❌ Error al procesar mensaje WebSocket: {str(e)}")
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def evapotranspiracion_data(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))
        logger.info(f"📡 Enviado nuevo dato de evapotranspiración al frontend: {message}")