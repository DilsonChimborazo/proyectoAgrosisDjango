from rest_framework.serializers import ModelSerializer
from apps.usuarios.rol.models import Rol

class RolSerializer(ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id', 'rol']
        read_only_fields = ['fecha_creacion']

    def validate_rol(self, value):

        return value.strip().capitalize()