# apps/trazabilidad/notificacion/api/router.py
from rest_framework.routers import DefaultRouter
from .views import NotificacionModelViewSet

routerNotificacion = DefaultRouter()
routerNotificacion.register(r'notificaciones', NotificacionModelViewSet, basename='notificaciones')
