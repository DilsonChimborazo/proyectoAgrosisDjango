from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
#from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from apps.iot.mide.models import Mide
from apps.iot.mide.api.serializers import leerMideSerializer, escribirMideSerializer

class MideViewSet(ModelViewSet):
    queryset = Mide.objects.select_related('fk_id_sensor', 'fk_id_plantacion__fk_id_eras', 'fk_id_plantacion__fk_id_cultivo').all()
    #permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['fk_id_sensor', 'fecha_medicion']
    serializer_class = leerMideSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return leerMideSerializer
        return escribirMideSerializer

    def get_serializer(self, *args, **kwargs):
        if getattr(self, 'swagger_fake_view', False):
            return None
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        print("📡 Endpoint /api/mediciones/ alcanzado")
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='por-sensor/(?P<sensor_id>[^/.]+)')
    def por_sensor(self, request, sensor_id=None):
        try:
            mediciones = self.queryset.filter(fk_id_sensor=sensor_id)
            serializer = self.get_serializer(mediciones, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data,
                'count': mediciones.count()
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=400)