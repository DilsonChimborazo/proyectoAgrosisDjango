from rest_framework.viewsets import ModelViewSet
from apps.trazabilidad.actividad.models import Actividad
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.actividad.api.serializers import LeerActividadSerializer

class ActividadViewSet(ModelViewSet):
    queryset = Actividad.objects.all()
    permissions_clases = [IsAuthenticated]
    serializer_class = LeerActividadSerializer