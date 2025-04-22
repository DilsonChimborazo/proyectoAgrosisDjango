from rest_framework.serializers import ModelSerializer
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.trazabilidad.cultivo.api.serializers import LeerCultivoSerializer 
from apps.trazabilidad.pea.api.serializers import LeerPeaSerializer
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer

class LeerControl_fitosanitarioSerializer(ModelSerializer):
    fk_id_cultivo = LeerCultivoSerializer() 
    fk_id_pea = LeerPeaSerializer()
    fk_id_insumo = InsumoSerializer()
    fk_identificacion = LeerUsuarioSerializer()
    class Meta:
        model = Control_fitosanitario
        fields = '__all__'

class escribirControl_fitosanitarioSerializer(ModelSerializer):
    class Meta:
        model = Control_fitosanitario
        fields = '__all__'