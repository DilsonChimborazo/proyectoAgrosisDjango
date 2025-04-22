from rest_framework.serializers import ModelSerializer
from apps.finanzas.stock.models import Stock
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.venta.models import Venta
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.finanzas.venta.api.serializers import leerVentaSerializer

class LeerStockSerializer(ModelSerializer):
    fk_id_produccion = ProduccionSerializer(read_only=True)
    fk_id_venta = leerVentaSerializer(read_only=True)

    class Meta:
        model = Stock
        fields = '__all__'

class EscribirStockSerializer(ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'
