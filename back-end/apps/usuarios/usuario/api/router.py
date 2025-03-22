from rest_framework.routers import DefaultRouter
from apps.usuarios.usuario.api.views import UsuarioViewSet

routerUsuario = DefaultRouter()
routerUsuario.register(prefix='usuario', viewset=UsuarioViewSet, basename='usuario')



    