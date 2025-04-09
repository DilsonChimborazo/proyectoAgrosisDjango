from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Count, Sum
from apps.inventario.herramientas.models import Herramientas
from apps.inventario.herramientas.api.serializers import HerramientasSerializer

class HerramientasViewSet(ModelViewSet):
    queryset = Herramientas.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = HerramientasSerializer
    
    @action(detail=False, methods=['get'], url_path='reporte-estado')
    def reporte_estado(self, request):
        """
        Reporte agrupado por estado (Disponible, Prestado, En reparación)
        """
        # Obtener las opciones de estado del modelo
        estados_disponibles = [choice[0] for choice in Herramientas._meta.get_field('estado').choices]
        
        # Consulta para agrupar por estado
        resultados = Herramientas.objects.values('estado').annotate(
            cantidad=Count('id'),
            stock_total=Sum('stock')
        ).order_by('estado')
        
        # Totales generales
        total_herramientas = Herramientas.objects.count()
        total_stock = Herramientas.objects.aggregate(total=Sum('stock'))['total'] or 0
        
        return Response({
            "reporte_por_estado": list(resultados),
            "resumen_general": {
                "total_herramientas": total_herramientas,
                "total_stock": total_stock,
                "estados_disponibles": estados_disponibles
            },
            "estructura": {
                "reporte": "ESTADO | CANTIDAD | STOCK TOTAL",
                "resumen": "TOTAL HERRAMIENTAS | TOTAL STOCK | ESTADOS DISPONIBLES"
            }
        })