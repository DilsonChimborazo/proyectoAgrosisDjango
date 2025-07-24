from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.iot.lote.models import Lote
from apps.iot.lote.api.serializers import leerLoteSerializer, escribirLoteSerializer

class LoteViewSet(ModelViewSet):
    queryset = Lote.objects.all()
    permission_classes = [IsAuthenticated]
    def get_serializer_class(self):
        """Retorna el serializador adecuado dependiendo de la acción"""
        if self.action in ['list', 'retrieve']:
            return leerLoteSerializer
        return escribirLoteSerializer

    def get_permissions(self):
        """Define permisos: solo admins pueden activar/desactivar y modificar"""
        if self.action in ['activar', 'desactivar', 'create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        """Activa un objeto Lote"""
        lote = self.get_object()
        if lote.estado:
            return Response({"message": "El lote ya está activo."}, status=status.HTTP_400_BAD_REQUEST)
        lote.estado = True
        lote.save()
        return Response({"message": "Lote activado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        """Desactiva un objeto Lote"""
        lote = self.get_object()
        if not lote.estado:
            return Response({"message": "El lote ya está inactivo."}, status=status.HTTP_400_BAD_REQUEST)
        lote.estado = False
        lote.save()
        return Response({"message": "Lote desactivado"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='lotesActivos')
    def lotes_activos(self, request):
        """Devuelve los lotes que están activos"""
        lotes = Lote.objects.filter(estado=True)
        serializer = leerLoteSerializer(lotes, many=True)
        return Response(serializer.data)
