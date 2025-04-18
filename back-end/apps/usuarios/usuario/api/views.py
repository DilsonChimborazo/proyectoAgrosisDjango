from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer, EscribirUsuarioSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class UsuarioViewSet(ModelViewSet):
    """Maneja la creación, lectura y gestión de usuarios"""

    def get_queryset(self):
        """ Retorna solo el usuario autenticado, excepto para los admins que ven todos """
        if self.request.user.is_staff:  # Si es admin, puede ver todos los usuarios
            return Usuarios.objects.all().order_by('id')
        return Usuarios.objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        """ Retorna el serializador adecuado dependiendo de la acción """
        if self.action in ['list', 'retrieve']:
            return LeerUsuarioSerializer 
        return EscribirUsuarioSerializer  

    def get_permissions(self):
        """Permite la creación del primer usuario sin autenticación"""
        if self.action == "create" and Usuarios.objects.count() == 0:
            return [AllowAny()]  # Permite la creación del primer usuario sin autenticación
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]  # Solo administradores pueden modificar usuarios
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Asigna automáticamente permisos de admin al primer usuario"""
        if Usuarios.objects.count() == 0:
            serializer.save(is_staff=True, is_superuser=True)  # Primer usuario es admin
        else:
            serializer.save()  # Los siguientes deben cumplir reglas normales

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        """ Activa un usuario """
        usuario = self.get_object()
        if usuario.is_active:
            return Response({"message": "El usuario ya está activo."}, status=status.HTTP_400_BAD_REQUEST)
        usuario.is_active = True
        usuario.save()
        return Response({"message": "Usuario activado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        """ Desactiva un usuario """
        usuario = self.get_object()
        if not usuario.is_active:
            return Response({"message": "El usuario ya está inactivo."}, status=status.HTTP_400_BAD_REQUEST)
        usuario.is_active = False
        usuario.save()
        return Response({"message": "Usuario desactivado"}, status=status.HTTP_200_OK)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Personaliza la respuesta del token JWT para incluir los datos del usuario"""
    def validate(self, attrs):
        data = super().validate(attrs)  
        user = self.user 
        data['user'] = LeerUsuarioSerializer(user).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para la autenticación con JWT"""
    serializer_class = CustomTokenObtainPairSerializer
