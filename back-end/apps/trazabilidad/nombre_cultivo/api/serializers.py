from rest_framework.serializers import ModelSerializer
from apps.trazabilidad.nombre_cultivo.models import Nombre_cultivo
from apps.trazabilidad.especie.api.serializers import LeerEspecieSerializer

class LeerNombreCultivoSerializer(ModelSerializer):
    fk_id_especie = LeerEspecieSerializer()
    class Meta:
        model = Nombre_cultivo
        fields = '__all__'

class EscribirNombreCultivoSerializer(ModelSerializer):
    class Meta:
        model = Nombre_cultivo
        fields = '__all__'