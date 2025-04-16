from rest_framework.routers import DefaultRouter
from apps.inventario.unidadMedida.api.views import UnidadMedidaViewSet

# Crear routers específicos para cada grupo de ViewSets
routerUnidadMedida = DefaultRouter()
routerUnidadMedida.register(prefix='unidad_medida', viewset=UnidadMedidaViewSet, basename='unidad_medida')

