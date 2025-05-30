from rest_framework.serializers import ModelSerializer
from apps.finanzas.salario.models import Salario  
from apps.usuarios.rol.api.serializer import RolSerializer

class LeerSalarioSerializer(ModelSerializer):
    fk_id_rol = RolSerializer()  

    class Meta:
        model = Salario
        fields = '__all__'

class EscribirSalarioSerializer(ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'
