from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer, EscribirUsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerUsuarioSerializer  
        return EscribirUsuarioSerializer

    def get_permissions(self):
        """ Solo los administradores pueden gestionar usuarios """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def registrar_usuario(self, request):
        """
        Permite a los administradores registrar aprendices, pasantes e instructores
        """
        self.permission_classes = [permissions.IsAdminUser]  
        self.check_permissions(request)
        data = request.data
        serializer = EscribirUsuarioSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario registrado correctamente", "data": serializer.data}, status=201)
        return Response(serializer.errors, status=400)
