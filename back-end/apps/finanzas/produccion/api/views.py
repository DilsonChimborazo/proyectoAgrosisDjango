from rest_framework.viewsets import ModelViewSet
from apps.finanzas.produccion.models import Produccion
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.produccion.api.serializers import ProduccionSerializer, escribirProduccionSerializer

class ProduccionViewSet(ModelViewSet):
    queryset = Produccion.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list','retrive']:
            return ProduccionSerializer
        return escribirProduccionSerializer
    
    