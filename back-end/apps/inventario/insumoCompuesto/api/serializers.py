from rest_framework import serializers
from apps.inventario.insumoCompuesto.models import InsumoCompuesto
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer
from apps.inventario.detalleInsumoCompuesto.models import DetalleInsumoCompuesto
from apps.inventario.unidadMedida.models import UnidadMedida

class DetalleInsumoCompuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleInsumoCompuesto
        fields = ['insumo', 'cantidad_utilizada']

class InsumoCompuestoSerializer(serializers.ModelSerializer):
    fk_unidad_medida = serializers.PrimaryKeyRelatedField(
        queryset=UnidadMedida.objects.all(), write_only=True
    )
    unidad_medida_info = UnidadMedidaSerializer(source='fk_unidad_medida', read_only=True)
    detalles = DetalleInsumoCompuestoSerializer(many=True, write_only=True)
    
    class Meta:
        model = InsumoCompuesto
        fields = '__all__'
        depth = 1
    
    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles')
        insumo_compuesto = InsumoCompuesto.objects.create(**validated_data)
        
        for detalle_data in detalles_data:
            DetalleInsumoCompuesto.objects.create(
                insumo_compuesto=insumo_compuesto,
                **detalle_data
            )
        
        return insumo_compuesto