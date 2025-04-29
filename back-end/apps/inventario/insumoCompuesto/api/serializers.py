from rest_framework.serializers import ModelSerializer
from apps.inventario.insumoCompuesto.models import InsumoCompuesto
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer


class InsumoCompuestoSerializer(ModelSerializer):
    fk_unidad_medida = UnidadMedidaSerializer(read_only=True)
    class Meta:
        model = InsumoCompuesto
        fields = '__all__'