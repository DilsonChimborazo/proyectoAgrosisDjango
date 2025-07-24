# apps/trazabilidad/asignacion_actividades/api/views.py
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.inventario.herramientas.models import Herramientas
from apps.inventario.insumo.models import Insumo
from apps.trazabilidad.asignacion_actividades.api.serializers import (
    LeerAsignacion_actividadesSerializer,
    EscribirAsignacion_actividadesSerializer,
    AsignarRecursosSerializer
)
from apps.usuarios.usuario.models import Usuarios
from apps.trazabilidad.actividad.models import Actividad
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class Asignacion_actividadesModelViewSet(ModelViewSet):
    queryset = Asignacion_actividades.objects.select_related(
        'fk_id_realiza__fk_id_plantacion__fk_id_cultivo',
        'fk_id_realiza__fk_id_actividad',
    ).prefetch_related('fk_identificacion').all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerAsignacion_actividadesSerializer
        elif self.action == 'asignar-recursos':
            return AsignarRecursosSerializer
        return EscribirAsignacion_actividadesSerializer

    @action(detail=True, methods=['post'], url_path='asignar-recursos')
    def asignar_recursos(self, request, pk=None):
        """
        Asigna recursos (herramientas e insumos) a una asignación existente
        """
        logger.info(f"Iniciando asignación de recursos para asignación ID: {pk}")
        logger.debug(f"Datos recibidos: {request.data}")
        
        # Validación inicial
        if not pk:
            logger.error("No se proporcionó ID de asignación")
            return Response(
                {"error": "Se requiere el ID de la asignación"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Obtener la asignación
            asignacion = self.get_object()
            logger.info(f"Asignación encontrada: {asignacion.id}")
        except Asignacion_actividades.DoesNotExist:
            logger.error(f"Asignación con ID {pk} no encontrada")
            return Response(
                {"error": "La asignación especificada no existe"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validar datos con serializer
        serializer = AsignarRecursosSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Datos inválidos: {serializer.errors}")
            return Response(
                {
                    "error": "Datos de entrada inválidos",
                    "detalles": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        herramientas_ids = serializer.validated_data.get('herramientas_ids', [])
        insumos_ids = serializer.validated_data.get('insumos_ids', [])
        
        logger.info(f"IDs de herramientas a asignar: {herramientas_ids}")
        logger.info(f"IDs de insumos a asignar: {insumos_ids}")

        # Verificar existencia de recursos
        try:
            # Validar herramientas
            herramientas_count = Herramientas.objects.filter(
                id__in=herramientas_ids
            ).count()
            if len(herramientas_ids) != herramientas_count:
                missing = set(herramientas_ids) - set(
                    Herramientas.objects.filter(id__in=herramientas_ids).values_list('id', flat=True)
                )
                logger.error(f"Herramientas no encontradas: {missing}")
                return Response(
                    {
                        "error": "Algunas herramientas no existen",
                        "herramientas_faltantes": list(missing)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validar insumos
            insumos_count = Insumo.objects.filter(
                id__in=insumos_ids
            ).count()
            if len(insumos_ids) != insumos_count:
                missing = set(insumos_ids) - set(
                    Insumo.objects.filter(id__in=insumos_ids).values_list('id', flat=True)
                )
                logger.error(f"Insumos no encontrados: {missing}")
                return Response(
                    {
                        "error": "Algunos insumos no existen",
                        "insumos_faltantes": list(missing)
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Asignar recursos
            asignacion.recursos_asignados = {
                'herramientas': herramientas_ids,
                'insumos': insumos_ids
            }
            asignacion.save()

            logger.info("Recursos asignados correctamente")
            logger.debug(f"Estado final de asignación: {asignacion.recursos_asignados}")

            # Notificar a los usuarios
            self._notificar_asignacion_recursos(asignacion)

            return Response({
                "status": "success",
                "message": "Recursos asignados correctamente",
                "asignacion_id": asignacion.id,
                "herramientas_asignadas": herramientas_ids,
                "insumos_asignados": insumos_ids,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception("Error crítico al asignar recursos")
            return Response(
                {
                    "error": "Error interno del servidor",
                    "detalle": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _notificar_asignacion_recursos(self, asignacion):
        """Envía notificaciones sobre los recursos asignados"""
        try:
            usuarios = asignacion.fk_identificacion.all()
            actividad = getattr(asignacion.fk_id_realiza, 'fk_id_actividad', None)
            
            mensaje = f"Nuevos recursos asignados a la actividad {actividad.nombre_actividad if actividad else 'N/A'}"
            
            if asignacion.recursos_asignados:
                herramientas = Herramientas.objects.filter(
                    id__in=asignacion.recursos_asignados.get('herramientas', [])
                )
                insumos = Insumo.objects.filter(
                    id__in=asignacion.recursos_asignados.get('insumos', [])
                )
                
                mensaje += "\n\nHerramientas:\n" + "\n".join([h.nombre_h for h in herramientas])
                mensaje += "\n\nInsumos:\n" + "\n".join([i.nombre for i in insumos])

            # Notificación por WebSocket
            channel_layer = get_channel_layer()
            for usuario in usuarios:
                async_to_sync(channel_layer.group_send)(
                    f"notificaciones_{usuario.id}",
                    {
                        "type": "notificacion.recursos",
                        "message": {
                            "asignacion_id": asignacion.id,
                            "mensaje": mensaje,
                            "fecha": str(asignacion.updated_at)
                        }
                    }
                )
                
                # Notificación por email (opcional)
                try:
                    send_mail(
                        subject="Recursos asignados",
                        message=mensaje,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[usuario.email],
                        fail_silently=True
                    )
                except Exception as email_error:
                    logger.error(f"Error enviando email: {email_error}")

        except Exception as e:
            logger.error(f"Error en notificación: {str(e)}")

    @action(detail=True, methods=['post'], url_path='finalizar')
    def finalizar(self, request, pk=None):
            """
            Acción para que un usuario asignado marque la asignación como Completada.
            """
            asignacion = self.get_object()
            if asignacion.estado == 'Completada':
                return Response({'error': 'La asignación ya está completada'}, status=status.HTTP_400_BAD_REQUEST)
            
            asignacion.estado = 'Completada'
            asignacion.save()

            # Enviar notificación por WebSocket a todos los usuarios asignados
            actividad = asignacion.fk_id_realiza.fk_id_actividad if asignacion.fk_id_realiza else None
            usuarios = asignacion.fk_identificacion.all()
            channel_layer = get_channel_layer()
            for usuario in usuarios:
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
                            "observaciones": f"Asignación completada por {request.user.nombre} {request.user.apellido}",
                        }
                    }
                )

            return Response({
                'message': 'Asignación marcada como Completada',
                'asignacion': LeerAsignacion_actividadesSerializer(asignacion).data
            }, status=status.HTTP_200_OK)

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