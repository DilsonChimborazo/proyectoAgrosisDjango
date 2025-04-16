from rest_framework.routers import DefaultRouter
from apps.inventario.insumo.api.views import InsumoViewSet

router_insumo =DefaultRouter()
router_insumo.register(prefix="insumo", basename= "insumo", viewset= InsumoViewSet) 