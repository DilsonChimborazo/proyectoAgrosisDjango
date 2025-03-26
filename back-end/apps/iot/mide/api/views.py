from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.iot.mide.models import Mide
from apps.iot.mide.api.serializers import leerMideSerializer, escribirMideSerializer

class MideViewSet(ModelViewSet):
    queryset = Mide.objects.select_related('fk_id_sensor', 'fk_id_era__fk_id_lote').all()  # Aseguramos que el queryset incluya .all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return leerMideSerializer
        return escribirMideSerializer

    def list(self, request, *args, **kwargs):
        # Agregamos un print para depurar y confirmar que el endpoint está siendo alcanzado
        print("📡 Endpoint /api/mediciones/ alcanzado")
        return super().list(request, *args, **kwargs)