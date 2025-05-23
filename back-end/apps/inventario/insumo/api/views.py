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
    
    def update(self, request, *args, **kwargs):
        # Manejar la actualización (PUT/PATCH) y devolver los datos actualizados
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        # Devolver los datos actualizados para que la UI los use
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='reporteBajoStock')
    def bajo_stock(self, request):
        umbral = int(request.query_params.get('umbral', 2000))
        insumos_bajos = Insumo.objects.filter(cantidad_en_base__lt=umbral)  
        serializer = self.get_serializer(insumos_bajos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)