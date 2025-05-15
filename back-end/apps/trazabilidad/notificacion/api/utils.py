# notificaciones/utils.py
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ..models import Notificacion
from .serializers import NotificacionSerializer

def send_notification(user, titulo, mensaje):
    notification = Notificacion.objects.create(
        usuario=user,
        titulo=titulo,
        mensaje=mensaje
    )
    serializer = NotificacionSerializer(notification)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notificaciones_{user.id}',
        {
            'type': 'send_notification',
            'notification': serializer.data
        }
    )