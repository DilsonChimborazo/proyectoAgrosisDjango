import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.evapotranspiracion.models import Evapotranspiracion
import logging
import asyncio

logger = logging.getLogger(__name__)

class EvapotranspiracionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("evapotranspiracion", self.channel_name)
        await self.accept()
        logger.info("✅ Cliente conectado al WebSocket de evapotranspiración")
        # Iniciar el sondeo de la base de datos
        self.polling = True
        asyncio.create_task(self.poll_database())

    async def disconnect(self, close_code):
        self.polling = False  # Detener el sondeo al desconectar
        await self.channel_layer.group_discard("evapotranspiracion", self.channel_name)
        logger.info(f"WebSocket desconectado: {close_code}")

    async def poll_database(self):
        last_id = None
        while self.polling:
            try:
                # Consultar el registro más reciente
                latest = await sync_to_async(
                    lambda: Evapotranspiracion.objects.select_related('fk_id_plantacion__fk_id_cultivo', 'fk_id_plantacion__fk_id_eras').order_by('-id').first()
                )()
                if latest and (last_id is None or latest.id > last_id):
                    # Se encontró un nuevo registro
                    # Obtener datos de relaciones usando sync_to_async
                    nombre_plantacion = await sync_to_async(
                        lambda: latest.fk_id_plantacion.fk_id_cultivo.nombre_cultivo if latest.fk_id_plantacion.fk_id_cultivo else 'Sin plantación'
                    )()
                    era_id = await sync_to_async(
                        lambda: latest.fk_id_plantacion.fk_id_eras.id if latest.fk_id_plantacion.fk_id_eras else None
                    )()
                    nombre_era = await sync_to_async(
                        lambda: latest.fk_id_plantacion.fk_id_eras.nombre if latest.fk_id_plantacion.fk_id_eras else 'Sin era'
                    )()
                    cultivo = await sync_to_async(
                        lambda: latest.fk_id_plantacion.fk_id_cultivo.nombre_cultivo if latest.fk_id_plantacion.fk_id_cultivo else 'Sin cultivo'
                    )()

                    data = {
                        'id': latest.id,
                        'plantacion_id': latest.fk_id_plantacion_id,
                        'nombre_plantacion': nombre_plantacion,
                        'era_id': era_id,
                        'nombre_era': nombre_era,
                        'cultivo': cultivo,
                        'eto': float(latest.eto),
                        'etc': float(latest.etc),
                        'cantidad_agua': float(latest.cantidad_agua) if latest.cantidad_agua is not None else 0.0,
                        'fecha': latest.fecha.isoformat(),
                    }
                    await self.send(text_data=json.dumps(data))
                    logger.info(f"📡 Enviado nuevo dato de evapotranspiración: {data}")
                    last_id = latest.id  # Actualizar el último ID visto
                await asyncio.sleep(5)  # Sondear cada 5 segundos
            except Exception as e:
                logger.error(f"❌ Error al consultar la base de datos: {str(e)}")
                await self.send(text_data=json.dumps({'error': str(e)}))
                await asyncio.sleep(5)  # Esperar antes de reintentar en caso de error