from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.realiza.models import Realiza
from apps.trazabilidad.realiza.api.serializers import LeerRealizaSerializer, EscribirRealizaSerializer

class RealizaModelViewSet(ModelViewSet):
    queryset = Realiza.objects.all()
    permissions_clases = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerRealizaSerializer
        return EscribirRealizaSerializer
