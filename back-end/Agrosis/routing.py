from django.urls import re_path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.iot.eras.api.consumer import ErasConsumer
from apps.iot.sensores.api.consumer import SensorConsumer
from apps.trazabilidad.asignacion_actividades.api.consumer import Asignacion_actividadesConsumer
from apps.iot.mide.api.consumer import MideConsumer
from apps.iot.sensores.api.consumer import SensorConsumer


websocket_urlpatterns = [
    re_path(r"ws/eras/$", ErasConsumer.as_asgi()),
    re_path(r'ws/sensores/$', SensorConsumer.as_asgi()),
    re_path(r'ws/asignacion_actividades/$', Asignacion_actividadesConsumer.as_asgi()),
    re_path(r'ws/api/mide/$', MideConsumer.as_asgi()),
    re_path(r'ws/api/sensores/$', SensorConsumer.as_asgi()),

    
]



