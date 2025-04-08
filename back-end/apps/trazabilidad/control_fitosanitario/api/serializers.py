from rest_framework.serializers import ModelSerializer
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.trazabilidad.cultivo.api.serializers import LeerCultivoSerializer 
from apps.trazabilidad.pea.api.serializers import LeerPeaSerializer

class LeerControl_fitosanitarioSerializer(ModelSerializer):
    fk_id_cultivo = LeerCultivoSerializer() 
    fk_id_pea = LeerPeaSerializer()
    class Meta:
        model = Control_fitosanitario
        fields = '__all__'

class escribirControl_fitosanitarioSerializer(ModelSerializer):
    class Meta:
        model = Control_fitosanitario
        fields = '__all__'