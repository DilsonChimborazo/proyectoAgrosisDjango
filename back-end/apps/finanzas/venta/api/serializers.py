# apps/finanzas/venta/api/serializers.py
from rest_framework import serializers
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer

class ItemVentaFacturaSerializer(serializers.ModelSerializer):
    produccion = ProduccionSerializer()
    unidad_medida = UnidadMedidaSerializer()

    class Meta:
        model = ItemVenta
        fields = [
            'id', 'produccion', 'precio_unidad', 'precio_unidad_con_descuento', 'cantidad',
            'unidad_medida', 'cantidad_en_base', 'subtotal', 'descuento_porcentaje'
        ]
        read_only_fields = fields

class VentaFacturaSerializer(serializers.ModelSerializer):
    items = ItemVentaFacturaSerializer(many=True, read_only=True)
    usuario = LeerUsuarioSerializer(read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'total', 'items', 'usuario']
        read_only_fields = fields

class ItemVentaSerializer(serializers.ModelSerializer):
    precio_por_unidad = serializers.SerializerMethodField()
    precio_por_unidad_base = serializers.SerializerMethodField()
    subtotal_con_descuento = serializers.SerializerMethodField()

    class Meta:
        model = ItemVenta
        fields = [
            'id', 'produccion', 'precio_unidad', 'precio_unidad_con_descuento', 'precio_por_unidad',
            'precio_por_unidad_base', 'cantidad', 'unidad_medida',
            'cantidad_en_base', 'subtotal', 'descuento_porcentaje', 'subtotal_con_descuento'
        ]
        read_only_fields = ['id', 'cantidad_en_base', 'subtotal', 'precio_por_unidad', 'precio_por_unidad_base', 'subtotal_con_descuento', 'precio_unidad_con_descuento']

    def get_precio_por_unidad(self, obj):
        return obj.precio_por_unidad_de_medida()

    def get_precio_por_unidad_base(self, obj):
        return obj.precio_por_unidad_base()

    def get_subtotal_con_descuento(self, obj):
        return obj.subtotal_con_descuento()

class LeerItemVentaSerializer(serializers.ModelSerializer):
    produccion = ProduccionSerializer()
    unidad_medida = UnidadMedidaSerializer()

    class Meta:
        model = ItemVenta
        fields = [
            'id', 'produccion', 'precio_unidad', 'precio_unidad_con_descuento', 'cantidad',
            'unidad_medida', 'cantidad_en_base', 'subtotal', 'descuento_porcentaje'
        ]
        read_only_fields = fields

class VentaSerializer(serializers.ModelSerializer):
    items = LeerItemVentaSerializer(many=True, read_only=True)
    usuario = LeerUsuarioSerializer(read_only=True)

    class Meta:
        model = Venta
        fields = ['id', 'fecha', 'total', 'items', 'usuario']
        read_only_fields = ['fecha', 'total']

class CrearVentaSerializer(serializers.ModelSerializer):
    items = ItemVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['id', 'items']
        read_only_fields = ['total', 'fecha']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        venta = Venta.objects.create(
            **validated_data,
            usuario=self.context['request'].user
        )

        for item_data in items_data:
            ItemVenta.objects.create(venta=venta, **item_data)

        venta.actualizar_total()
        return venta

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                ItemVenta.objects.create(venta=instance, **item_data)
        super().update(instance, validated_data)
        instance.actualizar_total()
        return instance