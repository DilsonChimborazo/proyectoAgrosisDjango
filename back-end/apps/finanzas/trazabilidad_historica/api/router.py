from rest_framework.routers import DefaultRouter
from apps.finanzas.trazabilidad_historica.api.views import (
    HistorialViewSet, 
    ResumenActualViewSet
)

router = DefaultRouter()
router.register(r'historial', HistorialViewSet, basename='historial')
router.register(r'resumen-actual', ResumenActualViewSet, basename='resumen-actual')

