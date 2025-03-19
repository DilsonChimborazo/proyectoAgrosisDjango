from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer, EscribirUsuarioSerializer

class UsuarioViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
       """ Retorna solo el usuario autenticado, excepto para los admins que ven todos """
       if self.request.user.is_staff:  # Si es admin, puede ver todos los usuarios
           return Usuarios.objects.all()
       return Usuarios.objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        """ Retorna el serializador adecuado dependiendo de la acción """
        if self.action in ['list', 'retrieve']:
            return LeerUsuarioSerializer 
        return EscribirUsuarioSerializer  

    def get_permissions(self):
        """ Define permisos según la acción """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()] 
        return [IsAuthenticated()] 
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)  
        user = self.user 
        data['user'] = LeerUsuarioSerializer(user).data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

