from rest_framework.routers import DefaultRouter
from apps.finanzas.nomina.api.views import NominaViewSet

router_nomina = DefaultRouter()
router_nomina.register(prefix="nomina", basename="nomina", viewset=NominaViewSet)

