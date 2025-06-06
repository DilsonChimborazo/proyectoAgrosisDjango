from rest_framework import serializers
from apps.finanzas.salario.models import Salario
from apps.usuarios.rol.api.serializer import RolSerializer

class LeerSalarioSerializer(serializers.ModelSerializer):
    fk_id_rol = RolSerializer()

    class Meta:
        model = Salario
        fields = '__all__'
        read_only_fields = ('fecha_inicio', 'fecha_fin')

class EscribirSalarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'
        extra_kwargs = {
            'fecha_inicio': {'input_formats': ['%Y-%m-%d']},
            'fecha_fin': {'input_formats': ['%Y-%m-%d'], 'required': False, 'allow_null': True},
        }
