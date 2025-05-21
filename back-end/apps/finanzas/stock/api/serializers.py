# stock/serializers.py
from rest_framework import serializers
from apps.finanzas.stock.models import Stock
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.finanzas.venta.api.serializers import VentaSerializer  # Importa el serializer básico de Venta

class LeerStockSerializer(serializers.ModelSerializer):
    fk_id_produccion = ProduccionSerializer(read_only=True)
    fk_id_venta = serializers.PrimaryKeyRelatedField(read_only=True)  # Cambiado a PrimaryKey

    class Meta:
        model = Stock
        fields = '__all__'

class EscribirStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'