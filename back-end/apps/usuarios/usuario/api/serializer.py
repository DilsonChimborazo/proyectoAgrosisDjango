from rest_framework.serializers import ModelSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.rol.api.serializer import RolSerializer
from apps.usuarios.ficha.api.serializer import FichaSerializer

class LeerUsuarioSerializer(ModelSerializer):
    fk_id_rol = RolSerializer()  
    ficha = FichaSerializer()

    class Meta:
        model = Usuarios
        fields = '__all__'

class EscribirUsuarioSerializer(ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'
        extra_kwargs = {'is_active': {'required': False}}

    def create(self, validated_data):
        usuario = Usuarios(**validated_data)
        usuario.set_password(validated_data['password']) 
        usuario.save()
        return usuario

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        for attr, value in validated_data.items():
            if attr != 'password':
                setattr(instance, attr, value)
        instance.save()
        return instance
