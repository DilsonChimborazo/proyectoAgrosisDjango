from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.rol.api.serializer import RolSerializer
from apps.usuarios.ficha.api.serializer import FichaSerializer

class LeerUsuarioSerializer(serializers.ModelSerializer):
    fk_id_rol = RolSerializer()
    ficha = FichaSerializer()
    img_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuarios
        fields = '__all__'

    def get_img_url(self, obj):
        request = self.context.get('request')
        if obj.img:
            return request.build_absolute_uri(obj.img.url)
        return request.build_absolute_uri('/media/imagenes/defecto.png')


class EscribirUsuarioSerializer(ModelSerializer):
    img = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = Usuarios
        fields = '__all__'
        extra_kwargs = {
            'is_active': {'required': False},
            'password': {'write_only': True},
            'img': {'required': False},
        }

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
