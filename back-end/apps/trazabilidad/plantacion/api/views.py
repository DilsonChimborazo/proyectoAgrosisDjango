from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.plantacion.api.serializers import LeerPlantacionSerializer, escribirPlantacionSerializer

class PlantacionViewSet(ModelViewSet):
    queryset = Plantacion.objects.all()
    permissions_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list','retrieve']:
            return LeerPlantacionSerializer
        return escribirPlantacionSerializer