import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.mail import send_mail
from django.conf import settings
from apps.trazabilidad.notificacion.models import Notificacion
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.insumo.models import Insumo
from asgiref.sync import sync_to_async
from datetime import timedelta
from django.utils import timezone

class NotificationInsumoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.group_name = f'notificaciones_{self.user.id}'

        if await self.is_admin(self.user):
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
            await self.check_insumo_status()  
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        titulo = data.get('titulo')
        mensaje = data.get('mensaje')

        if titulo and mensaje and self.user.is_authenticated and await self.is_admin(self.user):
            notificacion = await sync_to_async(Notificacion.objects.create)(
                usuario=self.user,
                titulo=titulo,
                mensaje=mensaje
            )

            try:
                await sync_to_async(send_mail)(
                    subject=titulo,
                    message=mensaje,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[self.user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error al enviar correo: {str(e)}")

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
        await self.send(text_data=json.dumps({
            'titulo': event['titulo'],
            'mensaje': event['mensaje'],
            'fecha': event['fecha'],
            'leida': event['leida']
        }))

    async def check_insumo_status(self):
        expiration_threshold = timezone.now().date() + timedelta(days=7)
        low_stock_threshold = 10  # Umbral para stock bajo

        # Obtener insumos próximos a vencer
        insumos_expiring = await sync_to_async(list)(
            Insumo.objects.filter(
                fecha_vencimiento__lte=expiration_threshold,
                fecha_vencimiento__gte=timezone.now().date()
            )
        )

        # Obtener insumos con stock bajo
        insumos_low_stock = await sync_to_async(list)(
            Insumo.objects.filter(
                cantidad_en_base__lt=low_stock_threshold,
                cantidad_en_base__gt=0
            )
        )

        # Obtener administradores
        usuarios_admin = await sync_to_async(list)(
            Usuarios.objects.filter(rol='admin')
        )

        # Procesar insumos próximos a vencer
        for insumo in insumos_expiring:
            days_until_expiry = (insumo.fecha_vencimiento - timezone.now().date()).days
            titulo = f"Insumo a punto de vencer: {insumo.nombre}"
            mensaje = (
                f"El insumo '{insumo.nombre}' vencerá en {days_until_expiry} día(s), "
                f"el {insumo.fecha_vencimiento.strftime('%Y-%m-%d')}."
            )

            for usuario in usuarios_admin:
                notification_exists = await sync_to_async(Notificacion.objects.filter)(
                    usuario=usuario,
                    titulo=titulo,
                    mensaje=mensaje
                )

                if await sync_to_async(notification_exists.exists)():
                    continue

                notificacion = await sync_to_async(Notificacion.objects.create)(
                    usuario=usuario,
                    titulo=titulo,
                    mensaje=mensaje
                )

                try:
                    await sync_to_async(send_mail)(
                        subject=titulo,
                        message=mensaje,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[usuario.email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error al enviar correo a {usuario.email}: {str(e)}")

                group_name = f'notificaciones_{usuario.id}'
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'send_notification',
                        'titulo': titulo,
                        'mensaje': mensaje,
                        'fecha': notificacion.fecha_notificacion.isoformat(),
                        'leida': notificacion.leida
                    }
                )

        # Procesar insumos con stock bajo
        for insumo in insumos_low_stock:
            titulo = f"Stock bajo: {insumo.nombre}"
            mensaje = (
                f"El insumo '{insumo.nombre}' tiene bajo stock: "
                f"{insumo.cantidad_en_base} {insumo.fk_unidad_medida.unidad_base if insumo.fk_unidad_medida else 'unidades'} restantes."
            )

            for usuario in usuarios_admin:
                notification_exists = await sync_to_async(Notificacion.objects.filter)(
                    usuario=usuario,
                    titulo=titulo,
                    mensaje=mensaje
                )

                if await sync_to_async(notification_exists.exists)():
                    continue

                notificacion = await sync_to_async(Notificacion.objects.create)(
                    usuario=usuario,
                    titulo=titulo,
                    mensaje=mensaje
                )

                try:
                    await sync_to_async(send_mail)(
                        subject=titulo,
                        message=mensaje,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[usuario.email],
                        fail_silently=False,
                    )
                except Exception as e:
                    print(f"Error al enviar correo a {usuario.email}: {str(e)}")

                group_name = f'notificaciones_{usuario.id}'
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'send_notification',
                        'titulo': titulo,
                        'mensaje': mensaje,
                        'fecha': notificacion.fecha_notificacion.isoformat(),
                        'leida': notificacion.leida
                    }
                )

    @sync_to_async
    def is_admin(self, user):
        return hasattr(user, 'rol') and user.rol == 'Administrador'