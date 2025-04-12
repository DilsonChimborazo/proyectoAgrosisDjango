from rest_framework.routers import DefaultRouter
from apps.inventario.bodega.api.views import BodegaModelViewSet

routerBodega =DefaultRouter()
routerBodega.register(prefix='bodega',  basename='bodega', viewset=BodegaModelViewSet) 
