from rest_framework.serializers import ModelSerializer
from apps.finanzas.venta.models import Venta 
from rest_framework import serializers
from apps.finanzas.produccion.api.serializers import ProduccionSerializer
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer

class leerVentaSerializer(ModelSerializer):
    fk_id_produccion = ProduccionSerializer()
    fk_unidad_medida = UnidadMedidaSerializer()
    class Meta:
        model = Venta
        fields = '__all__'

class escribirVentaSerializer(ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'
