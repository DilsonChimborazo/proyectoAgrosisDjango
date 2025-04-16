from rest_framework.viewsets import ModelViewSet
from apps.finanzas.nomina.models import Nomina
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.finanzas.nomina.api.serializers import (
    LeerNominaSerializer,
    EscribirNominaSerializer
)

class NominaViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Nomina.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerNominaSerializer
        return EscribirNominaSerializer
