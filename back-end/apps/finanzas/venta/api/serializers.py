from rest_framework import serializers
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer

class ItemVentaSerializer(serializers.ModelSerializer):
    precio_por_unidad = serializers.SerializerMethodField()
    precio_por_unidad_base = serializers.SerializerMethodField()

    class Meta:
        model = ItemVenta
        fields = [
            'id', 'produccion', 'precio_unidad', 'precio_por_unidad',
            'precio_por_unidad_base', 'cantidad', 'unidad_medida',
            'cantidad_en_base', 'subtotal'
        ]

    def get_precio_por_unidad(self, obj):
        return obj.precio_por_unidad_de_medida()

    def get_precio_por_unidad_base(self, obj):
        return obj.precio_por_unidad_base()


class LeerItemVentaSerializer(serializers.ModelSerializer):
    produccion = ProduccionSerializer()
    unidad_medida = UnidadMedidaSerializer()

    class Meta:
        model = ItemVenta
        fields = [
            'id', 'produccion', 'precio_unidad', 'cantidad',
            'unidad_medida', 'cantidad_en_base', 'subtotal'
        ]
        read_only_fields = fields


class VentaSerializer(serializers.ModelSerializer):
    items = LeerItemVentaSerializer(many=True, read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'total', 'items']
        read_only_fields = ['fecha', 'total']


class CrearVentaSerializer(serializers.ModelSerializer):
    items = ItemVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['id', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        venta = Venta.objects.create(**validated_data)

        for item_data in items_data:
            ItemVenta.objects.create(venta=venta, **item_data)

        return venta

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                ItemVenta.objects.create(venta=instance, **item_data)

        return instance