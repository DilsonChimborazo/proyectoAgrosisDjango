from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.finanzas.venta.api.serializers import VentaSerializer, CrearVentaSerializer, LeerItemVentaSerializer

class VentaViewSet(ModelViewSet):
    queryset = Venta.objects.prefetch_related('items').all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return VentaSerializer
        return CrearVentaSerializer

class ItemVentaViewSet(ModelViewSet):
    serializer_class = LeerItemVentaSerializer
    permission_classes = [IsAuthenticated]
    queryset = ItemVenta.objects.select_related('produccion', 'unidad_medida').all()
    
    def get_queryset(self):
        venta_id = self.kwargs.get('venta_pk')
        if venta_id:
            return self.queryset.filter(venta_id=venta_id)
        return self.queryset.none()