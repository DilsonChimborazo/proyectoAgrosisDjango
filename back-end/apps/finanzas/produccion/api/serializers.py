from rest_framework.serializers import ModelSerializer
from apps.finanzas.produccion.models import Produccion
from apps.trazabilidad.plantacion.api.serializers import LeerPlantacionSerializer

class ProduccionSerializer(ModelSerializer):
    fk_id_plantacion = LeerPlantacionSerializer()
    class Meta:
        model = Produccion
        fields = '__all__'  

class escribirProduccionSerializer(ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'  