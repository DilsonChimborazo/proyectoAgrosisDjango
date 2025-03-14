from rest_framework.routers import DefaultRouter
from apps.inventario.herramientas.api.views import herramientasViewset

router_herramientas =DefaultRouter()
router_herramientas.register(prefix="herramientas",  viewset= herramientasViewset) 