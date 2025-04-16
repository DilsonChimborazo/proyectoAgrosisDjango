from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.iot.lote.models import Lote
from apps.iot.lote.api.serializers import leerLoteSerializer, escribirLoteSerializer

class LoteViewSet(ModelViewSet):
    queryset = Lote.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return leerLoteSerializer
        return escribirLoteSerializer

    @action(detail=False, methods=['get'], url_path='lotesActivos')
    def lotes_activos(self, request):
        lotes = Lote.objects.filter(estado='ocupado')  # Solo lotes ocupados
        serializer = leerLoteSerializer(lotes, many=True)
        return Response(serializer.data)
