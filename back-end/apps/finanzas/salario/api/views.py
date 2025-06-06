from rest_framework.viewsets import ModelViewSet
from apps.finanzas.nomina.models import Salario
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.salario.api.serializers import (
    LeerSalarioSerializer,
    EscribirSalarioSerializer
)

class SalarioViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Salario.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerSalarioSerializer
        return EscribirSalarioSerializer