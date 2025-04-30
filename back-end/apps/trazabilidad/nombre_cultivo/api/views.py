from rest_framework.viewsets import ModelViewSet
from apps.trazabilidad.nombre_cultivo.models import Nombre_cultivo
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.trazabilidad.nombre_cultivo.api.serializers import LeerNombreCultivoSerializer, EscribirNombreCultivoSerializer

class NombreCultivoViewSet(ModelViewSet):
    permissions_clases = [IsAuthenticatedOrReadOnly]
    queryset = Nombre_cultivo.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list','retrieve']:
            return LeerNombreCultivoSerializer
        return EscribirNombreCultivoSerializer