from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.iot.mide.models import Mide
from apps.iot.mide.api.serializers import leerMideSerializer, escribirMideSerializer

class MideViewSet(ModelViewSet):
    queryset = Mide.objects.select_related('fk_id_sensor', 'fk_id_era__fk_id_lote')  
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:  # Corregí 'retrive' → 'retrieve'
            return leerMideSerializer
        return escribirMideSerializer
