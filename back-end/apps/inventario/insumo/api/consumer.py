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
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationInsumoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extraer token de la URL (?token=...)
        try:
            query_string = self.scope['query_string'].decode()
            token_param = [param.split('=')[1] for param in query_string.split('&') if param.startswith('token=')]
            
            if not token_param:
                raise InvalidToken("Token no proporcionado")
                
            token = token_param[0]
            UntypedToken(token)  # Validar token
            user_id = UntypedToken(token).payload['user_id']
            self.user = await sync_to_async(User.objects.get)(id=user_id)
            
            if not self.user.is_active:
                await self.close()
                return

            self.group_name = f'notificaciones_{self.user.id}'
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            
            if await self.user_is_admin():
                await self.check_insumo_status()
                
        except (InvalidToken, TokenError, KeyError, IndexError, User.DoesNotExist) as e:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'mark_as_read':
                notification_id = data.get('notification_id')
                await self.mark_notification_as_read(notification_id)

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({'error': 'Formato JSON inválido'}))
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'id': event['id'],
            'titulo': event['titulo'],
            'mensaje': event['mensaje'],
            'fecha': event['fecha'],
            'leida': event['leida']
        }))

    @sync_to_async
    def user_is_admin(self):
        try:
            usuario = Usuarios.objects.get(id=self.user.id)
            return usuario.fk_id_rol.rol == 'Administrador'
        except Usuarios.DoesNotExist:
            return False

    @sync_to_async
    def mark_notification_as_read(self, notification_id):
        try:
            notification = Notificacion.objects.get(id=notification_id, usuario=self.user)
            notification.leida = True
            notification.save()
            return True
        except Notificacion.DoesNotExist:
            return False

    async def check_insumo_status(self):
        expiration_threshold = timezone.now().date() + timedelta(days=7)
        low_stock_threshold = 1000

        # Obtener datos necesarios
        insumos_expiring = await sync_to_async(list)(
            Insumo.objects.filter(
                fecha_vencimiento__lte=expiration_threshold,
                fecha_vencimiento__gte=timezone.now().date()
            ).select_related('fk_unidad_medida')
        )

        insumos_low_stock = await sync_to_async(list)(
            Insumo.objects.filter(
                cantidad_en_base__lt=low_stock_threshold,
                cantidad_en_base__gt=0
            ).select_related('fk_unidad_medida')
        )

        insumos_zero_stock = await sync_to_async(list)(
            Insumo.objects.filter(
                cantidad_en_base=0
            ).select_related('fk_unidad_medida')
        )

        admin_users = await sync_to_async(list)(
            Usuarios.objects.filter(fk_id_rol__rol='Administrador').select_related('fk_id_rol')
        )

        # Procesar notificaciones
        await self.process_notifications(insumos_expiring, admin_users, 'vencimiento')
        await self.process_notifications(insumos_low_stock, admin_users, 'stock')
        await self.process_notifications(insumos_zero_stock, admin_users, 'zero_stock')

    async def process_notifications(self, insumos, admin_users, notification_type):
        for insumo in insumos:
            if notification_type == 'vencimiento':
                days_until_expiry = (insumo.fecha_vencimiento - timezone.now().date()).days
                titulo = f"Insumo próximo a vencer: {insumo.nombre}"
                mensaje = (f"El insumo '{insumo.nombre}' vencerá en {days_until_expiry} día(s), "
                         f"el {insumo.fecha_vencimiento.strftime('%Y-%m-%d')}.")
                html_mensaje = f"""
                    <html>
                        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="background-color: #ffcc00; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                                    <h1 style="margin: 0; color: #fff;">Notificación de Vencimiento</h1>
                                </div>
                                <div style="padding: 20px;">
                                    <h2 style="color: #333;">Insumo: {insumo.nombre}</h2>
                                    <p style="font-size: 16px; line-height: 1.5;">
                                        El insumo <strong>{insumo.nombre}</strong> vencerá en <strong>{days_until_expiry} día(s)</strong>,
                                        el <strong>{insumo.fecha_vencimiento.strftime('%Y-%m-%d')}</strong>.
                                    </p>
                                    <p style="font-size: 14px; color: #666;">
                                        Por favor, tome las medidas necesarias para gestionar este insumo.
                                    </p>
                                </div>
                                <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 0 0 8px 8px;">
                                    <p style="margin: 0; font-size: 12px; color: #666;">
                                        Este es un mensaje automático del sistema de inventario.
                                    </p>
                                </div>
                            </div>
                        </body>
                    </html>
                """
            elif notification_type == 'stock':
                titulo = f"Stock bajo: {insumo.nombre}"
                mensaje = (f"El insumo '{insumo.nombre}' tiene bajo stock: "
                          f"{insumo.cantidad_en_base} {insumo.fk_unidad_medida.unidad_base if insumo.fk_unidad_medida else 'unidades'} restantes.")
                html_mensaje = f"""
                    <html>
                        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="background-color: #ff5733; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                                    <h1 style="margin: 0; color: #fff;">Alerta de Stock Bajo</h1>
                                </div>
                                <div style="padding: 20px;">
                                    <h2 style="color: #333;">Insumo: {insumo.nombre}</h2>
                                    <p style="font-size: 16px; line-height: 1.5;">
                                        El insumo <strong>{insumo.nombre}</strong> tiene bajo stock: 
                                        <strong>{insumo.cantidad_en_base} {insumo.fk_unidad_medida.unidad_base if insumo.fk_unidad_medida else 'unidades'}</strong> restantes.
                                    </p>
                                    <p style="font-size: 14px; color: #666;">
                                        Por favor, considere reabastecer este insumo.
                                    </p>
                                </div>
                                <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 0 0 8px 8px;">
                                    <p style="margin: 0; font-size: 12px; color: #666;">
                                        Este es un mensaje automático del sistema de inventario.
                                    </p>
                                </div>
                            </div>
                        </body>
                    </html>
                """
            else:  # zero_stock
                titulo = f"Stock agotado: {insumo.nombre}"
                mensaje = (f"El insumo '{insumo.nombre}' se ha agotado completamente. "
                          f"No quedan unidades disponibles.")
                html_mensaje = f"""
                    <html>
                        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px;">
                            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <div style="background-color: #d32f2f; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                                    <h1 style="margin: 0; color: #fff;">Alerta de Stock Agotado</h1>
                                </div>
                                <div style="padding: 20px;">
                                    <h2 style="color: #333;">Insumo: {insumo.nombre}</h2>
                                    <p style="font-size: 16px; line-height: 1.5;">
                                        El insumo <strong>{insumo.nombre}</strong> se ha agotado completamente.
                                        No quedan unidades disponibles.
                                    </p>
                                    <p style="font-size: 14px; color: #666;">
                                        Por favor, reabastezca este insumo lo antes posible.
                                    </p>
                                </div>
                                <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 0 0 8px 8px;">
                                    <p style="margin: 0; font-size: 12px; color: #666;">
                                        Este es un mensaje automático del sistema de inventario.
                                    </p>
                                </div>
                            </div>
                        </body>
                    </html>
                """

            for admin in admin_users:
                # Verificar si la notificación ya existe
                notification_exists = await sync_to_async(
                    Notificacion.objects.filter(
                        usuario=admin,
                        titulo=titulo,
                        mensaje=mensaje,
                        leida=False
                    ).exists
                )()

                if notification_exists:
                    continue

                # Crear notificación
                notificacion = await sync_to_async(Notificacion.objects.create)(
                    usuario=admin,
                    titulo=titulo,
                    mensaje=mensaje
                )

                # Enviar email
                if admin.email:
                    try:
                        await sync_to_async(send_mail)(
                            subject=titulo,
                            message=mensaje,
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[admin.email],
                            fail_silently=True,
                            html_message=html_mensaje
                        )
                    except Exception as e:
                        print(f"Error enviando email: {str(e)}")

                # Enviar por websocket si está conectado
                admin_group = f'notificaciones_{admin.id}'
                await self.channel_layer.group_send(
                    admin_group,
                    {
                        'type': 'send_notification',
                        'id': notificacion.id,
                        'titulo': titulo,
                        'mensaje': mensaje,
                        'fecha': notificacion.fecha_notificacion.isoformat(),
                        'leida': notificacion.leida
                    }
                )