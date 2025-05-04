from rest_framework.serializers import ModelSerializer
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.especie.api.serializers import LeerEspecieSerializer 


class LeerCultivoSerializer(ModelSerializer):
    fk_id_especie = LeerEspecieSerializer() 
    class Meta:
        model = Cultivo
        fields = '__all__'

class EscribirCultivoSerializer(ModelSerializer):
    class Meta:
        model = Cultivo
        fields = '__all__'