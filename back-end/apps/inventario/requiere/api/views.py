from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from apps.inventario.requiere.models import Requiere
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.requiere.api.serializers import LeerRequiereSerializer

class RequiereViewset(ModelViewSet):
    queryset = Requiere.objects.all()
    #permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerRequiereSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Guardar el objeto en la BD
            nuevo_requiere = serializer.save()

            # Enviar notificación WebSocket
            administradores = Usuarios.objects.filter(fk_id_rol__rol="Administrador")
            channel_layer = get_channel_layer()

            mensaje = {
                "tipo": "notificacion",
                "mensaje": f"Se ha solicitado la herramienta '{nuevo_requiere.fk_Id_herramientas}'",
                "actividad": f"Asignada a: {nuevo_requiere.fk_id_asignaciona_actividades}",
            }

            for admin in administradores:
                grupo_admin = f"admin_{admin.id}"
                async_to_sync(channel_layer.group_send)(
                    grupo_admin,
                    {"type": "enviar_notificacion", "message": json.dumps(mensaje)}
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
