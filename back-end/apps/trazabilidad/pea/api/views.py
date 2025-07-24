from rest_framework.viewsets import ModelViewSet
from apps.trazabilidad.pea.models import Pea
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.pea.api.serializers import LeerPeaSerializer

class PeaViewSet(ModelViewSet):
    queryset = Pea.objects.all()
    permissions_clases = [IsAuthenticated]
    serializer_class = LeerPeaSerializer