from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from apps.inventario.insumo.models import Insumo
from apps.inventario.insumo.api.serializers import InsumoSerializer, ReporteEgresosSerializer
from apps.trazabilidad.actividad.models import Actividad
from apps.inventario.utiliza.models import Utiliza
from django.db.models import Prefetch
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades

class InsumoViewSet(ModelViewSet):
    permissions_clases = [IsAuthenticatedOrReadOnly]
    queryset = Insumo.objects.all()
    serializer_class = InsumoSerializer

    @action(detail=False, methods=['get'], url_path='reporte-egresos')
    def reporte_egresos(self, request):
        """
        Endpoint para generar reporte de egresos por insumos agrupados por actividad
        """
        # Prefetch optimizado para las relaciones
        actividades = Actividad.objects.prefetch_related(
            Prefetch(
                'asignacion_actividades_set',
                queryset=Asignacion_actividades.objects.prefetch_related(
                    Prefetch(
                        'utiliza_set',
                        queryset=Utiliza.objects.select_related('fk_id_insumo')
                    )
                )
            )
        ).all()

        serializer = ReporteEgresosSerializer(actividades, many=True)
        
        # Calcular total general
        total_general = sum(
            item['costo_total'] for item in serializer.data
        )
        
        return Response({
            'reporte': serializer.data,
            'total_general': total_general,
            'estructura': "ACTIVIDADES | EGRESOS POR INSUMOS | TOTAL"
        })