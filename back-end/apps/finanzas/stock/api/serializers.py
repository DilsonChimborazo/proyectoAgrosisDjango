from rest_framework import serializers
from apps.finanzas.stock.models import Stock
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.finanzas.venta.api.serializers import ItemVentaSerializer

class LeerStockSerializer(serializers.ModelSerializer):
    fk_id_produccion = ProduccionSerializer(read_only=True)
    fk_id_item_venta = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = [
            'id',
            'fk_id_produccion',
            'fk_id_item_venta',
            'cantidad',
            'fecha',
            'movimiento'
        ]

    def get_fk_id_item_venta(self, obj):
        if obj.fk_id_item_venta:
            return {
                'id': obj.fk_id_item_venta.id,
                'venta_id': obj.fk_id_item_venta.venta.id,
                'produccion': ProduccionSerializer(obj.fk_id_item_venta.produccion).data,
                'precio_unidad': obj.fk_id_item_venta.precio_unidad,
                'cantidad': obj.fk_id_item_venta.cantidad,
                'unidad_medida': UnidadMedidaSerializer(obj.fk_id_item_venta.unidad_medida).data
            }
        return None

class EscribirStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'