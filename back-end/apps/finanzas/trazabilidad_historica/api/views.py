from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.trazabilidad_historica.models import SnapshotTrazabilidad, ResumenTrazabilidad
from apps.finanzas.trazabilidad_historica.api.serializers import SnapshotSerializer, ResumenTrazabilidadSerializer
from apps.finanzas.trazabilidad_historica.services import TrazabilidadService
from datetime import datetime

class CustomPagination(PageNumberPagination):
    permission_classes = [IsAuthenticated]
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'results': data
        })

class HistorialViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = SnapshotTrazabilidad.objects.all()
    serializer_class = SnapshotSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        plantacion_id = self.kwargs.get('plantacion_id')
        if plantacion_id:
            return SnapshotTrazabilidad.objects.filter(
                plantacion_id=plantacion_id
            ).order_by('-fecha_registro')
        return super().get_queryset()

class TrazabilidadPlantacionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, plantacion_id):
        try:
            datos = TrazabilidadService.generar_datos_trazabilidad(plantacion_id)
            if not datos:
                return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
            return Response(datos)
        except Exception:
            return Response({"error": "Ocurrió un error interno en el servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistoricoTrazabilidadAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SnapshotSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        plantacion_id = self.kwargs['plantacion_id']
        return SnapshotTrazabilidad.objects.filter(
            plantacion_id=plantacion_id
        ).order_by('-fecha_registro')

class ResumenActualTrazabilidadAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, plantacion_id):
        try:
            resumen = ResumenTrazabilidad.objects.get(plantacion_id=plantacion_id)
            serializer = ResumenTrazabilidadSerializer(resumen)
            return Response(serializer.data)
        except ResumenTrazabilidad.DoesNotExist:
            datos_calculados = TrazabilidadService.generar_datos_trazabilidad(plantacion_id)
            if not datos_calculados:
                return Response(
                    {"error": f"Plantación con id={plantacion_id} no encontrada."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            respuesta_adaptada = {
                'ultima_actualizacion': datetime.now(),
                'datos_actuales': datos_calculados,
                'precio_minimo_venta_por_unidad': datos_calculados.get('precio_minimo_venta_por_unidad_acumulado', 0)
            }
            return Response(respuesta_adaptada, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Ocurrió un error interno en el servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)