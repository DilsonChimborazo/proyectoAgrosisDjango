from rest_framework.routers import DefaultRouter
from apps.finanzas.salario.api.views import SalarioViewSet

router_salario = DefaultRouter()
router_salario.register(prefix="salario", basename="salarios", viewset=SalarioViewSet)

urlpatterns = router_salario.urls
