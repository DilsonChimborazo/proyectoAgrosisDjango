from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from apps.inventario.detalleInsumoCompuesto.models import DetalleInsumoCompuesto
from apps.inventario.detalleInsumoCompuesto.api.serializers import DetalleInsumoCompuestoSerializer


class DetalleInsumoCompuestoViewSet(ModelViewSet):
    serializer_class = DetalleInsumoCompuestoSerializer
    queryset = DetalleInsumoCompuesto.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]