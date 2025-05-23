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

            eto = calcular_eto(mediciones, altitud=1000)  # Ajusta la altitud según sea necesario
            cultivo = plantacion.fk_id_cultivo
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