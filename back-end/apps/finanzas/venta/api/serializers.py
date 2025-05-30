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
        read_only_fields = ['id', 'cantidad_en_base', 'subtotal', 'precio_por_unidad', 'precio_por_unidad_base']

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
        fields = ['id', 'fecha', 'total', 'descuento_porcentaje', 'items']
        read_only_fields = ['fecha', 'total']


class CrearVentaSerializer(serializers.ModelSerializer):
    items = ItemVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['id', 'descuento_porcentaje', 'items'] # Agregamos descuento_porcentaje
        read_only_fields = ['total', 'fecha'] # Total se calcula, fecha auto_now_add

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        descuento_porcentaje = validated_data.pop('descuento_porcentaje', 0) # Obtener descuento

        venta = Venta.objects.create(descuento_porcentaje=descuento_porcentaje, **validated_data)

        for item_data in items_data:
            ItemVenta.objects.create(venta=venta, **item_data)

        venta.actualizar_total() 
        return venta

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        instance.descuento_porcentaje = validated_data.get('descuento_porcentaje', instance.descuento_porcentaje)

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                ItemVenta.objects.create(venta=instance, **item_data)
        super().update(instance, validated_data)
        instance.actualizar_total()
        return instance