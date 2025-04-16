from rest_framework.viewsets import ModelViewSet
from apps.usuarios.ficha.models import Ficha
from apps.usuarios.ficha.api.serializer import FichaSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import status

class FichaViewSet(ModelViewSet):
    queryset = Ficha.objects.all()
    serializer_class = FichaSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        """ Activa una ficha """
        ficha = self.get_object()
        if ficha.is_active:
            return Response({"message": "La ficha ya está activo."}, status=status.HTTP_400_BAD_REQUEST)
        ficha.is_active = True
        ficha.save()
        return Response({"message": "Ficha activada"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        """ Desactiva una ficha"""
        ficha = self.get_object()
        if not ficha.is_active:
            return Response({"message": "La ficha ya está inactiva."}, status=status.HTTP_400_BAD_REQUEST)
        ficha.is_active = False
        ficha.save()
        return Response({"message": "Ficha desactivada"}, status=status.HTTP_200_OK)


