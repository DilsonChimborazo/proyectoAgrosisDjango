from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from apps.inventario.insumoCompuesto.models import InsumoCompuesto
from apps.inventario.insumoCompuesto.api.serializers import InsumoCompuestoSerializer


class InsumoCompuestoViewSet(ModelViewSet):
    serializer_class = InsumoCompuestoSerializer
    queryset = InsumoCompuesto.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]