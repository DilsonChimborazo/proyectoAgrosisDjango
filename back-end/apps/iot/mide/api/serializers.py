from rest_framework.serializers import ModelSerializer
from apps.iot.mide.models import Mide
from apps.iot.sensores.api.serializers import SensoresSerializer
from apps.trazabilidad.plantacion.api.serializers import LeerPlantacionSerializer

class leerMideSerializer(ModelSerializer):
    fk_id_sensor = SensoresSerializer(allow_null=True)
    fk_id_plantacion = LeerPlantacionSerializer(allow_null=True)

    class Meta:
        model = Mide
        fields = '__all__'

class escribirMideSerializer(ModelSerializer):
    class Meta:
        model = Mide
        fields = '__all__'