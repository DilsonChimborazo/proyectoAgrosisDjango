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

            # Calcular ETo usando Blaney-Criddle
            eto = calcular_eto(mediciones)

            # Usar un kc promedio para todos los cultivos
            kc_promedio = Decimal('0.85')  
            logger.info(f"Usando kc promedio: {kc_promedio}")

            etc = eto * kc_promedio

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
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError:
            return Response({"error": "Faltan datos de sensores"}, status=status.HTTP_400_BAD_REQUEST)