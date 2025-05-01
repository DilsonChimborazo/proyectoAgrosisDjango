from rest_framework.serializers import ModelSerializer
from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.cultivo.api.serializers import LeerCultivoSerializer 
from apps.iot.eras.api.serializers import leerErasSerializer
from apps.trazabilidad.semillero.api.serializers import LeerSemilleroSerializer


class LeerPlantacionSerializer(ModelSerializer):
    fk_id_eras = leerErasSerializer()
    fk_id_cultivo = LeerCultivoSerializer()
    fk_id_semillero = LeerSemilleroSerializer()

    class Meta:
        model = Plantacion
        fields = '__all__'
        
class escribirPlantacionSerializer(ModelSerializer):
    class Meta:
        model = Plantacion
        fields = '__all__'
