from rest_framework.serializers import ModelSerializer
from apps.iot.evapotranspiracion.models import Evapotranspiracion
from apps.trazabilidad.plantacion.api.serializers import LeerPlantacionSerializer

class LeerEvapotranspiracionSerializer(ModelSerializer):
    fk_id_plantacion = LeerPlantacionSerializer(allow_null=True)

    class Meta:
        model = Evapotranspiracion
        fields = '__all__'

class EscribirEvapotranspiracionSerializer(ModelSerializer):
    class Meta:
        model = Evapotranspiracion
        fields = '__all__'

