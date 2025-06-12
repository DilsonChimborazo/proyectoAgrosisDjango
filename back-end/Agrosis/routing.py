from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.iot.eras.api.consumer import ErasConsumer
from apps.iot.sensores.api.consumer import SensorConsumer
from apps.trazabilidad.asignacion_actividades.api.consumer import AsignacionActividadesConsumer
from apps.iot.mide.api.consumer import MideConsumer
from apps.iot.sensores.api.consumer import SensorConsumer
from apps.iot.evapotranspiracion.api.consumer import EvapotranspiracionConsumer
from apps.trazabilidad.notificacion.api.consumer import NotificacionConsumer
from apps.inventario.insumo.api.consumer import NotificationInsumoConsumer
from apps.usuarios.usuario.api.consumer import UsuariosConsumer


websocket_urlpatterns = [
    re_path(r'ws/api/asignacion_actividades/$', AsignacionActividadesConsumer.as_asgi()),
    re_path(r'ws/api/mide/$', MideConsumer.as_asgi()),
    re_path(r'ws/api/sensores/$', SensorConsumer.as_asgi()),
    re_path(r"ws/api/evapotranspiracion/$", EvapotranspiracionConsumer.as_asgi()),
    re_path(r"ws/api/notificaciones/$", NotificacionConsumer.as_asgi()),
    re_path(r"ws/api/insumos/$", NotificationInsumoConsumer.as_asgi()),
    re_path(r'ws/api/usuario/(?P<usuario_id>\d+)/$', UsuariosConsumer.as_asgi()),

]



