from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.trazabilidad.asignacion_actividades.api.serializers import (
    LeerAsignacion_actividadesSerializer,
    EscribirAsignacion_actividadesSerializer
)
from apps.usuarios.usuario.models import Usuarios
from apps.trazabilidad.actividad.models import Actividad
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.mail import send_mail
from django.conf import settings

class Asignacion_actividadesModelViewSet(ModelViewSet):
    queryset = Asignacion_actividades.objects.select_related(
        'fk_id_realiza__fk_id_plantacion__fk_id_cultivo',
        'fk_id_realiza__fk_id_actividad',  # Añadido para optimizar la relación con actividad
    ).prefetch_related('fk_identificacion').all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerAsignacion_actividadesSerializer
        return EscribirAsignacion_actividadesSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Obtener la asignación creada
        asignacion = Asignacion_actividades.objects.get(id=serializer.data['id'])
        actividad = asignacion.fk_id_realiza.fk_id_actividad if asignacion.fk_id_realiza else None
        usuarios = asignacion.fk_identificacion.all()

        # Enviar correo y notificación WebSocket para cada usuario
        for usuario in usuarios:
            try:
                subject = "Nueva Actividad Asignada"
                message = (
                    f"Hola {usuario.nombre} {usuario.apellido},\n\n"
                    f"Se te ha asignado una nueva actividad:\n"
                    f"- Actividad: {actividad.nombre_actividad if actividad else 'No especificado'}\n"
                    f"- Fecha: {asignacion.fecha_programada}\n"
                    f"- Estado: {asignacion.estado}\n"
                    f"- Observaciones: {asignacion.observaciones or 'Ninguna'}\n\n"
                    f"Por favor, revisa los detalles en el sistema."
                )
                print(f"Enviando correo a: {usuario.email}")
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [usuario.email],
                    fail_silently=False,
                )
                print(f"Correo enviado a: {usuario.email}")
            except Exception as e:
                print(f"Error al enviar correo a {usuario.email}: {str(e)}")

            # Enviar notificación por WebSocket
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "asignacion_actividades_notifications",
                {
                    "type": "asignacion_notification",
                    "message": {
                        "id": asignacion.id,
                        "usuario": f"{usuario.nombre} {usuario.apellido}",
                        "actividad": actividad.nombre_actividad if actividad else "No especificado",
                        "fecha": str(asignacion.fecha_programada),
                        "estado": asignacion.estado,
                        "observaciones": asignacion.observaciones or "Ninguna",
                    }
                }
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'], url_path='reporte-asignaciones')
    def reporte_asignaciones(self, request):
        """
        Reporte personalizado que muestra la fecha programada, plantación, usuarios, actividad, estado y observaciones.
        """
        reporte = []

        for asignacion in self.get_queryset():
            plantacion = (
                asignacion.fk_id_realiza.fk_id_plantacion.fk_id_cultivo.nombre_cultivo
                if asignacion.fk_id_realiza and asignacion.fk_id_realiza.fk_id_plantacion and asignacion.fk_id_realiza.fk_id_plantacion.fk_id_cultivo
                else "No especificado"
            )
            usuarios = [
                {"nombre": f"{usuario.nombre} {usuario.apellido}"}
                for usuario in asignacion.fk_identificacion.all()
            ] if asignacion.fk_identificacion.exists() else [{"nombre": "No especificado"}]
            actividad = (
                asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad
                if asignacion.fk_id_realiza and asignacion.fk_id_realiza.fk_id_actividad
                else "No especificado"
            )
            fecha_programada = asignacion.fecha_programada.strftime('%Y-%m-%d') if asignacion.fecha_programada else "No especificado"
            estado = asignacion.estado if asignacion.estado else "No especificado"
            observaciones = asignacion.observaciones if asignacion.observaciones else "No especificado"

            reporte.append({
                "fecha_programada": fecha_programada,
                "plantacion": plantacion,
                "usuarios": usuarios,
                "actividad": actividad,
                "estado": estado,
                "observaciones": observaciones,
            })

        return Response({
            "reporte": reporte,
            "estructura": "FECHA PROGRAMADA | PLANTACIÓN | USUARIOS | ACTIVIDAD | ESTADO | OBSERVACIONES"
        })