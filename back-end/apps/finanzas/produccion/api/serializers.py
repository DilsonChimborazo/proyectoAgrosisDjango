from rest_framework.serializers import ModelSerializer
from apps.finanzas.produccion.models import Produccion
from apps.trazabilidad.plantacion.api.serializers import LeerPlantacionSerializer
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer

class ProduccionSerializer(ModelSerializer):
    fk_id_plantacion = LeerPlantacionSerializer()
    fk_unidad_medida = UnidadMedidaSerializer()
    class Meta:
        model = Produccion
        fields = '__all__'  

class escribirProduccionSerializer(ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'  