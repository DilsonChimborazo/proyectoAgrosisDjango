from rest_framework.serializers import ModelSerializer
from apps.iot.mide.models import Mide
from apps.iot.sensores.api.serializers import SensoresSerializer
from apps.iot.eras.api.serializers import leerErasSerializer

class leerMideSerializer(ModelSerializer):
    fk_id_sensor = SensoresSerializer(allow_null=True)  # Permite valores null
    fk_id_era = leerErasSerializer(allow_null=True)

    class Meta:
        model = Mide
        fields = '__all__'

class escribirMideSerializer(ModelSerializer):
    class Meta:
        model = Mide
        fields = '__all__'

