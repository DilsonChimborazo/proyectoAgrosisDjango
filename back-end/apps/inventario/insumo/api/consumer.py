import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.mail import send_mail
from django.conf import settings
from apps.trazabilidad.notificacion.models import Notificacion
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.insumo.models import Insumo
from asgiref.sync import sync_to_async
from datetime import datetime, timedelta
from django.utils import timezone

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Obtiene el usuario autenticado desde el scope
        self.user = self.scope['user']
        # Crea un nombre de grupo único para el usuario basado en su ID
        self.group_name = f'notificaciones_{self.user.id}'
        
        # Agrega el canal del usuario al grupo de notificaciones
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        # Acepta la conexión WebSocket
        await self.accept()

        # Si el usuario está autenticado, verifica insumos próximos a vencer
        if self.user.is_authenticated:
            await self.check_expiring_insumos()

    async def disconnect(self, close_code):
        # Al desconectarse, elimina el canal del usuario del grupo
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Recibe y procesa mensajes enviados a través del WebSocket
        data = json.loads(text_data)
        titulo = data.get('titulo')
        mensaje = data.get('mensaje')

        # Verifica que existan título, mensaje y un usuario autenticado
        if titulo and mensaje and self.user.is_authenticated:
            # Crea y guarda una nueva notificación en la base de datos
            notificacion = await sync_to_async(Notificacion.objects.create)(
                usuario=self.user,
                titulo=titulo,
                mensaje=mensaje
            )

            # Intenta enviar un correo electrónico con la notificación
            try:
                await sync_to_async(send_mail)(
                    subject=titulo,
                    message=mensaje,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[self.user.email],
                    fail_silently=False,
                )
            except Exception as e:
                # Imprime un error si falla el envío del correo
                print(f"Error al enviar correo: {str(e)}")

            # Envía la notificación al grupo del usuario a través de WebSocket
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'send_notification',
                    'titulo': titulo,
                    'mensaje': mensaje,
                    'fecha': notificacion.fecha_notificacion.isoformat(),
                    'leida': notificacion.leida
                }
            )

    async def send_notification(self, event):
        # Envía la notificación al cliente WebSocket
        await self.send(text_data=json.dumps({
            'titulo': event['titulo'],
            'mensaje': event['mensaje'],
            'fecha': event['fecha'],
            'leida': event['leida']
        }))

    async def check_expiring_insumos(self):
        # Verifica si el usuario está autenticado antes de continuar
        if not self.user.is_authenticated:
            return

        # Define el umbral de vencimiento (7 días desde la fecha actual)
        expiration_threshold = timezone.now().date() + timedelta(days=7)
        # Obtiene los insumos que vencerán dentro del umbral y aún no han vencido
        insumos = await sync_to_async(list)(
            Insumo.objects.filter(
                fecha_vencimiento__lte=expiration_threshold,
                fecha_vencimiento__gte=timezone.now().date()
            )
        )

        # Procesa cada insumo próximo a vencer
        for insumo in insumos:
            # Calcula los días restantes hasta el vencimiento
            days_until_expiry = (insumo.fecha_vencimiento - timezone.now().date()).days
            # Define el título y mensaje de la notificación
            titulo = f"Insumo a punto de vencer: {insumo.nombre}"
            mensaje = (
                f"El insumo {insumo.nombre} vencerá en {days_until_expiry} día(s), "
                f"el {insumo.fecha_vencimiento.strftime('%Y-%m-%d')}."
            )

            # Verifica si ya existe una notificación idéntica para evitar duplicados
            notification_exists = await sync_to_async(Notificacion.objects.filter)(
                usuario=self.user,
                titulo=titulo,
                mensaje=mensaje
            )
            if await sync_to_async(notification_exists.exists)():
                continue

            # Crea y guarda la notificación en la base de datos
            notificacion = await sync_to_async(Notificacion.objects.create)(
                usuario=self.user,
                titulo=titulo,
                mensaje=mensaje
            )

            # Intenta enviar un correo electrónico con la notificación
            try:
                await sync_to_async(send_mail)(
                    subject=titulo,
                    message=mensaje,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[self.user.email],
                    fail_silently=False,
                )
            except Exception as e:
                # Imprime un error si falla el envío del correo
                print(f"Error al enviar correo: {str(e)}")

            # Envía la notificación al grupo del usuario a través de WebSocket
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'send_notification',
                    'titulo': titulo,
                    'mensaje': mensaje,
                    'fecha': notificacion.fecha_notificacion.isoformat(),
                    'leida': notificacion.leida
                }
            )