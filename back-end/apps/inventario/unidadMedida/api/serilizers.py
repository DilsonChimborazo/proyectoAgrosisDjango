from rest_framework.serializers import ModelSerializer
from apps.inventario.unidadMedida.models import UnidadMedida

class UnidadMedidaSerializer(ModelSerializer):
    class Meta:
        model = UnidadMedida
        fields = '__all__'