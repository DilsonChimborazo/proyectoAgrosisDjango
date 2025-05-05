from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.inventario.insumo.models import Insumo
from apps.inventario.insumo.api.serializers import InsumoSerializer, InsumoCreateSerializer


class InsumoViewSet(ModelViewSet):
    queryset = Insumo.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return InsumoCreateSerializer
        return InsumoSerializer

    @action(detail=False, methods=['get'], url_path='reporteBajoStock')
    def bajo_stock(self, request):
        umbral = int(request.query_params.get('umbral', 500))
        insumos_bajos = Insumo.objects.filter(stock__lt=umbral)
        serializer = self.get_serializer(insumos_bajos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)