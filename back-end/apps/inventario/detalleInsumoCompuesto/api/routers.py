from rest_framework.routers import DefaultRouter
from apps.inventario.detalleInsumoCompuesto.api.views import DetalleInsumoCompuestoViewSet

detalleInsumoCompuesto_router =DefaultRouter()
detalleInsumoCompuesto_router.register(prefix="detalleinsumo", basename= "detalleinsumo", viewset= DetalleInsumoCompuestoViewSet) 