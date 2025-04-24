from rest_framework.routers import DefaultRouter
from apps.trazabilidad.nombre_cultivo.api.views import NombreCultivoViewSet

router_nombrecultivo = DefaultRouter()
router_nombrecultivo.register(prefix='nombre_cultivo', viewset=NombreCultivoViewSet, basename='nombre_cultivo')