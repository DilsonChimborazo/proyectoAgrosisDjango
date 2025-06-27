import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ..models import Notificacion
from .serializers import NotificacionSerializer
from apps.usuarios.usuario.models import Usuarios

class NotificacionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Extraer el token de la query string
            token = self.scope['query_string'].decode().split('token=')[-1]
            user = await self.get_user_from_token(token)
            if user is None:
                await self.close()
                return

            self.group_name = f'notificaciones_{user.id}'
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        except Exception as e:
            print(f"Error en connect: {e}")
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data.get('action') == 'mark_as_read':
                await self.mark_notification_as_read(data.get('notification_id'))
        except json.JSONDecodeError:
            print("Error al decodificar mensaje WebSocket")

    async def send_notification(self, event):
        try:
            notification = event['notification']
            await self.send(text_data=json.dumps({
                'type': 'notification',
                'notification': notification
            }))
        except Exception as e:
            print(f"Error en send_notification: {e}")

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            from rest_framework_simplejwt.tokens import AccessToken
            token = AccessToken(token)
            user_id = token['user_id']
            return Usuarios.objects.get(id=user_id)
        except Exception as e:
            print(f"Error al validar token: {e}")
            return None

    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        try:
            notification = Notificacion.objects.get(id=notification_id, usuario__id=self.group_name.split('_')[-1])
            notification.leida = True
            notification.save()
        except Notificacion.DoesNotExist:
            print(f"Notificación {notification_id} no encontrada")