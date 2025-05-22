import json
from decimal import Decimal
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.iot.mide.models import Mide
from apps.iot.sensores.models import Sensores
from apps.trazabilidad.plantacion.models import Plantacion
from apps.iot.evapotranspiracion.api.utils import calcular_eto
from apps.iot.evapotranspiracion.models import Evapotranspiracion
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class MideConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("mide", self.channel_name)
        await self.accept()
        logger.info("✅ Cliente conectado al WebSocket de mide")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("mide", self.channel_name)
        logger.info("⚠ Cliente desconectado del WebSocket de mide")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"✅ Dato recibido: {data}")

            required_fields = ["fk_id_sensor", "fk_id_plantacion", "valor_medicion"]
            if not all(field in data for field in required_fields):
                error_msg = f"⚠️ Datos incompletos recibidos: {data}"
                logger.error(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Verificar si el sensor existe
            sensor = await sync_to_async(lambda: Sensores.objects.get(id=data["fk_id_sensor"]))()
            if not sensor:
                error_msg = f"❌ Sensor con id {data['fk_id_sensor']} no existe"
                logger.error(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Verificar si la plantación existe
            plantacion = await sync_to_async(
                lambda: Plantacion.objects.select_related('fk_id_eras', 'fk_id_cultivo').get(id=data["fk_id_plantacion"])
            )()
            if not plantacion:
                error_msg = f"❌ Plantación con id {data['fk_id_plantacion']} no existe"
                logger.error(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Convertir valor_medicion a Decimal
            try:
                valor_medicion = Decimal(str(data["valor_medicion"]))
            except (ValueError, TypeError) as e:
                error_msg = f"❌ Error en valor_medicion: {str(e)}"
                logger.error(error_msg)
                await self.send(text_data=json.dumps({"error": error_msg}))
                return

            # Validar rango del sensor
            logger.info(f"Validando sensor {sensor.nombre_sensor}: valor={valor_medicion}, rango=[{sensor.medida_minima}, {sensor.medida_maxima}]")
            if not (sensor.medida_minima <= float(valor_medicion) <= sensor.medida_maxima):
                error_msg = f"❌ Valor fuera de rango para {sensor.nombre_sensor}: {valor_medicion}"
                logger.error(error_msg)
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

            # Construir el mensaje para el WebSocket de Mide
            message = {
                "valor_medicion": float(data["valor_medicion"]),
                "fecha_medicion": nuevo_mide.fecha_medicion.strftime("%Y-%m-%d %H:%M:%S"),
                "fk_id_sensor": int(data["fk_id_sensor"]),
                "nombre_sensor": nombre_sensor,
                "fk_id_plantacion": int(data["fk_id_plantacion"]),
                "nombre_era": nombre_era,
                "nombre_cultivo": nombre_cultivo
            }

            # Enviar datos al grupo de Mide
            await self.channel_layer.group_send("mide", {"type": "enviar_dato", "message": message})

            # Calcular Evapotranspiración si hay suficientes datos
            await self.calcular_y_guardar_evapotranspiracion(plantacion, nuevo_mide.fecha_medicion.date())

        except Exception as e:
            error_msg = f"❌ Error al procesar mensaje WebSocket: {str(e)}"
            logger.error(error_msg)
            await self.send(text_data=json.dumps({"error": error_msg}))

    async def enviar_dato(self, event):
        try:
            mensaje = json.dumps(event["message"])
            logger.info(f"📡 Datos enviados al frontend: {mensaje}")
            await self.send(text_data=mensaje)
        except Exception as e:
            logger.error(f"❌ Error al enviar datos WebSocket: {e}")

    async def calcular_y_guardar_evapotranspiracion(self, plantacion, fecha):
        try:
            # Verificar si la plantación tiene cultivo asociado
            if not plantacion.fk_id_cultivo:
                logger.warning(f"Plantación {plantacion.id} no tiene cultivo asociado. No se calcula ETo.")
                return

            # Obtener mediciones del día actual para la plantación
            mediciones = await sync_to_async(
                lambda: Mide.objects.filter(
                    fk_id_plantacion=plantacion,
                    fecha_medicion__date=fecha
                ).select_related('fk_id_sensor')
            )()

            # Verificar si hay suficientes datos para calcular ETo
            required_sensors = ['TEMPERATURA', 'HUMEDAD_AMBIENTAL', 'VELOCIDAD_VIENTO', 'ILUMINACION']
            sensor_types = await sync_to_async(
                lambda: set(medicion.fk_id_sensor.tipo_sensor for medicion in mediciones)
            )()
            if not all(sensor_type in sensor_types for sensor_type in required_sensors):
                logger.info(f"No hay suficientes datos de sensores para plantación {plantacion.id} en {fecha}")
                return

            # Calcular ETo
            try:
                eto = await sync_to_async(calcular_eto)(mediciones, altitud=1000)  # Ajusta la altitud según sea necesario
            except ValueError as e:
                logger.error(f"Error al calcular ETo para plantación {plantacion.id}: {str(e)}")
                return

            # Seleccionar kc según etapa_actual
            cultivo = await sync_to_async(lambda: plantacion.fk_id_cultivo)()
            etapa = cultivo.etapa_actual.lower() if cultivo.etapa_actual else ""
            if etapa == "inicial":
                kc = Decimal(str(cultivo.kc_inicial)) if cultivo.kc_inicial is not None else Decimal('1.0')
            elif etapa == "desarrollo":
                kc = Decimal(str(cultivo.kc_desarrollo)) if cultivo.kc_desarrollo is not None else Decimal('1.0')
            elif etapa == "final":
                kc = Decimal(str(cultivo.kc_final)) if cultivo.kc_final is not None else Decimal('1.0')
            else:
                kc = Decimal('1.0')
                logger.warning(f"Etapa desconocida '{etapa}' para cultivo {cultivo.id}. Usando kc=1.0")

            etc = eto * kc

            # Verificar si ya existe un registro de Evapotranspiracion para esta plantación y fecha
            evap_exists = await sync_to_async(
                lambda: Evapotranspiracion.objects.filter(
                    fk_id_plantacion=plantacion,
                    fecha=fecha
                ).exists()
            )()

            if evap_exists:
                logger.info(f"Ya existe un registro de Evapotranspiracion para plantación {plantacion.id} en {fecha}")
                return

            # Guardar en Evapotranspiracion
            evap = await sync_to_async(Evapotranspiracion.objects.create)(
                fk_id_plantacion=plantacion,
                fecha=fecha,
                eto=eto,
                etc=etc
            )
            logger.info(f"Evapotranspiración calculada y guardada: ETo={eto}, ETc={etc} para plantación {plantacion.id}")

        except Exception as e:
            logger.error(f"Error al calcular y guardar evapotranspiración: {str(e)}")