import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.usuarios.usuario.models import Usuarios
from apps.trazabilidad.actividad.models import Actividad
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings

class AsignacionActividadesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Conexión WebSocket"""

        await self.channel_layer.group_add("asignacion_actividades_notifications", self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        """Desconexión WebSocket"""
        await self.channel_layer.group_discard("asignacion_actividades_notifications", self.channel_name)

    async def receive(self, text_data):
        """Maneja los mensajes entrantes desde el cliente"""
        data = json.loads(text_data)

        # Verificar que los datos necesarios estén presentes
        required_keys = ["fecha", "fk_id_realiza", "id_identificacion"]
        if not all(key in data for key in required_keys):
            await self.send(text_data=json.dumps({"error": "Faltan datos necesarios para asignar la actividad."}))
            return

        fecha = data["fecha"]
        fk_id_realiza = data["fk_id_realiza"]
        fk_identificacion = data["fk_identificacion"]

        # Asignar la actividad y enviar notificación por correo
        asignacion_data = await self.asignar_actividad(fecha, fk_id_realiza, fk_identificacion)

        if asignacion_data and "error" not in asignacion_data:
            # Responder al cliente que envió el mensaje
            await self.send(text_data=json.dumps({"message": asignacion_data}))

            # Notificar a todos los usuarios conectados
            await self.channel_layer.group_send(
                "asignacion_actividades_notifications",
                {
                    "type": "asignacion_notification",
                    "message": asignacion_data
                }
            )
        else:
            await self.send(text_data=json.dumps({"error": asignacion_data.get("error", "No se pudo asignar la actividad")}))

    async def asignacion_notification(self, event):
        """Envía los datos de la asignación al cliente en tiempo real"""
        await self.send(text_data=json.dumps(event["message"]))

    @sync_to_async
    def asignar_actividad(self, fecha, fk_id_realiza, fk_identificacion):
        """Asigna la actividad en la base de datos, envía correo y devuelve los datos"""
        try:
            actividad = Actividad.objects.get(id=fk_id_realiza)
            usuario = Usuarios.objects.get(identificacion=fk_identificacion)

            # Crear la asignación
            asignacion = Asignacion_actividades.objects.create(
                fecha=fecha,
                fk_id_realiza=actividad,
                fk_identificacion=usuario
            )

            # Enviar notificación por correo
            subject = "Nueva Actividad Asignada"
            message = (
                f"Hola {usuario.nombre} {usuario.apellidos},\n\n"
                f"Se te ha asignado una nueva actividad:\n"
                f"- Actividad: {actividad.nombre_actividad}\n"
                f"- Fecha: {fecha}\n\n"
                f"Por favor, revisa los detalles en el sistema."
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [usuario.correoElectronico],
                fail_silently=False,
            )

            # Mensaje para el WebSocket
            mensaje = {
                "id": asignacion.id,
                "usuario": f"{usuario.nombre} {usuario.apellido}",
                "actividad": actividad.nombre_actividad,
                "fecha": str(fecha),
            }
            return mensaje

        except Usuarios.DoesNotExist:
            return {"error": "El usuario no existe."}
        except Actividad.DoesNotExist:
            return {"error": "La actividad no existe."}
        except Exception as e:
            return {"error": str(e)}