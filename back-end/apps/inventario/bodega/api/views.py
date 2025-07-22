from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.inventario.bodega.models import Bodega
from apps.inventario.bodega.api.serializers import LeerBodegaSerializer, EscribirBodegaSerializer

class BodegaModelViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Bodega.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerBodegaSerializer
        return EscribirBodegaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            movimiento = serializer.save()
            headers = self.get_success_headers(serializer.data)
            
            if movimiento:  
                return Response(
                    LeerBodegaSerializer(movimiento).data,
                    status=status.HTTP_201_CREATED,
                    headers=headers
                )
            return Response(
                {"detail": "No se crearon movimientos"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)