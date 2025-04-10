from rest_framework.viewsets import ModelViewSet
from apps.usuarios.ficha.models import Ficha
from apps.usuarios.ficha.api.serializer import FichaSerializer
from rest_framework.permissions import IsAuthenticated

class FichaViewSet(ModelViewSet):
    queryset = Ficha.objects.all()
    serializer_class = FichaSerializer
    permission_classes = [IsAuthenticated]


