from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.tipo_cultivo.models import Tipo_cultivo
from apps.trazabilidad.tipo_cultivo.api.serializers import LeerTipo_cultivoSerializer, EscribirTipo_cultivoSerializer

class Tipo_cultivoModelViewSet(ModelViewSet):
    queryset = Tipo_cultivo.objects.all()
    permissions_clases = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerTipo_cultivoSerializer
        return EscribirTipo_cultivoSerializer
