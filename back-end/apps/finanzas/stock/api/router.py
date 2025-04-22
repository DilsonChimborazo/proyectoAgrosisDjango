from rest_framework.routers import DefaultRouter
from apps.finanzas.stock.api.views import StockViewSet

router_stock = DefaultRouter()
router_stock.register(prefix='stock', basename='stock', viewset=StockViewSet)
