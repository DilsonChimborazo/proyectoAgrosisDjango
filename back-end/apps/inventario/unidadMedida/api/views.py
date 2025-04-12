from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.inventario.unidadMedida.models import UnidadMedida
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer

class UnidadMedidaViewSet(ModelViewSet):
    queryset = UnidadMedida.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = UnidadMedidaSerializer