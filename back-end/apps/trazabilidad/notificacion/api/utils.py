from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import NotificacionSerializer
import logging

logger = logging.getLogger(__name__)

def send_notification(user, notification):
    try:
        serializer = NotificacionSerializer(notification)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notificaciones_{user.id}',
            {
                'type': 'send_notification',
                'notification': serializer.data
            }
        )
        logger.info(f"Notificación enviada a {user.email}: {notification.titulo}")
    except Exception as e:
        logger.error(f"Error enviando notificación a {user.email}: {str(e)}", exc_info=True)
        raise