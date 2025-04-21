from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.inventario.bodega.models import Bodega
from apps.inventario.bodega.api.serializers import leerBodegaSerializer, escribirBodegaSerializer

class BodegaModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Bodega.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return leerBodegaSerializer
        return escribirBodegaSerializer