from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from apps.trazabilidad.realiza.api.serializers import LeerRealizaSerializer
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades

class LeerAsignacion_actividadesSerializer(ModelSerializer):
    fk_id_realiza = LeerRealizaSerializer()
    fk_identificacion = PrimaryKeyRelatedField(many=True, read_only=True)  # Devuelve lista de IDs
    
    class Meta:
        model = Asignacion_actividades
        fields = '__all__'

class EscribirAsignacion_actividadesSerializer(ModelSerializer):
    class Meta:
        model = Asignacion_actividades
        fields = '__all__'