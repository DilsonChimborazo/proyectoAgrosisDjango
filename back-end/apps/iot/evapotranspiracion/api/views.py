from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from apps.iot.mide.models import Mide
from apps.trazabilidad.plantacion.models import Plantacion
from apps.iot.evapotranspiracion.models import Evapotranspiracion
from apps.iot.evapotranspiracion.api.utils import calcular_eto
from apps.iot.evapotranspiracion.api.serializers import LeerEvapotranspiracionSerializer
from datetime import date
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class EvapotranspiracionViewSet(ViewSet):
    def list(self, request):
        logger.info("Solicitud recibida en EvapotranspiracionViewSet.list")
        plantacion_id = request.query_params.get('fk_id_plantacion')
        if not plantacion_id:
            logger.error("Falta el parámetro fk_id_plantacion")
            return Response({"error": "Se requiere el parámetro fk_id_plantacion"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plantacion = Plantacion.objects.get(id=plantacion_id)
            logger.info(f"Plantación encontrada: {plantacion_id}")
            evapotranspiraciones = Evapotranspiracion.objects.filter(fk_id_plantacion=plantacion)
            logger.info(f"Registros encontrados: {evapotranspiraciones.count()}")

            serializer = LeerEvapotranspiracionSerializer(evapotranspiraciones, many=True)
            return Response(serializer.data)
        except Plantacion.DoesNotExist:
            logger.error(f"Plantación no encontrada: {plantacion_id}")
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error en list: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            plantacion = Plantacion.objects.get(id=pk)
            if not plantacion.fk_id_cultivo:
                return Response({"error": "La plantación no tiene un cultivo asociado"}, status=status.HTTP_400_BAD_REQUEST)

            mediciones = Mide.objects.filter(
                fk_id_plantacion_id=pk,
                fecha_medicion__date=date.today()
            )

            if not mediciones.exists():
                return Response({"error": "No hay mediciones para hoy"}, status=status.HTTP_404_NOT_FOUND)

            # Depurar las mediciones utilizadas
            logger.info(f"Mediciones encontradas para hoy (plantación {pk}):")
            for m in mediciones:
                logger.info(f"  - Sensor: {m.fk_id_sensor.nombre_sensor}, Valor: {m.valor_medicion}, Tipo: {type(m.valor_medicion).__name__}, Fecha: {m.fecha_medicion}")

            # Calcular ETo usando Blaney-Criddle
            eto = calcular_eto(mediciones)
            logger.info(f"Valor calculado de ETo: {eto}, Tipo: {type(eto).__name__}")

            # Usar un kc promedio para todos los cultivos
            kc_promedio = Decimal('0.85')
            logger.info(f"Valor de kc_promedio usado: {kc_promedio}, Tipo: {type(kc_promedio).__name__}")

            # Convertir eto a Decimal para evitar problemas de precisión
            eto_decimal = Decimal(str(eto))
            logger.info(f"Conversión de ETo a Decimal: {eto_decimal}, Tipo: {type(eto_decimal).__name__}")

            # Calcular etc y depurar
            etc = eto_decimal * kc_promedio
            logger.info(f"Cálculo de etc: ETo ({eto_decimal}) * kc_promedio ({kc_promedio}) = {etc}, Tipo: {type(etc).__name__}")

            # Guardar el cálculo
            evap = Evapotranspiracion.objects.create(
                fk_id_plantacion=plantacion,
                fecha=date.today(),
                eto=eto,
                etc=etc
            )

            serializer = LeerEvapotranspiracionSerializer(evap)
            return Response(serializer.data)
        except Plantacion.DoesNotExist:
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            logger.error(f"Error en el cálculo de ETo: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError:
            logger.error("Faltan datos de sensores en las mediciones")
            return Response({"error": "Faltan datos de sensores"}, status=status.HTTP_400_BAD_REQUEST)