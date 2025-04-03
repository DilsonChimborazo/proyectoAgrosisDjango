from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from ..models import Programacion
from .serializers import LeerProgramacionSerializer, EscribirProgramacionSerializer, ReporteTiemposSerializer

class ProgramacionModelViewSet(ModelViewSet):
    queryset = Programacion.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerProgramacionSerializer
        return EscribirProgramacionSerializer

    @action(detail=False, methods=['get'], url_path='reporte-tiempos')
    def reporte_tiempos(self, request):
        """
        Endpoint para generar reporte de tiempos por actividad similar a la imagen proporcionada
        """
        # Agrupar por actividad y sumar tiempos
        resultados = Programacion.objects.values(
            'fk_id_asignacionActividades__fk_id_actividad__nombre_actividad'
        ).annotate(
            tiempo_total=Sum('duracion'),
            veces_realizada=Count('id')
        ).order_by('-tiempo_total')
        
        # Calcular total general
        total_general = sum(item['tiempo_total'].total_seconds() / 60 for item in resultados)
        
        serializer = ReporteTiemposSerializer(resultados, many=True)
        
        return Response({
            'actividades': serializer.data,
            'total_general_minutos': total_general,
            'estructura_reporte': [
                "ACTIVIDAD | Tiempo dedicado (minutos) | TOTAL",
                "--------------------------------------------"
            ]
        })