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

        serializer = self.get_serializer(instancia, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        nueva_cantidad = serializer.validated_data.get('cantidad_herramienta')
        movimiento = request.data.get('movimiento', 'entrada').lower()

        if nueva_cantidad is None:
            raise ValidationError({"cantidad_herramienta": "Este campo es obligatorio"})

        # Ajustar stock según el tipo de movimiento
        if movimiento == 'salida':
            if cantidad_anterior < nueva_cantidad:
                raise ValidationError({
                    "error": f"No hay suficiente stock. Disponible: {cantidad_anterior}, intentando restar: {nueva_cantidad}"
                })
            cantidad_resultante = cantidad_anterior - nueva_cantidad
        else:  # entrada
            cantidad_resultante = cantidad_anterior + nueva_cantidad

        # Actualizar la cantidad
        instancia.cantidad_herramienta = cantidad_resultante
        instancia.nombre_h = serializer.validated_data.get('nombre_h', instancia.nombre_h)
        instancia.estado = serializer.validated_data.get('estado', instancia.estado)
        instancia.save()

        # Registrar movimiento
        Bodega.objects.create(
            fk_id_herramientas=instancia,
            movimiento=movimiento.capitalize(),
            cantidad_herramienta=nueva_cantidad,
            fecha=timezone.now()
        )

        return Response(self.get_serializer(instancia).data)

    
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