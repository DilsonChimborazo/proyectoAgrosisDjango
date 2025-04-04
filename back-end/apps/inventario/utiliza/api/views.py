from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.inventario.utiliza.models import Utiliza
from apps.inventario.utiliza.api.serializers import LeerUtilizaSerializer, UtilizaSerializer

class UtilizaViewset(ModelViewSet):
    queryset = Utiliza.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly] 

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerUtilizaSerializer
        return UtilizaSerializer 
