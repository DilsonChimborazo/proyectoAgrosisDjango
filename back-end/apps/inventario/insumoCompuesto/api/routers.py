from rest_framework.routers import DefaultRouter
from apps.inventario.insumoCompuesto.api.views import InsumoCompuestoViewSet

router_insumo_compuesto =DefaultRouter()
router_insumo_compuesto.register(prefix="insumocompuesto", basename= "insumocompuesto", viewset= InsumoCompuestoViewSet) 