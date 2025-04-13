from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.inventario.insumo.models import Insumo
from apps.inventario.insumo.api.serializers import InsumoSerializer


class InsumoViewSet(ModelViewSet):
    serializer_class = InsumoSerializer
    queryset = Insumo.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'], url_path='reporteBajoStock')
    def bajo_stock(self, request):
        """
        Retorna los insumos cuyo stock esté por debajo del umbral (por defecto 10).
        Puedes pasar el umbral con el parámetro ?umbral=5 en la URL.
        """
        umbral = int(request.query_params.get('umbral', 500))
        insumos_bajos = Insumo.objects.filter(stock__lt=umbral)
        serializer = self.get_serializer(insumos_bajos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
