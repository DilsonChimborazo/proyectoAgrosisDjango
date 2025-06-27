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

        plantacion_id = request.query_params.get('fk_id_plantacion')
        if not plantacion_id:
          
            return Response({"error": "Se requiere el parámetro fk_id_plantacion"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plantacion = Plantacion.objects.get(id=plantacion_id)
        
            evapotranspiraciones = Evapotranspiracion.objects.filter(fk_id_plantacion=plantacion)
           

            serializer = LeerEvapotranspiracionSerializer(evapotranspiraciones, many=True)
            return Response(serializer.data)
        except Plantacion.DoesNotExist:
          
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
           
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    