from rest_framework.routers import DefaultRouter
from apps.iot.evapotranspiracion.api.views import EvapotranspiracionViewSet

router_Evapo = DefaultRouter()
router_Evapo.register(prefix="evapotranspiracion", basename="evapotranspiracion", viewset=EvapotranspiracionViewSet)