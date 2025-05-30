from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.inventario.unidadMedida.models import UnidadMedida
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer

class UnidadMedidaViewSet(ModelViewSet):
    queryset = UnidadMedida.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UnidadMedidaSerializer