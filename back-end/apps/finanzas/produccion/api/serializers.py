from rest_framework.serializers import ModelSerializer
from apps.finanzas.produccion.models import Produccion
from apps.trazabilidad.cultivo.api.serializers import LeerCultivoSerializer

class ProduccionSerializer(ModelSerializer):
    fk_id = LeerCultivoSerializer()
    class Meta:
        model = Produccion
        fields = '__all__'  

class escribirProduccionSerializer(ModelSerializer):
    class Meta:
        model = Produccion
        fields = '__all__'  