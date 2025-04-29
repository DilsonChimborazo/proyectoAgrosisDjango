from rest_framework.serializers import ModelSerializer
from apps.inventario.detalleInsumoCompuesto.models import DetalleInsumoCompuesto
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.inventario.insumoCompuesto.api.serializers import InsumoCompuestoSerializer


class DetalleInsumoCompuestoSerializer(ModelSerializer):
    insumo = InsumoSerializer(read_only=True)
    insumo_compuesto = InsumoCompuestoSerializer(read_only=True)

    class Meta:
        model = DetalleInsumoCompuesto
        fields = '__all__'
