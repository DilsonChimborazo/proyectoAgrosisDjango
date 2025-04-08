from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer, EscribirUsuarioSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class UsuarioViewSet(ModelViewSet):
    #permission_classes = [IsAuthenticated] 
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
        """ Define permisos según la acción """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if self.request.user.is_staff:
                return [IsAuthenticated(), IsAdminUser()] 
            return [IsAuthenticated()] 
        return super().get_permissions()
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)  
        user = self.user 
        data['user'] = LeerUsuarioSerializer(user).data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        """ Activa un usuario """
        usuario = self.get_object()
        usuario.is_active = True
        usuario.save()
        return Response({"message": "Usuario activado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        """ Desactiva un usuario """
        usuario = self.get_object()
        usuario.is_active = False
        usuario.save()
        return Response({"message": "Usuario desactivado"}, status=status.HTTP_200_OK)

