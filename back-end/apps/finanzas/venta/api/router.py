from rest_framework.routers import DefaultRouter
from apps.finanzas.venta.api.views import VentaViewSet, ItemVentaViewSet

router_venta = DefaultRouter()
router_venta.register(prefix="ventas", basename="ventas", viewset=VentaViewSet)
router_venta.register(r'ventas/(?P<venta_pk>\d+)/items', ItemVentaViewSet, basename='venta-items')

