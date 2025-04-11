from rest_framework.routers import DefaultRouter
from apps.usuarios.ficha.api.views import FichaViewSet

routerFicha = DefaultRouter()
routerFicha.register(prefix='ficha', viewset=FichaViewSet)