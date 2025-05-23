from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from apps.iot.controlRiego.models import ControlRiego
from apps.iot.controlRiego.api.serializer import ControlRiegoSerializer
from apps.trazabilidad.plantacion.models import Plantacion
import logging
import requests

logger = logging.getLogger(__name__)

class ControlRiegoViewSet(ViewSet):
    def create(self, request):
        try:
            plantacion_id = request.data.get('plantacion_id')
            estado = request.data.get('estado')
            etc = request.data.get('etc')

            if not plantacion_id or not estado or etc is None:
                logger.error("Faltan parámetros: plantacion_id, estado o etc")
                return Response({"error": "Se requieren plantacion_id, estado y etc"}, status=status.HTTP_400_BAD_REQUEST)

            if estado not in ['encendido', 'apagado']:
                logger.error(f"Estado inválido: {estado}")
                return Response({"error": "Estado debe ser 'encendido' o 'apagado'"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                plantacion = Plantacion.objects.get(id=plantacion_id)
            except Plantacion.DoesNotExist:
                logger.error(f"Plantación no encontrada: {plantacion_id}")
                return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

            # Crear registro en ControlRiego
            control_riego = ControlRiego(
                fk_id_plantacion=plantacion,
                estado=estado,
                etc=etc
            )
            control_riego.save()

            # Integración IoT (HTTP)
            try:
                response = requests.post(
                    "http://192.168.0.200:80/valve/control",  # Reemplaza con la URL de tu dispositivo
                    json={"state": "on" if estado == "encendido" else "off"},
                    timeout=5
                )
                response.raise_for_status()
                logger.info(f"Comando HTTP enviado: {estado} para plantación {plantacion_id}")
            except requests.RequestException as http_error:
                logger.error(f"Error enviando comando HTTP: {str(http_error)}")
                pass  # No fallar si el HTTP falla

            serializer = ControlRiegoSerializer(control_riego)
            logger.info(f"Riego {estado} registrado para plantación {plantacion_id} con ETc={etc}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error al controlar riego: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        plantacion_id = request.query_params.get('plantacion_id')
        if not plantacion_id:
            return Response({"error": "Se requiere plantacion_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            latest_control = ControlRiego.objects.filter(fk_id_plantacion_id=plantacion_id).order_by('-fecha').first()
            if not latest_control:
                return Response({"plantacion_id": plantacion_id, "estado": "apagado", "etc": 0, "fecha": None}, status=status.HTTP_200_OK)
            serializer = ControlRiegoSerializer(latest_control)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error al obtener estado de riego: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)