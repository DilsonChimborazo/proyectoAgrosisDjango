from rest_framework import viewsets, permissions
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer, EscribirUsuarioSerlializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = LeerUsuarioSerializer, EscribirUsuarioSerlializer

    def get_permissions(self):
        """ Solo los administradores pueden gestionar usuarios """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAdminUser]
        return [perm() for perm in self.permission_classes]
