from rest_framework.serializers import ModelSerializer
from apps.usuarios.ficha.models import Ficha

class FichaSerializer(ModelSerializer):
    class Meta:
        model = Ficha
        fields = ['numero_ficha', 'nombre_ficha', 'abreviacion', 'fecha_inicio', 'fecha_salida', 'is_active']