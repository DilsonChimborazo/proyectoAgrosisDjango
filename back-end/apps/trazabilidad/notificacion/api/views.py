from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Notificacion
from .serializers import NotificacionSerializer
from .utils import send_notification
import logging

logger = logging.getLogger(__name__)

class NotificacionModelViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notificacion.objects.all()

    def get_queryset(self):
        try:
            if not self.request.user or not self.request.user.is_authenticated:
                logger.error("Usuario no autenticado o token inválido")
                return Notificacion.objects.none()
            queryset = Notificacion.objects.filter(usuario=self.request.user).order_by('-fecha_notificacion')
            logger.info(f"Notificaciones para usuario {self.request.user.email}: {queryset.count()}")
            return queryset
        except Exception as e:
            logger.error(f"Error en get_queryset: {str(e)}", exc_info=True)
            raise

    def get_object(self):
        try:
            obj = super().get_object()
            logger.info(f"Accediendo a notificación {obj.id} para usuario {self.request.user.email}")
            return obj
        except Exception as e:
            logger.error(f"Error en get_object: {str(e)}", exc_info=True)
            raise

    def perform_create(self, serializer):
        try:
            # Obtener datos de la solicitud
            titulo = self.request.data.get('titulo')
            mensaje = self.request.data.get('mensaje')

            # Verificar si ya existe una notificación con el mismo título y mensaje
            if Notificacion.objects.filter(
                usuario=self.request.user,
                titulo=titulo,
                mensaje=mensaje
            ).exists():
                logger.info(f"Notificación duplicada evitada para usuario {self.request.user.email}: {titulo}")
                return Response({"detail": "Notificación duplicada no creada"}, status=status.HTTP_200_OK)

            # Crear la notificación usando el serializador
            notification = serializer.save(usuario=self.request.user)
            logger.info(f"Notificación creada para usuario {self.request.user.email}: {titulo}")

            # Enviar la notificación a través de Channels
            send_notification(
                user=self.request.user,
                notification=notification
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error en perform_create: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        try:
            serializer.instance.leida = True
            serializer.save()
            logger.info(f"Notificación {serializer.instance.id} marcada como leída")
        except Exception as e:
            logger.error(f"Error en perform_update: {str(e)}", exc_info=True)
            raise

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error en update: {str(e)}", exc_info=True)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)