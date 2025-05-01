from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from apps.iot.eras.models import Eras
from apps.iot.eras.api.serializers import leerErasSerializer, escribirErasSerializer

class ErasViewSet(ModelViewSet):
    queryset = Eras.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        """Retorna el serializador adecuado dependiendo de la acción"""
        if self.action in ['list', 'retrieve']:
            return leerErasSerializer
        return escribirErasSerializer

    def get_permissions(self):
        """Define permisos: solo admins pueden activar/desactivar y modificar"""
        if self.action in ['activar', 'desactivar', 'create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        """Activa un objeto Eras"""
        eras = self.get_object()
        if eras.estado:
            return Response({"message": "El objeto Eras ya está activo."}, status=status.HTTP_400_BAD_REQUEST)
        eras.estado = True
        eras.save()
        return Response({"message": "Objeto Eras activado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        """Desactiva un objeto Eras"""
        eras = self.get_object()
        if not eras.estado:
            return Response({"message": "El objeto Eras ya está inactivo."}, status=status.HTTP_400_BAD_REQUEST)
        eras.estado = False
        eras.save()
        return Response({"message": "Objeto Eras desactivado"}, status=status.HTTP_200_OK)