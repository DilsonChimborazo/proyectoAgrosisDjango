from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import Count, Sum
from apps.inventario.herramientas.models import Herramientas
from apps.inventario.bodega.models import Bodega
from apps.inventario.herramientas.api.serializers import HerramientasSerializer
from rest_framework.exceptions import ValidationError  

class HerramientasViewSet(ModelViewSet):
    queryset = Herramientas.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = HerramientasSerializer


    def update(self, request, *args, **kwargs):
        instancia = self.get_object()
        cantidad_anterior = instancia.cantidad_herramienta

        serializer = self.get_serializer(instancia, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)

        cantidad_nueva = serializer.validated_data.get('cantidad_herramienta', cantidad_anterior)
        movimiento = request.data.get('movimiento', 'entrada').lower()

        # Determinar la cantidad de movimiento real
        if movimiento == 'salida':
            if cantidad_nueva > cantidad_anterior:
                raise ValidationError({
                    "error": f"No hay suficiente stock. Disponible: {cantidad_anterior}, Intentando restar: {cantidad_nueva}"
                })
            cantidad_movimiento = cantidad_anterior - cantidad_nueva
        else:
            cantidad_movimiento = cantidad_nueva - cantidad_anterior

        # Registrar el movimiento en bodega
        Bodega.objects.create(
            fk_id_herramientas=instancia,
            movimiento=movimiento.capitalize(),
            cantidad_herramienta=cantidad_movimiento,  # Usando el campo correcto
            fecha=timezone.now()
        )

        instancia.refresh_from_db()
        serializer = self.get_serializer(instancia)
        return Response(serializer.data)
    
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