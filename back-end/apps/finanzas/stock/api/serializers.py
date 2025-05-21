from rest_framework import serializers
from apps.finanzas.stock.models import Stock
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.finanzas.venta.api.serializers import VentaSerializer

class LeerStockSerializer(serializers.ModelSerializer):
    fk_id_produccion = ProduccionSerializer(read_only=True)
    fk_id_venta = serializers.PrimaryKeyRelatedField(read_only=True)
    tipo_movimiento = serializers.SerializerMethodField()
    origen = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = [
            'id', 'fecha', 'movimiento', 'cantidad', 'comentario',
            'fk_id_produccion', 'fk_id_venta', 'tipo_movimiento', 'origen'
        ]
        read_only_fields = fields

    def get_tipo_movimiento(self, obj):
        return "Entrada de mercancía" if obj.movimiento == 'Entrada' else "Salida por venta"

    def get_origen(self, obj):
        return obj.fk_id_produccion.nombre_produccion if obj.fk_id_produccion else f"Venta #{obj.fk_id_venta.id}"

class EscribirStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['fk_id_produccion', 'cantidad', 'movimiento', 'comentario']
        extra_kwargs = {
            'movimiento': {'read_only': True}  # El movimiento se define automáticamente
        }

    def validate(self, data):
        # Validaciones adicionales para entradas manuales
        if data.get('movimiento') == 'Entrada' and not data.get('fk_id_produccion'):
            raise serializers.ValidationError(
                "Las entradas de stock deben asociarse a una producción"
            )
        return data