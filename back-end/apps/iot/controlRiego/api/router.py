from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.iot.controlRiego.api.views import ControlRiegoViewSet

routerControlRiego = DefaultRouter()
routerControlRiego.register(prefix="control-riego", basename="control-riego", viewset=ControlRiegoViewSet)

